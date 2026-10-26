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
        unit.loadSpriteV2("LASER_TANK+mask", GameEnums.Recoloring_Matrix);
    };
    this.doWalkingAnimation = function(action, map)
    {
        var unit = action.getTargetUnit();
        var animation = GameAnimationFactory.createWalkingAnimation(map, unit, action);
        animation.loadSpriteV2("LASER_TANK+walk+mask", GameEnums.Recoloring_Matrix, 1);
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
        return qsTr("Laser Tank");
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
        return qsTr("Fires a piercing laser: the target tile plus two more tiles straight along the firing direction take full attack damage. The beam penetrates everything, hits units and HP-buildings regardless of allegiance, beam victims are treated like indirect-fire targets and never counterattack, and only the main battle shows an animation. Each attack costs a single charge.");
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
    // Laser core: in postBattleActions, silently hit two extra tiles
    // straight along the firing direction (the beam keeps travelling
    // past the target). Each beam tile is a full attack calculation:
    //   units    -> ACTION_FIRE.calcDamage (full combat calculation)
    //   buildings-> ACTION_FIRE.calcEnviromentDamage (env damage table)
    // Beam victims follow the indirect-fire rule: they never
    // counterattack. Friendly fire is on. The beam ignores all
    // obstacles; only the map edge stops it. A red laser ray visual
    // (the vanilla Laser Cannon effect) is queued along the beam.
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

            // beam origin: the battled unit's tile; when attacking a
            // building/terrain directly, otherUnit is null and the fire
            // action's recorded target tile is the beam origin instead
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

            // beam uses the weapon that actually fired (gun or mg)
            var beamWeaponID = (weapon === 0) ? unit.getWeapon1ID() : unit.getWeapon2ID();
            if (beamWeaponID === "") { return; }

            // the beam travels two more tiles straight along (dx, dy);
            // the target tile itself is excluded - it already took the
            // regular battle damage, hitting it again would double it
            var beamTiles = [[tx + dx, ty + dy], [tx + 2 * dx, ty + 2 * dy]];
            var sgPos = Qt.point(ux, uy);
            var sgHp  = unit.getHp();

            // ---- red laser ray visual along the whole beam ----
            try
            {
                // rotation: sprite points east at 0 degrees, screen y is down
                var beamRotation = Math.atan2(dy, dx) * 180.0 / Math.PI;
                var visualTiles = [[tx, ty], [tx + dx, ty + dy], [tx + 2 * dx, ty + 2 * dy]];
                for (var b = 0; b < visualTiles.length; b++)
                {
                    var bx = visualTiles[b][0], by = visualTiles[b][1];
                    if (map.onMap(bx, by) === false) { break; }
                    var beamAnim = GameAnimationFactory.createAnimation(map, bx, by);
                    if (b === 0)
                    {
                        beamAnim.addSprite("laserray+center+start", 0, 0, 0, 2);
                    }
                    else
                    {
                        beamAnim.addSprite("laserray", 0, 0, 0, 2);
                    }
                    beamAnim.setRotation(beamRotation);
                    if (b === 0)
                    {
                        beamAnim.setSound("laserFire.wav");
                    }
                    action.queueAnimation(beamAnim);
                }
            }
            catch (animError)
            {
                // missing laser sprites must never break the battle
            }

            for (var i = 0; i < beamTiles.length; i++)
            {
                var fx = beamTiles[i][0], fy = beamTiles[i][1];
                try
                {
                    if (map.onMap(fx, fy) === false) { continue; }

                    var terrain = map.getTerrain(fx, fy);
                    var victim  = terrain.getUnit();
                    var bld     = terrain.getBuilding();

                    // ---- units: full attack calculation, friend and foe alike;
                    //      indirect-fire rule: beam victims never counter ----
                    if (victim !== null && victim !== undefined)
                    {
                        var vPos = Qt.point(fx, fy);
                        var dmg = ACTION_FIRE.calcDamage(action, unit, beamWeaponID, sgPos, sgHp,
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
                        var bdmg = ACTION_FIRE.calcEnviromentDamage(action, unit, beamWeaponID, sgPos,
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
                    // one bad tile must never kill the whole beam
                }
            }
        }
        catch (e)
        {
            // never let the laser break the engine's battle flow
        }
    };
};

Constructor.prototype = UNIT;
var LASER_TANK = new Constructor();
