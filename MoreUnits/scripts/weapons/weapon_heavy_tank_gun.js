var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("Heavy Cannon");
    };
    this.getEnviromentDamage = function(enviromentId)
    {
        return 55;
    };
    this.damageTable = [["APC", 135],
                        ["FLARE", 135],
                        ["RECON", 135],
						["TRUCK", 160],

                        // tanks
                        ["FLAK", 125],
                        ["HOVERFLAK", 125],
                        ["LIGHT_TANK", 115],
                        ["HOVERCRAFT", 115],

                        // heavy tanks
                        ["HEAVY_HOVERCRAFT", 50],
                        ["HEAVY_TANK", 50],
                        ["MEDIUM_TANK", 85],
                        ["NEOTANK", 65],
                        ["ZCOUNIT_TANK_HUNTER", 100],

                        // very heavy tanks
                        ["MEGATANK", 40],
						["MBT", 30],
						
						["REPAIR_DRONE", 240],

                        ["HOELLIUM", 40],
						
						["T_TRAIN", 105],
						["ARTY_TRAIN", 85],
						["ARMORED_TRAIN", 60],
						
						["SNIPER_TOWER", 200],
						["PILLBOX", 60],
						["MISSILE_DEF", 160],
						["ARTY_DEF", 175],

                        // ranged land units
                        ["ARTILLERY", 125],
                        ["ARTILLERYCRAFT", 125],
                        ["ANTITANKCANNON", 80],
                        ["MISSILE", 130],
                        ["ROCKETTHROWER", 130],
                        ["PIPERUNNER", 115],
                        ["MU_PIPEBIN", 115],
                        // ships
                        ["GUNBOAT", 50],
                        ["CANNONBOAT", 50],
                        ["BLACK_BOAT", 50],
                        ["TORPEDOBOAT", 80],
                        ["LANDER", 65],
                        ["FRIGATE", 60],
                        ["DESTROYER", 60],
                        ["CRUISER", 60],
                        ["SUBMARINE", 20],
						["NUCLEAR_SUBMARINE", 5],
                        ["BATTLECRUISER", 25],
                        ["BATTLESHIP", 20],
                        ["AIRCRAFTCARRIER", 20],
                        ["MU_LARGEMISSILE", 75],
                        ["MU_WEAPON_CONSTRUCTOR", 75],
                        ["MU_BACKTRACKCAR", 70]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_HEAVY_TANK_GUN.damageTable, "WEAPON_HEAVY_TANK_GUN");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_HEAVY_TANK_GUN = new Constructor();
