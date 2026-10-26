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
    this.getUnitDamageID = function(unit)
    {
        // alias to the light tank so every existing weapon table resolves
        // damage against us (otherwise no weapon can attack this unit)
        return "LIGHT_TANK";
    };
    this.canMoveAndFire = function()
    {
        return true;
    };
    this.getDescription = function()
    {
        return qsTr("Shotgun blast: the target tile plus the two tiles flanking it take full attack damage. Splash hits units and HP-buildings regardless of allegiance, splash victims are treated like indirect-fire targets and never counterattack, and only the main battle shows an animation. Each attack costs a single shell.");
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
    // Splash victims follow the indirect-fire rule: they never
    // counterattack. Friendly fire is on. Only the main battle shows
    // an animation and only the main battle consumes ammo.
    // ================================================================
    this.postBattleActions = function(unit, damage, otherUnit, gotAttacked, weapon, action, map)
    {
        try
        {
            if (gotAttacked) { return; }
            if (weapon !== 0 && weapon !== 1) { return; }
            if (unit === null || unit === undefined) { return; }
            if (action === null || action === undefined) { return; }

            if (map === null || map === undefined)
            {
                map = unit.getMap();
            }
            if (map === null || map === undefined) { return; }

            // splash centre: the battled unit's tile; when attacking a
            // building/terrain directly, otherUnit is null and the fire
            // action's recorded target tile is the splash centre instead
            // (getActionTarget points at our own post-move tile there)
            var tx, ty;
            if (otherUnit !== null && otherUnit !== undefined)
            {
                tx = otherUnit.getX();
                ty = otherUnit.getY();
            }
            else if (typeof ACTION_FIRE !== "undefined" && ACTION_FIRE !== null &&
                     map.onMap(ACTION_FIRE.postAnimationTargetX, ACTION_FIRE.postAnimationTargetY))
            {
                tx = ACTION_FIRE.postAnimationTargetX;
                ty = ACTION_FIRE.postAnimationTargetY;
            }
            else
            {
                return;
            }
            var ux = unit.getX(), uy = unit.getY();
            var dx = tx - ux, dy = ty - uy;
            if (dx === 0 && dy === 0) { return; }

            // splash uses the weapon that actually fired (gun or mg)
            var splashWeaponID = (weapon === 0) ? unit.getWeapon1ID() : unit.getWeapon2ID();
            if (splashWeaponID === "") { return; }

            // the two tiles flanking the target, perpendicular to fire direction
            var flanks = [[-dy, dx], [dy, -dx]];
            var sgPos = Qt.point(ux, uy);
            var sgHp  = unit.getHp();

            for (var i = 0; i < flanks.length; i++)
            {
                var fx = tx + flanks[i][0], fy = ty + flanks[i][1];
                try
                {
                    if (map.onMap(fx, fy) === false) { continue; }

                    var terrain = map.getTerrain(fx, fy);
                    var victim  = terrain.getUnit();
                    var bld     = terrain.getBuilding();

                    // ---- units: full attack calculation, friend and foe alike;
                    //      indirect-fire rule: splash victims never counter ----
                    if (victim !== null && victim !== undefined)
                    {
                        var vPos = Qt.point(fx, fy);
                        var dmg = ACTION_FIRE.calcDamage(action, unit, splashWeaponID, sgPos, sgHp,
                                                         victim, vPos, false,
                                                         GameEnums.LuckDamageMode_On, false);
                        if (dmg > 0)
                        {
                            victim.setHp(victim.getHp() - dmg / 10.0);
                        }
                        if (victim.getHp() <= 0)
                        {
                            victim.killUnit();
                        }
                    }

                    // ---- HP buildings (MiniCannon / BlackCannon etc.), no animation ----
                    if (bld !== null && bld !== undefined && bld.getHp() > 0 && bld.getIsAttackable(fx, fy))
                    {
                        var bdmg = ACTION_FIRE.calcEnviromentDamage(action, unit, splashWeaponID, sgPos,
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
                catch (tileError)
                {
                    // one bad tile must never kill the whole blast
                }
            }
        }
        catch (e)
        {
            // never let the shotgun break the engine's battle flow
        }
    };
};

Constructor.prototype = UNIT;
var SHOTGUN_TANK = new Constructor();
