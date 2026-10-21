var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("Interceptor Missile");
    };
    this.damageTable = [["DUSTER", 150],
                        ["FIGHTER", 120],
						["DRONE", 190],
						["STRIKER", 105],
						["INTERCEPTOR", 140],
                        ["BOMBER", 130],
                        ["STEALTHBOMBER", 150],
                        ["TRANSPORTPLANE", 160],
                        ["WATERPLANE", 125],
                        ["BLACK_BOMB", 500],
						
						["RECON_DRONE", 510],
						
						["ZCOUNIT_KIROV", 180],
                        
                        ["R_HELI", 170],
                        ["K_HELI", 160],
                        ["T_HELI", 190],
                        ["MU_LARGEMISSILE", 0],
                        ["MU_WEAPON_CONSTRUCTOR", 0],
                        ["MU_PIPEBIN", 0],
                        ["MU_BACKTRACKCAR", 0]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_INTERCEPTOR_MISSILE.damageTable, "WEAPON_INTERCEPTOR_MISSILE");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_INTERCEPTOR_MISSILE = new Constructor();
