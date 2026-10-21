var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("APFSDS");
    };
    this.getEnviromentDamage = function(enviromentId)
    {
        return 65;
    };
    this.damageTable = [["APC", 205],
                        ["FLARE", 205],
                        ["RECON", 205],
						["TRUCK", 285],

                        // tanks
                        ["FLAK", 210],
                        ["HOVERFLAK", 215],
                        ["LIGHT_TANK", 200],
                        ["HOVERCRAFT", 200],

                        // heavy tanks
                        ["HEAVY_HOVERCRAFT", 135],
                        ["MEDIUM_TANK", 140],
                        ["HEAVY_TANK", 130],
                        ["ZCOUNIT_TANK_HUNTER", 200],
                        ["NEOTANK", 140],

                        // very heavy tanks
                        ["MEGATANK", 85],
						["MBT", 75],
						
						["T_TRAIN", 190],
						["ARTY_TRAIN", 170],
						["ARMORED_TRAIN", 145],
						
						["REPAIR_DRONE", 345],
						
						["SNIPER_TOWER", 150],
						["PILLBOX", 75],
						["MISSILE_DEF", 120],
						["ARTY_DEF", 135],

                        // ranged land units
                        ["ARTILLERY", 240],
                        ["ARTILLERYCRAFT", 255],
                        ["ANTITANKCANNON", 120],
                        ["MISSILE", 240],
                        ["ROCKETTHROWER", 250],
                        ["PIPERUNNER", 200],
                        ["MU_PIPEBIN", 200],

                        ["HOELLIUM", 10],
                        // ships
                        ["GUNBOAT",90],
                        ["CANNONBOAT", 95],
                        ["BLACK_BOAT", 70],
                        ["TORPEDOBOAT", 100],
                        ["LANDER", 45],
                        ["FRIGATE", 30],
                        ["DESTROYER", 20],
                        ["CRUISER", 12],
                        ["SUBMARINE", 1],
						["NUCLEAR_SUBMARINE", 1],
                        ["BATTLECRUISER", 5],
                        ["BATTLESHIP", 2],
                        ["AIRCRAFTCARRIER", 1],
                        ["MU_LARGEMISSILE", 75],
                        ["MU_WEAPON_CONSTRUCTOR", 75],
                        ["MU_BACKTRACKCAR", 70]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_APFSDS.damageTable, "WEAPON_APFSDS");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_APFSDS = new Constructor();
