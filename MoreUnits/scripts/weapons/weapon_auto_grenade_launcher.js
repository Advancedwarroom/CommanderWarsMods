var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("Automatic Grenade Launcher");
    };
    this.getEnviromentDamage = function(enviromentId)
    {
        return 5;
    };
    this.damageTable = [["INFANTRY", 140],
                        ["MECH", 130],
                        ["MOTORBIKE", 135],
                        ["SNIPER", 150],
                        ["AIRBORNE", 110],

                        // supporter
                        ["APC", 65],
                        ["FLARE", 55],
                        ["RECON", 60],
						["TRUCK", 85],

                        // tanks
                        ["FLAK", 10],
                        ["HOVERFLAK", 12],
                        ["LIGHT_TANK", 8],
                        ["HOVERCRAFT", 8],
                        ["MEDIUM_TANK", 3],
                        ["ZCOUNIT_TANK_HUNTER", 7],

                        // heavy tanks
                        ["HEAVY_HOVERCRAFT", 1],
                        ["HEAVY_TANK", 1],
                        ["NEOTANK", 1],

                        // very heavy tanks
                        ["MEGATANK", 1],
						["MBT", 1],
						
						["REPAIR_DRONE", 220],
						
						["T_TRAIN", 15],
						["ARTY_TRAIN", 1],
						["ARMORED_TRAIN", 1],
						
						["SNIPER_TOWER", 205],
						["PILLBOX", 10],
						["MISSILE_DEF", 60],
						["ARTY_DEF", 80],

                        ["HOELLIUM", 40],


                        // ranged land units
                        ["ARTILLERY", 65],
                        ["ARTILLERYCRAFT", 65],
                        ["ANTITANKCANNON", 75],
                        ["MISSILE", 40],
                        ["ROCKETTHROWER", 75],
                        ["PIPERUNNER", 10],
                        ["MU_PIPEBIN", 10],
                        ["MU_LARGEMISSILE", 35],
                        ["MU_WEAPON_CONSTRUCTOR", 35],
                        ["MU_BACKTRACKCAR", 30],
                        ["MU_EMPOWER_TERRAIN_EDITOR", 140]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_AUTO_GRENADE_LAUNCHER.damageTable, "WEAPON_AUTO_GRENADE_LAUNCHER");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_AUTO_GRENADE_LAUNCHER = new Constructor();