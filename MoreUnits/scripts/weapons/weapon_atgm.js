var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("ATGM");
    };
    this.getEnviromentDamage = function(enviromentId)
    {
        return 45;
    };
    this.damageTable = [["APC", 80],
                        ["FLARE", 90],
                        ["RECON", 95],
						["TRUCK", 125],

                        // tanks
                        ["FLAK", 70],
                        ["HOVERFLAK", 70],
                        ["LIGHT_TANK", 65],
                        ["HOVERCRAFT", 65],

                        // heavy tanks
                        ["HEAVY_HOVERCRAFT", 15],
                        ["HEAVY_TANK", 15],
                        ["MEDIUM_TANK", 25],
                        ["NEOTANK", 15],

                        // very heavy tanks
                        ["MEGATANK", 10],
						["MBT", 3],

                        ["HOELLIUM", 25],
						
						["REPAIR_DRONE", 185],
						
						["T_TRAIN", 55],
						["ARTY_TRAIN", 35],
						["ARMORED_TRAIN", 10],
						
						["SNIPER_TOWER", 105],
						["PILLBOX", 35],
						["MISSILE_DEF", 90],
						["ARTY_DEF", 100],

                        // ranged land units
                        ["ARTILLERY", 80],
                        ["ARTILLERYCRAFT", 80],
                        ["ANTITANKCANNON", 30],
                        ["MISSILE", 95],
                        ["ROCKETTHROWER", 90],
                        ["PIPERUNNER", 60],
                        ["MU_PIPEBIN", 60],
                        // ships
                        ["GUNBOAT", 15],
                        ["CANNONBOAT", 15],
                        ["BLACK_BOAT", 15],
                        ["TORPEDOBOAT", 20],
                        ["LANDER", 10],
                        ["FRIGATE", 5],
                        ["DESTROYER", 5],
                        ["CRUISER", 5],
                        ["SUBMARINE", 1],
						["NUCLEAR_SUBMARINE", 1],
                        ["BATTLECRUISER", 1],
                        ["BATTLESHIP", 1],
                        ["AIRCRAFTCARRIER", 1],
                        ["MU_LARGEMISSILE", 70],
                        ["MU_WEAPON_CONSTRUCTOR", 70],
                        ["MU_BACKTRACKCAR", 65]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_ATGM.damageTable, "WEAPON_ATGM");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_ATGM = new Constructor();
