var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("Medium Cannon");
    };
    this.getEnviromentDamage = function(enviromentId)
    {
        return 35;
    };
    this.damageTable = [["APC", 105],
                        ["FLARE", 85],
                        ["RECON", 105],
						["TRUCK", 125],

                        // tanks
                        ["FLAK", 105],
                        ["HOVERFLAK", 105],
                        ["LIGHT_TANK", 85],
                        ["HOVERCRAFT", 85],

                        // heavy tanks
                        ["HEAVY_HOVERCRAFT", 50],
                        ["HEAVY_TANK", 50],
                        ["MEDIUM_TANK", 55],
                        ["ZCOUNIT_TANK_HUNTER", 60],                       
                        ["NEOTANK", 45],

                        // very heavy tanks
                        ["MEGATANK", 25],
						["MBT", 18],
						
						["REPAIR_DRONE", 225],

                        ["HOELLIUM", 25],
						
						["T_TRAIN", 75],
						["ARTY_TRAIN", 55],
						["ARMORED_TRAIN", 30],
						
						["SNIPER_TOWER", 130],
						["PILLBOX", 30],
						["MISSILE_DEF", 115],
						["ARTY_DEF", 125],

                        // ranged land units
                        ["ARTILLERY", 105],
                        ["ARTILLERYCRAFT", 105],
                        ["ANTITANKCANNON", 35],
                        ["MISSILE", 105],
                        ["ROCKETTHROWER", 105],
                        ["PIPERUNNER", 85],
                        ["MU_PIPEBIN", 85],

                        // ships
                        ["GUNBOAT", 45],
                        ["CANNONBOAT", 45],
                        ["BLACK_BOAT", 35],
                        ["TORPEDOBOAT", 90],
                        ["LANDER", 35],
                        ["FRIGATE", 45],
                        ["DESTROYER", 45],
                        ["CRUISER", 45],
                        ["SUBMARINE", 10],
						["NUCLEAR_SUBMARINE", 1],
                        ["BATTLECRUISER", 20],
                        ["BATTLESHIP", 15],
                        ["AIRCRAFTCARRIER", 10],
                        ["MU_LARGEMISSILE", 65],
                        ["MU_WEAPON_CONSTRUCTOR", 65],
                        ["MU_BACKTRACKCAR", 60],
                        ["MU_EMPOWER_TERRAIN_EDITOR", 70]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_MEDIUM_TANK_GUN.damageTable, "WEAPON_MEDIUM_TANK_GUN");
    };
};
Constructor.prototype = WEAPON;
var WEAPON_MEDIUM_TANK_GUN = new Constructor();

if (settings.getMods().indexOf("mods/Commander_Wars_Bad_Days") > -1)
{
        WEAPON_MEDIUM_TANK_GUN .getName = function()
        {
            return qsTr("Medium Tank Gun");
        };
    	WEAPON_MEDIUM_TANK_GUN.damageTable.push(["NEOSPIDER_TANK", 35]);
	WEAPON_MEDIUM_TANK_GUN.damageTable.push(["BLACK_BOMBLOADER", 30]);
	WEAPON_MEDIUM_TANK_GUN.damageTable.push(["CONVOY", 140]);
	WEAPON_MEDIUM_TANK_GUN.damageTable.push(["SUPPLY_TRUCK", 185]);
	WEAPON_MEDIUM_TANK_GUN.damageTable.push(["SPIDER_TANK", 70]);
	WEAPON_MEDIUM_TANK_GUN.damageTable.push(["JAVELINS", 60]);
	WEAPON_MEDIUM_TANK_GUN.damageTable.push(["LIGHT_MG", 50]);
	WEAPON_MEDIUM_TANK_GUN.damageTable.push(["CQC", 60]);
	WEAPON_MEDIUM_TANK_GUN.damageTable.push(["BUNKER", 20]);
	WEAPON_MEDIUM_TANK_GUN.damageTable.push(["WATCH_TOWER", 45]);
	WEAPON_MEDIUM_TANK_GUN.damageTable.push(["LENSE", 105]);
	WEAPON_MEDIUM_TANK_GUN.damageTable.push(["INTELLIGENCE", 220]);
	WEAPON_MEDIUM_TANK_GUN.damageTable.push(["MONITOR", 55]);
	WEAPON_MEDIUM_TANK_GUN.damageTable.push(["CORVETTE", 35]);
	WEAPON_MEDIUM_TANK_GUN.damageTable.push(["MISSILELOADER", 75]);
	WEAPON_MEDIUM_TANK_GUN.damageTable.push(["HOVERTRANSPORT", 110]);
	WEAPON_MEDIUM_TANK_GUN.damageTable.push(["HOVERFLARE", 80]);
	WEAPON_MEDIUM_TANK_GUN.damageTable.push(["MEGACRAFT", 30]);
	WEAPON_MEDIUM_TANK_GUN.damageTable.push(["DESTROYER_ESCORT", 20]);
	WEAPON_MEDIUM_TANK_GUN.damageTable.push(["BASE_CANNON", 20]);
	WEAPON_MEDIUM_TANK_GUN.damageTable.push(["NAVY_GUN", 20]);
	WEAPON_MEDIUM_TANK_GUN.damageTable.push(["ATTACK_CAR", 130]);
	WEAPON_MEDIUM_TANK_GUN.damageTable.push(["TANK_DESTROYER", 70]);
	WEAPON_MEDIUM_TANK_GUN.damageTable.push(["ROWBOAT", 185]);
	WEAPON_MEDIUM_TANK_GUN.damageTable.push(["GIGATANK", 15]);
	WEAPON_MEDIUM_TANK_GUN.damageTable.push(["GAZILLION_TANK", 8]);
	WEAPON_MEDIUM_TANK_GUN.damageTable.push(["SIEGE_BATTLESHIP", 11]);
	WEAPON_MEDIUM_TANK_GUN.damageTable.push(["MASSIVE_HOELLIUM", 9]);
	WEAPON_MEDIUM_TANK_GUN.damageTable.push(["ANTI_AIR_BASE", 20]);
	WEAPON_MEDIUM_TANK_GUN.damageTable.push(["INFANTRY", 70]);
	WEAPON_MEDIUM_TANK_GUN.damageTable.push(["MECH", 60]);
	WEAPON_MEDIUM_TANK_GUN.damageTable.push(["SNIPER", 70]);
	WEAPON_MEDIUM_TANK_GUN.damageTable.push(["MOTORBIKE", 60]);
	WEAPON_MEDIUM_TANK_GUN.damageTable.push(["PARASITE", 110]);
};
