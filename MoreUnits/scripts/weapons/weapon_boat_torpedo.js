var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("Light Torpedo");
    };
    this.damageTable = [// ships
                        ["GUNBOAT", 85],
                        ["CANNONBOAT", 90],
                        ["BLACK_BOAT", 75],
                        ["TORPEDOBOAT", 95],
                        ["LANDER", 55],
                        ["FRIGATE", 40],
                        ["DESTROYER", 40],
                        ["CRUISER", 40],
                        ["SUBMARINE", 40],
						["NUCLEAR_SUBMARINE", 25],
                        ["BATTLECRUISER", 45],
                        ["BATTLESHIP", 40],
                        ["AIRCRAFTCARRIER", 40],
                        ["MU_LARGEMISSILE", 0],
                        ["MU_WEAPON_CONSTRUCTOR", 0],
                        ["MU_PIPEBIN", 0],
                        ["MU_BACKTRACKCAR", 0]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_BOAT_TORPEDO.damageTable, "WEAPON_BOAT_TORPEDO");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_BOAT_TORPEDO = new Constructor();
