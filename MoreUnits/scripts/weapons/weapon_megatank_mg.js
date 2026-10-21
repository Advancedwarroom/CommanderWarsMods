var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("Super Heavy Machine Gun");
    };
    this.getEnviromentDamage = function(enviromentId)
    {
        return 1;
    };
    this.damageTable = [["INFANTRY", 135],
                        ["MECH", 125],
                        ["MOTORBIKE", 110],
                        ["SNIPER", 110],
                        ["AIRBORNE", 100],

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
                        ["ZCOUNIT_TANK_HUNTER", 7],

                        // heavy tanks
                        ["HEAVY_HOVERCRAFT", 1],
                        ["HEAVY_TANK", 1],
                        ["NEOTANK", 1],
						
						["REPAIR_DRONE", 175],
						["RECON_DRONE", 190],
						
						["SNIPER_TOWER", 135],
						["PILLBOX", 1],
						["MISSILE_DEF", 65],
						["ARTY_DEF", 75],
						
						["T_TRAIN", 1],
						["ARTY_TRAIN", 1],
						["ARMORED_TRAIN", 1],

                        // very heavy tanks
                        ["MEGATANK", 1],
						["MBT", 1],

                        ["HOELLIUM", 20],

                        // heli copter
                        ["T_HELI", 55],
                        ["K_HELI", 5],
                        ["R_HELI", 22],

                        // ranged land units
                        ["ARTILLERY", 65],
                        ["ARTILLERYCRAFT", 65],
                        ["ANTITANKCANNON", 1],
                        ["MISSILE", 55],
                        ["ROCKETTHROWER", 75],
                        ["PIPERUNNER", 10],
                        ["MU_PIPEBIN", 10],
                        ["MU_LARGEMISSILE", 15],
                        ["MU_WEAPON_CONSTRUCTOR", 15],
                        ["MU_BACKTRACKCAR", 10],
                        ["MU_EMPOWER_TERRAIN_EDITOR", 135]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_MEGATANK_MG.damageTable, "WEAPON_MEGATANK_MG");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_MEGATANK_MG = new Constructor();
