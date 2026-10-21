var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("Light Cruiser Missile");
    };
    this.damageTable = [// ships
                        ["GUNBOAT", 80],
                        ["CANNONBOAT", 80],
                        ["BLACK_BOAT", 80],
                        ["TORPEDOBOAT", 85],
                        ["LANDER", 40],
                        ["FRIGATE", 65],
                        ["DESTROYER", 65],
                        ["CRUISER", 30],
                        ["SUBMARINE", 95],
						["NUCLEAR_SUBMARINE", 80],
                        ["BATTLECRUISER", 45],
                        ["BATTLESHIP", 40],
                        ["AIRCRAFTCARRIER", 40],
                        ["MU_LARGEMISSILE", 70],
                        ["MU_WEAPON_CONSTRUCTOR", 70],
                        ["MU_PIPEBIN", 0],
                        ["MU_BACKTRACKCAR", 65]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_ANTI_SHIP_CRUISER_MISSILE.damageTable, "WEAPON_ANTI_SHIP_CRUISER_MISSILE");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_ANTI_SHIP_CRUISER_MISSILE = new Constructor();
