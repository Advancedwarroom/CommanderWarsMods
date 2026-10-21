var Constructor = function()
{
    this.postAnimationUnit = null;
    this.postAnimationTargetX = -1;
    this.postAnimationTargetY = -1;

    this.canBePerformed = function(action, map)
    {
        var unit = action.getTargetUnit();
        if (unit === null || unit.getHasMoved() === true)
        {
            return false;
        }
        var actionTargetField = action.getActionTarget();
        var ux = actionTargetField.x;
        var uy = actionTargetField.y;

        // Check if there is any forcefield (temporary or Unbreakable) within range 2-4
        for (var dx = -4; dx <= 4; dx++)
        {
            for (var dy = -4; dy <= 4; dy++)
            {
                var dist = Math.abs(dx) + Math.abs(dy);
                if (dist >= 2 && dist <= 4)
                {
                    var tx = ux + dx;
                    var ty = uy + dy;
                    if (map.onMap(tx, ty))
                    {
                        var terrain = map.getTerrain(tx, ty);
                        var terrainVars = terrain.getVariables();
                        var ffVar = terrainVars.getVariable("BOS_FORCEFIELD");
                        var unbVar = terrainVars.getVariable("BOS_UNBREAKABLE");
                        if ((ffVar !== null && ffVar.readDataBool() === true) ||
                            (unbVar !== null && unbVar.readDataBool() === true))
                        {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    };

    this.getActionText = function(map)
    {
        return qsTr("BreakField");
    };

    this.getIcon = function(map)
    {
        return "unhide";
    };

    this.isFinalStep = function(action, map)
    {
        if (action.getInputStep() === 1)
        {
            return true;
        }
        return false;
    };

    this.getStepInputType = function(action, map)
    {
        return "FIELD";
    };

    this.getStepData = function(action, data, map)
    {
        var unit = action.getTargetUnit();
        var actionTargetField = action.getActionTarget();
        var ux = actionTargetField.x;
        var uy = actionTargetField.y;

        for (var dx = -4; dx <= 4; dx++)
        {
            for (var dy = -4; dy <= 4; dy++)
            {
                var dist = Math.abs(dx) + Math.abs(dy);
                if (dist >= 2 && dist <= 4)
                {
                    var tx = ux + dx;
                    var ty = uy + dy;
                    if (map.onMap(tx, ty))
                    {
                        var terrain = map.getTerrain(tx, ty);
                        var terrainVars = terrain.getVariables();
                        var unbVar = terrainVars.getVariable("BOS_UNBREAKABLE");
                        var ffVar = terrainVars.getVariable("BOS_FORCEFIELD");

                        if (unbVar !== null && unbVar.readDataBool() === true)
                        {
                            // Unbreakable — red (high priority target)
                            data.setColor("#C8FF0000");
                            data.addPoint(Qt.point(tx, ty));
                        }
                        else if (ffVar !== null && ffVar.readDataBool() === true)
                        {
                            // Temporary forcefield — yellow
                            data.setColor("#C8FFFF00");
                            data.addPoint(Qt.point(tx, ty));
                        }
                    }
                }
            }
        }
    };

    this.perform = function(action, map)
    {
        var unit = action.getTargetUnit();
        ACTION_BOS_BREAKFIELD.postAnimationUnit = unit;

        var animation = Global[unit.getUnitID()].doWalkingAnimation(action, map);
        animation.setEndOfAnimationCall("ACTION_BOS_BREAKFIELD", "performPostAnimation");
        Global[unit.getUnitID()].moveUnit(unit, action, map);

        action.startReading();
        ACTION_BOS_BREAKFIELD.postAnimationTargetX = action.readDataInt32();
        ACTION_BOS_BREAKFIELD.postAnimationTargetY = action.readDataInt32();
    };

    this.performPostAnimation = function(postAnimation, map)
    {
        var unit = ACTION_BOS_BREAKFIELD.postAnimationUnit;
        var targetX = ACTION_BOS_BREAKFIELD.postAnimationTargetX;
        var targetY = ACTION_BOS_BREAKFIELD.postAnimationTargetY;

        if (unit !== null && targetX !== -1 && targetY !== -1 && map.onMap(targetX, targetY))
        {
            var terrain = map.getTerrain(targetX, targetY);
            var terrainVars = terrain.getVariables();

            // Remove all forcefield-related variables (temporary + Unbreakable)
            terrainVars.deleteVariable("BOS_FORCEFIELD");
            terrainVars.deleteVariable("BOS_FORCEFIELD_TURNS");
            terrainVars.deleteVariable("BOS_FORCEFIELD_COUNT");
            terrainVars.deleteVariable("BOS_UNBREAKABLE");

            // Play break animation
            var anim = GameAnimationFactory.createAnimation(map, targetX, targetY);
            anim.addSprite("explosion+air", -map.getImageSize() / 2, -map.getImageSize() / 2, 0, 2);
            anim.setSound("unstealth.wav", 1);

            unit.setHasMoved(true);
        }

        ACTION_BOS_BREAKFIELD.postAnimationUnit = null;
        ACTION_BOS_BREAKFIELD.postAnimationTargetX = -1;
        ACTION_BOS_BREAKFIELD.postAnimationTargetY = -1;
    };

    this.getName = function()
    {
        return qsTr("BreakField");
    };

    this.getDescription = function()
    {
        return qsTr("Cancel any forcefield (temporary or Unbreakable) on a tile within range 2-4. Ends the turn.");
    };
};

Constructor.prototype = ACTION;
var ACTION_BOS_BREAKFIELD = new Constructor();
