Constructor = function()
{
    this.getName = function()
    {
        return qsTr("Artillery Cannon");
    };
    this.getEnviromentDamage = function(enviromentId)
    {
        return 45;
    };
    this.damageTable = [["INFANTRY", 90],
                        ["MECH", 85],
                        ["MOTORBIKE", 85],
                        ["SNIPER", 85],
                        ["AIRBORNE", 80],

                        // supporter
                        ["APC", 70],
                        ["FLARE", 75],
                        ["RECON", 75],
						["TRUCK", 95],

                        // tanks
                        ["FLAK", 75],
                        ["HOVERFLAK", 75],
                        ["LIGHT_TANK", 70],
                        ["HOVERCRAFT", 70],
                        ["MEDIUM_TANK", 45],

                        // heavy tanks
                        ["HEAVY_HOVERCRAFT", 35],
                        ["HEAVY_TANK", 35],
                        ["NEOTANK", 30],

                        // very heavy tanks
                        ["MEGATANK", 15],
						["MBT", 8],

                        // ranged land units
                        ["ARTILLERY", 75],
                        ["ARTILLERYCRAFT", 75],
                        ["ANTITANKCANNON", 55],
                        ["MISSILE", 80],
                        ["ROCKETTHROWER", 80],
                        ["PIPERUNNER", 70],
                        ["MU_PIPEBIN", 70],
						
						["T_TRAIN", 60],
						["ARTY_TRAIN", 40],
						["ARMORED_TRAIN", 15],
						
						["SNIPER_TOWER", 105],
						["PILLBOX", 20],
						["MISSILE_DEF", 90],
						["ARTY_DEF", 100],
						
						["REPAIR_DRONE", 165],

                        ["HOELLIUM", 5],
                        // ships
                        ["GUNBOAT", 55],
                        ["CANNONBOAT", 55],
                        ["BLACK_BOAT", 55],
                        ["TORPEDOBOAT", 100],
                        ["LANDER", 55],
                        ["FRIGATE", 65],
                        ["DESTROYER", 65],
                        ["CRUISER", 65],
                        ["SUBMARINE", 60],
						["NUCLEAR_SUBMARINE", 45],
                        ["BATTLECRUISER", 45],
                        ["BATTLESHIP", 40],
                        ["AIRCRAFTCARRIER", 45],
                        ["MU_LARGEMISSILE", 75],
                        ["MU_WEAPON_CONSTRUCTOR", 75],
                        ["MU_BACKTRACKCAR", 70],
                        ["MU_EMPOWER_TERRAIN_EDITOR", 90]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_CANNON.damageTable, "WEAPON_CANNON");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_CANNON = new Constructor();
