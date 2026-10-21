var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("Bomb");
    };
    this.getEnviromentDamage = function(enviromentId)
    {
        return 95;
    };
    this.damageTable = [["INFANTRY", 120],
                        ["MECH", 110],
                        ["MOTORBIKE", 105],
                        ["SNIPER", 100],
                        ["AIRBORNE", 95],

                        // supporter
                        ["APC", 105],
                        ["FLARE", 105],
                        ["RECON", 105],
						["TRUCK", 135],

                        // tanks
                        ["FLAK", 95],
                        ["HOVERFLAK", 95],
                        ["LIGHT_TANK", 105],
                        ["HOVERCRAFT", 105],
                        ["MEDIUM_TANK", 95],
                        ["ZCOUNIT_TANK_HUNTER", 100],

                        // heavy tanks
                        ["HEAVY_HOVERCRAFT", 80],
                        ["HEAVY_TANK", 80],
                        ["NEOTANK", 90],

                        // very heavy tanks
                        ["MEGATANK", 55],
						["MBT", 48],

                        ["HOELLIUM", 60],
						
						["T_TRAIN", 95],
						["ARTY_TRAIN", 75],
						["ARMORED_TRAIN", 50],
						
						["SNIPER_TOWER", 130],
						["PILLBOX", 75],
						["MISSILE_DEF", 110],
						["ARTY_DEF", 120],
						
						["REPAIR_DRONE", 400],

                        // ranged land units
                        ["ARTILLERY", 105],
                        ["ARTILLERYCRAFT", 105],
                        ["ANTITANKCANNON", 80],
                        ["MISSILE", 105],
                        ["ROCKETTHROWER", 105],
                        ["PIPERUNNER", 105],
                        ["MU_PIPEBIN", 105],
                        // ships
                        ["GUNBOAT", 95],
                        ["CANNONBOAT", 95],
                        ["BLACK_BOAT", 95],
                        ["TORPEDOBOAT", 120],
                        ["LANDER", 95],
                        ["FRIGATE", 85],
                        ["DESTROYER", 85],
                        ["CRUISER", 85],
                        ["SUBMARINE", 85],
						["NUCLEAR_SUBMARINE", 70],
                        ["BATTLECRUISER", 80],
                        ["BATTLESHIP", 75],
                        ["AIRCRAFTCARRIER", 60],
                        ["MU_LARGEMISSILE", 95],
                        ["MU_WEAPON_CONSTRUCTOR", 95],
                        ["MU_BACKTRACKCAR", 90],
                        ["MU_EMPOWER_TERRAIN_EDITOR", 120]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_BOMB.damageTable, "WEAPON_BOMB");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_BOMB = new Constructor();
