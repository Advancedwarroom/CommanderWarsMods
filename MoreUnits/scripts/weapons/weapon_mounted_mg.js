var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("Mounted Machine Gun");
    };
    this.getEnviromentDamage = function(enviromentId)
    {
        return 1;
    };
    this.damageTable = [["INFANTRY", 95],
                        ["MECH", 85],
                        ["MOTORBIKE", 80],
                        ["SNIPER", 75],
                        ["AIRBORNE", 65],

                        // supporter
                        ["APC", 45],
                        ["FLARE", 30],
                        ["RECON", 35],
						["TRUCK", 55],

                        // tanks
                        ["FLAK", 4],
                        ["HOVERFLAK", 4],
                        ["LIGHT_TANK", 6],
                        ["HOVERCRAFT", 6],
                        ["MEDIUM_TANK", 1],
                        ["ZCOUNIT_TANK_HUNTER", 3],

                        // heavy tanks
                        ["HEAVY_HOVERCRAFT", 1],
                        ["HEAVY_TANK", 1],
                        ["NEOTANK", 1],
						
						["REPAIR_DRONE", 145],
						["RECON_DRONE", 135],

                        // very heavy tanks
                        ["MEGATANK", 1],
						["MBT", 1],

                        ["HOELLIUM", 20],
						
						["T_TRAIN", 1],
						["ARTY_TRAIN", 1],
						["ARMORED_TRAIN", 1],
						
						["SNIPER_TOWER", 95],
						["PILLBOX", 1],
						["MISSILE_DEF", 32],
						["ARTY_DEF", 37],

                        // heli copter
                        ["T_HELI", 35],
                        ["K_HELI", 3],
                        ["R_HELI", 12],

                        // ranged land units
                        ["ARTILLERY", 45],
                        ["ARTILLERYCRAFT", 45],
                        ["ANTITANKCANNON", 25],
                        ["MISSILE", 28],
                        ["ROCKETTHROWER", 55],
                        ["PIPERUNNER", 6],
                        ["MU_PIPEBIN", 6],
                        ["MU_LARGEMISSILE", 15],
                        ["MU_WEAPON_CONSTRUCTOR", 15],
                        ["MU_BACKTRACKCAR", 10],
                        ["MU_EMPOWER_TERRAIN_EDITOR", 95]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_MOUNTED_MG.damageTable, "WEAPON_MOUNTED_MG");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_MOUNTED_MG = new Constructor();
