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
        return true;
    };

    this.getActionText = function(map)
    {
        return qsTr("Forcefield");
    };

    this.getIcon = function(map)
    {
        return "icon_fire";
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
        var currentTurn = map.getCurrentDay();

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
                        var countVar = terrainVars.getVariable("BOS_FORCEFIELD_COUNT");
                        var lastTurnVar = terrainVars.getVariable("BOS_FORCEFIELD_LAST_TURN");
                        var count = 0;
                        var lastTurn = -999;
                        if (countVar !== null)
                        {
                            count = countVar.readDataInt32();
                        }
                        if (lastTurnVar !== null)
                        {
                            lastTurn = lastTurnVar.readDataInt32();
                        }
                        var turnGap = currentTurn - lastTurn;

                        if (unbVar !== null && unbVar.readDataBool() === true)
                        {
                            // Unbreakable tile — show green (already permanent)
                            data.setColor("#C800FF00");
                        }
                        else if (count > 0 && turnGap <= 1)
                        {
                            // Active streak (renewed last turn or this turn)
                            if (count >= 7)
                            {
                                data.setColor("#C8FF8800"); // orange-ish (close to 10)
                            }
                            else if (count >= 4)
                            {
                                data.setColor("#C8FFFF00"); // yellow
                            }
                            else
                            {
                                data.setColor("#C8FFAA00"); // light orange
                            }
                        }
                        else if (count > 0 && turnGap > 1)
                        {
                            // Streak broken (count preserved but expired)
                            data.setColor("#C800AAFF"); // blue-ish
                        }
                        else
                        {
                            // Normal tile — red
                            data.setColor("#C8FF0000");
                        }
                        data.addPoint(Qt.point(tx, ty));
                    }
                }
            }
        }
    };

    this.perform = function(action, map)
    {
        var unit = action.getTargetUnit();
        ACTION_BOS_FORCEFIELD.postAnimationUnit = unit;

        var animation = Global[unit.getUnitID()].doWalkingAnimation(action, map);
        animation.setEndOfAnimationCall("ACTION_BOS_FORCEFIELD", "performPostAnimation");
        Global[unit.getUnitID()].moveUnit(unit, action, map);

        action.startReading();
        ACTION_BOS_FORCEFIELD.postAnimationTargetX = action.readDataInt32();
        ACTION_BOS_FORCEFIELD.postAnimationTargetY = action.readDataInt32();
    };

    this.performPostAnimation = function(postAnimation, map)
    {
        var unit = ACTION_BOS_FORCEFIELD.postAnimationUnit;
        var targetX = ACTION_BOS_FORCEFIELD.postAnimationTargetX;
        var targetY = ACTION_BOS_FORCEFIELD.postAnimationTargetY;

        if (unit !== null && targetX !== -1 && targetY !== -1 && map.onMap(targetX, targetY))
        {
            var terrain = map.getTerrain(targetX, targetY);
            var terrainVars = terrain.getVariables();

            // ============================================================
            // Forcefield stacking logic with expiration:
            // If the tile was NOT updated last turn (current - last > 1),
            // the count resets to 1 (this is the first consecutive turn).
            // Otherwise increment the counter.
            // ============================================================
            var currentTurn = map.getCurrentDay();
            var count = 0;
            var countVar = terrainVars.getVariable("BOS_FORCEFIELD_COUNT");
            var lastTurnVar = terrainVars.getVariable("BOS_FORCEFIELD_LAST_TURN");
            if (countVar !== null)
            {
                count = countVar.readDataInt32();
            }
            if (lastTurnVar !== null)
            {
                var lastTurn = lastTurnVar.readDataInt32();
                if (currentTurn - lastTurn > 1)
                {
                    // Streak broken — reset
                    count = 0;
                }
            }
            count++;
            terrainVars.createVariable("BOS_FORCEFIELD_COUNT").writeDataInt32(count);
            terrainVars.createVariable("BOS_FORCEFIELD_LAST_TURN").writeDataInt32(currentTurn);

            // Refresh / create the temporary forcefield (1 turn duration)
            terrainVars.createVariable("BOS_FORCEFIELD").writeDataBool(true);
            terrainVars.createVariable("BOS_FORCEFIELD_TURNS").writeDataInt32(1);

            // After 10 consecutive turns, grant Unbreakable
            var isUnbreakable = false;
            if (count >= 10)
            {
                terrainVars.createVariable("BOS_UNBREAKABLE").writeDataBool(true);
                isUnbreakable = true;
            }

            // Play forcefield animation (flashier for Unbreakable)
            var anim = GameAnimationFactory.createAnimation(map, targetX, targetY);
            if (isUnbreakable)
            {
                anim.addSprite("explosion+air", -map.getImageSize() / 2, -map.getImageSize() / 2, 0, 2);
                anim.setSound("explosion+air.wav", 1);
            }
            else
            {
                anim.addSprite("stealth", -map.getImageSize() / 2, -map.getImageSize() / 2, 0, 2);
                anim.setSound("stealth.wav", 1);
            }

            // Record this tile in the Black Onyx's field list for cleanup next turn
            var unitVars = unit.getVariables();
            var myFieldsVar = unitVars.getVariable("BOS_MY_FIELDS");
            var myFields = "";
            if (myFieldsVar !== null)
            {
                myFields = myFieldsVar.readDataString();
            }
            if (myFields !== "")
            {
                myFields += ";";
            }
            myFields += targetX + "," + targetY;
            unitVars.createVariable("BOS_MY_FIELDS").writeDataString(myFields);

            unit.setHasMoved(true);
        }

        ACTION_BOS_FORCEFIELD.postAnimationUnit = null;
        ACTION_BOS_FORCEFIELD.postAnimationTargetX = -1;
        ACTION_BOS_FORCEFIELD.postAnimationTargetY = -1;
    };

    this.getName = function()
    {
        return qsTr("Forcefield");
    };

    this.getDescription = function()
    {
        return qsTr("Project a forcefield onto any tile within range 2-4. All units/weapons on that tile take 30% damage from conventional attacks (including counterattacks). Sustaining the SAME tile for 10 consecutive turns grants Unbreakable (permanent forcefield, 0 damage). If a tile is NOT renewed for more than 1 turn, the streak resets to 0. Does not consume ammo. Ends the turn.");
    };
};

Constructor.prototype = ACTION;
var ACTION_BOS_FORCEFIELD = new Constructor();
