var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("Heavy Machine Gun");
    };
    this.getEnviromentDamage = function(enviromentId)
    {
        return 1;
    };
    this.damageTable = [["INFANTRY", 75],
                        ["MECH", 65],
                        ["MOTORBIKE", 65],
                        ["SNIPER", 65],
                        ["AIRBORNE", 55],

                        // supporter
                        ["APC", 20],
                        ["FLARE", 30],
                        ["RECON", 30],
						["TRUCK", 50],

                        // tanks
                        ["FLAK", 1],
                        ["HOVERFLAK", 1],
                        ["LIGHT_TANK", 8],
                        ["HOVERCRAFT", 8],
                        ["MEDIUM_TANK", 5],
                        ["ZCOUNIT_TANK_HUNTER", 5],

                        // heavy tanks
                        ["HEAVY_HOVERCRAFT", 5],
                        ["HEAVY_TANK", 5],
                        ["NEOTANK", 5],

                        // very heavy tanks
                        ["MEGATANK", 1],
						["MBT", 1],

                        ["HOELLIUM", 20],
						
						["REPAIR_DRONE", 145],
						["RECON_DRONE", 105],
						
						["T_TRAIN", 1],
						["ARTY_TRAIN", 1],
						["ARMORED_TRAIN", 1],
						
						["SNIPER_TOWER", 80],
						["PILLBOX", 1],
						["MISSILE_DEF", 35],
						["ARTY_DEF", 45],

                        // heli copter
						["R_HELI", 45],
						["T_HELI", 55],
						["K_HELI", 30],
						
						["ZCOUNIT_KIROV", 15],

                        // ranged land units
                        ["ARTILLERY", 25],
                        ["ARTILLERYCRAFT", 25],
                        ["ANTITANKCANNON", 1],
                        ["MISSILE", 25],
                        ["ROCKETTHROWER", 35],
                        ["PIPERUNNER", 6],
                        ["MU_PIPEBIN", 6],
                        ["MU_LARGEMISSILE", 10],
                        ["MU_WEAPON_CONSTRUCTOR", 10],
                        ["MU_BACKTRACKCAR", 5],
                        ["MU_EMPOWER_TERRAIN_EDITOR", 75]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_K_HELI_MG.damageTable, "WEAPON_K_HELI_MG");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_K_HELI_MG = new Constructor();
