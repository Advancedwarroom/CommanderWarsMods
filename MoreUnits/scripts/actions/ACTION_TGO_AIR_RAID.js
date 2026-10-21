var Constructor = function()
{
    this.AIR_RAID_COST = 20000;
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
        var funds = unit.getOwner().getFunds();
        if (unit.getAmmo1() > 0 && funds >= ACTION_TGO_AIR_RAID.AIR_RAID_COST)
        {
            return true;
        }
        return false;
    };

    this.getActionText = function(map)
    {
        return qsTr("Air Raid") + " " + ACTION_TGO_AIR_RAID.AIR_RAID_COST.toString();
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
        data.setColor("#C8FF0000");
        var mapWidth = map.getMapWidth();
        var mapHeight = map.getMapHeight();
        for (var x = 0; x < mapWidth; x++)
        {
            for (var y = 0; y < mapHeight; y++)
            {
                data.addPoint(Qt.point(x, y));
            }
        }
    };

    this.perform = function(action, map)
    {
        var unit = action.getTargetUnit();
        ACTION_TGO_AIR_RAID.postAnimationUnit = unit;

        var animation = Global[unit.getUnitID()].doWalkingAnimation(action, map);
        animation.setEndOfAnimationCall("ACTION_TGO_AIR_RAID", "performPostAnimation");
        Global[unit.getUnitID()].moveUnit(unit, action, map);

        action.startReading();
        ACTION_TGO_AIR_RAID.postAnimationTargetX = action.readDataInt32();
        ACTION_TGO_AIR_RAID.postAnimationTargetY = action.readDataInt32();
    };

    this.performPostAnimation = function(postAnimation, map)
    {
        var unit = ACTION_TGO_AIR_RAID.postAnimationUnit;
        var targetX = ACTION_TGO_AIR_RAID.postAnimationTargetX;
        var targetY = ACTION_TGO_AIR_RAID.postAnimationTargetY;

        if (unit !== null && targetX !== -1 && targetY !== -1)
        {
            var player = unit.getOwner();
            unit.setAmmo1(unit.getAmmo1() - 1);
            player.addFunds(-ACTION_TGO_AIR_RAID.AIR_RAID_COST);

            var animation = GameAnimationFactory.createAnimation(map, targetX, targetY);
            animation.addSprite("explosion+land", -map.getImageSize() / 2, -map.getImageSize(), 0, 2);
            animation.setSound("explosion+land.wav");

            for (var dx = -1; dx <= 1; dx++)
            {
                for (var dy = -1; dy <= 1; dy++)
                {
                    var dist = Math.abs(dx) + Math.abs(dy);
                    if (dist >= 0 && dist <= 1)
                    {
                        var tx = targetX + dx;
                        var ty = targetY + dy;
                        if (map.onMap(tx, ty))
                        {
                            var terrain = map.getTerrain(tx, ty);
                            var targetUnit = terrain.getUnit();
                            if (targetUnit !== null)
                            {
                                var newHp = targetUnit.getHp() - 5;
                                if (newHp <= 0)
                                {
                                    targetUnit.killUnit();
                                }
                                else
                                {
                                    targetUnit.setHp(newHp);
                                }
                            }
                        }
                    }
                }
            }

            unit.setHasMoved(true);
        }

        ACTION_TGO_AIR_RAID.postAnimationUnit = null;
        ACTION_TGO_AIR_RAID.postAnimationTargetX = -1;
        ACTION_TGO_AIR_RAID.postAnimationTargetY = -1;
    };

    this.getName = function()
    {
        return qsTr("Air Raid");
    };

    this.getDescription = function()
    {
        return qsTr("Spend 20000G to call an air raid strike anywhere on the map. Select any tile as center; deals fixed 5 HP damage to all units in range 0-1 (center + 4 adjacent tiles). Consumes 1 ammo.");
    };
};

Constructor.prototype = ACTION;
var ACTION_TGO_AIR_RAID = new Constructor();
