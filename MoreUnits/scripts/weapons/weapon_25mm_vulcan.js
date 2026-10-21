var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("Vulcan");
    };
    this.getEnviromentDamage = function(enviromentId)
    {
        return 1;
    };
    this.damageTable = [["DUSTER", 45],
                        ["FIGHTER", 30],
						["DRONE", 60],
						["STRIKER", 20],
						["INTERCEPTOR", 40],
						["SEAD", 30],
                        ["BOMBER", 40],
                        ["STEALTHBOMBER", 30],
                        ["TRANSPORTPLANE", 55],
                        ["BLACK_BOMB", 65],
                        ["WATERPLANE", 35],
						["ZCOUNIT_KIROV", 70],
						
                        ["R_HELI", 65],
                        ["K_HELI", 50],
                        ["T_HELI", 75],
                        ["MU_LARGEMISSILE", 25],
                        ["MU_WEAPON_CONSTRUCTOR", 25],
                        ["MU_PIPEBIN", 0],
                        ["MU_BACKTRACKCAR", 20]];
                       

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_25MM_VULCAN.damageTable, "WEAPON_25MM_VULCAN");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_25MM_VULCAN = new Constructor();
