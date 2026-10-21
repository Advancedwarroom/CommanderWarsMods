var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("Heavy Rocket");
    };
    this.getEnviromentDamage = function(enviromentId)
    {
        return 25;
    };
    this.damageTable = [["APC", 85],
                        ["FLARE", 95],
                        ["RECON", 95],
						["TRUCK", 115],
                        ["FLAK", 65],
                        ["HOVERFLAK", 65],
                        ["LIGHT_TANK", 90],
                        ["HOVERCRAFT", 90],
                        ["MEDIUM_TANK", 65],
                        ["HEAVY_HOVERCRAFT", 25],
                        ["HEAVY_TANK", 25],
                        ["NEOTANK", 35],
                        ["MEGATANK", 15],
						["MBT", 8],
                        ["ARTILLERY", 85],
                        ["ARTILLERYCRAFT", 85],
                        ["ANTITANKCANNON", 50],
                        ["MISSILE", 75],
                        ["ROCKETTHROWER", 95],
                        ["PIPERUNNER", 65],
                        ["MU_PIPEBIN", 65],
                        ["HOELLIUM", 45],
						
						["T_TRAIN", 80],
						["ARTY_TRAIN", 60],
						["ARMORED_TRAIN", 35],
						
						["REPAIR_DRONE", 165],
						
						["SNIPER_TOWER", 115],
						["PILLBOX", 35],
						["MISSILE_DEF", 100],
						["ARTY_DEF", 105],
						
                        // ships
                        ["GUNBOAT", 100],
                        ["CANNONBOAT", 100],
                        ["BLACK_BOAT", 100],
                        ["TORPEDOBOAT", 105],
                        ["LANDER", 45],
                        ["FRIGATE", 80],
                        ["DESTROYER", 80],
                        ["CRUISER", 15],
                        ["SUBMARINE", 30],
                        ["BATTLECRUISER", 35],
                        ["BATTLESHIP", 30],
						["NUCLEAR_SUBMARINE", 20],
                        ["AIRCRAFTCARRIER", 25],
                        ["MU_LARGEMISSILE", 85],
                        ["MU_WEAPON_CONSTRUCTOR", 85],
                        ["MU_BACKTRACKCAR", 80]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_AIR_TO_GROUND_MISSILE_II.damageTable, "WEAPON_AIR_TO_GROUND_MISSILE");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_AIR_TO_GROUND_MISSILE_II = new Constructor();
