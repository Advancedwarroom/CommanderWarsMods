var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("Thermobaric Nuclear Missile");
    };
    this.getEnviromentDamage = function(enviromentId)
    {
        return 100;
    };
    this.damageTable = [["INFANTRY", 1000],
                        ["MECH", 1000],
                        ["MOTORBIKE", 1000],
                        ["SNIPER", 1000],
                        ["AIRBORNE", 1000],

                        // supporter
                        ["APC", 500],
                        ["FLARE", 500],
                        ["RECON", 500],
						["TRUCK", 500],

                        // tanks
                        ["FLAK", 500],
                        ["HOVERFLAK", 500],
                        ["LIGHT_TANK", 500],
                        ["HOVERCRAFT", 500],
                        ["MEDIUM_TANK", 500],

                        // heavy tanks
                        ["HEAVY_HOVERCRAFT", 500],
                        ["HEAVY_TANK", 500],
                        ["NEOTANK", 500],

                        // very heavy tanks
                        ["MEGATANK", 500],
						["MBT", 500],

                        ["HOELLIUM", 500],
						
						["REPAIR_DRONE", 750],
						
						["T_TRAIN", 500],
						["ARTY_TRAIN", 500],
						["ARMORED_TRAIN", 500],
						
						["SNIPER_TOWER", 1000],
						["PILLBOX", 500],
						["MISSILE_DEF", 500],
						["ARTY_DEF", 500],

                        // ranged land units
                        ["ARTILLERY", 500],
                        ["ARTILLERYCRAFT", 500],
                        ["ANTITANKCANNON", 500],
                        ["MISSILE", 500],
                        ["ROCKETTHROWER", 500],
                        ["PIPERUNNER", 500],
                        ["MU_PIPEBIN", 500],
                        // ships
                        ["GUNBOAT", 500],
                        ["CANNONBOAT", 500],
                        ["BLACK_BOAT", 500],
                        ["TORPEDOBOAT", 500],
                        ["LANDER", 500],
                        ["FRIGATE", 500],
                        ["DESTROYER", 500],
                        ["CRUISER", 500],
                        ["BATTLECRUISER", 500],
                        ["BATTLESHIP", 500],
						["NUCLEAR_SUBMARINE", 500],
						["SUBMARINE", 500],
                        ["AIRCRAFTCARRIER", 500],
                        ["MU_LARGEMISSILE", 100],
                        ["MU_WEAPON_CONSTRUCTOR", 100],
                        ["MU_BACKTRACKCAR", 95],
                        ["MU_EMPOWER_TERRAIN_EDITOR", 1000]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_NUCLEAR_MISSILE.damageTable, "WEAPON_NUCLEAR_MISSILE");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_NUCLEAR_MISSILE = new Constructor();
