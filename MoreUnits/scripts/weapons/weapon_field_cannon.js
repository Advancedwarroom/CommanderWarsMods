var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("Field Artillery Cannon");
    };
    this.getEnviromentDamage = function(enviromentId)
    {
        return 75;
    };
    this.damageTable = [["INFANTRY", 115],
                        ["MECH", 110],
                        ["MOTORBIKE", 120],
                        ["SNIPER", 105],
                        ["AIRBORNE", 95],
                        // supporter
                        ["APC", 90],
                        ["FLARE", 95],
                        ["RECON", 100],
						["TRUCK", 125],
                        // tanks
                        ["FLAK", 95],
                        ["HOVERFLAK", 90],
                        ["LIGHT_TANK", 90],
                        ["HOVERCRAFT", 85],
                        ["MEDIUM_TANK", 65],
                        ["ZCOUNIT_TANK_HUNTER", 75],
                        // heavy tanks
                        ["HEAVY_HOVERCRAFT", 45],
                        ["HEAVY_TANK", 45],
                        ["NEOTANK", 55],
                        // very heavy tanks
                        ["MEGATANK", 30],
						["MBT", 20],
                        // ranged land units
                        ["ARTILLERY", 100],
                        ["ARTILLERYCRAFT", 95],
                        ["ANTITANKCANNON", 95],
                        ["MISSILE", 110],
                        ["ROCKETTHROWER", 115],
                        ["PIPERUNNER", 100],
                        ["MU_PIPEBIN", 100],
                        ["HOELLIUM", 45],
						
						["REPAIR_DRONE", 375],
						
						["T_TRAIN", 80],
						["ARTY_TRAIN", 60],
						["ARMORED_TRAIN", 35],
						
						["SNIPER_TOWER", 130],
						["PILLBOX", 45],
						["MISSILE_DEF", 115],
						["ARTY_DEF", 120],
						
                        // ships
                        ["GUNBOAT", 95],
                        ["CANNONBOAT", 95],
                        ["BLACK_BOAT", 95],
                        ["TORPEDOBOAT", 105],
                        ["LANDER", 95],
                        ["FRIGATE", 95],
                        ["DESTROYER", 95],
                        ["CRUISER", 95],
                        ["SUBMARINE", 95],
						["NUCLEAR_SUBMARINE", 80],
                        ["BATTLECRUISER", 65],
                        ["BATTLESHIP", 50],
                        ["AIRCRAFTCARRIER", 60],
                        ["MU_LARGEMISSILE", 75],
                        ["MU_WEAPON_CONSTRUCTOR", 75],
                        ["MU_BACKTRACKCAR", 70],
                        ["MU_EMPOWER_TERRAIN_EDITOR", 115]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_FIELD_CANNON.damageTable, "WEAPON_FIELD_CANNON");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_FIELD_CANNON = new Constructor();
