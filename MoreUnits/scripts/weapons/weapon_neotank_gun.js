var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("Neo Cannon");
    };
    this.getEnviromentDamage = function(enviromentId)
    {
        return 55;
    };
    this.damageTable = [["APC", 125],
                        ["FLARE", 125],
                        ["RECON", 125],
						["TRUCK", 145],

                        // tanks
                        ["FLAK", 115],
                        ["HOVERFLAK", 115],
                        ["LIGHT_TANK", 105],
                        ["HOVERCRAFT", 105],

                        // heavy tanks
                        ["HEAVY_HOVERCRAFT", 45],
                        ["HEAVY_TANK", 45],
                        ["MEDIUM_TANK", 75],
                        ["NEOTANK", 55],
                        ["ZCOUNIT_TANK_HUNTER", 85],

                        // very heavy tanks
                        ["MEGATANK", 30],
						["MBT", 20],
						
						["T_TRAIN", 95],
						["ARTY_TRAIN", 75],
						["ARMORED_TRAIN", 50],
						
						["SNIPER_TOWER", 170],
						["PILLBOX", 35],
						["MISSILE_DEF", 145],
						["ARTY_DEF", 155],
						
						["REPAIR_DRONE", 230],

                        ["HOELLIUM", 30],

                        // ranged land units
                        ["ARTILLERY", 115],
                        ["ARTILLERYCRAFT", 115],
                        ["ANTITANKCANNON", 70],
                        ["MISSILE", 125],
                        ["ROCKETTHROWER", 125],
                        ["PIPERUNNER", 105],
                        ["MU_PIPEBIN", 105],
                        // ships
                        ["GUNBOAT", 40],
                        ["CANNONBOAT", 40],
                        ["BLACK_BOAT", 40],
                        ["TORPEDOBOAT", 55],
                        ["LANDER", 50],
                        ["FRIGATE", 55],
                        ["DESTROYER", 55],
                        ["CRUISER", 50],
                        ["SUBMARINE", 15],
						["NUCLEAR_SUBMARINE", 1],
                        ["BATTLECRUISER", 20],
                        ["BATTLESHIP", 15],
                        ["AIRCRAFTCARRIER", 15],
                        ["MU_LARGEMISSILE", 85],
                        ["MU_WEAPON_CONSTRUCTOR", 85],
                        ["MU_BACKTRACKCAR", 80]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_NEOTANK_GUN.damageTable, "WEAPON_NEOTANK_GUN");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_NEOTANK_GUN = new Constructor();
