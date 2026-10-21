var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("Pipe Waste");
    };

    // Damage table: value 1 for all units = 0 actual HP damage
    // (1% of 10 HP = 0.1, rounds down to 0). The attack is valid
    // (getBaseDamage returns 1 > 0) but deals no HP loss. The actual
    // effect is applied via MU_PIPEBIN.postBattleActions (rubbish layer).
    this.damageTable = [["INFANTRY", 1],
                        ["MECH", 1],
                        ["MOTORBIKE", 1],
                        ["SNIPER", 1],
                        ["AIRBORNE", 1],

                        // supporter
                        ["APC", 1],
                        ["FLARE", 1],
                        ["RECON", 1],
                        ["TRUCK", 1],

                        // tanks
                        ["FLAK", 1],
                        ["HOVERFLAK", 1],
                        ["LIGHT_TANK", 1],
                        ["HOVERCRAFT", 1],
                        ["MEDIUM_TANK", 1],
                        ["ZCOUNIT_TANK_HUNTER", 1],

                        // heavy tanks
                        ["HEAVY_HOVERCRAFT", 1],
                        ["HEAVY_TANK", 1],
                        ["NEOTANK", 1],

                        // very heavy tanks
                        ["MEGATANK", 1],
                        ["MBT", 1],

                        ["REPAIR_DRONE", 1],
                        ["RECON_DRONE", 1],

                        ["T_TRAIN", 1],
                        ["ARTY_TRAIN", 1],
                        ["ARMORED_TRAIN", 1],

                        ["SNIPER_TOWER", 1],
                        ["PILLBOX", 1],
                        ["MISSILE_DEF", 1],
                        ["ARTY_DEF", 1],

                        ["HOELLIUM", 1],

                        // helicopter
                        ["T_HELI", 1],
                        ["K_HELI", 1],
                        ["R_HELI", 1],

                        // air
                        ["DUSTER", 1],
                        ["FIGHTER", 1],
                        ["DRONE", 1],
                        ["STRIKER", 1],
                        ["BOMBER", 1],
                        ["STEALTHBOMBER", 1],
                        ["TRANSPORTPLANE", 1],
                        ["BLACK_BOMB", 1],
                        ["WATERPLANE", 1],

                        // ranged land units
                        ["ARTILLERY", 1],
                        ["ARTILLERYCRAFT", 1],
                        ["ANTITANKCANNON", 1],
                        ["MISSILE", 1],
                        ["ROCKETTHROWER", 1],
                        ["PIPERUNNER", 1],

                        // ships
                        ["GUNBOAT", 1],
                        ["CANNONBOAT", 1],
                        ["BLACK_BOAT", 1],
                        ["TORPEDOBOAT", 1],
                        ["LANDER", 1],
                        ["FRIGATE", 1],
                        ["DESTROYER", 1],
                        ["CRUISER", 1],
                        ["SUBMARINE", 1],
                        ["NUCLEAR_SUBMARINE", 1],
                        ["BATTLECRUISER", 1],
                        ["BATTLESHIP", 1],
                        ["AIRCRAFTCARRIER", 1],

                        // MoreUnits
                        ["MU_LARGEMISSILE", 1],
                        ["MU_WEAPON_CONSTRUCTOR", 1],
                        ["MU_BACKTRACKCAR", 1],
                        ["MU_EMPOWER_TERRAIN_EDITOR", 1],
                        ["MU_PIPEBIN", 1]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_MU_PIPEBIN.damageTable, "WEAPON_MU_PIPEBIN");
    };

    this.getEnviromentDamage = function(enviromentId)
    {
        return 0;
    };
};

Constructor.prototype = WEAPON;
var WEAPON_MU_PIPEBIN = new Constructor();
