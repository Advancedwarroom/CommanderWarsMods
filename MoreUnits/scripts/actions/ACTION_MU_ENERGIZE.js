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

    this.isFinalStep = function(action)
    {
        if (action.getStepInputType() === 'FIELD')
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
            action.startReading();
            var x = action.readDataInt32();
            var y = action.readDataInt32();
            ACTION_MU_ENERGIZE.targetX = x;
            ACTION_MU_ENERGIZE.targetY = y;
            ACTION_MU_ENERGIZE.postAnimationUnit = action.getTargetUnit();
            var unit = action.getTargetUnit();
            var animation = GameAnimationFactory.createActionAnimation(map, unit, action);
            animation.writeDataInt32(unit.getX());
            animation.writeDataInt32(unit.getY());
            animation.setEndOfAnimationCall("ACTION_MU_ENERGIZE", "performPostAnimation");
            action.setAnimation(animation);
            Global[unit.getUnitID()].moveUnit(unit, action, map);
        }
        catch (e)
        {
            // never let the energize break the engine's action flow
        }
    };

    this.performPostAnimation = function(postAnimation, map)
    {
        try
        {
            postAnimation.startReading();
            var ux = postAnimation.readDataInt32();
            var uy = postAnimation.readDataInt32();
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
