var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("Anti-Ship Missile");
    };
    this.getEnviromentDamage = function(enviromentId)
    {
        return 55;
    };
    this.damageTable = [["GUNBOAT", 200],
                        ["CANNONBOAT", 200],
                        ["BLACK_BOAT", 200],
                        ["TORPEDOBOAT", 200],
                        ["LANDER", 210],
                        ["FRIGATE", 120],
                        ["DESTROYER", 130],
                        ["CRUISER", 110],
                        ["SUBMARINE", 120],
						["NUCLEAR_SUBMARINE", 95],
                        ["BATTLECRUISER", 100],
                        ["BATTLESHIP", 95],
                        ["AIRCRAFTCARRIER", 80],
                        ["MU_LARGEMISSILE", 0],
                        ["MU_WEAPON_CONSTRUCTOR", 0],
                        ["MU_PIPEBIN", 0],
                        ["MU_BACKTRACKCAR", 0]];

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_ANTI_SHIP_MISSILE1.damageTable, "WEAPON_ANTI_SHIP_MISSILE1");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_ANTI_SHIP_MISSILE1 = new Constructor();
