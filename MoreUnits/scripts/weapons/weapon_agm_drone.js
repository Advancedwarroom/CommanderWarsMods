var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("AGM");
    };
    this.getEnviromentDamage = function(enviromentId)
    {
        return 25;
    };
    this.damageTable = [["INFANTRY", 75],
                        ["MECH", 65],
                        ["MOTORBIKE", 70],
                        ["SNIPER", 60],
                        ["AIRBORNE", 50],
                        
                        ["APC", 55],
                        ["FLARE", 68],
                        ["RECON", 75],
						["TRUCK", 90],
                        ["FLAK", 35],
                        ["HOVERFLAK", 30],
                        ["LIGHT_TANK", 60],
                        ["HOVERCRAFT", 55],
                        ["MEDIUM_TANK", 35],
                        
                        ["HEAVY_HOVERCRAFT", 20],
                        ["HEAVY_TANK", 20],
                        ["NEOTANK", 15],
                        ["MEGATANK", 10],
						["MBT", 1],
						
						["REPAIR_DRONE", 170],
						
						["T_TRAIN", 50],
						["ARTY_TRAIN", 30],
						["ARMORED_TRAIN", 5],
						
						["SNIPER_TOWER", 80],
						["PILLBOX", 25],
						["MISSILE_DEF", 70],
						["ARTY_DEF", 80],
                        
                        ["ARTILLERY", 65],
                        ["ARTILLERYCRAFT", 65],
                        ["ANTITANKCANNON", 20],
                        ["MISSILE", 55],
                        ["ROCKETTHROWER", 75],
                        ["PIPERUNNER", 55],
                        ["MU_PIPEBIN", 55],
                        ["MU_EMPOWER_TERRAIN_EDITOR", 75],
                        ["HOELLIUM", 25],]
                        // ships

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_AGM_DRONE.damageTable, "WEAPON_AGM_DRONE");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_AGM_DRONE = new Constructor();