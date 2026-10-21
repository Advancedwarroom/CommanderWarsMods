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
						["TRUCK", 105],

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
						
						["T_TRAIN", 30],
						["ARTY_TRAIN", 15],
						["ARMORED_TRAIN", 5],
                        
                        ["DUSTER", 55],
						["DRONE", 75],
						["STRIKER", 25],
                        ["FIGHTER", 35],
						["INTERCEPTOR", 40],
						["SEAD", 30],
                        ["BOMBER", 55],
                        ["STEALTHBOMBER", 45],
                        ["TRANSPORTPLANE", 55],
                        ["BLACK_BOMB", 90],
                        ["WATERPLANE", 50],
						
						["ZCOUNIT_KIROV", 52],
						
						["REPAIR_DRONE", 145],
						
						["SNIPER_TOWER", 110],
						["PILLBOX", 45],
						["MISSILE_DEF", 130],
						["ARTY_DEF", 140],
                        
                        ["R_HELI", 75],
                        ["T_HELI", 90],
                        ["K_HELI", 60],

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
        return WEAPON.getDamageFromTable(unit, WEAPON_30MM_CANNON.damageTable, "WEAPON_30MM_CANNON");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_30MM_CANNON = new Constructor();
