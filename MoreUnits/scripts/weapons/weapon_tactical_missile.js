var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("Tactical Missile");
    };
    this.getEnviromentDamage = function(enviromentId)
    {
        return 55;
    };
    this.damageTable = [["INFANTRY", 150],
                        ["MECH", 130],
                        ["MOTORBIKE", 120],
                        ["SNIPER", 110],
                        ["AIRBORNE", 105],

                        // supporter
                        ["APC", 110],
                        ["FLARE", 110],
                        ["RECON", 110],
						["TRUCK", 135],

                        // tanks
                        ["FLAK", 100],
                        ["HOVERFLAK", 100],
                        ["LIGHT_TANK", 95],
                        ["HOVERCRAFT", 95],
                        ["MEDIUM_TANK", 75],

                        // heavy tanks
                        ["HEAVY_HOVERCRAFT", 60],
                        ["HEAVY_TANK", 60],
                        ["NEOTANK", 55],

                        // very heavy tanks
                        ["MEGATANK", 45],
						["MBT", 38],
						
						["REPAIR_DRONE", 400],
						
						["SNIPER_TOWER", 140],
						["PILLBOX", 55],
						["MISSILE_DEF", 130],
						["ARTY_DEF", 135],
						
						["T_TRAIN", 85],
						["ARTY_TRAIN", 65],
						["ARMORED_TRAIN", 40],

                        ["HOELLIUM", 90],

                        // ranged land units
                        ["ARTILLERY", 110],
                        ["ARTILLERYCRAFT", 110],
                        ["ANTITANKCANNON", 100],
                        ["MISSILE", 120],
                        ["ROCKETTHROWER", 110],
                        ["PIPERUNNER", 95],
                        ["MU_PIPEBIN", 95],
                        // ships
                        ["GUNBOAT", 120],
                        ["CANNONBOAT", 115],
                        ["BLACK_BOAT", 110],
                        ["TORPEDOBOAT", 112],
                        ["LANDER", 80],
                        ["FRIGATE", 70],
                        ["DESTROYER", 75],
                        ["CRUISER", 60],
                        ["SUBMARINE", 20],
                        ["BATTLECRUISER", 45],
                        ["BATTLESHIP", 40],
                        ["AIRCRAFTCARRIER", 30],
                        ["MU_LARGEMISSILE", 85],
                        ["MU_WEAPON_CONSTRUCTOR", 85],
                        ["MU_BACKTRACKCAR", 80],
                        ["MU_EMPOWER_TERRAIN_EDITOR", 150]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_TACTICAL_MISSILE.damageTable, "WEAPON_TACTICAL_MISSILE");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_TACTICAL_MISSILE = new Constructor();
