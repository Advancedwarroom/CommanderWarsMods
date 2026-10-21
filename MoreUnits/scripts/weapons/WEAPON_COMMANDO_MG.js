var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("Battle Rifle + Grenade Launcher");
    };
    this.getEnviromentDamage = function(enviromentId)
    {
        return 15;
    };
    this.damageTable = [["INFANTRY", 105],
                        ["MECH", 95],
                        ["MOTORBIKE", 90],
                        ["SNIPER", 115],
						["AIRBORNE", 60],

                        ["APC", 14],
                        ["FLARE", 20],
						["HOVERFLARE", 24],
                        ["RECON", 22],
						["TRUCK", 40],

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
						
						["REPAIR_DRONE", 125],
						["RECON_DRONE", 85],
						
						["SNIPER_TOWER", 140],
						["PILLBOX", 1],
						["MISSILE_DEF", 35],
						["ARTY_DEF", 45],

                        ["T_HELI", 23],
                        ["R_HELI", 10],
                        ["K_HELI", 2],
						

                        ["ARTILLERY", 14],
                        ["ANTITANKCANNON", 28],
                        ["MISSILE", 27],
                        ["ROCKETTHROWER", 27],
                        ["PIPERUNNER", 4],
                        ["MU_PIPEBIN", 4],
						
                        ["CANNONBOAT", 7],
                        ["LANDER", 6],
                        ["BLACK_BOAT", 4],
                        ["MU_LARGEMISSILE", 10],
                        ["MU_WEAPON_CONSTRUCTOR", 10],
                        ["MU_BACKTRACKCAR", 5],
                        ["MU_EMPOWER_TERRAIN_EDITOR", 105]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_COMMANDO_MG.damageTable, "WEAPON_COMMANDO_MG");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_COMMANDO_MG = new Constructor();
