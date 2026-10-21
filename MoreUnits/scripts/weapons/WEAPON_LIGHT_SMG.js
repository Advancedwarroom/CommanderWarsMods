var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("Submachine Gun");
    };
    this.getEnviromentDamage = function(enviromentId)
    {
        return 1;
    };
    this.damageTable = [["INFANTRY", 50],
                        ["MECH", 40],
                        ["MOTORBIKE", 35],
                        ["SNIPER", 55],
                        ["AIRBORNE", 25],

                        // supporter
                        ["APC", 3],
                        ["FLARE", 3],
                        ["RECON", 5],
						["TRUCK", 10],

                        // tanks
                        ["FLAK", 1],
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

                        ["HOELLIUM", 8],
						
						["REPAIR_DRONE", 60],
						["RECON_DRONE", 65],
						
						["T_TRAIN", 1],
						["ARTY_TRAIN", 1],
						["ARMORED_TRAIN", 1],
						
						["SNIPER_TOWER", 75],
						["PILLBOX", 1],
						["MISSILE_DEF", 20],
						["ARTY_DEF", 25],

                        // heli copter
                        ["T_HELI", 15],
                        ["K_HELI", 1],
                        ["R_HELI", 1],

                        // ranged land units
                        ["ARTILLERY", 8],
                        ["ARTILLERYCRAFT", 8],
                        ["ANTITANKCANNON", 20],
                        ["MISSILE", 10],
                        ["ROCKETTHROWER", 12],
                        ["PIPERUNNER", 1],
                        ["MU_PIPEBIN", 1],
                        ["MU_LARGEMISSILE", 10],
                        ["MU_WEAPON_CONSTRUCTOR", 10],
                        ["MU_BACKTRACKCAR", 5],
                        ["MU_EMPOWER_TERRAIN_EDITOR", 50]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_LIGHT_SMG.damageTable, "WEAPON_LIGHT_SMG");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_LIGHT_SMG = new Constructor();
