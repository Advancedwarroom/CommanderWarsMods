var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("Heavy Artillery Cannon");
    };
    this.getEnviromentDamage = function(enviromentId)
    {
        return 55;
    };
    this.damageTable = [["INFANTRY", 95],
                        ["MECH", 90],
                        ["MOTORBIKE", 90],
                        ["SNIPER", 85],
                        ["AIRBORNE", 75],
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
                        ["ZCOUNIT_TANK_HUNTER", 60],
                        // heavy tanks
                        ["HEAVY_HOVERCRAFT", 40],
                        ["HEAVY_TANK", 40],
                        ["NEOTANK", 50],
                        // very heavy tanks
                        ["MEGATANK", 25],
						["MBT", 15],
						
						["T_TRAIN", 70],
						["ARTY_TRAIN", 55],
						["ARMORED_TRAIN", 30],
						
						["SNIPER_TOWER", 110],
						["PILLBOX", 40],
						["MISSILE_DEF", 100],
						["ARTY_DEF", 105],
						
						["REPAIR_DRONE", 200],
						
                        // ranged land units
                        ["ARTILLERY", 80],
                        ["ARTILLERYCRAFT", 80],
                        ["ANTITANKCANNON", 75],
                        ["MISSILE", 90],
                        ["ROCKETTHROWER", 85],
                        ["PIPERUNNER", 80],
                        ["MU_PIPEBIN", 80],
                        ["HOELLIUM", 20],
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
                        ["MU_EMPOWER_TERRAIN_EDITOR", 95]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_BATTLESHIP_CANNON.damageTable, "WEAPON_BATTLESHIP_CANNON");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_BATTLESHIP_CANNON = new Constructor();
