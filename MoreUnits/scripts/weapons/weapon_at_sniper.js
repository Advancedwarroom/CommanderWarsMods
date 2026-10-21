var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("Anti-Material Rifle");
    };
    this.getEnviromentDamage = function(enviromentId)
    {
        return 10;
    };
    this.damageTable = [["INFANTRY", 100],
                        ["MECH", 90],
                        ["MOTORBIKE", 95],
                        ["SNIPER", 85],
                        ["AIRBORNE", 75],

                        // supporter
                        ["APC", 65],
                        ["FLARE", 55],
                        ["RECON", 75],
						["TRUCK", 90],

                        // tanks
                        ["FLAK", 35],
                        ["HOVERFLAK", 35],
                        ["LIGHT_TANK", 35],
                        ["HOVERCRAFT", 35],
                        ["MEDIUM_TANK", 20],

                        // heavy tanks
                        ["HEAVY_HOVERCRAFT", 10],
                        ["HEAVY_TANK", 10],
                        ["NEOTANK", 13],

                        // very heavy tanks
                        ["MEGATANK", 1],
						["MBT", 1],
						
						["T_TRAIN", 25],
						["ARTY_TRAIN", 15],
						["ARMORED_TRAIN", 1],
						
						["SNIPER_TOWER", 100],
						["PILLBOX", 10],
						["MISSILE_DEF", 60],
						["ARTY_DEF", 70],

                        ["HOELLIUM", 45],
						
						["REPAIR_DRONE", 160],

                        // heli copter
                        ["T_HELI", 45],
                        ["K_HELI", 25],
                        ["R_HELI", 40],

                        // ranged land units
                        ["ARTILLERY", 25],
                        ["ARTILLERYCRAFT", 25],
                        ["ANTITANKCANNON", 40],
                        ["MISSILE", 35],
                        ["ROCKETTHROWER", 30],
                        ["PIPERUNNER", 35],
                        ["MU_PIPEBIN", 35],
                        ["MU_LARGEMISSILE", 45],
                        ["MU_WEAPON_CONSTRUCTOR", 45],
                        ["MU_BACKTRACKCAR", 40],
                        ["MU_EMPOWER_TERRAIN_EDITOR", 100]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_AT_SNIPER.damageTable, "WEAPON_AT_SNIPER");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_AT_SNIPER = new Constructor();
