var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("Neo Machine Gun");
    };
    this.getEnviromentDamage = function(enviromentId)
    {
        return 1;
    };
    this.damageTable = [["INFANTRY", 125],
                        ["MECH", 115],
                        ["MOTORBIKE", 110],
                        ["SNIPER", 110],
                        ["AIRBORNE", 105],

                        // supporter
                        ["APC", 65],
                        ["FLARE", 65],
                        ["RECON", 65],
						["TRUCK", 85],

                        // tanks
                        ["FLAK", 17],
                        ["HOVERFLAK", 17],
                        ["LIGHT_TANK", 10],
                        ["HOVERCRAFT", 10],
                        ["MEDIUM_TANK", 5],

                        // heavy tanks
                        ["HEAVY_HOVERCRAFT", 1],
                        ["HEAVY_TANK", 1],
                        ["MEDIUM_TANK", 1],
                        ["NEOTANK", 1],
						["MBT", 1],
						
						["REPAIR_DRONE", 165],
						["RECON_DRONE", 145],
						
						["SNIPER_TOWER", 145],
						["PILLBOX", 1],
						["MISSILE_DEF", 65],
						["ARTY_DEF", 75],
						
						["T_TRAIN", 1],
						["ARTY_TRAIN", 1],
						["ARMORED_TRAIN", 1],

                        // very heavy tanks
                        ["MEGATANK", 1],

                        ["HOELLIUM", 20],

                        // heli copter
                        ["T_HELI", 55],
                        ["K_HELI", 5],
                        ["R_HELI", 22],

                        // ranged land units
                        ["ARTILLERY", 65],
                        ["ARTILLERYCRAFT", 65],
                        ["ANTITANKCANNON", 10],
                        ["MISSILE", 55],
                        ["ROCKETTHROWER", 75],
                        ["PIPERUNNER", 10],
                        ["MU_PIPEBIN", 10],
                        ["MU_LARGEMISSILE", 15],
                        ["MU_WEAPON_CONSTRUCTOR", 15],
                        ["MU_BACKTRACKCAR", 10],
                        ["MU_EMPOWER_TERRAIN_EDITOR", 125]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_NEOTANK_MG.damageTable, "WEAPON_NEOTANK_MG");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_NEOTANK_MG = new Constructor();
