var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("Hypersonic Missile");
    };
    this.getEnviromentDamage = function(enviromentId)
    {
        return 100;
    };
    this.damageTable = [["INFANTRY", 300],
                        ["MECH", 300],
                        ["MOTORBIKE", 300],
                        ["SNIPER", 320],
                        ["AIRBORNE", 280],

                        // supporter
                        ["APC", 210],
                        ["FLARE", 200],
                        ["RECON", 305],
						["TRUCK", 410],

                        // tanks
                        ["FLAK", 200],
                        ["HOVERFLAK", 200],
                        ["LIGHT_TANK", 190],
                        ["HOVERCRAFT", 190],
                        ["MEDIUM_TANK", 160],

                        // heavy tanks
                        ["HEAVY_HOVERCRAFT", 140],
                        ["HEAVY_TANK", 140],
                        ["NEOTANK", 130],

                        // very heavy tanks
                        ["MEGATANK", 110],
						["MBT", 95],

                        ["HOELLIUM", 500],
						
						["REPAIR_DRONE", 1050],
						
						["T_TRAIN", 180],
						["ARTY_TRAIN", 160],
						["ARMORED_TRAIN", 135],
						
						["SNIPER_TOWER", 420],
						["PILLBOX", 130],
						["MISSILE_DEF", 250],
						["ARTY_DEF", 265],

                        // ranged land units
                        ["ARTILLERY", 225],
                        ["ARTILLERYCRAFT", 230],
                        ["ANTITANKCANNON", 310],
                        ["MISSILE", 230],
                        ["ROCKETTHROWER", 250],
                        ["PIPERUNNER", 200],
                        ["MU_PIPEBIN", 200],
                        // ships
                        ["GUNBOAT", 300],
                        ["CANNONBOAT", 300],
                        ["BLACK_BOAT", 290],
                        ["TORPEDOBOAT", 310],
                        ["LANDER", 250],
                        ["FRIGATE", 230],
                        ["DESTROYER", 200],
                        ["CRUISER", 180],
                        ["BATTLECRUISER", 120],
                        ["BATTLESHIP", 90],
						["NUCLEAR_SUBMARINE", 30],
						["SUBMARINE", 70],
                        ["AIRCRAFTCARRIER", 70],
                        ["MU_LARGEMISSILE", 85],
                        ["MU_WEAPON_CONSTRUCTOR", 85],
                        ["MU_BACKTRACKCAR", 80],
                        ["MU_EMPOWER_TERRAIN_EDITOR", 300]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_HYPERSONIC_MISSILE.damageTable, "WEAPON_HYPERSONIC_MISSILE");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_HYPERSONIC_MISSILE = new Constructor();
