var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("Medium Machine Gun");
    };
    this.getEnviromentDamage = function(enviromentId)
    {
        return 1;
    };
    this.damageTable = [["INFANTRY", 80],
                        ["MECH", 70],
                        ["MOTORBIKE", 70],
                        ["SNIPER", 70],
                        ["AIRBORNE", 60],

                        // supporter
                        ["APC", 45],
                        ["FLARE", 50],
                        ["RECON", 60],
						["TRUCK", 80],

                        // tanks
                        ["FLAK", 45],
                        ["HOVERFLAK", 45],
                        ["LIGHT_TANK", 10],
                        ["HOVERCRAFT", 10],
                        ["MEDIUM_TANK", 5],
                        ["ZCOUNIT_TANK_HUNTER", 8],

                        // heavy tanks
                        ["HEAVY_HOVERCRAFT", 1],
                        ["HEAVY_TANK", 1],
                        ["NEOTANK", 1],

                        // very heavy tanks
                        ["MEGATANK", 1],
						["MBT", 1],
						
						["REPAIR_DRONE", 95],

                        ["HOELLIUM", 20],
						
						["T_TRAIN", 1],
						["ARTY_TRAIN", 1],
						["ARMORED_TRAIN", 1],
						
						["SNIPER_TOWER", 90],
						["PILLBOX", 1],
						["MISSILE_DEF", 60],
						["ARTY_DEF", 65],

                        // heli copter
                        ["T_HELI", 35],
                        ["R_HELI", 18],
                        ["K_HELI", 10],

                        // ranged land units
                        ["ARTILLERY", 45],
                        ["ARTILLERYCRAFT", 45],
                        ["ANTITANKCANNON", 25],
                        ["MISSILE", 55],
                        ["ROCKETTHROWER", 55],
                        ["PIPERUNNER", 10],
                        ["MU_PIPEBIN", 10],
                        ["MU_LARGEMISSILE", 10],
                        ["MU_WEAPON_CONSTRUCTOR", 10],
                        ["MU_BACKTRACKCAR", 5],
                        ["MU_EMPOWER_TERRAIN_EDITOR", 80]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_FLARE_MG.damageTable, "WEAPON_FLARE_MG");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_FLARE_MG = new Constructor();
