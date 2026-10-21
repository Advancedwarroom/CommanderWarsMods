var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("Incendiary Rocket Launcher");
    };
    this.getEnviromentDamage = function(enviromentId)
    {
        return 15;
    };
    this.damageTable = [["INFANTRY", 300],
	                    ["MECH", 290],
	                    ["MOTORBIKE", 280],
	                    ["SNIPER", 320],
						["AIRBORNE", 275],
		
		                ["APC", 35],
                        ["FLARE", 15],
                        ["RECON", 105],
						["TRUCK", 190],
                        // tanks
                        ["FLAK", 5],
                        ["HOVERFLAK", 1],
                        ["LIGHT_TANK", 1],
                        ["HOVERCRAFT", 1],
                        ["MEDIUM_TANK", 1],
                        ["ZCOUNIT_TANK_HUNTER", 1],
                        // heavy tanks
                        ["HEAVY_HOVERCRAFT", 1],
                        ["HEAVY_TANK", 1],
                        ["NEOTANK", 1],
                        // very heavy tanks
                        ["MEGATANK", 1],
						["MBT", 1],
                        ["HOELLIUM", 250],
						
						["REPAIR_DRONE", 450],
						
						["SNIPER_TOWER", 600],
						["PILLBOX", 60],
						["MISSILE_DEF", 350],
						["ARTY_DEF", 380],
						
						["T_TRAIN", 80],
						["ARTY_TRAIN", 30],
						["ARMORED_TRAIN", 1],
						
                        // ranged land units
                        ["ARTILLERY", 110],
                        ["ARTILLERYCRAFT", 100],
                        ["ANTITANKCANNON", 200],
                        ["MISSILE", 300],
                        ["ROCKETTHROWER", 350],
                        ["PIPERUNNER", 1],
                        ["MU_PIPEBIN", 1],
                        ["MU_LARGEMISSILE", 50],
                        ["MU_WEAPON_CONSTRUCTOR", 50],
                        ["MU_BACKTRACKCAR", 45],
                        ["MU_EMPOWER_TERRAIN_EDITOR", 300]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_INCENDIARY_LAUNCHER.damageTable, "WEAPON_INCENDIARY_LAUNCHER");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_INCENDIARY_LAUNCHER = new Constructor();
