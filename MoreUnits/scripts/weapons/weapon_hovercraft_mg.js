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
                        ["FLARE", 45],
                        ["RECON", 45],
						["TRUCK", 55],

                        // tanks
                        ["FLAK", 8],
                        ["HOVERFLAK", 8],
                        ["LIGHT_TANK", 8],
                        ["HOVERCRAFT", 8],

						["MEDIUM_TANK", 5],
						
                        // heavy tanks
                        ["HEAVY_HOVERCRAFT", 1],
                        ["HEAVY_TANK", 1],
                        ["NEOTANK", 1],

                        // very heavy tanks
                        ["MEGATANK", 1],
						["MBT", 1],
						
						["REPAIR_DRONE", 100],
						["RECON_DRONE", 115],
						
						["SNIPER_TOWER", 80],
						["PILLBOX", 1],
						["MISSILE_DEF", 60],
						["ARTY_DEF", 65],

                        ["HOELLIUM", 20],
						
						["T_TRAIN", 1],
						["ARTY_TRAIN", 1],
						["ARMORED_TRAIN", 1],

                        // heli copter
                        ["T_HELI", 40],
                        ["K_HELI", 3],
                        ["R_HELI", 18],

                        // ranged land units
                        ["ARTILLERY", 45],
                        ["ARTILLERYCRAFT", 45],
                        ["ANTITANKCANNON", 1],
                        ["MISSILE", 55],
                        ["ROCKETTHROWER", 55],
                        ["PIPERUNNER", 6],
                        ["MU_PIPEBIN", 6],
                        ["MU_LARGEMISSILE", 15],
                        ["MU_WEAPON_CONSTRUCTOR", 15],
                        ["MU_BACKTRACKCAR", 10],
                        ["MU_EMPOWER_TERRAIN_EDITOR", 80]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_HOVERCRAFT_MG.damageTable, "WEAPON_HOVERCRAFT_MG");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_HOVERCRAFT_MG = new Constructor();
