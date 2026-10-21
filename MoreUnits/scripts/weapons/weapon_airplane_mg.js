var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("20mm Heavy Machine Gun");
    };
    this.getEnviromentDamage = function(enviromentId)
    {
        return 1;
    };
    this.damageTable = [["INFANTRY", 75],
                        ["MECH", 45],
                        ["MOTORBIKE", 40],
                        ["SNIPER", 35],
                        ["AIRBORNE", 30],
                        // supporter
                        ["APC", 15],
                        ["FLARE", 15],
                        ["RECON", 18],
						["TRUCK", 25],
                        // tanks
                        ["FLAK", 5],
                        ["HOVERFLAK", 5],
                        ["LIGHT_TANK", 8],
                        ["HOVERCRAFT", 8],
                        // heavy tanks
                        ["HEAVY_HOVERCRAFT", 3],
                        ["HEAVY_TANK", 3],
                        ["NEOTANK", 3],
                        ["MEDIUM_TANK", 3],
                        ["ZCOUNIT_TANK_HUNTER", 3],                        
                        // very heavy tanks
                        ["MEGATANK", 1],
						["MBT", 1],
                        ["HOELLIUM", 20],
                        // ranged land units
                        ["ARTILLERY", 15],
                        ["ARTILLERYCRAFT", 15],
                        ["ANTITANKCANNON", 25],
                        ["MISSILE", 20],
                        ["ROCKETTHROWER", 20],
                        ["PIPERUNNER", 6],
                        ["MU_PIPEBIN", 6],
						
						["T_TRAIN", 1],
						["ARTY_TRAIN", 1],
						["ARMORED_TRAIN", 1],
						
						["SNIPER_TOWER", 55],
						["PILLBOX", 1],
						["MISSILE_DEF", 45],
						["ARTY_DEF", 50],
						
                        // air
                        ["DUSTER", 55],
						["DRONE", 70],
						
						["REPAIR_DRONE", 110],

						["ZCOUNIT_KIROV", 20],
                        
                        ["R_HELI", 85],                        
                        ["K_HELI", 65],
                        ["T_HELI", 95],
                        ["MU_LARGEMISSILE", 10],
                        ["MU_WEAPON_CONSTRUCTOR", 10],
                        ["MU_BACKTRACKCAR", 5],
                        ["MU_EMPOWER_TERRAIN_EDITOR", 75]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_AIRPLANE_MG.damageTable, "WEAPON_AIRPLANE_MG");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_AIRPLANE_MG = new Constructor();
