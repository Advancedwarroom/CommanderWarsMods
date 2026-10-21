var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("Ship Missile");
    };
    this.damageTable = [// ships
                        ["GUNBOAT", 70],
                        ["CANNONBOAT", 70],
                        ["BLACK_BOAT", 70],
                        ["TORPEDOBOAT", 85],
                        ["LANDER", 30],
                        ["FRIGATE", 35],
                        ["DESTROYER", 35],
                        ["CRUISER", 20],
                        ["SUBMARINE", 70],
						["NUCLEAR_SUBMARINE", 55],
                        ["BATTLECRUISER", 25],
                        ["BATTLESHIP", 20],
                        ["AIRCRAFTCARRIER", 20],
                        ["MU_LARGEMISSILE", 0],
                        ["MU_WEAPON_CONSTRUCTOR", 0],
                        ["MU_PIPEBIN", 0],
                        ["MU_BACKTRACKCAR", 0]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_ANTI_SHIP_MISSILE.damageTable, "WEAPON_ANTI_SHIP_MISSILE");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_ANTI_SHIP_MISSILE = new Constructor();
