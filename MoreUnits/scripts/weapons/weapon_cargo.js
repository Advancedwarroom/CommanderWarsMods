var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("Cargo");
    };
    this.getEnviromentDamage = function(enviromentId)
    {
        return -1;
    };
    this.damageTable = [[["MU_LARGEMISSILE", 0],
                        ["MU_WEAPON_CONSTRUCTOR", 0],
                        ["MU_PIPEBIN", 0],
                        ["MU_BACKTRACKCAR", 0]]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_CARGO.damageTable, "WEAPON_CARGO");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_CARGO = new Constructor();
