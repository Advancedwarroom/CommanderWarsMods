var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("Flare");
    };
    this.getEnviromentDamage = function(enviromentId)
    {
        return -1;
    };
    this.damageTable = [[["MU_LARGEMISSILE", 55],
                        ["MU_WEAPON_CONSTRUCTOR", 55],
                        ["MU_PIPEBIN", 0],
                        ["MU_BACKTRACKCAR", 50]]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_FLARE.damageTable, "WEAPON_FLARE");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_FLARE = new Constructor();
