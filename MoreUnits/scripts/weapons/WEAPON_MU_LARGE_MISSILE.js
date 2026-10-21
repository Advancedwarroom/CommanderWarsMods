var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("Large Missile Warhead");
    };
    this.damageTable = [];
    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_MU_LARGE_MISSILE.damageTable, "WEAPON_MU_LARGE_MISSILE");
    };
    this.getEnviromentDamage = function(enviromentId)
    {
        return 0;
    };
};

Constructor.prototype = WEAPON;
var WEAPON_MU_LARGE_MISSILE = new Constructor();
