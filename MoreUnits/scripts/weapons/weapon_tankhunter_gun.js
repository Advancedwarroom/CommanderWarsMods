var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("Heavy Anti Tank Cannon");
    };
    this.getEnviromentDamage = function(enviromentId)
    {
        return 55;
    };
    this.damageTable = [["APC", 160],
                        ["FLARE", 160],
                        ["RECON", 160],
						["TRUCK", 190],

                        // tanks
                        ["FLAK", 150],
                        ["HOVERFLAK", 150],
                        ["LIGHT_TANK", 135],
                        ["HOVERCRAFT", 135],

                        // heavy tanks
                        ["HEAVY_HOVERCRAFT", 90],
                        ["HEAVY_TANK", 90],
                        ["MEDIUM_TANK", 95],
                        ["ZCOUNIT_TANK_HUNTER", 100],
                        ["NEOTANK", 80],

                        // very heavy tanks
                        ["MEGATANK", 50],
						["MBT", 40],

                        ["HOELLIUM", 30],
						
						["T_TRAIN", 125],
						["ARTY_TRAIN", 105],
						["ARMORED_TRAIN", 80],
						
						["SNIPER_TOWER", 180],
						["PILLBOX", 55],
						["MISSILE_DEF", 170],
						["ARTY_DEF", 175],
						
						["REPAIR_DRONE", 395],

                        // ranged land units
                        ["ARTILLERY", 160],
                        ["ARTILLERYCRAFT", 160],
                        ["ANTITANKCANNON", 120],
                        ["MISSILE", 160],
                        ["ROCKETTHROWER", 160],
                        ["PIPERUNNER", 145],
                        ["MU_PIPEBIN", 145],
                        // ships
                        ["GUNBOAT", 55],
                        ["CANNONBOAT", 55],
                        ["BLACK_BOAT", 55],
                        ["TORPEDOBOAT", 75],
                        ["LANDER", 30],
                        ["FRIGATE", 35],
                        ["DESTROYER", 35],
                        ["CRUISER", 35],
                        ["SUBMARINE", 25],
                        ["BATTLECRUISER", 25],
                        ["BATTLESHIP", 20],
                        ["AIRCRAFTCARRIER", 20],
                        ["MU_LARGEMISSILE", 70],
                        ["MU_WEAPON_CONSTRUCTOR", 70],
                        ["MU_BACKTRACKCAR", 65]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_TANKHUNTER_GUN.damageTable, "WEAPON_TANKHUNTER_GUN");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_TANKHUNTER_GUN = new Constructor();
