var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("Missile Launcher");
    };
    this.damageTable = [["DUSTER", 45],
                        ["FIGHTER", 30],
						["DRONE", 55],
						["STRIKER", 15],
						["INTERCEPTOR", 40],
                        ["BOMBER", 35],
                        ["STEALTHBOMBER", 45],
                        ["TRANSPORTPLANE", 45],
                        ["WATERPLANE", 45],
                        ["BLACK_BOMB", 55],
						
						["RECON_DRONE", 100],
						
						["ZCOUNIT_KIROV", 50],
						
                        ["R_HELI", 95],
						["K_HELI", 85],
                        ["T_HELI", 125],
                        ["MU_LARGEMISSILE", 85],
                        ["MU_WEAPON_CONSTRUCTOR", 85],
                        ["MU_PIPEBIN", 0],
                        ["MU_BACKTRACKCAR", 80]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_MISSILE_LAUNCHER.damageTable, "WEAPON_MISSILE_LAUNCHER");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_MISSILE_LAUNCHER = new Constructor();
