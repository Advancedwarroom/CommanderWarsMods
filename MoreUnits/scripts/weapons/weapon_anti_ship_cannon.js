var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("Heavy Cannon");
    };
    this.damageTable = [// ships
                        ["GUNBOAT", 85],
                        ["CANNONBOAT", 85],
                        ["BLACK_BOAT", 85],
                        ["TORPEDOBOAT", 100],
                        ["LANDER", 85],
                        ["FRIGATE", 85],
                        ["DESTROYER", 85],
                        ["CRUISER", 85],
                        ["SUBMARINE", 85],
						["NUCLEAR_SUBMARINE", 45],
                        ["BATTLECRUISER", 55],
                        ["BATTLESHIP", 40],
                        ["AIRCRAFTCARRIER", 50],
                        // destroyer can attack ground units
                        ["INFANTRY", 90],
                        ["MECH", 90],
                        ["MOTORBIKE", 85],
                        ["SNIPER", 85],
                        ["AIRBORNE", 75],
                        // supporter
                        ["APC", 75],
                        ["FLARE", 80],
                        ["RECON", 80],
						["TRUCK", 105],
                        // tanks
                        ["FLAK", 75],
                        ["HOVERFLAK", 75],
                        ["LIGHT_TANK", 70],
                        ["HOVERCRAFT", 70],
                        ["MEDIUM_TANK", 50],
                        ["ZCOUNIT_TANK_HUNTER", 60],
                        // heavy tanks
                        ["HEAVY_HOVERCRAFT", 35],
                        ["HEAVY_TANK", 35],
                        ["NEOTANK", 40],
                        // very heavy tanks
                        ["MEGATANK", 20],
						["MBT", 8],
						
						["REPAIR_DRONE", 185],
						
						["T_TRAIN", 60],
						["ARTY_TRAIN", 40],
						["ARMORED_TRAIN", 15],
						
						["SNIPER_TOWER", 110],
						["PILLBOX", 30],
						["MISSILE_DEF", 90],
						["ARTY_DEF", 100],
						
                        // ranged land units
                        ["ARTILLERY", 70],
                        ["ARTILLERYCRAFT", 70],
                        ["ANTITANKCANNON", 55],
                        ["MISSILE", 80],
                        ["ROCKETTHROWER", 80],
                        ["PIPERUNNER", 70],
                        ["MU_PIPEBIN", 70],
                        ["HOELLIUM", 20],
                        ["MU_LARGEMISSILE", 75],
                        ["MU_WEAPON_CONSTRUCTOR", 75],
                        ["MU_BACKTRACKCAR", 70],
                        ["MU_EMPOWER_TERRAIN_EDITOR", 90]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_ANTI_SHIP_CANNON.damageTable, "WEAPON_ANTI_SHIP_CANNON");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_ANTI_SHIP_CANNON = new Constructor();
