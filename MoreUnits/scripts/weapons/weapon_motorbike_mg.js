var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("Light Machine Gun");
    };
    this.getEnviromentDamage = function(enviromentId)
    {
        return 1;
    };
    this.damageTable = [["INFANTRY", 65],
                        ["MECH", 55],
                        ["MOTORBIKE", 55],
                        ["SNIPER", 75],
                        ["AIRBORNE", 65],

                        ["APC", 20],
                        ["FLARE", 15],
                        ["RECON", 18],
						["TRUCK", 23],

                        ["FLAK", 5],
                        ["HOVERFLAK", 5],
                        ["LIGHT_TANK", 8],
                        ["HOVERCRAFT", 8],

                        ["HEAVY_HOVERCRAFT", 3],
                        ["HEAVY_TANK", 3],
                        ["MEDIUM_TANK", 5],
                        ["ZCOUNIT_TANK_HUNTER", 5],
                        ["NEOTANK", 3],
						
						["REPAIR_DRONE", 125],
						["RECON_DRONE", 115],

                        ["MEGATANK", 1],
						["MBT", 1],

                        ["HOELLIUM", 20],
						
						["T_TRAIN", 1],
						["ARTY_TRAIN", 1],
						["ARMORED_TRAIN", 1],
						
						["SNIPER_TOWER", 95],
						["PILLBOX", 1],
						["MISSILE_DEF", 45],
						["ARTY_DEF", 50],

                        ["T_HELI", 35],
                        ["K_HELI", 3],
                        ["R_HELI", 12],

                        ["ARTILLERY", 15],
                        ["ARTILLERYCRAFT", 15],
                        ["ANTITANKCANNON", 35],
                        ["MISSILE", 35],
                        ["ROCKETTHROWER", 35],
                        ["PIPERUNNER", 10],
                        ["MU_PIPEBIN", 10],
                        ["MU_LARGEMISSILE", 10],
                        ["MU_WEAPON_CONSTRUCTOR", 10],
                        ["MU_BACKTRACKCAR", 5],
                        ["MU_EMPOWER_TERRAIN_EDITOR", 65]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_MOTORBIKE_MG.damageTable, "WEAPON_MOTORBIKE_MG");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_MOTORBIKE_MG = new Constructor();
