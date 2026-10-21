var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("Silenced Battle Rifle");
    };
    this.getEnviromentDamage = function(enviromentId)
    {
        return 3;
    };
    this.damageTable = [["INFANTRY", 115],
                        ["MECH", 105],
                        ["MOTORBIKE", 105],
                        ["SNIPER", 125],
						["AIRBORNE", 75],

                        ["APC", 14],
                        ["FLARE", 20],
						["HOVERFLARE", 24],
                        ["RECON", 22],
						["TRUCK", 35],

                        ["FLAK", 14],
                        ["HOVERFLAK", 18],
						["TANK_DESTROYER", 15],
                        ["LIGHT_TANK", 14],
                        ["HOVERCRAFT", 14],
                        ["MEDIUM_TANK", 10],

                        ["HEAVY_HOVERCRAFT", 9],
                        ["HEAVY_TANK", 6],
                        ["NEOTANK", 4],

                        ["MEGATANK", 4],
						["MBT", 1],
						["MEGACRAFT", 4],

                        ["HOELLIUM", 25],
						
						["REPAIR_DRONE", 200],
						["RECON_DRONE", 145],
						
						["T_TRAIN", 4],
						["ARTY_TRAIN", 1],
						["ARMORED_TRAIN", 1],
						
						["SNIPER_TOWER", 150],
						["PILLBOX", 7],
						["MISSILE_DEF", 35],
						["ARTY_DEF", 40],

                        ["T_HELI", 27],
                        ["R_HELI", 14],
                        ["K_HELI", 5],
						

                        ["ARTILLERY", 14],
                        ["ANTITANKCANNON", 28],
                        ["MISSILE", 27],
                        ["ROCKETTHROWER", 27],
                        ["PIPERUNNER", 4],
                        ["MU_PIPEBIN", 4],
						
                        ["CANNONBOAT", 9],
                        ["LANDER", 6],
                        ["BLACK_BOAT", 4],
                        ["MU_LARGEMISSILE", 10],
                        ["MU_WEAPON_CONSTRUCTOR", 10],
                        ["MU_BACKTRACKCAR", 5],
                        ["MU_EMPOWER_TERRAIN_EDITOR", 115]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_SMG.damageTable, "WEAPON_SMG");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_SMG = new Constructor();
