var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("Auto Cannon");
    };
    this.getEnviromentDamage = function(enviromentId)
    {
        return 10;
    };
    this.damageTable = [["INFANTRY", 170],
                        ["MECH", 150],
                        ["MOTORBIKE", 150],
                        ["SNIPER", 150],
                        ["AIRBORNE", 140],

                        // supporter
                        ["APC", 50],
                        ["FLARE", 45],
                        ["RECON", 60],
						["TRUCK", 80],

                        // tanks
                        ["FLAK", 45],
                        ["HOVERFLAK", 45],
                        ["LIGHT_TANK", 15],
                        ["HOVERCRAFT", 15],

                        // heavy tanks
						["MEDIUM_TANK", 10],
                        ["HEAVY_HOVERCRAFT", 5],
                        ["HEAVY_TANK", 5],
                        ["NEOTANK", 5],
						
						["REPAIR_DRONE", 260],
						["RECON_DRONE", 205],

                        // very heavy tanks
                        ["MEGATANK", 3],
						["MBT", 1],

                        ["HOELLIUM", 30],
						
						["T_TRAIN", 5],
						["ARTY_TRAIN", 1],
						["ARMORED_TRAIN", 1],
						
						["SNIPER_TOWER", 190],
						["PILLBOX", 1],
						["MISSILE_DEF", 65],
						["ARTY_DEF", 70],

                        // heli copter
                        ["T_HELI", 120],
                        ["K_HELI", 85],
                        ["R_HELI", 105],

                        //air
                        ["DUSTER", 75],
                        ["FIGHTER", 75],
						["DRONE", 95],
						["STRIKER", 60],
						["SEAD", 75],
                        ["BOMBER", 75],
                        ["STEALTHBOMBER", 75],
                        ["BLACK_BOMB", 75],
                        ["TRANSPORTPLANE", 75],
                        ["WATERPLANE", 75],

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
                        ["MU_EMPOWER_TERRAIN_EDITOR", 170]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_HOVERVULCAN_CANNON.damageTable, "WEAPON_HOVERVULCAN_CANNON");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_HOVERVULCAN_CANNON = new Constructor();
