var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("Vulcan Cannon");
    };
    this.damageTable = [["DUSTER", 95],
                        ["FIGHTER", 80],
						["DRONE", 110],
						["STRIKER", 65],
						["INTERCEPTOR", 90],
						["SEAD", 80],
                        ["BOMBER", 100],
                        ["STEALTHBOMBER", 100],
                        ["TRANSPORTPLANE", 100],
                        ["WATERPLANE", 100],
                        ["BLACK_BOMB", 180],
						
						["RECON_DRONE", 205],
						
						["ZCOUNIT_KIROV", 150],
						
                        ["R_HELI", 150],
                        ["K_HELI", 130],
                        ["T_HELI", 150],
                        ["MU_LARGEMISSILE", 25],
                        ["MU_WEAPON_CONSTRUCTOR", 25],
                        ["MU_PIPEBIN", 0],
                        ["MU_BACKTRACKCAR", 20]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_GATLING.damageTable, "WEAPON_GATLING");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_GATLING = new Constructor();
