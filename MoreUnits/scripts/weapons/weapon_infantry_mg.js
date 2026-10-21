var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("Assault Rifle");
    };
    this.getEnviromentDamage = function(enviromentId)
    {
        return 1;
    };
    this.damageTable = [["INFANTRY", 55],
                        ["MECH", 45],
                        ["MOTORBIKE", 45],
                        ["SNIPER", 55],
                        ["AIRBORNE", 35],

                        // supporter
                        ["APC", 12],
                        ["FLARE", 10],
                        ["RECON", 12],
						["TRUCK", 22],

                        // tanks
                        ["FLAK", 5],
                        ["HOVERFLAK", 5],
                        ["LIGHT_TANK", 5],
                        ["HOVERCRAFT", 5],
                        ["MEDIUM_TANK", 3],
                        ["ZCOUNIT_TANK_HUNTER", 3],

                        // heavy tanks
                        ["HEAVY_HOVERCRAFT", 1],
                        ["HEAVY_TANK", 1],
                        ["NEOTANK", 1],

                        // very heavy tanks
                        ["MEGATANK", 1],
						["MBT", 1],
						
						["REPAIR_DRONE", 70],
						["RECON_DRONE", 75],
						
						["T_TRAIN", 1],
						["ARTY_TRAIN", 1],
						["ARMORED_TRAIN", 1],
						
						["SNIPER_TOWER", 70],
						["PILLBOX", 1],
						["MISSILE_DEF", 30],
						["ARTY_DEF", 37],

                        ["HOELLIUM", 20],

                        // heli copter
                        ["T_HELI", 30],
                        ["K_HELI", 1],
                        ["R_HELI", 7],

                        // ranged land units
                        ["ARTILLERY", 15],
                        ["ARTILLERYCRAFT", 15],
                        ["ANTITANKCANNON", 30],
                        ["MISSILE", 26],
                        ["ROCKETTHROWER", 25],
                        ["PIPERUNNER", 5],
                        ["MU_PIPEBIN", 5],
                        ["MU_LARGEMISSILE", 10],
                        ["MU_WEAPON_CONSTRUCTOR", 10],
                        ["MU_BACKTRACKCAR", 5],
                        ["MU_EMPOWER_TERRAIN_EDITOR", 55]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_INFANTRY_MG.damageTable, "WEAPON_INFANTRY_MG");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_INFANTRY_MG = new Constructor();
