var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("Rocket");
    };
    this.getEnviromentDamage = function(enviromentId)
    {
        return 25;
    };
    this.damageTable = [["APC", 60],
                        ["FLARE", 75],
                        ["RECON", 75],
						["TRUCK", 100],
                        ["FLAK", 45],
                        ["HOVERFLAK", 45],
                        ["LIGHT_TANK", 70],
                        ["HOVERCRAFT", 70],
                        ["MEDIUM_TANK", 45],
                        ["ZCOUNIT_TANK_HUNTER", 50],
                        ["HEAVY_HOVERCRAFT", 15],
                        ["HEAVY_TANK", 15],
                        ["NEOTANK", 20],
                        ["MEGATANK", 10],
						["MBT", 5],
                        ["ARTILLERY", 65],
                        ["ARTILLERYCRAFT", 65],
                        ["ANTITANKCANNON", 20],
                        ["MISSILE", 55],
                        ["ROCKETTHROWER", 75],
                        ["PIPERUNNER", 55],
                        ["MU_PIPEBIN", 55],
                        ["HOELLIUM", 25],
						
						["REPAIR_DRONE", 135],
						
						["T_TRAIN", 60],
						["ARTY_TRAIN", 40],
						["ARMORED_TRAIN", 15],
						
						["SNIPER_TOWER", 95],
						["PILLBOX", 20],
						["MISSILE_DEF", 80],
						["ARTY_DEF", 90],
						
                        // ships
                        ["GUNBOAT", 80],
                        ["CANNONBOAT", 80],
                        ["BLACK_BOAT", 80],
                        ["TORPEDOBOAT", 85],
                        ["LANDER", 25],
                        ["FRIGATE", 65],
                        ["DESTROYER", 65],
                        ["CRUISER", 10],
                        ["SUBMARINE", 25],
                        ["BATTLECRUISER", 30],
                        ["BATTLESHIP", 25],
						["NUCLEAR_SUBMARINE", 15],
                        ["AIRCRAFTCARRIER", 25],
                        ["MU_LARGEMISSILE", 85],
                        ["MU_WEAPON_CONSTRUCTOR", 85],
                        ["MU_BACKTRACKCAR", 80]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_AIR_TO_GROUND_MISSILE.damageTable, "WEAPON_AIR_TO_GROUND_MISSILE");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_AIR_TO_GROUND_MISSILE = new Constructor();
