var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("Anti Air Machine Gun");
    };
    this.getEnviromentDamage = function(enviromentId)
    {
        return 10;
    };
    this.damageTable = [["DUSTER", 75],
                        ["FIGHTER", 65],
						["DRONE", 95],
						["STRIKER", 55],
						["INTERCEPTOR", 75],
						["SEAD", 45],
                        ["BOMBER", 80],
                        ["BLACK_BOMB", 120],
                        ["STEALTHBOMBER", 70],
                        ["TRANSPORTPLANE", 75],
                        ["WATERPLANE", 75],
                        ["ZCOUNIT_KIROV", 50],
						
						["ZCOUNIT_KIROV", 85],
                        
                        ["R_HELI", 120],
                        ["K_HELI", 100],
                        ["T_HELI", 130],

                        // infantry
                        ["INFANTRY", 105],
                        ["MECH", 100],
                        ["MOTORBIKE", 105],
                        ["SNIPER", 95],
                        ["AIRBORNE", 85],

                        // supporter
                        ["APC", 50],
                        ["FLARE", 50],
                        ["RECON", 60],
						["TRUCK", 80],

                        // tanks
                        ["FLAK", 45],
                        ["HOVERFLAK", 45],
                        ["LIGHT_TANK", 25],
                        ["HOVERCRAFT", 25],
                        ["MEDIUM_TANK", 10],
                        ["ZCOUNIT_TANK_HUNTER", 15],

                        // heavy tanks
                        ["HEAVY_HOVERCRAFT", 5],
                        ["HEAVY_TANK", 5],
                        ["NEOTANK", 5],

                        // very heavy tanks
                        ["MEGATANK", 1],
						["MBT", 1],
						
						["REPAIR_DRONE", 165],
						["RECON_DRONE", 165],
						
						["SNIPER_TOWER", 115],
						["PILLBOX", 1],
						["MISSILE_DEF", 65],
						["ARTY_DEF", 75],
						
						["T_TRAIN", 15],
						["ARTY_TRAIN", 1],
						["ARMORED_TRAIN", 1],

                        ["HOELLIUM", 20],

                        // ranged land units
                        ["ARTILLERY", 50],
                        ["ARTILLERYCRAFT", 50],
                        ["ANTITANKCANNON", 25],
                        ["MISSILE", 55],
                        ["ROCKETTHROWER", 55],
                        ["PIPERUNNER", 25],
                        ["MU_PIPEBIN", 25],
                        ["MU_LARGEMISSILE", 75],
                        ["MU_WEAPON_CONSTRUCTOR", 75],
                        ["MU_BACKTRACKCAR", 70],
                        ["MU_EMPOWER_TERRAIN_EDITOR", 105]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_VULCAN_CANNON.damageTable, "WEAPON_VULCAN_CANNON");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_VULCAN_CANNON = new Constructor();
