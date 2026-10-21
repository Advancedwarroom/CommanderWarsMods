var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("Molotov");
    };
    this.getEnviromentDamage = function(enviromentId)
    {
        return 15;
    };
    this.damageTable = [["INFANTRY", 120],
                        ["MECH", 100],
                        ["MOTORBIKE", 55],
                        ["SNIPER", 100],
                        ["AIRBORNE", 100],

                        ["APC", 35],
                        ["FLARE", 30],
                        ["RECON", 35],
						["TRUCK", 55],

                        // tanks
                        ["FLAK", 20],
                        ["HOVERFLAK", 25],
                        ["LIGHT_TANK", 20],
                        ["HOVERCRAFT", 25],
                        ["MEDIUM_TANK", 5],
                        ["ZCOINIT_TANK_HUNTER", 10],

                        // heavy tanks
                        ["HEAVY_HOVERCRAFT", 1],
                        ["HEAVY_TANK", 1],
                        ["NEOTANK", 1],
						["MBT", 1],
						
						["REPAIR_DRONE", 65],

                        // very heavy tanks
                        ["MEGATANK", 1],

                        ["HOELLIUM", 50],
						
						["T_TRAIN", 10],
						["ARTY_TRAIN", 1],
						["ARMORED_TRAIN", 1],
						
						["SNIPER_TOWER", 120],
						["PILLBOX", 10],
						["MISSILE_DEF", 50],
						["ARTY_DEF", 60],

                        // ranged land units
                        ["ARTILLERY", 35],
                        ["ARTILLERYCRAFT", 40],
                        ["ANTITANKCANNON", 35],
                        ["MISSILE", 35],
                        ["ROCKETTHROWER", 35],
                        ["PIPERUNNER", 20],
                        ["MU_PIPEBIN", 20],
                        ["MU_LARGEMISSILE", 85],
                        ["MU_WEAPON_CONSTRUCTOR", 85],
                        ["MU_BACKTRACKCAR", 80],
                        ["MU_EMPOWER_TERRAIN_EDITOR", 120]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_FIREBOMB.damageTable, "WEAPON_FIREBOMB");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_FIREBOMB = new Constructor();
