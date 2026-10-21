var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("HESH Round");
    };
    this.getEnviromentDamage = function(enviromentId)
    {
        return 120;
    };
    this.damageTable = [["APC", 75],
                        ["FLARE", 80],
                        ["RECON", 85],
						["TRUCK", 115],
                        
                        ["INFANTRY", 110],
                        ["MECH", 100],
                        ["MOTORBIKE", 120],
                        ["SNIPER", 90],
                        ["AIRBORNE", 80],

                        // tanks
                        ["FLAK", 65],
                        ["HOVERFLAK", 65],
                        ["LIGHT_TANK", 50],
                        ["HOVERCRAFT", 50],

                        // heavy tanks
                        ["HEAVY_HOVERCRAFT", 12],
                        ["HEAVY_TANK", 12],
                        ["MEDIUM_TANK", 15],
                        ["NEOTANK", 15],
                        ["ZCOUNIT_TANK_HUNTER", 15],

                        // very heavy tanks
                        ["MEGATANK", 10],
						["MBT", 1],

                        ["HOELLIUM", 20],
						
						["T_TRAIN", 40],
						["ARTY_TRAIN", 20],
						["ARMORED_TRAIN", 1],
						
						["SNIPER_TOWER", 220],
						["PILLBOX", 90],
						["MISSILE_DEF", 160],
						["ARTY_DEF", 185],
						
						["REPAIR_DRONE", 350],

                        // ranged land units
                        ["ARTILLERY", 60],
                        ["ARTILLERYCRAFT", 60],
                        ["ANTITANKCANNON", 50],
                        ["MISSILE", 70],
                        ["ROCKETTHROWER", 75],
                        ["PIPERUNNER", 25],
                        ["MU_PIPEBIN", 25],
                        // ships
                        ["GUNBOAT", 10],
                        ["CANNONBOAT", 10],
                        ["BLACK_BOAT", 10],
                        ["TORPEDOBOAT", 15],
                        ["LANDER", 10],
                        ["FRIGATE", 5],
                        ["DESTROYER", 5],
                        ["CRUISER", 5],
                        ["SUBMARINE", 1],
						["NUCLEAR_SUBMARINE", 1],
                        ["BATTLECRUISER", 1],
                        ["BATTLESHIP", 1],
                        ["AIRCRAFTCARRIER", 1],
                        ["MU_LARGEMISSILE", 75],
                        ["MU_WEAPON_CONSTRUCTOR", 75],
                        ["MU_BACKTRACKCAR", 70],
                        ["MU_EMPOWER_TERRAIN_EDITOR", 110]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_ENGINEER_CANNON.damageTable, "WEAPON_ENGINEER_CANNON");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_ENGINEER_CANNON = new Constructor();
