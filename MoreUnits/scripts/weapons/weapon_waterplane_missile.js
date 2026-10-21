var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("IR Missile");
    };
    this.getEnviromentDamage = function(enviromentId)
    {
        return 45;
    };
    this.damageTable = [["DUSTER", 90],
                        ["FIGHTER", 30],
						["DRONE", 120],
						["STRIKER", 20],
						["INTERCEPTOR", 60],
						["SEAD", 35],
                        ["BOMBER", 70],
                        ["STEALTHBOMBER", 65],
                        ["TRANSPORTPLANE", 100],
                        ["BLACK_BOMB", 95],
                        ["WATERPLANE", 65],
						
						["ZCOUNIT_KIROV", 85],
						
                        ["R_HELI", 100],
                        ["K_HELI", 85],
                        ["T_HELI", 110],
                        ["MU_LARGEMISSILE", 60],
                        ["MU_WEAPON_CONSTRUCTOR", 60],
                        ["MU_PIPEBIN", 0],
                        ["MU_BACKTRACKCAR", 55]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_WATERPLANE_MISSILE.damageTable, "WEAPON_WATERPLANE_MISSILE");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_WATERPLANE_MISSILE = new Constructor();
