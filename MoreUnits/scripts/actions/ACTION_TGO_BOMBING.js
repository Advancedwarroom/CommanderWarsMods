var Constructor = function()
{
    this.postAnimationUnit = null;

    this.canBePerformed = function(action, map)
    {
        var unit = action.getTargetUnit();
        if (unit === null || unit.getHasMoved() === true)
        {
            return false;
        }
        if (unit.getAmmo1() > 0)
        {
            return true;
        }
        return false;
    };

    this.getActionText = function(map)
    {
        return qsTr("Bombing");
    };

    this.getIcon = function(map)
    {
        return "icon_fire";
    };

    this.isFinalStep = function(action, map)
    {
        return true;
    };

    this.perform = function(action, map)
    {
        var unit = action.getTargetUnit();
        ACTION_TGO_BOMBING.postAnimationUnit = unit;

        var animation = Global[unit.getUnitID()].doWalkingAnimation(action, map);
        animation.setEndOfAnimationCall("ACTION_TGO_BOMBING", "performPostAnimation");
        Global[unit.getUnitID()].moveUnit(unit, action, map);
    };

    this.performPostAnimation = function(postAnimation, map)
    {
        var unit = ACTION_TGO_BOMBING.postAnimationUnit;
        if (unit !== null)
        {
            unit.setAmmo1(unit.getAmmo1() - 1);
            var ux = unit.getX();
            var uy = unit.getY();

            var centerAnim = GameAnimationFactory.createAnimation(map, ux, uy);
            centerAnim.addSprite("explosion+air", -map.getImageSize() / 2, -map.getImageSize(), 0, 2);
            centerAnim.setSound("explosion+air.wav");

            for (var dx = -3; dx <= 3; dx++)
            {
                for (var dy = -3; dy <= 3; dy++)
                {
                    var dist = Math.abs(dx) + Math.abs(dy);
                    if (dist >= 1 && dist <= 3)
                    {
                        var tx = ux + dx;
                        var ty = uy + dy;
                        if (map.onMap(tx, ty))
                        {
                            var terrain = map.getTerrain(tx, ty);
                            var targetUnit = terrain.getUnit();
                            if (targetUnit !== null)
                            {
                                var newHp = targetUnit.getHp() - 3;
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
        ACTION_TGO_BOMBING.postAnimationUnit = null;
    };

    this.getName = function()
    {
        return qsTr("Bombing");
    };

    this.getDescription = function()
    {
        return qsTr("Bomb the area around itself (range 1-3, excluding self). Deals fixed 3 HP damage to ALL units regardless of affiliation. Consumes 1 ammo.");
    };
};

Constructor.prototype = ACTION;
var ACTION_TGO_BOMBING = new Constructor();
