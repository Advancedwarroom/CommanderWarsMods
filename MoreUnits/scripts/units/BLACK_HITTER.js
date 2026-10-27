var Constructor = function()
{
    this.init = function(unit)
    {
        unit.setFuel(70);
        unit.setMaxFuel(70);
        unit.setBaseMovementPoints(7);
        unit.setMinRange(1);
        unit.setMaxRange(1);
        unit.setVision(3);
        // no weapons: its only attack is driving through the enemy
        // engine-native pass-through (same switch the Oozium uses)
        unit.setIgnoreUnitCollision(true);
    };

    this.loadSprites = function(unit)
    {
        unit.loadSpriteV2("BLACK_HITTER+mask", GameEnums.Recoloring_Matrix);
    };
    this.doWalkingAnimation = function(action, map)
    {
        var unit = action.getTargetUnit();
        // ---- pass-through impact: the first three enemy units on the
        //      path take 3 / 2 / 1 HP; everything after passes unharmed ----
        try
        {
            var path = action.getMovePath();
            var impact = 3;
            for (var i = 1; i < path.length - 1; i++)
            {
                if (impact < 1) { break; }
                var p = path[i];
                if (map.onMap(p.x, p.y) === false) { continue; }
                var victim = map.getTerrain(p.x, p.y).getUnit();
                if (victim !== null && victim !== undefined &&
                    unit.getOwner().isEnemy(victim.getOwner()))
                {
                    victim.setHp(victim.getHp() - impact);
                    if (victim.getHp() <= 0)
                    {
                        victim.killUnit();
                    }
                    impact -= 1;
                }
            }
        }
        catch (e)
        {
            // pass-through damage must never break the move
        }
        var animation = GameAnimationFactory.createWalkingAnimation(map, unit, action);
        animation.loadSpriteV2("BLACK_HITTER+walk+mask", GameEnums.Recoloring_Matrix, 1);
        animation.setSound("movetank.wav", -2);
        return animation;
    };
    this.getMovementType = function()
    {
        return "MOVE_TANK";
    };
    this.getBaseCost = function()
    {
        return 28000;
    };
    this.getName = function()
    {
        return qsTr("Black Hitter");
    };
    this.getUnitDamageID = function(unit)
    {
        // boss-grade hull: mega tank defensive table
        return "MEGATANK";
    };
    this.canMoveAndFire = function()
    {
        return true;
    };
    this.getDescription = function()
    {
        return qsTr("A boss-class war machine that does not shoot - it rams through the enemy. Enemy units never block its movement: the first unit it passes through takes 3 HP damage, the second 2 HP, the third 1 HP (further units pass unharmed). It carries no weapons and relies on its mega-tank grade hull. Expensive, fast, and utterly indifferent to your battle line.");
    };
    this.getUnitType = function()
    {
        return GameEnums.UnitType_Ground;
    };
    this.getEditorPlacementSound = function()
    {
        return "movetank.wav";
    };
};

Constructor.prototype = UNIT;
var BLACK_HITTER = new Constructor();
