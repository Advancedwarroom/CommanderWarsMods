var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("Torpedo");
    };
    this.damageTable = [// ships
                        ["GUNBOAT", 100],
                        ["CANNONBOAT", 95],
                        ["BLACK_BOAT", 95],
                        ["TORPEDOBOAT", 120],
                        ["LANDER", 95],
                        ["FRIGATE", 50],
                        ["DESTROYER", 50],
                        ["CRUISER", 25],
                        ["SUBMARINE", 55],
						["NUCLEAR_SUBMARINE", 40],
                        ["BATTLECRUISER", 75],
                        ["BATTLESHIP", 55],
                        ["AIRCRAFTCARRIER", 75],
                        ["MU_LARGEMISSILE", 0],
                        ["MU_WEAPON_CONSTRUCTOR", 0],
                        ["MU_PIPEBIN", 0],
                        ["MU_BACKTRACKCAR", 0]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_TORPEDO.damageTable, "WEAPON_TORPEDO");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_TORPEDO = new Constructor();
