var Constructor = function()
{
    this.damageTable = [["DUSTER", 100],
                        ["FIGHTER", 75],
						["DRONE", 95],
						["STRIKER", 65],
						["INTERCEPTOR", 80],
						["SEAD", 65],
                        ["BOMBER", 85],
                        ["BLACK_BOMB", 125],
                        ["STEALTHBOMBER", 100],
                        ["TRANSPORTPLANE", 85],
                        ["WATERPLANE", 100],
						["ZCOUNIT_KIROV", 110],
						
						["RECON_DRONE", 145],
						
                        ["R_HELI", 115],
                        ["K_HELI", 95],
                        ["T_HELI", 120],
                        ["MU_LARGEMISSILE", 55],
                        ["MU_WEAPON_CONSTRUCTOR", 55],
                        ["MU_PIPEBIN", 0],
                        ["MU_BACKTRACKCAR", 50]];

    this.getName = function()
    {
        return qsTr("Autocannon");
    };
    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_A_AIR_GUN.damageTable, "WEAPON_A_AIR_GUN");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_A_AIR_GUN = new Constructor();
