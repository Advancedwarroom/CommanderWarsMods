var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("ARH Missile");
    };
    this.damageTable = [["DUSTER", 110],
                        ["FIGHTER", 50],
						["DRONE", 120],
						["STRIKER", 40],
						["INTERCEPTOR", 80],
						["SEAD", 50],
                        ["BOMBER", 90],
                        ["STEALTHBOMBER", 75],
                        ["TRANSPORTPLANE", 110],
                        ["BLACK_BOMB", 130],
                        ["WATERPLANE", 75],
						["ZCOUNIT_KIROV", 135],
                        
                        ["R_HELI", 110],
                        ["K_HELI", 95],
                        ["T_HELI", 130],
                        ["MU_LARGEMISSILE", 0],
                        ["MU_WEAPON_CONSTRUCTOR", 0],
                        ["MU_PIPEBIN", 0],
                        ["MU_BACKTRACKCAR", 0]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_FOX3_MISSILE.damageTable, "WEAPON_FOX3_MISSILE");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_FOX3_MISSILE = new Constructor();
