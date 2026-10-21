var Constructor = function()
{
    this.LAUNCH_COST = 10000;

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
        if (unit.getAmmo1() > 0 && funds >= ACTION_MU_LAUNCH_MISSILE.LAUNCH_COST)
        {
            return true;
        }
        return false;
    };

    this.getActionText = function(map)
    {
        return qsTr("Launch") + " " + ACTION_MU_LAUNCH_MISSILE.LAUNCH_COST.toString();
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

        data.setColor("#C8FF0000");
        for (var dx = -5; dx <= 5; dx++)
        {
            for (var dy = -5; dy <= 5; dy++)
            {
                var dist = Math.abs(dx) + Math.abs(dy);
                if (dist >= 2 && dist <= 5)
                {
                    var tx = ux + dx;
                    var ty = uy + dy;
                    if (map.onMap(tx, ty))
                    {
                        data.addPoint(Qt.point(tx, ty));
                    }
                }
            }
        }
    };

    this.perform = function(action, map)
    {
        var unit = action.getTargetUnit();

        ACTION_MU_LAUNCH_MISSILE.postAnimationUnit = unit;

        var animation = Global[unit.getUnitID()].doWalkingAnimation(action, map);
        animation.setEndOfAnimationCall("ACTION_MU_LAUNCH_MISSILE", "performPostAnimation");

        Global[unit.getUnitID()].moveUnit(unit, action, map);

        action.startReading();
        ACTION_MU_LAUNCH_MISSILE.postAnimationTargetX = action.readDataInt32();
        ACTION_MU_LAUNCH_MISSILE.postAnimationTargetY = action.readDataInt32();
    };

    this.performPostAnimation = function(postAnimation, map)
    {
        var unit = ACTION_MU_LAUNCH_MISSILE.postAnimationUnit;
        var targetX = ACTION_MU_LAUNCH_MISSILE.postAnimationTargetX;
        var targetY = ACTION_MU_LAUNCH_MISSILE.postAnimationTargetY;

        if (unit !== null && targetX !== -1 && targetY !== -1)
        {
            var player = unit.getOwner();

            unit.setAmmo1(unit.getAmmo1() - 1);
            player.addFunds(-ACTION_MU_LAUNCH_MISSILE.LAUNCH_COST);

            var unitOwner = unit.getOwner();

            var animation = GameAnimationFactory.createAnimation(map, targetX, targetY);
            animation.addSprite("explosion+land", -map.getImageSize() / 2, -map.getImageSize(), 0, 2);
            animation.setSound("explosion+land.wav");

            for (var dx = -3; dx <= 3; dx++)
            {
                for (var dy = -3; dy <= 3; dy++)
                {
                    var dist = Math.abs(dx) + Math.abs(dy);
                    if (dist <= 3)
                    {
                        var tx = targetX + dx;
                        var ty = targetY + dy;
                        if (map.onMap(tx, ty))
                        {
                            var terrain = map.getTerrain(tx, ty);
                            var targetUnit = terrain.getUnit();
                            var targetBuilding = terrain.getBuilding();

                            if (targetUnit !== null)
                            {
                                var targetOwner = targetUnit.getOwner();
                                var targetUnitType = targetUnit.getUnitType();
                                var isSpecialWeapon = (targetUnitType === GameEnums.REMOTE_WEAPON);
                                var damage = 0;

                                if (targetOwner === unitOwner)
                                {
                                    damage = isSpecialWeapon ? 0 : 3;
                                }
                                else if (unitOwner.isAlly(targetOwner))
                                {
                                    damage = isSpecialWeapon ? 0 : 4;
                                }
                                else if (unitOwner.isEnemy(targetOwner))
                                {
                                    damage = isSpecialWeapon ? 1 : 5;
                                }

                                if (damage > 0)
                                {
                                    var currentHp = targetUnit.getHp();
                                    var newHp = currentHp - damage;
                                    if (newHp < 0)
                                    {
                                        newHp = 0;
                                    }
                                    targetUnit.setHp(newHp);
                                    if (targetUnit.getHp() <= 0)
                                    {
                                        targetUnit.killUnit();
                                    }
                                }
                            }

                            if (targetBuilding !== null && targetBuilding.getOwnerID() >= 0)
                            {
                                var buildingOwner = targetBuilding.getOwner();
                                if (unitOwner.isEnemy(buildingOwner))
                                {
                                    var buildingID = targetBuilding.getBuildingID();
                                    var isSpecialBuilding = false;
                                    if (buildingID !== null)
                                    {
                                        var upperID = buildingID.toUpperCase();
                                        isSpecialBuilding = (upperID.indexOf("DEATHRAY") >= 0 ||
                                                            upperID.indexOf("NUKE") >= 0 ||
                                                            upperID.indexOf("LASER") >= 0);
                                    }
                                    var buildingDamage = isSpecialBuilding ? 10 : 1;
                                    var currentBuildingHp = targetBuilding.getHp();
                                    var newBuildingHp = currentBuildingHp - buildingDamage;
                                    if (newBuildingHp < 0)
                                    {
                                        newBuildingHp = 0;
                                    }
                                    targetBuilding.setHp(newBuildingHp);
                                }
                            }
                        }
                    }
                }
            }

            unit.setHasMoved(true);
        }

        ACTION_MU_LAUNCH_MISSILE.postAnimationUnit = null;
        ACTION_MU_LAUNCH_MISSILE.postAnimationTargetX = -1;
        ACTION_MU_LAUNCH_MISSILE.postAnimationTargetY = -1;
    };

    this.getName = function()
    {
        return qsTr("Launch Missile");
    };

    this.getDescription = function()
    {
        return qsTr("Launch a missile at a target location (range 2-5). Costs 10000 funds per launch. Deals fixed AOE damage in a 0-3 tile radius: Enemies 5 HP, Allies 4 HP, Same-player 3 HP. Enemy special weapons (DeathRay, etc.) take 1 HP. Enemy buildings take 1 HP, special weapon buildings take 10 HP. Friendly/ally units and buildings unaffected.");
    };
}

Constructor.prototype = ACTION;
var ACTION_MU_LAUNCH_MISSILE = new Constructor();
