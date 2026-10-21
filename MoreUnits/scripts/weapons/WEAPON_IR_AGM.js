var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("AGM + AAM");
    };
    this.getEnviromentDamage = function(enviromentId)
    {
        return 45;
    };
    this.damageTable = [["DUSTER", 30],
                        ["FIGHTER", 10],
						["SEAD", 10],
                        ["BOMBER", 20],
                        ["STEALTHBOMBER", 20],
                        ["TRANSPORTPLANE", 20],
                        ["BLACK_BOMB", 50],
                        ["WATERPLANE", 10],
						["AWACS", 10],
												["DRONES", 50],
												["GUNSHIP", 5],
												["INTERCEPTOR", 20],
												["MULTI_ROLE", 15],
												["SEAD", 5],
												["STEALTH_BOMBER", 8],
												["STRIKER", 8],
												["SUICIDE DRONE", 75],
												["KIROV", 60],			
												
												["SNIPER_TOWER", 110],
												["PILLBOX", 15],
												["MISSILE_DEF", 100],
												["ARTY_DEF", 105],			
                        
                        ["R_HELI", 30],
                        ["K_HELI", 15],
                        ["T_HELI", 40],
						["ASM_HELI", 25],
												["AT_HELI", 20],
												["S_HELI", 40],
												["STEALTH_ATTACK_COPTER", 20],
												["STEALTH_COPTER", 32],
												["TAC_HELI", 35],
                        
						["INFANTRY", 95],
                        ["MECH", 90],
                        ["MOTORBIKE", 90],
                        ["SNIPER", 85],
                        ["AIRBORNE", 70],
						["AA_INFANTRY", 92],
												["MORTAR", 100],
												["SUPPORT", 80],
												["AT_SNIPER", 75],
												["ZCOUNIT_AT_CYCLE", 95],
												["ZCOUNIT_COMMANDO", 75],
												["ZCOUNIT_PARTISAN", 90],
                        
						["APC", 80],
                        ["FLARE", 85],
                        ["RECON", 85],
                        ["FLAK", 80],
                        ["HOVERFLAK", 75],
                        ["LIGHT_TANK", 80],
                        ["HOVERCRAFT", 80],
						["GCS", 90],
												["HEAVY_APC", 75],
												["MOBILECOMMAND", 80],
												["RADAR_UNIT", 92],
												["RCV", 70],
												["SUPPLY_TRUCK", 110],
												["TRUCK", 100],
												["ZCOUNIT_LOGIC_TRUCK", 105],
                        
                        ["HEAVY_HOVERCRAFT", 40],
                        ["HEAVY_TANK", 40],
                        ["MEDIUM_TANK", 50],
                        ["NEOTANK", 30],
                        ["MEGATANK", 10],
						["ENGINEER_TANK", 55],
												["IFV", 70],
												["MBT", 5],
												["ZCOUNIT_TANK_HUNTER", 70],
												
												["T_TRAIN", 70],
												["ARTY_TRAIN", 50],
												["ARMORED_TRAIN", 25],
												
												["REPAIR_DRONE", 195],
												["RECON_DRONE", 200],
						
                        ["ARTILLERY", 85],
                        ["ARTILLERYCRAFT", 85],
                        ["ANTITANKCANNON", 65],
                        ["MISSILE", 90],
                        ["ROCKETTHROWER", 90],
                        ["PIPERUNNER", 80],
                        ["MU_PIPEBIN", 80],
						["MISSILE_LAUNCHER", 80],
												["SPMS", 90],
												["ZCOUNIT_SIEGE_CANNON", 70],
												["ASHM", 78],
																		["BMDS", 85],
																		["SPAAGM", 82],
																		
																		["ANTITANKMISSILE", 88],
																								["ZCOUNIT_SMUGGLER", 95],
                        ["HOELLIUM", 10],
                        // ships
                        ["GUNBOAT", 50],
                        ["CANNONBOAT", 50],
                        ["BLACK_BOAT", 50],
                        ["TORPEDOBOAT", 50],
                        ["LANDER", 30],
                        ["FRIGATE", 20],
                        ["DESTROYER", 20],
                        ["CRUISER", 10],
                        ["SUBMARINE", 5],
                        ["BATTLECRUISER", 5],
                        ["BATTLESHIP", 5],
						["MINESWEEPER", 55],
												["SUPPLY_SHIP", 45],
												["ASS", 2],
																		["ASM", 18],
																		["CORVETTE", 15],
																		["ESCORT_VESSEL", 25],
																		["MONITOR", 40],
                        ["AIRCRAFTCARRIER", 5],
                        ["MU_LARGEMISSILE", 85],
                        ["MU_WEAPON_CONSTRUCTOR", 85],
                        ["MU_BACKTRACKCAR", 80],
                        ["MU_EMPOWER_TERRAIN_EDITOR", 95]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_IR_AGM.damageTable, "WEAPON_IR_AGM");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_IR_AGM = new Constructor();
