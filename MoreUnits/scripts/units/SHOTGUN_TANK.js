var Constructor = function()
{
    this.init = function(unit)
    {
        unit.setAmmo1(6);
        unit.setMaxAmmo1(6);
        unit.setWeapon1ID("WEAPON_LIGHT_TANK_GUN");

        unit.setAmmo2(10);
        unit.setMaxAmmo2(10);
        unit.setWeapon2ID("WEAPON_LIGHT_TANK_MG");

        unit.setFuel(70);
        unit.setMaxFuel(70);
        unit.setBaseMovementPoints(6);
        unit.setMinRange(1);
        unit.setMaxRange(1);
        unit.setVision(2);
    };

    this.loadSprites = function(unit)
    {
        unit.loadSpriteV2("SHOTGUN_TANK+mask", GameEnums.Recoloring_Matrix);
    };
    this.doWalkingAnimation = function(action, map)
    {
        var unit = action.getTargetUnit();
        var animation = GameAnimationFactory.createWalkingAnimation(map, unit, action);
        animation.loadSpriteV2("SHOTGUN_TANK+walk+mask", GameEnums.Recoloring_Matrix, 1);
        animation.setSound("movetank.wav", -2);
        return animation;
    };
    this.getMovementType = function()
    {
        return "MOVE_TANK";
    };
    this.getBaseCost = function()
    {
        return 15000;
    };
    this.getName = function()
    {
        return qsTr("Shotgun Tank");
    };
    this.canMoveAndFire = function()
    {
        return true;
    };
    this.getDescription = function()
    {
        return qsTr("Shotgun blast: the target tile plus the two tiles flanking it take full attack damage. Splash hits units and HP-buildings regardless of allegiance, but only the main battle shows an animation. Each attack costs a single shell.");
    };
    this.getUnitType = function()
    {
        return GameEnums.UnitType_Ground;
    };
    this.getEditorPlacementSound = function()
    {
        return "movetank.wav";
    };

    // ================================================================
    // Shotgun core: in postBattleActions, silently splash the two tiles
    // flanking the target tile (perpendicular to the firing direction).
    //   units    -> ACTION_FIRE.calcDamage (full combat calculation)
    //   buildings-> ACTION_FIRE.calcEnviromentDamage (env damage table)
    // Counterattacks of splash victims follow the engine's own rule
    // (direct-fire only, Manhattan distance 1; indirect never counters).
    // Also triggers when counterattacking: the blast sprays the attacker.
    // ================================================================
    this.postBattleActions = function(unit, damage, otherUnit, gotAttacked, weapon, action)
    {
        if (gotAttacked) { return; }
        if (weapon !== 0 && weapon !== 1) { return; }
        if (action === null) { return; }

        var map = unit.getOwner().getMap();

        // splash centre: the battled unit's tile; falls back to the action
        // target tile when attacking buildings/terrain
        var tx, ty;
        if (otherUnit !== null)
        {
            tx = otherUnit.getX();
            ty = otherUnit.getY();
        }
        else
        {
            var t = action.getActionTarget();
            tx = t.x;
            ty = t.y;
        }
        var ux = unit.getX(), uy = unit.getY();
        var dx = tx - ux, dy = ty - uy;
        if (dx === 0 && dy === 0) { return; }

        // the two tiles flanking the target, perpendicular to fire direction
        var flanks = [[-dy, dx], [dy, -dx]];
        var sgPos = Qt.point(ux, uy);
        var sgHp  = unit.getHp();
        var gunID = unit.getWeapon1ID();

        for (var i = 0; i < flanks.length; i++)
        {
            var fx = tx + flanks[i][0], fy = ty + flanks[i][1];
            if (map.onMap(fx, fy) === false) { continue; }

            var terrain = map.getTerrain(fx, fy);
            var victim  = terrain.getUnit();
            var bld     = terrain.getBuilding();

            // ---- units: full attack calculation, friend and foe alike ----
            if (victim !== null)
            {
                var vPos = Qt.point(fx, fy);
                var dmg = ACTION_FIRE.calcDamage(action, unit, gunID, sgPos, sgHp,
                                                 victim, vPos, false,
                                                 GameEnums.LuckDamageMode_On, false);
                if (dmg > 0)
                {
                    victim.setHp(victim.getHp() - dmg / 10.0);
                }
                // counterattack: engine rules (direct + distance 1)
                if (victim.getHp() > 0 &&
                    victim.canCounterAttack(action, vPos, unit, sgPos, GameEnums.LuckDamageMode_On))
                {
                    var cw = victim.getWeapon1ID();
                    var cd = ACTION_FIRE.calcDamage(action, victim, cw, vPos, victim.getHp(),
                                                    unit, sgPos, true,
                                                    GameEnums.LuckDamageMode_On, false);
                    if (cd > 0)
                    {
                        unit.setHp(unit.getHp() - cd / 10.0);
                    }
                }
                if (victim.getHp() <= 0)
                {
                    victim.killUnit();
                }
            }

            // ---- HP buildings (MiniCannon / BlackCannon etc.) ----
            if (bld !== null && bld.getHp() > 0 && bld.getIsAttackable(fx, fy))
            {
                var bdmg = ACTION_FIRE.calcEnviromentDamage(action, unit, gunID, sgPos,
                                                            Qt.point(fx, fy), terrain.getID(),
                                                            GameEnums.LuckDamageMode_On);
                if (bdmg > 0)
                {
                    bld.setHp(bld.getHp() - bdmg);
                    if (bld.getHp() <= 0)
                    {
                        var bscript = Global[bld.getBuildingID()];
                        if (typeof bscript.onDestroyed === "function")
                        {
                            bscript.onDestroyed(bld, map);
                        }
                    }
                }
            }
        }
        if (unit.getHp() <= 0)
        {
            unit.killUnit();
        }
    };
};

Constructor.prototype = UNIT;
var SHOTGUN_TANK = new Constructor();
