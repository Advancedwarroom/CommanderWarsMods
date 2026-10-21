var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("Anti Tank Guided Missile");
    };
    this.getEnviromentDamage = function(enviromentId)
    {
        return 55;
    };
    this.damageTable = [["APC", 95],
                        ["FLARE", 105],
                        ["RECON", 115],
						["TRUCK", 135],

                        ["FLAK", 95],
                        ["HOVERFLAK", 95],
                        ["LIGHT_TANK", 80],
                        ["HOVERCRAFT", 80],

                        ["HEAVY_HOVERCRAFT", 50],
                        ["HEAVY_TANK", 50],
                        ["MEDIUM_TANK", 65],
                        ["NEOTANK", 60],
                        ["MEGATANK", 45],
						["MBT", 30],
						
						["REPAIR_DRONE", 200],
						
						["T_TRAIN", 70],
						["ARTY_TRAIN", 50],
						["ARMORED_TRAIN", 25],
						
						["SNIPER_TOWER", 125],
						["PILLBOX", 65],
						["MISSILE_DEF", 105],
						["ARTY_DEF", 115],

                        ["ARTILLERY", 90],
                        ["ANTITANKCANNON", 55],
                        ["MISSILE", 110],
                        ["ROCKETTHROWER", 110],
                        ["PIPERUNNER", 65],
                        ["MU_PIPEBIN", 65],

                        ["HOELLIUM", 40],]

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_A_TANK_MISSILE.damageTable, "WEAPON_A_TANK_MISSILE");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_A_TANK_MISSILE = new Constructor();
