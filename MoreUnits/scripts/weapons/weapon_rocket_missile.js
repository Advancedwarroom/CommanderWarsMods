var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("Rocket");
    };
    this.getEnviromentDamage = function(enviromentId)
    {
        return 55;
    };
    this.damageTable = [["INFANTRY", 95],
                        ["MECH", 90],
                        ["MOTORBIKE", 90],
                        ["SNIPER", 90],
                        ["AIRBORNE", 85],

                        // supporter
                        ["APC", 80],
                        ["FLARE", 85],
                        ["RECON", 90],
						["TRUCK", 115],

                        // tanks
                        ["FLAK", 85],
                        ["HOVERFLAK", 85],
                        ["LIGHT_TANK", 80],
                        ["HOVERCRAFT", 80],
                        ["MEDIUM_TANK", 55],

                        // heavy tanks
                        ["HEAVY_HOVERCRAFT", 40],
                        ["HEAVY_TANK", 40],
                        ["NEOTANK", 50],

                        // very heavy tanks
                        ["MEGATANK", 25],
						["MBT", 15],
						
						["REPAIR_DRONE", 275],

                        ["HOELLIUM", 15],
						
						["T_TRAIN", 70],
						["ARTY_TRAIN", 50],
						["ARMORED_TRAIN", 25],
						
						["SNIPER_TOWER", 115],
						["PILLBOX", 30],
						["MISSILE_DEF", 105],
						["ARTY_DEF", 110],

                        // ranged land units
                        ["ARTILLERY", 80],
                        ["ARTILLERYCRAFT", 80],
                        ["ANTITANKCANNON", 65],
                        ["MISSILE", 90],
                        ["ROCKETTHROWER", 85],
                        ["PIPERUNNER", 80],
                        ["MU_PIPEBIN", 80],
                        // ships
                        ["GUNBOAT", 85],
                        ["CANNONBOAT", 85],
                        ["BLACK_BOAT", 60],
                        ["TORPEDOBOAT", 80],
                        ["LANDER", 60],
                        ["FRIGATE", 95],
                        ["DESTROYER", 95],
                        ["CRUISER", 85],
                        ["SUBMARINE", 45],
						["NUCLEAR_SUBMARINE", 25],
                        ["BATTLECRUISER", 60],
                        ["BATTLESHIP", 55],
                        ["AIRCRAFTCARRIER", 60],
                        ["MU_LARGEMISSILE", 85],
                        ["MU_WEAPON_CONSTRUCTOR", 85],
                        ["MU_BACKTRACKCAR", 80],
                        ["MU_EMPOWER_TERRAIN_EDITOR", 95]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_ROCKET_MISSILE.damageTable, "WEAPON_ROCKET_MISSILE");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_ROCKET_MISSILE = new Constructor();
