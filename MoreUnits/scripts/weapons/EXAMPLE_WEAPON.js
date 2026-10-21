var Constructor = function()
{
    // Weapon display name
    this.getName = function()
    {
        return qsTr("Example Cannon");
    };

    // Damage to buildings/terrain (optional)
    this.getEnviromentDamage = function(enviromentId)
    {
        return 15;
    };

    // ===== Damage Table =====
    // Format: ["target_unit_id", damage_value]
    // Damage is a percentage: 100 = 100% base damage
    this.damageTable = [
        ["INFANTRY", 75],
        ["HEAVY_TANK", 55],
        ["LIGHT_TANK", 70],
        // Add more targets...
                        ["MU_LARGEMISSILE", 50],
                        ["MU_WEAPON_CONSTRUCTOR", 50],
                        ["MU_BACKTRACKCAR", 45]];

    // Get damage against a specific unit
    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, EXAMPLE_WEAPON.damageTable, "EXAMPLE_WEAPON");
    };
};

Constructor.prototype = WEAPON;
var EXAMPLE_WEAPON = new Constructor();
