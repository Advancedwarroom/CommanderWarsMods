var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("Anti Tank Cannon");
    };

    this.getEnviromentDamage = function(enviromentId)
    {
        return 55;
    };

    this.damageTable = [["INFANTRY", 75],
                        ["MECH", 65],
                        ["MOTORBIKE", 65],
                        ["SNIPER", 65],
						["AIRBORNE", 50],
                        ["APC", 65],
                        ["FLARE", 75],
                        ["RECON", 75],
						["TRUCK", 100],
                        ["FLAK", 75],
                        ["HOVERFLAK", 75],
                        ["LIGHT_TANK", 75],
                        ["HOVERCRAFT", 75],
                        ["HEAVY_HOVERCRAFT", 58],
                        ["HEAVY_TANK", 58],
                        ["NEOTANK", 60],
                        ["MEGATANK", 55],
                        ["HOELLIUM", 15],
						
						["REPAIR_DRONE", 140],
						
						["T_TRAIN", 65],
						["ARTY_TRAIN", 45],
						["ARMORED_TRAIN", 20],
						
						["SNIPER_TOWER", 85],
						["PILLBOX", 50],
						["MISSILE_DEF", 65],
						["ARTY_DEF", 70],
                        
                        ["ARTILLERY", 65],
                        ["ARTILLERYCRAFT", 65],
                        ["ANTITANKCANNON", 55],
                        ["MISSILE", 70],
                        ["ROCKETTHROWER", 70],
                        ["ZCOUNIT_TANK_HUNTER", 15],
                        ["MEDIUM_TANK", 65],
						["MBT", 40],
                        ["PIPERUNNER", 55],
                        ["MU_PIPEBIN", 55],
                        ["MU_LARGEMISSILE", 65],
                        ["MU_WEAPON_CONSTRUCTOR", 65],
                        ["MU_BACKTRACKCAR", 60],
                        ["MU_EMPOWER_TERRAIN_EDITOR", 75]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_A_TANK_CANNON.damageTable, "WEAPON_A_TANK_CANNON");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_A_TANK_CANNON = new Constructor();
