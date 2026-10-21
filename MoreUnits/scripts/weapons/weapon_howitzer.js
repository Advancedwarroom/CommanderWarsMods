Constructor = function()
{
    this.getName = function()
    {
        return qsTr("Howitzer Cannon");
    };
    this.getEnviromentDamage = function(enviromentId)
    {
        return 45;
    };
    this.damageTable = [["INFANTRY", 110],
                        ["MECH", 105],
                        ["MOTORBIKE", 105],
                        ["SNIPER", 100],
                        ["AIRBORNE", 95],

                        // supporter
                        ["APC", 90],
                        ["FLARE", 100],
                        ["RECON", 105],
						["TRUCK", 125],

                        // tanks
                        ["FLAK", 95],
                        ["HOVERFLAK", 95],
                        ["LIGHT_TANK", 90],
                        ["HOVERCRAFT", 90],
                        ["MEDIUM_TANK", 70],

                        // heavy tanks
                        ["HEAVY_HOVERCRAFT", 70],
                        ["HEAVY_TANK", 55],
                        ["NEOTANK", 50],

                        // very heavy tanks
                        ["MEGATANK", 35],
						["MBT", 25],
						
						["T_TRAIN", 80],
						["ARTY_TRAIN", 60],
						["ARMORED_TRAIN", 35],

                        // ranged land units
                        ["ARTILLERY", 95],
                        ["ARTILLERYCRAFT", 95],
                        ["ANTITANKCANNON", 75],
                        ["MISSILE", 100],
                        ["ROCKETTHROWER", 105],
                        ["PIPERUNNER", 90],
                        ["MU_PIPEBIN", 90],
						
						["REPAIR_DRONE", 200],
						["RECON_DRONE", 325],
						
						["SNIPER_TOWER", 130],
						["PILLBOX", 40],
						["MISSILE_DEF", 110],
						["ARTY_DEF", 120],
                        
                        ["T_HELI", 75],
                        ["R_HELI", 65],
                        ["K_HELI", 50],
						
						["DUSTER", 35],

                        ["HOELLIUM", 30],
                        // ships
                        ["GUNBOAT", 80],
                        ["CANNONBOAT", 75],
                        ["BLACK_BOAT", 70],
                        ["TORPEDOBOAT", 90],
                        ["LANDER", 70],
                        ["FRIGATE", 75],
                        ["DESTROYER", 75],
                        ["CRUISER", 75],
                        ["SUBMARINE", 40],
						["NUCLEAR_SUBMARINE", 25],
                        ["BATTLECRUISER", 55],
                        ["BATTLESHIP", 50],
                        ["AIRCRAFTCARRIER", 45],
                        ["MU_LARGEMISSILE", 75],
                        ["MU_WEAPON_CONSTRUCTOR", 75],
                        ["MU_BACKTRACKCAR", 70],
                        ["MU_EMPOWER_TERRAIN_EDITOR", 110]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_HOWITZER.damageTable, "WEAPON_HOWITZER");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_HOWITZER = new Constructor();
