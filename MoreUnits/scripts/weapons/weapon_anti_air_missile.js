var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("SAM");
    };
    this.damageTable = [["DUSTER", 120],
                        ["FIGHTER", 100],
						["STRIKER", 90],
						["DRONE", 120],
						["INTERCEPTOR", 110],
                        ["BOMBER", 100],
                        ["STEALTHBOMBER", 100],
                        ["TRANSPORTPLANE", 110],
                        ["WATERPLANE", 100],
                        ["BLACK_BOMB", 140],
						
						["RECON_DRONE", 200],
						
						["ZCOUNIT_KIROV", 110],
                        
                        ["R_HELI", 120],
                        ["K_HELI", 100],
                        ["T_HELI", 120],
                        ["MU_LARGEMISSILE", 0],
                        ["MU_WEAPON_CONSTRUCTOR", 0],
                        ["MU_PIPEBIN", 0],
                        ["MU_BACKTRACKCAR", 0]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_ANTI_AIR_MISSILE.damageTable, "WEAPON_ANTI_AIR_MISSILE");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_ANTI_AIR_MISSILE = new Constructor();
