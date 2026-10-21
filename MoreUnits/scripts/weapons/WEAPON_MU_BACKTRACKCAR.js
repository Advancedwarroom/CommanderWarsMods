var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("BackTrack System");
    };
    this.damageTable = [];
    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_MU_BACKTRACKCAR.damageTable, "WEAPON_MU_BACKTRACKCAR");
    };
    this.getEnviromentDamage = function(enviromentId)
    {
        return 0;
    };
};

Constructor.prototype = WEAPON;
var WEAPON_MU_BACKTRACKCAR = new Constructor();
