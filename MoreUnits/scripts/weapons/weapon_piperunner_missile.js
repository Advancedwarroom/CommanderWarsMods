var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("Heavy Auto Cannon");
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
						["MBT", 10],
						
						["REPAIR_DRONE", 150],
						["RECON_DRONE", 170],
						
						["T_TRAIN", 70],
						["ARTY_TRAIN", 50],
						["ARMORED_TRAIN", 25],
						
						["SNIPER_TOWER", 120],
						["PILLBOX", 30],
						["MISSILE_DEF", 110],
						["ARTY_DEF", 115],

                        ["HOELLIUM", 15],

                        // heli copter
                        ["T_HELI", 110],
                        ["K_HELI", 90],
                        ["R_HELI", 105],

                        //air
                        ["DUSTER", 75],
                        ["FIGHTER", 65],
						["DRONE", 95],
						["STRIKER", 50],
                        ["BOMBER", 75],
                        ["STEALTHBOMBER", 75],
                        ["TRANSPORTPLANE", 75],
                        ["BLACK_BOMB", 120],
                        ["WATERPLANE", 75],

                        // ranged land units
                        ["ARTILLERY", 80],
                        ["ARTILLERYCRAFT", 80],
                        ["ANTITANKCANNON", 55],
                        ["MISSILE", 90],
                        ["ROCKETTHROWER", 85],
                        ["PIPERUNNER", 80],
                        ["MU_PIPEBIN", 80],
                        // ships
                        ["GUNBOAT", 60],
                        ["CANNONBOAT", 60],
                        ["BLACK_BOAT", 60],
                        ["TORPEDOBOAT", 75],
                        ["LANDER", 60],
                        ["FRIGATE", 90],
                        ["DESTROYER", 90],
                        ["CRUISER", 85],
                        ["SUBMARINE", 85],
						["NUCLEAR_SUBMARINE", 70],
                        ["BATTLECRUISER", 65],
                        ["BATTLESHIP", 55],
                        ["AIRCRAFTCARRIER", 60],
                        ["MU_LARGEMISSILE", 75],
                        ["MU_WEAPON_CONSTRUCTOR", 75],
                        ["MU_BACKTRACKCAR", 70],
                        ["MU_EMPOWER_TERRAIN_EDITOR", 95]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_PIPERUNNER_MISSILE.damageTable, "WEAPON_PIPERUNNER_MISSILE");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_PIPERUNNER_MISSILE = new Constructor();
