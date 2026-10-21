var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("Anti-Submarine Missile");
    };
    this.damageTable = [
                        ["SUBMARINE", 125],
						["NUCLEAR_SUBMARINE", 100],
						["WATERMINE", 100],
                        ["MU_LARGEMISSILE", 0],
                        ["MU_WEAPON_CONSTRUCTOR", 0],
                        ["MU_PIPEBIN", 0],
                        ["MU_BACKTRACKCAR", 0]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_ANTI_SUBMARINE_MISSILE.damageTable, "WEAPON_ANTI_SUBMARINE_MISSILE");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_ANTI_SUBMARINE_MISSILE = new Constructor();
