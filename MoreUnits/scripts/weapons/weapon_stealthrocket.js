var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("IR Missiles + AGMs");
    };
    this.getEnviromentDamage = function(enviromentId)
    {
        return 70;
    };
    this.damageTable = [["INFANTRY", 80],
                        ["MECH", 80],
                        ["MOTORBIKE", 80],
                        ["SNIPER", 80],
                        ["AIRBORNE", 80],

                        // supporter
                        ["APC", 75],
                        ["FLARE", 80],
                        ["RECON", 80],
						["TRUCK", 105],

                        // tanks
                        ["FLAK", 70],
                        ["HOVERFLAK", 70],
                        ["LIGHT_TANK", 70],
                        ["HOVERCRAFT", 70],
                        ["MEDIUM_TANK", 55],

                        // heavy tanks
                        ["HEAVY_HOVERCRAFT", 45],
                        ["HEAVY_TANK", 45],
                        ["NEOTANK", 40],

                        // very heavy tanks
                        ["MEGATANK", 35],
						["MBT", 20],

                        ["HOELLIUM", 35],
						
						["REPAIR_DRONE", 240],
						
						["T_TRAIN", 60],
						["ARTY_TRAIN", 40],
						["ARMORED_TRAIN", 15],
						
						["SNIPER_TOWER", 110],
						["PILLBOX", 45],
						["MISSILE_DEF", 90],
						["ARTY_DEF", 100],

                        // ranged land units
                        ["ARTILLERY", 75],
                        ["ARTILLERYCRAFT", 75],
                        ["ANTITANKCANNON", 55],
                        ["MISSILE", 80],
                        ["ROCKETTHROWER", 80],
                        ["PIPERUNNER", 70],
                        ["MU_PIPEBIN", 70],

                        // air units
                        ["DUSTER", 75],
                        ["FIGHTER", 45],
						["DRONE", 90],
						["STRIKER", 35],
						["INTERCEPTOR", 58],
						["SEAD", 45],
                        ["BOMBER", 70],
                        ["STEALTHBOMBER", 55],
                        ["TRANSPORTPLANE", 70],
                        ["BLACK_BOMB", 120],
                        ["WATERPLANE", 65],
						
						["ZCOUNIT_KIROV", 75],
						
                        ["R_HELI", 85],
                        ["K_HELI", 70],
                        ["T_HELI", 95],
                        // ships
                        ["GUNBOAT", 75],
                        ["CANNONBOAT", 75],
                        ["BLACK_BOAT", 75],
                        ["TORPEDOBOAT", 75],
                        ["LANDER", 65],
                        ["FRIGATE", 65],
                        ["DESTROYER", 60],
                        ["CRUISER", 35],
                        ["SUBMARINE", 55],
                        ["BATTLECRUISER", 50],
                        ["BATTLESHIP", 45],
                        ["AIRCRAFTCARRIER", 45],
                        ["MU_LARGEMISSILE", 80],
                        ["MU_WEAPON_CONSTRUCTOR", 80],
                        ["MU_BACKTRACKCAR", 75],
                        ["MU_EMPOWER_TERRAIN_EDITOR", 80]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_STEALTHROCKET.damageTable, "WEAPON_STEALTHROCKET");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_STEALTHROCKET = new Constructor();
