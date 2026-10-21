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
    this.damageTable = [

						["APC", 85],
                        ["FLARE", 90],
                        ["RECON", 95],
						["TRUCK", 155],
                        ["FLAK", 80],
                        ["HOVERFLAK", 80],
                        ["LIGHT_TANK", 80],
                        ["HOVERCRAFT", 80],
                        ["MEDIUM_TANK", 65],
                        ["HEAVY_HOVERCRAFT", 55],
                        ["HEAVY_TANK", 55],
                        ["NEOTANK", 50],
                        ["MEGATANK", 45],
						["MBT", 30],
                        ["ARTILLERY", 85],
                        ["ARTILLERYCRAFT", 85],
                        ["ANTITANKCANNON", 65],
                        ["MISSILE", 90],
                        ["ROCKETTHROWER", 90],
                        ["PIPERUNNER", 75],
                        ["MU_PIPEBIN", 75],
                        ["HOELLIUM", 45],
						
						["REPAIR_DRONE", 210],

						["T_TRAIN", 60],
						["ARTY_TRAIN", 40],
						["ARMORED_TRAIN", 15],
						
						["SNIPER_TOWER", 120],
						["PILLBOX", 65],
						["MISSILE_DEF", 100],
						["ARTY_DEF", 110],
						
                        ["GUNBOAT", 85],
                        ["CANNONBOAT", 85],
                        ["BLACK_BOAT", 85],
                        ["TORPEDOBOAT", 85],
                        ["LANDER", 25],
                        ["FRIGATE", 65],
                        ["DESTROYER", 65],
                        ["CRUISER", 10],
                        ["SUBMARINE", 25],
                        ["BATTLECRUISER", 10],
                        ["BATTLESHIP", 5],
						["NUCLEAR_SUBMARINE", 1],
                        ["AIRCRAFTCARRIER", 2],
                        ["MU_LARGEMISSILE", 85],
                        ["MU_WEAPON_CONSTRUCTOR", 85],
                        ["MU_BACKTRACKCAR", 80]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_AGM.damageTable, "WEAPON_AGM");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_AGM = new Constructor();
