var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("Medium Machine Gun");
    };
    this.getEnviromentDamage = function(enviromentId)
    {
        return 1;
    };
    this.damageTable = [["INFANTRY", 105],
                        ["MECH", 95],
                        ["MOTORBIKE", 90],
                        ["SNIPER", 90],
                        ["AIRBORNE", 80],

                        // supporter
                        ["APC", 45],
                        ["FLARE", 45],
                        ["RECON", 45],
						["TRUCK", 65],

                        // tanks
                        ["FLAK", 7],
                        ["HOVERFLAK", 7],
                        ["LIGHT_TANK", 8],
                        ["HOVERCRAFT", 8],
                        ["MEDIUM_TANK", 5],
                        ["ZCOUNIT_TANK_HUNTER", 5],

                        // heavy tanks
                        ["HEAVY_HOVERCRAFT", 1],
                        ["HEAVY_TANK", 1],
						["MBT", 1],
                        ["NEOTANK", 1],
						
						["REPAIR_DRONE", 125],
						["RECON_DRONE", 130],
						
						["T_TRAIN", 1],
						["ARTY_TRAIN", 1],
						["ARMORED_TRAIN", 1],
						
						["SNIPER_TOWER", 110],
						["PILLBOX", 1],
						["MISSILE_DEF", 45],
						["ARTY_DEF", 55],

                        // very heavy tanks
                        ["MEGATANK", 1],
                        ["MEDIUM_TANK", 1],
                        ["HOELLIUM", 20],

                        // heli copter
                        ["T_HELI", 45],
                        ["K_HELI", 5],
                        ["R_HELI", 12],

                        // ranged land units
                        ["ARTILLERY", 45],
                        ["ARTILLERYCRAFT", 45],
                        ["ANTITANKCANNON", 10],
                        ["MISSILE", 35],
                        ["ROCKETTHROWER", 45],
                        ["PIPERUNNER", 8],
                        ["MU_PIPEBIN", 8],
                        ["MU_LARGEMISSILE", 15],
                        ["MU_WEAPON_CONSTRUCTOR", 15],
                        ["MU_BACKTRACKCAR", 10],
                        ["MU_EMPOWER_TERRAIN_EDITOR", 105]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_MEDIUM_TANK_MG.damageTable, "WEAPON_MEDIUM_TANK_MG");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_MEDIUM_TANK_MG = new Constructor();