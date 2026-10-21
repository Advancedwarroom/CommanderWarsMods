var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("Light Cannon");
    };
    this.getEnviromentDamage = function(enviromentId)
    {
        return 15;
    };
    this.damageTable = [["APC", 75],
                        ["FLARE", 80],
                        ["RECON", 85],
						["TRUCK", 105],

                        // tanks
                        ["FLAK", 65],
                        ["HOVERFLAK", 65],
                        ["LIGHT_TANK", 55],
                        ["HOVERCRAFT", 55],

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
						
						["T_TRAIN", 45],
						["ARTY_TRAIN", 25],
						["ARMORED_TRAIN", 1],
						
						["SNIPER_TOWER", 100],
						["PILLBOX", 15],
						["MISSILE_DEF", 90],
						["ARTY_DEF", 95],
						
						["REPAIR_DRONE", 100],

                        // ranged land units
                        ["ARTILLERY", 70],
                        ["ARTILLERYCRAFT", 70],
                        ["ANTITANKCANNON", 30],
                        ["MISSILE", 85],
                        ["ROCKETTHROWER", 85],
                        ["PIPERUNNER", 55],
                        ["MU_PIPEBIN", 55],
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
                        ["MU_LARGEMISSILE", 55],
                        ["MU_WEAPON_CONSTRUCTOR", 55],
                        ["MU_BACKTRACKCAR", 50]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_LIGHT_TANK_GUN.damageTable, "WEAPON_LIGHT_TANK_GUN");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_LIGHT_TANK_GUN = new Constructor();
