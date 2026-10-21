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
    this.damageTable = [["INFANTRY", 150],
                        ["MECH", 110],
                        ["MOTORBIKE", 110],
                        ["SNIPER", 110],
                        ["AIRBORNE", 100],

                        // supporter
                        ["APC", 45],
                        ["FLARE", 35],
                        ["RECON", 40],
						["TRUCK", 60],

                        // tanks
                        ["FLAK", 8],
                        ["HOVERFLAK", 8],
                        ["LIGHT_TANK", 8],
                        ["HOVERCRAFT", 8],
						
						["REPAIR_DRONE", 175],
						["RECON_DRONE", 145],

                        // heavy tanks
                        ["HEAVY_HOVERCRAFT", 5],
                        ["HEAVY_TANK", 5],
						["MEDIUM_TANK", 5],
                        ["NEOTANK", 5],

                        // very heavy tanks
                        ["MEGATANK", 1],
						["MBT", 1],

                        ["HOELLIUM", 20],
						
						["T_TRAIN", 1],
						["ARTY_TRAIN", 1],
						["ARMORED_TRAIN", 1],
						
						["SNIPER_TOWER", 140],
						["PILLBOX", 1],
						["MISSILE_DEF", 70],
						["ARTY_DEF", 80],

                        // heli copter
                        ["T_HELI", 40],
                        ["K_HELI", 10],
                        ["R_HELI", 25],

                        // ranged land units
                        ["ARTILLERY", 45],
                        ["ARTILLERYCRAFT", 45],
                        ["ANTITANKCANNON", 1],
                        ["MISSILE", 60],
                        ["ROCKETTHROWER", 60],
                        ["PIPERUNNER", 8],
                        ["MU_PIPEBIN", 8],
                        ["MU_LARGEMISSILE", 15],
                        ["MU_WEAPON_CONSTRUCTOR", 15],
                        ["MU_BACKTRACKCAR", 10],
                        ["MU_EMPOWER_TERRAIN_EDITOR", 150]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_HEAVY_TANK_MG.damageTable, "WEAPON_HEAVY_TANK_MG");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_HEAVY_TANK_MG = new Constructor();
