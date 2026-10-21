var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("Heavy Bombs");
    };
    this.getEnviromentDamage = function(enviromentId)
    {
        return 95;
    };
    this.damageTable = [["INFANTRY", 135],
                        ["MECH", 125],
                        ["MOTORBIKE", 120],
                        ["SNIPER", 140],
                        ["AIRBORNE", 110],

                        // supporter
                        ["APC", 115],
                        ["FLARE", 115],
                        ["RECON", 115],
						["TRUCK", 140],

                        // tanks
                        ["FLAK", 110],
                        ["HOVERFLAK", 110],
                        ["LIGHT_TANK", 120],
                        ["HOVERCRAFT", 120],
                        ["MEDIUM_TANK", 110],
                        ["ZCOUNIT_TANK_HUNTER", 115],

                        // heavy tanks
                        ["HEAVY_HOVERCRAFT", 95],
                        ["HEAVY_TANK", 95],
                        ["NEOTANK", 105],

                        // very heavy tanks
                        ["MEGATANK", 70],
						["MBT", 55],
						
						["REPAIR_DRONE", 500],

                        ["HOELLIUM", 80],
						
						["T_TRAIN", 110],
						["ARTY_TRAIN", 90],
						["ARMORED_TRAIN", 65],
						
						["SNIPER_TOWER", 260],
						["PILLBOX", 110],
						["MISSILE_DEF", 140],
						["ARTY_DEF", 155],

                        // ranged land units
                        ["ARTILLERY", 120],
                        ["ARTILLERYCRAFT", 120],
                        ["ANTITANKCANNON", 105],
                        ["MISSILE", 120],
                        ["ROCKETTHROWER", 120],
                        ["PIPERUNNER", 120],
                        ["MU_PIPEBIN", 120],
                        // ships
                        ["GUNBOAT", 110],
                        ["CANNONBOAT", 110],
                        ["BLACK_BOAT", 110],
                        ["TORPEDOBOAT", 135],
                        ["LANDER", 110],
                        ["FRIGATE", 100],
                        ["DESTROYER", 90],
                        ["CRUISER", 90],
                        ["SUBMARINE", 85],
						["NUCLEAR_SUBMARINE", 70],
                        ["BATTLECRUISER", 85],
                        ["BATTLESHIP", 80],
                        ["AIRCRAFTCARRIER", 75],
                        ["MU_LARGEMISSILE", 95],
                        ["MU_WEAPON_CONSTRUCTOR", 95],
                        ["MU_BACKTRACKCAR", 90],
                        ["MU_EMPOWER_TERRAIN_EDITOR", 135]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_HEAVY_BOMB.damageTable, "WEAPON_HEAVY_BOMB");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_HEAVY_BOMB = new Constructor();
