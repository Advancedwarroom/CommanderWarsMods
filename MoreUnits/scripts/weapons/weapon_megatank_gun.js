var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("Super Heavy Cannon");
    };
    this.getEnviromentDamage = function(enviromentId)
    {
        return 65;
    };
    this.damageTable = [["APC", 195],
                        ["FLARE", 195],
                        ["RECON", 195],
						["TRUCK", 215],

                        // tanks
                        ["FLAK", 195],
                        ["HOVERFLAK", 195],
                        ["LIGHT_TANK", 180],
                        ["HOVERCRAFT", 180],

                        // heavy tanks
                        ["HEAVY_HOVERCRAFT", 120],
                        ["MEDIUM_TANK", 125],
                        ["HEAVY_TANK", 120],
                        ["ZCOUNIT_TANK_HUNTER", 130],
                        ["NEOTANK", 115],

                        // very heavy tanks
                        ["MEGATANK", 65],
						["MBT", 42],
						
						["REPAIR_DRONE", 250],
						
						["T_TRAIN", 170],
						["ARTY_TRAIN", 150],
						["ARMORED_TRAIN", 125],
						
						["SNIPER_TOWER", 80],
						["PILLBOX", 75],
						["MISSILE_DEF", 220],
						["ARTY_DEF", 235],

                        // ranged land units
                        ["ARTILLERY", 195],
                        ["ARTILLERYCRAFT", 195],
                        ["ANTITANKCANNON", 150],
                        ["MISSILE", 195],
                        ["ROCKETTHROWER", 195],
                        ["PIPERUNNER", 180],
                        ["MU_PIPEBIN", 180],

                        ["HOELLIUM", 35],
                        // ships
                        ["GUNBOAT", 105],
                        ["CANNONBOAT", 105],
                        ["BLACK_BOAT", 105],
                        ["TORPEDOBOAT", 120],
                        ["LANDER", 75],
                        ["FRIGATE", 65],
                        ["DESTROYER", 65],
                        ["CRUISER", 65],
                        ["SUBMARINE", 45],
						["NUCLEAR_SUBMARINE", 30],
                        ["BATTLECRUISER", 50],
                        ["BATTLESHIP", 45],
                        ["AIRCRAFTCARRIER", 45],
                        ["MU_LARGEMISSILE", 105],
                        ["MU_WEAPON_CONSTRUCTOR", 105],
                        ["MU_BACKTRACKCAR", 100]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_MEGATANK_GUN.damageTable, "WEAPON_MEGATANK_GUN");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_MEGATANK_GUN = new Constructor();
