var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("Heavy Vulcan Gun");
    };
    this.getEnviromentDamage = function(enviromentId)
    {
        return 15;
    };
    this.damageTable = [["DUSTER", 95],
                        ["FIGHTER", 75],
						["DRONE", 120],
						["STRIKER", 60],
						["INTERCEPTOR", 85],
						["SEAD", 55],
                        ["BOMBER", 90],
                        ["BLACK_BOMB", 150],
                        ["STEALTHBOMBER", 70],
                        ["TRANSPORTPLANE", 90],
                        ["WATERPLANE", 85],
						
						["ZCOUNIT_KIROV", 95],
                        
                        ["R_HELI", 140],
                        ["K_HELI", 120],
                        ["T_HELI", 150],

                        // infantry
                        ["INFANTRY", 145],
                        ["MECH", 140],
                        ["MOTORBIKE", 145],
                        ["SNIPER", 135],
                        ["AIRBORNE", 125],

                        // supporter
                        ["APC", 60],
                        ["FLARE", 60],
                        ["RECON", 70],
						["TRUCK", 90],

                        // tanks
                        ["FLAK", 55],
                        ["HOVERFLAK", 55],
                        ["LIGHT_TANK", 35],
                        ["HOVERCRAFT", 35],
                        ["MEDIUM_TANK", 20],
                        ["ZCOUNIT_TANK_HUNTER", 35],

                        // heavy tanks
                        ["HEAVY_HOVERCRAFT", 8],
                        ["HEAVY_TANK", 8],
                        ["NEOTANK", 12],

                        // very heavy tanks
                        ["MEGATANK", 5],
						["MBT", 1],
						
						["REPAIR_DRONE", 205],
						["RECON_DRONE", 195],
						
						["SNIPER_TOWER", 165],
						["PILLBOX", 7],
						["MISSILE_DEF", 85],
						["ARTY_DEF", 95],
						
						["T_TRAIN", 25],
						["ARTY_TRAIN", 10],
						["ARMORED_TRAIN", 1],

                        ["HOELLIUM", 30],

                        // ranged land units
                        ["ARTILLERY", 70],
                        ["ARTILLERYCRAFT", 70],
                        ["ANTITANKCANNON", 45],
                        ["MISSILE", 75],
                        ["ROCKETTHROWER", 75],
                        ["PIPERUNNER", 45],
                        ["MU_PIPEBIN", 45],
                        ["MU_LARGEMISSILE", 75],
                        ["MU_WEAPON_CONSTRUCTOR", 75],
                        ["MU_BACKTRACKCAR", 70],
                        ["MU_EMPOWER_TERRAIN_EDITOR", 145]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_VULCAN_CANNON_II.damageTable, "WEAPON_VULCAN_CANNON_II");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_VULCAN_CANNON_II = new Constructor();