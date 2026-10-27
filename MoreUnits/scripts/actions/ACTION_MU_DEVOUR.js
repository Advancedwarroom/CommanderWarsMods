var Constructor = function()
{
    this.postAnimationUnit = null;
    this.targetX = -1;
    this.targetY = -1;

    this.canBePerformed = function(action, map)
    {
        try
        {
            var unit = action.getTargetUnit();
            if (unit === null || unit === undefined) { return false; }
            if (unit.getUnitID() !== "THE_BLACK_LEVIATHAN") { return false; }
            if (unit.getAmmo1() <= 0) { return false; }
            var v = unit.getVariables().getVariable("MU_LEVIATHAN_DEVOURED");
            if (v !== null && v !== undefined && v.readInt32() === 1) { return false; }
            return true;
        }
        catch (e)
        {
            return false;
        }
    };

    this.getActionText = function()
    {
        return qsTr("Devour");
    };
    this.getIcon = function()
    {
        return "icon_fire";
    };

    this.isFinalStep = function(action, map)
    {
        // the engine has written the picked field after step 0;
        // only then is this single-step action complete
        if (action.getInputStep() === 1)
        {
            return true;
        }
        return false;
    };

    this.getStepInputType = function(action)
    {
        return 'FIELD';
    };

    this.getStepData = function(action, data, map)
    {
        try
        {
            var unit = action.getTargetUnit();
            if (unit === null || unit === undefined) { return; }
            data.setColor('#C8FF0000');
            var ux = unit.getX(), uy = unit.getY();
            for (var dx = -2; dx <= 2; dx++)
            {
                for (var dy = -2; dy <= 2; dy++)
                {
                    var dist = Math.abs(dx) + Math.abs(dy);
                    if (dist < 1 || dist > 2) { continue; }
                    var x = ux + dx, y = uy + dy;
                    if (map.onMap(x, y) === false) { continue; }
                    var targetUnit = map.getTerrain(x, y).getUnit();
                    if (targetUnit !== null && targetUnit !== undefined &&
                        unit.getOwner().isEnemy(targetUnit.getOwner()))
                    {
                        data.addPoint(Qt.point(x, y));
                    }
                }
            }
        }
        catch (e)
        {
            // never let target selection break the action menu
        }
    };

    this.perform = function(action, map)
    {
        try
        {
            // ACTION_MU_SPIT pattern: no createActionAnimation, no setAnimation;
            // the unit's walking animation carries the end-of-animation callback
            var unit = action.getTargetUnit();
            ACTION_MU_DEVOUR.postAnimationUnit = unit;
            action.startReading();
            ACTION_MU_DEVOUR.targetX = action.readDataInt32();
            ACTION_MU_DEVOUR.targetY = action.readDataInt32();
            var animation = Global[unit.getUnitID()].doWalkingAnimation(action, map);
            animation.setEndOfAnimationCall("ACTION_MU_DEVOUR", "performPostAnimation");
            Global[unit.getUnitID()].moveUnit(unit, action, map);
        }
        catch (e)
        {
            // never let the action break the engine's action flow
        }
    };

    this.performPostAnimation = function(postAnimation, map)
    {
        try
        {
            var unit = ACTION_MU_DEVOUR.postAnimationUnit;
            if (unit !== null && unit !== undefined)
            {
                unit.setAmmo1(unit.getAmmo1() - 1);
                var vars = unit.getVariables();
                var v = vars.getVariable("MU_LEVIATHAN_DEVOURED");
                if (v === null || v === undefined)
                {
                    v = vars.createVariable("MU_LEVIATHAN_DEVOURED");
                }
                v.writeInt32(1);
                // the Leviathan stays where it is and rests (moved state)
                unit.setHasMoved(true);
            }
            var tx = ACTION_MU_DEVOUR.targetX, ty = ACTION_MU_DEVOUR.targetY;
            if (map.onMap(tx, ty))
            {
                var target = map.getTerrain(tx, ty).getUnit();
                if (target !== null && target !== undefined)
                {
                    target.killUnit();
                }
            }
            ACTION_MU_DEVOUR.postAnimationUnit = null;
            ACTION_MU_DEVOUR.targetX = -1;
            ACTION_MU_DEVOUR.targetY = -1;
        }
        catch (e)
        {
            // never let the devour break the engine's action flow
        }
    };
};

Constructor.prototype = ACTION;
var ACTION_MU_DEVOUR = new Constructor();
