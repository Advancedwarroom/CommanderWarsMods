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
            if (unit.getUnitID() !== "MICROWAVE_VEHICLE") { return false; }
            // solar energizing only works under a sunny sky
            if (map.getGameRules().getCurrentWeather().getWeatherId() !== "WEATHER_1SUN") { return false; }
            var v = unit.getVariables().getVariable("MU_ENERGIZED");
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
        return qsTr("Energize");
    };
    this.getIcon = function()
    {
        return "icon_load";
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
            data.setColor('#C800FF00');
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
                        unit.getOwner().isEnemy(targetUnit.getOwner()) === false &&
                        targetUnit.getHp() < 10)
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
            ACTION_MU_ENERGIZE.postAnimationUnit = unit;
            action.startReading();
            ACTION_MU_ENERGIZE.targetX = action.readDataInt32();
            ACTION_MU_ENERGIZE.targetY = action.readDataInt32();
            var animation = Global[unit.getUnitID()].doWalkingAnimation(action, map);
            animation.setEndOfAnimationCall("ACTION_MU_ENERGIZE", "performPostAnimation");
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
            var unit = ACTION_MU_ENERGIZE.postAnimationUnit;
            if (unit !== null && unit !== undefined)
            {
                var vars = unit.getVariables();
                var v = vars.getVariable("MU_ENERGIZED");
                if (v === null || v === undefined)
                {
                    v = vars.createVariable("MU_ENERGIZED");
                }
                v.writeInt32(1);
                unit.setHasMoved(true);
            }
            var tx = ACTION_MU_ENERGIZE.targetX, ty = ACTION_MU_ENERGIZE.targetY;
            if (map.onMap(tx, ty))
            {
                var target = map.getTerrain(tx, ty).getUnit();
                if (target !== null && target !== undefined)
                {
                    var hp = target.getHp();
                    if (hp < 10)
                    {
                        target.setHp(Math.min(10, hp + 1));
                    }
                }
            }
            ACTION_MU_ENERGIZE.postAnimationUnit = null;
            ACTION_MU_ENERGIZE.targetX = -1;
            ACTION_MU_ENERGIZE.targetY = -1;
        }
        catch (e)
        {
            // never let the energize break the engine's action flow
        }
    };
};

Constructor.prototype = ACTION;
var ACTION_MU_ENERGIZE = new Constructor();
