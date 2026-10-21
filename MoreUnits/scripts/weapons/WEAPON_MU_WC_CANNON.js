var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("Constructor Cannon");
    };
    this.damageTable = [["INFANTRY", 85],
                        ["MECH", 80],
                        ["MOTORBIKE", 82],
                        ["SNIPER", 78],
                        ["AIRBORNE", 70],

                        // supporter
                        ["APC", 48],
                        ["FLARE", 40],
                        ["RECON", 45],
                        ["TRUCK", 65],

                        // tanks
                        ["FLAK", 20],
                        ["HOVERFLAK", 20],
                        ["LIGHT_TANK", 15],
                        ["HOVERCRAFT", 15],
                        ["MEDIUM_TANK", 5],
                        ["ZCOUNIT_TANK_HUNTER", 10],

                        // heavy tanks
                        ["HEAVY_HOVERCRAFT", 3],
                        ["HEAVY_TANK", 3],
                        ["NEOTANK", 3],

                        // very heavy tanks
                        ["MEGATANK", 1],
                        ["MBT", 1],

                        ["REPAIR_DRONE", 130],
                        ["RECON_DRONE", 130],

                        ["T_TRAIN", 8],
                        ["ARTY_TRAIN", 1],
                        ["ARMORED_TRAIN", 1],

                        ["SNIPER_TOWER", 95],
                        ["PILLBOX", 1],
                        ["MISSILE_DEF", 50],
                        ["ARTY_DEF", 55],

                        ["HOELLIUM", 20],

                        // helicopter
                        ["T_HELI", 70],
                        ["K_HELI", 40],
                        ["R_HELI", 60],

                        // ranged land units
                        ["ARTILLERY", 48],
                        ["ARTILLERYCRAFT", 48],
                        ["ANTITANKCANNON", 25],
                        ["MISSILE", 40],
                        ["ROCKETTHROWER", 55],
                        ["PIPERUNNER", 15],
                        ["MU_PIPEBIN", 15],
                        ["MU_LARGEMISSILE", 55],
                        ["MU_BACKTRACKCAR", 50],
                        ["MU_EMPOWER_TERRAIN_EDITOR", 75],
                        ["MU_WEAPON_CONSTRUCTOR", 35]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_MU_WC_CANNON.damageTable, "WEAPON_MU_WC_CANNON");
    };
    this.getEnviromentDamage = function(enviromentId)
    {
        return 1;
    };
};

Constructor.prototype = WEAPON;
var WEAPON_MU_WC_CANNON = new Constructor();
