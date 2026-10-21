var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("SARH Missile");
    };
    this.damageTable = [["DUSTER", 120],
                        ["FIGHTER", 55],
						["STRIKER", 45],
						["DRONE", 145],
						["INTERCEPTOR", 85],
						["SEAD", 55],
                        ["BOMBER", 100],
                        ["STEALTHBOMBER", 85],
                        ["TRANSPORTPLANE", 125],
                        ["BLACK_BOMB", 150],
                        ["WATERPLANE", 85],
						["ZCOUNIT_KIROV", 150],
                        
                        ["R_HELI", 120],
                        ["K_HELI", 105],
                        ["T_HELI", 140],
                        ["MU_LARGEMISSILE", 0],
                        ["MU_WEAPON_CONSTRUCTOR", 0],
                        ["MU_PIPEBIN", 0],
                        ["MU_BACKTRACKCAR", 0]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_AIR_TO_AIR_MISSILE.damageTable, "WEAPON_AIR_TO_AIR_MISSILE");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_AIR_TO_AIR_MISSILE = new Constructor();
