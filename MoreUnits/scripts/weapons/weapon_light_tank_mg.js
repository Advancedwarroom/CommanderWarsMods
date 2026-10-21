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
    this.damageTable = [["INFANTRY", 75],
                        ["MECH", 70],
                        ["MOTORBIKE", 70],
                        ["SNIPER", 70],
                        ["AIRBORNE", 60],

                        // supporter
                        ["APC", 54],
                        ["FLARE", 35],
                        ["RECON", 40],
						["TRUCK", 60],

                        // tanks
                        ["FLAK", 5],
                        ["HOVERFLAK", 5],
                        ["LIGHT_TANK", 6],
                        ["HOVERCRAFT", 6],
                        ["MEDIUM_TANK", 1],
                        ["ZCOUNIT_TANK_HUNTER", 3],

                        // heavy tanks
                        ["HEAVY_HOVERCRAFT", 1],
                        ["HEAVY_TANK", 1],
                        ["MEDIUM_TANK", 1],
                        ["NEOTANK", 1],

                        // very heavy tanks
                        ["MEGATANK", 1],
						["MBT", 1],
						
						["REPAIR_DRONE", 100],
						["RECON_DRONE", 115],
						
						["SNIPER_TOWER", 90],
						["PILLBOX", 1],
						["MISSILE_DEF", 40],
						["ARTY_DEF", 45],
						
						["T_TRAIN", 1],
						["ARTY_TRAIN", 1],
						["ARMORED_TRAIN", 1],

                        ["HOELLIUM", 20],

                        // heli copter
                        ["T_HELI", 40],
                        ["K_HELI", 1],
                        ["R_HELI", 10],

                        // ranged land units
                        ["ARTILLERY", 45],
                        ["ARTILLERYCRAFT", 45],
                        ["ANTITANKCANNON", 1],
                        ["MISSILE", 30],
                        ["ROCKETTHROWER", 55],
                        ["PIPERUNNER", 6],
                        ["MU_PIPEBIN", 6],
                        ["MU_LARGEMISSILE", 15],
                        ["MU_WEAPON_CONSTRUCTOR", 15],
                        ["MU_BACKTRACKCAR", 10],
                        ["MU_EMPOWER_TERRAIN_EDITOR", 75]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_LIGHT_TANK_MG.damageTable, "WEAPON_LIGHT_TANK_MG");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_LIGHT_TANK_MG = new Constructor();
