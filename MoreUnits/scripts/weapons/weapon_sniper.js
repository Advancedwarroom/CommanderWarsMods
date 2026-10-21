var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("Designated Marksman Rifle");
    };
    this.getEnviromentDamage = function(enviromentId)
    {
        return 1;
    };
    this.damageTable = [["INFANTRY", 80],
                        ["MECH", 70],
                        ["MOTORBIKE", 70],
                        ["SNIPER", 70],
                        ["AIRBORNE", 60],

                        // supporter
                        ["APC", 35],
                        ["FLARE", 35],
                        ["RECON", 35],
						["TRUCK", 55],

                        // tanks
                        ["FLAK", 8],
                        ["HOVERFLAK", 8],
                        ["LIGHT_TANK", 8],
                        ["HOVERCRAFT", 8],
                        ["MEDIUM_TANK", 5],

                        // heavy tanks
                        ["HEAVY_HOVERCRAFT", 5],
                        ["HEAVY_TANK", 5],
                        ["NEOTANK", 5],

                        // very heavy tanks
                        ["MEGATANK", 1],
						["MBT", 1],
						
						["REPAIR_DRONE", 140],
						["RECON_DRONE", 145],

                        ["HOELLIUM", 20],
						
						["T_TRAIN", 1],
						["ARTY_TRAIN", 1],
						["ARMORED_TRAIN", 1],

                        // heli copter
                        ["T_HELI", 35],
                        ["K_HELI", 5],
                        ["R_HELI", 18],
						
						// defences
						["SNIPER_TOWER", 85],
						["PILLBOX", 5],
						["MISSILE_DEF", 25],
						["ARTY_DEF", 30],
											
                        // ranged land units
                        ["ARTILLERY", 8],
                        ["ARTILLERYCRAFT", 8],
                        ["ANTITANKCANNON", 8],
                        ["MISSILE", 12],
                        ["ROCKETTHROWER", 12],
                        ["PIPERUNNER", 5],
                        ["MU_PIPEBIN", 5],
                        ["MU_LARGEMISSILE", 35],
                        ["MU_WEAPON_CONSTRUCTOR", 35],
                        ["MU_BACKTRACKCAR", 30],
                        ["MU_EMPOWER_TERRAIN_EDITOR", 80]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_SNIPER.damageTable, "WEAPON_SNIPER");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_SNIPER = new Constructor();
