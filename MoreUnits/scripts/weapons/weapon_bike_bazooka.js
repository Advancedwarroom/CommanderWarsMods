var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("Recoilless Rifle");
    };
    this.getEnviromentDamage = function(enviromentId)
    {
        return 15;
    };
    this.damageTable = [["INFANTRY", 35],
                        ["MECH", 30],
                        ["MOTORBIKE", 30],
                        ["SNIPER", 30],
						["AIRBORNE", 15],

                        ["APC", 85],
                        ["FLARE", 85],
                        ["RECON", 75],
						["TRUCK", 100],
                        // tanks
                        ["FLAK", 55],
                        ["HOVERFLAK", 55],
                        ["LIGHT_TANK", 55],
                        ["HOVERCRAFT", 55],
                        // heavy tanks
                        ["HEAVY_HOVERCRAFT", 25],
                        ["HEAVY_TANK", 15],
                        ["NEOTANK", 25],
                        // very heavy tanks
                        ["MEGATANK", 10],
						["MBT", 1],
                        ["HOELLIUM", 30],
						
						["REPAIR_DRONE", 115],
						
						["SNIPER_TOWER", 90],
						["PILLBOX", 3],
						["MISSILE_DEF", 80],
						["ARTY_DEF", 90],
						
						["T_TRAIN", 45],
						["ARTY_TRAIN", 25],
						["ARMORED_TRAIN", 1],
						
                        // ranged land units
                        ["ARTILLERY", 70],
                        ["ARTILLERYCRAFT", 70],
                        ["ANTITANKCANNON", 55],
                        ["MISSILE", 85],
                        ["ROCKETTHROWER", 85],
                        ["PIPERUNNER", 55],
                        ["MU_PIPEBIN", 55],
                        ["MU_LARGEMISSILE", 60],
                        ["MU_WEAPON_CONSTRUCTOR", 60],
                        ["MU_BACKTRACKCAR", 55],
                        ["MU_EMPOWER_TERRAIN_EDITOR", 35]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_BIKE_BAZOOKA.damageTable, "WEAPON_BIKE_BAZOOKA");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_BIKE_BAZOOKA = new Constructor();
