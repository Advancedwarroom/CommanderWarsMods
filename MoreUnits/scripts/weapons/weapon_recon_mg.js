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
    this.damageTable = [["INFANTRY", 70],
                        ["MECH", 65],
                        ["MOTORBIKE", 65],
                        ["SNIPER", 65],
                        ["AIRBORNE", 55],

                        // supporter
                        ["APC", 45],
                        ["FLARE", 30],
                        ["RECON", 35],
						["TRUCK", 55],

                        // tanks
                        ["FLAK", 4],
                        ["HOVERFLAK", 4],
                        ["LIGHT_TANK", 6],
                        ["HOVERCRAFT", 6],
                        ["MEDIUM_TANK", 1],
                        ["ZCOUNIT_TANK_HUNTER", 3],

                        // heavy tanks
                        ["HEAVY_HOVERCRAFT", 1],
                        ["HEAVY_TANK", 1],
                        ["NEOTANK", 1],

                        // very heavy tanks
                        ["MEGATANK", 1],
						["MBT", 1],
						
						["REPAIR_DRONE", 100],
						["RECON_DRONE", 105],
						
						["T_TRAIN", 1],
						["ARTY_TRAIN", 1],
						["ARMORED_TRAIN", 1],
						
						["SNIPER_TOWER", 85],
						["PILLBOX", 1],
						["MISSILE_DEF", 35],
						["ARTY_DEF", 40],

                        ["HOELLIUM", 20],

                        // heli copter
                        ["T_HELI", 35],
                        ["K_HELI", 3],
                        ["R_HELI", 12],

                        // ranged land units
                        ["ARTILLERY", 45],
                        ["ARTILLERYCRAFT", 45],
                        ["ANTITANKCANNON", 25],
                        ["MISSILE", 28],
                        ["ROCKETTHROWER", 55],
                        ["PIPERUNNER", 6],
                        ["MU_PIPEBIN", 6],
                        ["MU_LARGEMISSILE", 10],
                        ["MU_WEAPON_CONSTRUCTOR", 10],
                        ["MU_BACKTRACKCAR", 5],
                        ["MU_EMPOWER_TERRAIN_EDITOR", 70]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_RECON_MG.damageTable, "WEAPON_RECON_MG");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_RECON_MG = new Constructor();
