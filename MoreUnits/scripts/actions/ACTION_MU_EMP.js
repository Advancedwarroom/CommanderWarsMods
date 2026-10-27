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
            if (unit.getUnitID() !== "MATRIX_CAR") { return false; }
            if (unit.getAmmo1() <= 0) { return false; }
            var v = unit.getVariables().getVariable("MU_EMP_USED");
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
        return qsTr("EMP");
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
            for (var dx = -1; dx <= 1; dx++)
            {
                for (var dy = -1; dy <= 1; dy++)
                {
                    if (Math.abs(dx) + Math.abs(dy) !== 1) { continue; }
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
            action.startReading();
            var x = action.readDataInt32();
            var y = action.readDataInt32();
            ACTION_MU_EMP.targetX = x;
            ACTION_MU_EMP.targetY = y;
            ACTION_MU_EMP.postAnimationUnit = action.getTargetUnit();
            var unit = action.getTargetUnit();
            var animation = GameAnimationFactory.createActionAnimation(map, unit, action);
            animation.writeDataInt32(unit.getX());
            animation.writeDataInt32(unit.getY());
            animation.setEndOfAnimationCall("ACTION_MU_EMP", "performPostAnimation");
            action.setAnimation(animation);
            Global[unit.getUnitID()].moveUnit(unit, action, map);
        }
        catch (e)
        {
            // never let the EMP break the engine's action flow
        }
    };

    this.performPostAnimation = function(postAnimation, map)
    {
        try
        {
            postAnimation.startReading();
            var ux = postAnimation.readDataInt32();
            var uy = postAnimation.readDataInt32();
            var unit = ACTION_MU_EMP.postAnimationUnit;
            if (unit !== null && unit !== undefined)
            {
                unit.setAmmo1(unit.getAmmo1() - 1);
                var vars = unit.getVariables();
                var v = vars.getVariable("MU_EMP_USED");
                if (v === null || v === undefined)
                {
                    v = vars.createVariable("MU_EMP_USED");
                }
                v.writeInt32(1);
                // firing the EMP ends the Matrix Car's turn as well
                unit.setHasMoved(true);
            }
            var tx = ACTION_MU_EMP.targetX, ty = ACTION_MU_EMP.targetY;
            if (map.onMap(tx, ty))
            {
                var target = map.getTerrain(tx, ty).getUnit();
                if (target !== null && target !== undefined)
                {
                    // zero damage: the Von Bolt lightning lockdown. The flag
                    // is only reset at the end of the victim's next turn, so
                    // the unit misses exactly one full turn.
                    target.setHasMoved(true);
                }
            }
            ACTION_MU_EMP.postAnimationUnit = null;
            ACTION_MU_EMP.targetX = -1;
            ACTION_MU_EMP.targetY = -1;
        }
        catch (e)
        {
            // never let the EMP break the engine's action flow
        }
    };
};

Constructor.prototype = ACTION;
var ACTION_MU_EMP = new Constructor();
