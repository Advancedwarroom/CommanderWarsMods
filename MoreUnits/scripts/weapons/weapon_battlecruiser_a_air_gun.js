var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("Anti Air Machine Guns");
    };
    this.damageTable = [["DUSTER", 70],
                        ["FIGHTER", 50],
						["DRONE", 80],
						["STRIKER", 35],
						["INTERCEPTOR", 60],
						["SEAD", 40],
                        ["BOMBER", 65],
                        ["ZCOUNIT_KIROV", 20],
                        ["STEALTHBOMBER", 65],
                        ["TRANSPORTPLANE", 65],
                        ["BLACK_BOMB", 105],
                        ["WATERPLANE", 65],
						
						["RECON_DRONE", 160],
						
						["ZCOUNIT_KIROV", 75],
						
						["RECON_DRONE", 220],
						
                        ["R_HELI", 105],
                        ["K_HELI", 90],
                        ["T_HELI", 105],
                        ["MU_LARGEMISSILE", 70],
                        ["MU_WEAPON_CONSTRUCTOR", 70],
                        ["MU_PIPEBIN", 0],
                        ["MU_BACKTRACKCAR", 65]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_BATTLECRUISER_A_AIR_GUN.damageTable, "WEAPON_BATTLECRUISER_A_AIR_GUN");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_BATTLECRUISER_A_AIR_GUN = new Constructor();
