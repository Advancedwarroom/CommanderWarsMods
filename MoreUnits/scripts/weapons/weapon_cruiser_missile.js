var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("Cruiser Missile");
    };
    this.getEnviromentDamage = function(enviromentId)
    {
        return 85;
    };
    this.damageTable = [["INFANTRY", 120],
                        ["MECH", 110],
                        ["MOTORBIKE", 115],
                        ["SNIPER", 130],
                        ["AIRBORNE", 95],
                        // supporter
                        ["APC", 100],
                        ["FLARE", 105],
                        ["RECON", 120],
						["TRUCK", 155],
                        // tanks
                        ["FLAK", 105],
                        ["HOVERFLAK", 110],
                        ["LIGHT_TANK", 95],
                        ["HOVERCRAFT", 100],
                        ["MEDIUM_TANK", 75],
                        ["ZCOUNIT_TANK_HUNTER", 90],
                        // heavy tanks
                        ["HEAVY_HOVERCRAFT", 70],
                        ["HEAVY_TANK", 75],
                        ["NEOTANK", 80],
                        // very heavy tanks
                        ["MEGATANK", 45],
						["MBT", 30],
                        // ranged land units
                        ["ARTILLERY", 100],
                        ["ARTILLERYCRAFT", 110],
                        ["ANTITANKCANNON", 105],
                        ["MISSILE", 115],
                        ["ROCKETTHROWER", 120],
                        ["PIPERUNNER", 100],
                        ["MU_PIPEBIN", 100],
                        ["HOELLIUM", 35],
						
						["T_TRAIN", 85],
						["ARTY_TRAIN", 65],
						["ARMORED_TRAIN", 40],
						
						["SNIPER_TOWER", 175],
						["PILLBOX", 95],
						["MISSILE_DEF", 140],
						["ARTY_DEF", 150],
						
						["REPAIR_DRONE", 425],
						
                        // ships
                        ["GUNBOAT", 125],
                        ["CANNONBOAT", 130],
                        ["BLACK_BOAT", 115],
                        ["TORPEDOBOAT", 135],
                        ["LANDER", 110],
                        ["FRIGATE", 105],
                        ["DESTROYER", 100],
                        ["CRUISER", 95],
                        ["SUBMARINE", 95],
						["NUCLEAR_SUBMARINE", 80],
                        ["BATTLECRUISER", 85],
                        ["BATTLESHIP", 75],
                        ["AIRCRAFTCARRIER", 70],
                        ["MU_LARGEMISSILE", 70],
                        ["MU_WEAPON_CONSTRUCTOR", 70],
                        ["MU_BACKTRACKCAR", 65],
                        ["MU_EMPOWER_TERRAIN_EDITOR", 120]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_CRUISER_MISSILE.damageTable, "WEAPON_CRUISER_MISSILE");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_CRUISER_MISSILE = new Constructor();
