var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("Missile");
    };
    this.getEnviromentDamage = function(enviromentId)
    {
        return 55;
    };
    this.damageTable = [["INFANTRY", 105],
                        ["MECH", 100],
                        ["MOTORBIKE", 100],
                        ["SNIPER", 100],

                        // supporter
                        ["APC", 95],
                        ["FLARE", 95],
                        ["RECON", 105],
						["TRUCK", 130],

                        // tanks
                        ["FLAK", 95],
                        ["HOVERFLAK", 95],
                        ["LIGHT_TANK", 90],
                        ["HOVERCRAFT", 90],
                        ["MEDIUM_TANK", 65],
                        ["ZCOUNIT_TANK_HUNTER", 70],

                        // heavy tanks
                        ["HEAVY_HOVERCRAFT", 55],
                        ["HEAVY_TANK", 55],
                        ["NEOTANK", 60],

                        // very heavy tanks
                        ["MEGATANK", 45],
						["MBT", 38],

                        ["HOELLIUM", 40],
						
						["T_TRAIN", 80],
						["ARTY_TRAIN", 60],
						["ARMORED_TRAIN", 35],
						
						["SNIPER_TOWER", 140],
						["PILLBOX", 55],
						["MISSILE_DEF", 115],
						["ARTY_DEF", 120],
						
						["REPAIR_DRONE", 240],

                        // ranged land units
                        ["ARTILLERY", 95],
                        ["ARTILLERYCRAFT", 95],
                        ["ANTITANKCANNON", 85],
                        ["MISSILE", 105],
                        ["ROCKETTHROWER", 105],
                        ["PIPERUNNER", 90],
                        ["MU_PIPEBIN", 90],
                        // ships
                        ["GUNBOAT", 105],
                        ["CANNONBOAT", 105],
                        ["BLACK_BOAT", 100],
                        ["TORPEDOBOAT", 120],
                        ["LANDER", 85],
                        ["FRIGATE", 95],
                        ["DESTROYER", 95],
                        ["CRUISER", 85],
                        ["SUBMARINE", 85],
						["NUCLEAR_SUBMARINE", 60],
                        ["BATTLECRUISER", 60],
                        ["BATTLESHIP", 60],
                        ["AIRCRAFTCARRIER", 60],
                        ["MU_LARGEMISSILE", 50],
                        ["MU_WEAPON_CONSTRUCTOR", 50],
                        ["MU_BACKTRACKCAR", 45],
                        ["MU_EMPOWER_TERRAIN_EDITOR", 105]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_MISSILE.damageTable, "WEAPON_MISSILE");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_MISSILE = new Constructor();
