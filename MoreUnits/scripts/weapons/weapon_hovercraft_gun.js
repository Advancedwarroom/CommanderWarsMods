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
                        ["FLAK", 75],
                        ["HOVERFLAK", 75],
                        ["LIGHT_TANK", 55],
                        ["HOVERCRAFT", 55],
						["MEDIUM_TANK", 25],

                        // heavy tanks
                        ["HEAVY_HOVERCRAFT", 15],
                        ["HEAVY_TANK", 10],
                        ["NEOTANK", 20],

                        // very heavy tanks
                        ["MEGATANK", 5],
						["MBT", 1],

                        ["HOELLIUM", 20],
						
						["REPAIR_DRONE", 135],
						
						["T_TRAIN", 45],
						["ARTY_TRAIN", 25],
						["ARMORED_TRAIN", 1],
						
						["SNIPER_TOWER", 110],
						["PILLBOX", 5],
						["MISSILE_DEF", 95],
						["ARTY_DEF", 100],

                        // ranged land units
                        ["ARTILLERY", 70],
                        ["ARTILLERYCRAFT", 70],
                        ["ANTITANKCANNON", 30],
                        ["MISSILE", 85],
                        ["ROCKETTHROWER", 85],
                        ["PIPERUNNER", 85],
                        ["MU_PIPEBIN", 85],
                        // ships
                        ["GUNBOAT", 45],
                        ["CANNONBOAT", 45],
                        ["BLACK_BOAT", 45],
                        ["TORPEDOBOAT", 45],
                        ["LANDER", 18],
                        ["FRIGATE", 10],
                        ["DESTROYER", 10],
                        ["CRUISER", 10],
                        ["SUBMARINE", 10],
						["NUCLEAR_SUBMARINE", 1],
                        ["BATTLECRUISER", 10],
                        ["BATTLESHIP", 10],
                        ["AIRCRAFTCARRIER", 10],
                        ["MU_LARGEMISSILE", 55],
                        ["MU_WEAPON_CONSTRUCTOR", 55],
                        ["MU_BACKTRACKCAR", 50]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_HOVERCRAFT_GUN.damageTable, "WEAPON_HOVERCRAFT_GUN");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_HOVERCRAFT_GUN = new Constructor();
