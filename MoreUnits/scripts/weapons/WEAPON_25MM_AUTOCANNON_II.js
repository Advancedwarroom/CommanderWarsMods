var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("Autocannon");
    };
    this.getEnviromentDamage = function(enviromentId)
    {
        return 5;
    };
    this.damageTable = [["APC", 65],
                        ["FLARE", 70],
                        ["RECON", 80],
						["TRUCK", 105],
                        
                        ["INFANTRY", 110],
                        ["MECH", 100],
                        ["MOTORBIKE", 95],
                        ["SNIPER", 85],
                        ["AIRBORNE", 75],

                        //tanks
                        ["FLAK", 45],
                        ["HOVERFLAK", 45],
                        ["LIGHT_TANK", 30],
                        ["HOVERCRAFT", 30],
                        ["MEDIUM_TANK", 15],

                        //heavy tanks
                        ["HEAVY_HOVERCRAFT", 5],
                        ["HEAVY_TANK", 5],
                        ["NEOTANK", 1],

                        //very heavy tanks
                        ["MEGATANK", 1],
						["MBT", 1],
                        ["HOELLIUM", 10],
						
						["T_TRAIN", 20],
						["ARTY_TRAIN", 1],
						["ARMORED_TRAIN", 1],
                        
						["T_HELI", 85],
						["K_HELI", 45],
						["R_HELI", 65],
						
						["SNIPER_TOWER", 90],
						["PILLBOX", 15],
						["MISSILE_DEF", 80],
						["ARTY_DEF", 90],
						
						["RECON_DRONE", 105],
						["REPAIR_DRONE", 120],
						
						["ZCOUNIT_KIROV", 45],

                        //ranged land units
                        ["ARTILLERY", 50],
                        ["ARTILLERYCRAFT", 50],
                        ["ANTITANKCANNON", 45],
                        ["MISSILE", 60],
                        ["ROCKETTHROWER", 60],
                        ["PIPERUNNER", 35],
                        ["MU_PIPEBIN", 35],
                        ["MU_EMPOWER_TERRAIN_EDITOR", 110],]

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_25MM_AUTOCANNON_II.damageTable, "WEAPON_25MM_AUTOCANNON_II");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_25MM_AUTOCANNON_II = new Constructor();
