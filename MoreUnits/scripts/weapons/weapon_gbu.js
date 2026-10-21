var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("Guided Bomb Unit");
    };
    this.getEnviromentDamage = function(enviromentId)
    {
        return 85;
    };
    this.damageTable = [["APC", 65],
                        ["FLARE", 70],
                        ["RECON", 80],
						["TRUCK", 100],

                        // tanks
                        ["FLAK", 90],
                        ["HOVERFLAK", 75],
                        ["LIGHT_TANK", 70],
                        ["HOVERCRAFT", 55],
                        ["MEDIUM_TANK", 50],

                        ["HEAVY_HOVERCRAFT", 35],
                        ["HEAVY_TANK", 35],
                        ["NEOTANK", 20],

                        // very heavy tanks
                        ["MEGATANK", 8],
						["MBT", 3],
						
						["REPAIR_DRONE", 245],
						
						["SNIPER_TOWER", 150],
						["PILLBOX", 55],
						["MISSILE_DEF", 135],
						["ARTY_DEF", 140],

                        ["HOELLIUM", 30],
						
						["T_TRAIN", 60],
						["ARTY_TRAIN", 40],
						["ARMORED_TRAIN", 15],

                        ["ARTILLERY", 120],
                        ["ARTILLERYCRAFT", 120],
                        ["ANTITANKCANNON", 110],
                        ["MISSILE", 125],
                        ["ROCKETTHROWER", 125],
                        ["PIPERUNNER", 125],
                        ["MU_PIPEBIN", 125],
                        ["MU_LARGEMISSILE", 95],
                        ["MU_WEAPON_CONSTRUCTOR", 95],
                        ["MU_BACKTRACKCAR", 90]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_GBU.damageTable, "WEAPON_GBU");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_GBU = new Constructor();
