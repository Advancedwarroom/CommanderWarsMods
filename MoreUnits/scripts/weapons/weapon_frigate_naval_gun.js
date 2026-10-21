var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("Anti Naval Gun");
    };
    this.damageTable = [// ships
                        ["GUNBOAT", 75],
                        ["CANNONBOAT", 75],
                        ["BLACK_BOAT", 75],
                        ["TORPEDOBOAT", 75],
                        ["LANDER", 75],
                        ["FRIGATE", 55],
                        ["DESTROYER", 35],
                        ["CRUISER", 25],
                        ["SUBMARINE", 20],
						["NUCLEAR_SUBMARINE", 2],
                        ["BATTLECRUISER", 5],
                        ["BATTLESHIP", 5],
                        ["AIRCRAFTCARRIER", 5],
                        // infantry
                        ["INFANTRY", 65],
                        ["MECH", 55],
                        ["MOTORBIKE", 55],
                        ["SNIPER", 55],
                        ["AIRBORNE", 45],
                        // supporter
                        ["APC", 45],
                        ["FLARE", 45],
                        ["RECON", 45],
						["TRUCK", 65],
                        // tanks
                        ["FLAK", 35],
                        ["HOVERFLAK", 35],
                        ["LIGHT_TANK", 35],
                        ["HOVERCRAFT", 35],
                        ["MEDIUM_TANK", 25],
                        // heavy tanks
                        ["HEAVY_HOVERCRAFT", 15],
                        ["HEAVY_TANK", 15],
                        ["NEOTANK", 20],
                        // very heavy tanks
                        ["MEGATANK", 5],
						["MBT", 1],
						
						["REPAIR_DRONE", 125],
						
						["SNIPER_TOWER", 75],
						["PILLBOX", 10],
						["MISSILE_DEF", 55],
						["ARTY_DEF", 60],
						
						["T_TRAIN", 25],
						["ARTY_TRAIN", 5],
						["ARMORED_TRAIN", 1],
						
                        // ranged land units
                        ["ARTILLERY", 40],
                        ["ARTILLERYCRAFT", 40],
                        ["ANTITANKCANNON", 25],
                        ["MISSILE", 45],
                        ["ROCKETTHROWER", 45],
                        ["PIPERUNNER", 50],
                        ["MU_PIPEBIN", 50],
                        ["HOELLIUM", 5],
                        ["MU_LARGEMISSILE", 70],
                        ["MU_WEAPON_CONSTRUCTOR", 70],
                        ["MU_BACKTRACKCAR", 65],
                        ["MU_EMPOWER_TERRAIN_EDITOR", 65]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_FRIGATE_NAVAL_GUN.damageTable, "WEAPON_FRIGATE_NAVAL_GUN");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_FRIGATE_NAVAL_GUN = new Constructor();
