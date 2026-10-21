var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("Advanced SAM");
    };
    this.damageTable = [["DUSTER", 140],
                        ["FIGHTER", 120],
						["DRONE", 170],
						["STRIKER", 105],
						["INTERCEPTOR", 135],
                        ["BOMBER", 145],
                        ["STEALTHBOMBER", 130],
                        ["BLACK_BOMB", 180],
                        ["TRANSPORTPLANE", 150],
                        ["WATERPLANE", 110],
						
						["RECON_DRONE", 305],
						
						["ZCOUNIT_KIROV", 125],
						
                        ["R_HELI", 130],
                        ["K_HELI", 120],
                        ["T_HELI", 140],
                        ["MU_LARGEMISSILE", 0],
                        ["MU_WEAPON_CONSTRUCTOR", 0],
                        ["MU_PIPEBIN", 0],
                        ["MU_BACKTRACKCAR", 0]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_CARRIER_ANTI_AIR_MISSILE.damageTable, "WEAPON_CARRIER_ANTI_AIR_MISSILE");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_CARRIER_ANTI_AIR_MISSILE = new Constructor();
