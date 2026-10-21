Constructor = function()
{
    this.getName = function()
    {
        return qsTr("Mortar");
    };
    this.getEnviromentDamage = function(enviromentId)
    {
        return 25;
    };
    this.damageTable = [["INFANTRY", 95],
                        ["MECH", 85],
                        ["MOTORBIKE", 85],
                        ["SNIPER", 85],
                        ["AIRBORNE", 80],

                        // supporter
                        ["APC", 55],
                        ["FLARE", 65],
                        ["RECON", 75],
						["TRUCK", 95],

                        // tanks
                        ["FLAK", 65],
                        ["HOVERFLAK", 65],
                        ["LIGHT_TANK", 55],
                        ["HOVERCRAFT", 55],

                        // heavy tanks
                        ["HEAVY_HOVERCRAFT", 5],
                        ["HEAVY_TANK", 5],
                        ["MEDIUM_TANK", 25],
                        ["NEOTANK", 3],
						
						["REPAIR_DRONE", 185],

                        // very heavy tanks
                        ["MEGATANK", 1],
						["MBT", 1],
						
						["SNIPER_TOWER", 105],
						["PILLBOX", 1],
						["MISSILE_DEF", 85],
						["ARTY_DEF", 95],
						
						["T_TRAIN", 45],
						["ARTY_TRAIN", 25],
						["ARMORED_TRAIN", 1],

                        // ranged land units
                        ["ARTILLERY", 65],
                        ["ARTILLERYCRAFT", 65],
                        ["ANTITANKCANNON", 45],
                        ["MISSILE", 75],
                        ["ROCKETTHROWER", 75],
                        ["PIPERUNNER", 45],
                        ["MU_PIPEBIN", 45],

                        ["HOELLIUM", 30],
                        ["MU_LARGEMISSILE", 75],
                        ["MU_WEAPON_CONSTRUCTOR", 75],
                        ["MU_BACKTRACKCAR", 70],
                        ["MU_EMPOWER_TERRAIN_EDITOR", 95]];
                        
    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_MORTAR.damageTable, "WEAPON_MORTAR");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_MORTAR = new Constructor();
