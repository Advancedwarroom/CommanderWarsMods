var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("Rocket Launcher");
    };
    this.getEnviromentDamage = function(enviromentId)
    {
        return 15;
    };
    this.damageTable = [["APC", 75],
                        ["FLARE", 85],
                        ["RECON", 85],
						["TRUCK", 110],
                        // tanks
                        ["FLAK", 65],
                        ["HOVERFLAK", 65],
                        ["LIGHT_TANK", 55],
                        ["HOVERCRAFT", 55],
                        ["MEDIUM_TANK", 15],
                        ["ZCOUNIT_TANK_HUNTER", 25],
                        // heavy tanks
                        ["HEAVY_HOVERCRAFT", 10],
                        ["HEAVY_TANK", 10],
                        ["NEOTANK", 15],
                        // very heavy tanks
                        ["MEGATANK", 5],
						["MBT", 1],
                        ["HOELLIUM", 30],
						
						["REPAIR_DRONE", 105],
						
						["T_TRAIN", 45],
						["ARTY_TRAIN", 25],
						["ARMORED_TRAIN", 1],
						
						["SNIPER_TOWER", 100],
						["PILLBOX", 5],
						["MISSILE_DEF", 90],
						["ARTY_DEF", 95],
						
                        // ranged land units
                        ["ARTILLERY", 70],
                        ["ARTILLERYCRAFT", 70],
                        ["ANTITANKCANNON", 55],
                        ["MISSILE", 85],
                        ["ROCKETTHROWER", 85],
                        ["PIPERUNNER", 55],
                        ["MU_PIPEBIN", 55],
                        ["MU_LARGEMISSILE", 65],
                        ["MU_WEAPON_CONSTRUCTOR", 65],
                        ["MU_BACKTRACKCAR", 60]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_BAZOOKA.damageTable, "WEAPON_BAZOOKA");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_BAZOOKA = new Constructor();
