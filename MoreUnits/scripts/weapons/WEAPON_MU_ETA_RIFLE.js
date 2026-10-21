var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("ETA Rifle");
    };
    this.getEnviromentDamage = function(enviromentId)
    {
        return 1;
    };
    // Slightly stronger than WEAPON_INFANTRY_MG, much weaker than anti-tank weapons.
    this.damageTable = [["INFANTRY", 60],
                        ["MECH", 50],
                        ["MOTORBIKE", 50],
                        ["SNIPER", 65],
                        ["AIRBORNE", 40],

                        // supporter
                        ["APC", 15],
                        ["FLARE", 12],
                        ["RECON", 15],
                        ["TRUCK", 25],

                        // tanks
                        ["FLAK", 8],
                        ["HOVERFLAK", 8],
                        ["LIGHT_TANK", 8],
                        ["HOVERCRAFT", 8],
                        ["MEDIUM_TANK", 5],
                        ["ZCOUNIT_TANK_HUNTER", 5],

                        // heavy tanks
                        ["HEAVY_HOVERCRAFT", 3],
                        ["HEAVY_TANK", 3],
                        ["NEOTANK", 3],

                        // very heavy tanks
                        ["MEGATANK", 1],
                        ["MBT", 1],

                        ["REPAIR_DRONE", 75],
                        ["RECON_DRONE", 80],

                        ["T_TRAIN", 1],
                        ["ARTY_TRAIN", 1],
                        ["ARMORED_TRAIN", 1],

                        ["SNIPER_TOWER", 75],
                        ["PILLBOX", 5],
                        ["MISSILE_DEF", 30],
                        ["ARTY_DEF", 37],

                        ["HOELLIUM", 25],

                        // helicopter
                        ["T_HELI", 35],
                        ["K_HELI", 5],
                        ["R_HELI", 10],

                        // ranged land units
                        ["ARTILLERY", 20],
                        ["ARTILLERYCRAFT", 20],
                        ["ANTITANKCANNON", 35],
                        ["MISSILE", 30],
                        ["ROCKETTHROWER", 30],
                        ["PIPERUNNER", 8],
                        ["MU_PIPEBIN", 8],
                        ["MU_LARGEMISSILE", 15],
                        ["MU_WEAPON_CONSTRUCTOR", 15],
                        ["MU_BACKTRACKCAR", 10],
                        ["MU_EMPOWER_TERRAIN_EDITOR", 60]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_MU_ETA_RIFLE.damageTable, "WEAPON_MU_ETA_RIFLE");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_MU_ETA_RIFLE = new Constructor();
