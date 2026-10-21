var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("Heavy Vulcan");
    };
    this.getEnviromentDamage = function(enviromentId)
    {
        return 1;
    };
    this.damageTable = [
						//infantry
						["INFANTRY", 110],
                        ["MECH", 100],
                        ["MOTORBIKE", 120],
                        ["SNIPER", 100],
                        ["AIRBORNE", 85],

                        // supporter
                        ["APC", 65],
                        ["FLARE", 65],
                        ["RECON", 80],
						["TRUCK", 110],

                        //tanks
                        ["FLAK", 30],
                        ["HOVERFLAK", 35],
                        ["LIGHT_TANK", 35],
                        ["HOVERCRAFT", 35],
                        ["MEDIUM_TANK", 25],

                        //heavy tanks
                        ["HEAVY_HOVERCRAFT", 15],
                        ["HEAVY_TANK", 15],
                        ["NEOTANK", 10],

                        //very heavy tanks
                        ["MEGATANK", 7],
						["MBT", 1],
                        ["HOELLIUM", 25],
						
						["REPAIR_DRONE", 150],
						
						["T_TRAIN", 35],
						["ARTY_TRAIN", 20],
						["ARMORED_TRAIN", 10],
						
						["SNIPER_TOWER", 110],
						["PILLBOX", 45],
						["MISSILE_DEF", 130],
						["ARTY_DEF", 140],
                        
                        //ranged land units
                        ["ARTILLERY", 42],
                        ["ARTILLERYCRAFT", 50],
                        ["ANTITANKCANNON", 35],
                        ["MISSILE", 55],
                        ["ROCKETTHROWER", 55],
                        ["PIPERUNNER", 25],
                        ["MU_PIPEBIN", 25],
						["CANNONBOAT", 45],
						["BLACK_BOAT", 45],
						["LANDER", 25],
						["GUNBOAT", 45],
						["TORPEDOBOAT", 45],
                        ["MU_LARGEMISSILE", 75],
                        ["MU_WEAPON_CONSTRUCTOR", 75],
                        ["MU_BACKTRACKCAR", 70],
                        ["MU_EMPOWER_TERRAIN_EDITOR", 110]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_30MM_CANNON_GUNSHIP.damageTable, "WEAPON_30MM_CANNON_GUNSHIP");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_30MM_CANNON_GUNSHIP = new Constructor();
