var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("Naval Machine Gun");
    };
    this.damageTable = [["GUNBOAT", 55],
                        ["CANNONBOAT", 55],
                        ["BLACK_BOAT", 55],
                        ["TORPEDOBOAT", 55],
                        ["LANDER", 35],
                        ["FRIGATE", 35],
                        ["DESTROYER", 25],
                        ["CRUISER", 15],
                        ["SUBMARINE", 5],
						["NUCLEAR_SUBMARINE", 1],
                        ["BATTLECRUISER", 5],
                        ["BATTLESHIP", 5],
                        ["AIRCRAFTCARRIER", 5],
                        // infantry
                        ["INFANTRY", 55],
                        ["MECH", 45],
                        ["MOTORBIKE", 45],
                        ["SNIPER", 45],
                        ["AIRBORNE", 35],
                        // supporter
                        ["APC", 35],
                        ["FLARE", 35],
                        ["RECON", 35],
						["TRUCK", 50],
                        // tanks
                        ["FLAK", 25],
                        ["HOVERFLAK", 25],
                        ["LIGHT_TANK", 25],
                        ["HOVERCRAFT", 25],
                        ["MEDIUM_TANK", 10],
                        ["ZCOUNIT_TANK_HUNTER", 15],
                        // heavy tanks
                        ["HEAVY_HOVERCRAFT", 1],
                        ["HEAVY_TANK", 1],
                        ["NEOTANK", 5],
                        // very heavy tanks
                        ["MEGATANK", 1],
						["MBT", 1],
						
						["REPAIR_DRONE", 90],
						
						["SNIPER_TOWER", 65],
						["PILLBOX", 1],
						["MISSILE_DEF", 45],
						["ARTY_DEF", 50],
						
						["T_TRAIN", 15],
						["ARTY_TRAIN", 1],
						["ARMORED_TRAIN", 1],
						
                        // ranged land units
                        ["ARTILLERY", 25],
                        ["ARTILLERYCRAFT", 25],
                        ["ANTITANKCANNON", 25],
                        ["MISSILE", 35],
                        ["ROCKETTHROWER", 35],
                        ["PIPERUNNER", 35],
                        ["MU_PIPEBIN", 35],
                        ["HOELLIUM", 20],
                        ["MU_LARGEMISSILE", 70],
                        ["MU_WEAPON_CONSTRUCTOR", 70],
                        ["MU_BACKTRACKCAR", 65],
                        ["MU_EMPOWER_TERRAIN_EDITOR", 55]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_GUNBOAT_NAVAL_GUN.damageTable, "WEAPON_GUNBOAT_NAVAL_GUN");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_GUNBOAT_NAVAL_GUN = new Constructor();
