var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("Battle Rifle");
    };
    this.getEnviromentDamage = function(enviromentId)
    {
        return 1;
    };
    this.damageTable = [["INFANTRY", 85],
                        ["MECH", 55],
                        ["MOTORBIKE", 55],
                        ["SNIPER", 75],
                        ["AIRBORNE", 65],

                        ["APC", 20],
                        ["FLARE", 20],
                        ["RECON", 20],
						["TRUCK", 35],

                        ["FLAK", 5],
                        ["HOVERFLAK", 5],
                        ["LIGHT_TANK", 5],
                        ["HOVERCRAFT", 5],

                        ["HEAVY_HOVERCRAFT", 1],
                        ["HEAVY_TANK", 1],
						["MEDIUM_TANK", 3],
                        ["NEOTANK", 1],

                        ["MEGATANK", 1],
						["MBT", 1],
						
						["REPAIR_DRONE", 85],
						["RECON_DRONE", 90],

                        ["HOELLIUM", 20],
						
						["SNIPER_TOWER", 95],
						["PILLBOX", 1],
						["MISSILE_DEF", 45],
						["ARTY_DEF", 50],
						
						["T_TRAIN", 1],
						["ARTY_TRAIN", 1],
						["ARMORED_TRAIN", 1],

                        ["T_HELI", 30],
                        ["K_HELI", 1],
                        ["R_HELI", 10],

                        ["ARTILLERY", 15],
                        ["ARTILLERYCRAFT", 15],
                        ["ANTITANKCANNON", 45],
                        ["MISSILE", 35],
                        ["ROCKETTHROWER", 35],
                        ["PIPERUNNER", 6],
                        ["MU_PIPEBIN", 6],
                        ["MU_LARGEMISSILE", 15],
                        ["MU_WEAPON_CONSTRUCTOR", 15],
                        ["MU_BACKTRACKCAR", 10],
                        ["MU_EMPOWER_TERRAIN_EDITOR", 85]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_MECH_MG.damageTable, "WEAPON_MECH_MG");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_MECH_MG = new Constructor();
