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
    this.damageTable = [["APC", 90],
                        ["FLARE", 90],
                        ["RECON", 95],
						["TRUCK", 125],

                        // tanks
                        ["FLAK", 90],
                        ["HOVERFLAK", 90],
                        ["LIGHT_TANK", 70],
                        ["HOVERCRAFT", 70],
						
						["MEDIUM_TANK", 40],

                        // heavy tanks
                        ["HEAVY_HOVERCRAFT", 35],
                        ["HEAVY_TANK", 30],
                        ["NEOTANK", 45],

                        // very heavy tanks
                        ["MEGATANK", 20],
						["MBT", 10],

                        ["HOELLIUM", 30],
						
						["T_TRAIN", 60],
						["ARTY_TRAIN", 40],
						["ARMORED_TRAIN", 15],
						
						["SNIPER_TOWER", 160],
						["PILLBOX", 40],
						["MISSILE_DEF", 110],
						["ARTY_DEF", 125],
						
						["REPAIR_DRONE", 195],

                        // ranged land units
                        ["ARTILLERY", 85],
                        ["ARTILLERYCRAFT", 85],
                        ["ANTITANKCANNON", 35],
                        ["MISSILE", 90],
                        ["ROCKETTHROWER", 90],
                        ["PIPERUNNER", 90],
                        ["MU_PIPEBIN", 90],
                        // ships
                        ["GUNBOAT", 55],
                        ["CANNONBOAT", 55],
                        ["BLACK_BOAT", 55],
                        ["TORPEDOBOAT", 55],
                        ["LANDER", 22],
                        ["FRIGATE", 12],
                        ["DESTROYER", 12],
                        ["CRUISER", 12],
                        ["SUBMARINE", 12],
						["NUCLEAR_SUBMARINE", 5],
                        ["BATTLECRUISER", 12],
                        ["BATTLESHIP", 10],
                        ["AIRCRAFTCARRIER", 10],
                        ["MU_LARGEMISSILE", 65],
                        ["MU_WEAPON_CONSTRUCTOR", 65],
                        ["MU_BACKTRACKCAR", 60]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_HEAVY_HOVERCRAFT_GUN.damageTable, "WEAPON_HEAVY_HOVERCRAFT_GUN");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_HEAVY_HOVERCRAFT_GUN = new Constructor();
