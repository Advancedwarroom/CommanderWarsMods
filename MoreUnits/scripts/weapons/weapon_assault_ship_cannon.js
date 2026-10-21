var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("Heavy Ship Cannons");
    };
	this.getEnviromentDamage = function(enviromentId)
    {
        return 20;
    };
    this.damageTable = [["GUNBOAT", 105],
                        ["CANNONBOAT", 105],
                        ["BLACK_BOAT", 100],
                        ["TORPEDOBOAT", 120],
                        ["LANDER", 95],
                        ["FRIGATE", 75],
                        ["DESTROYER", 75],
                        ["CRUISER", 55],
                        ["SUBMARINE", 25],
						["NUCLEAR_SUBMARINE", 10],
                        ["BATTLECRUISER", 20],
                        ["BATTLESHIP", 15],
                        ["AIRCRAFTCARRIER", 10],]

    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_ASSAULT_SHIP_CANNON.damageTable, "WEAPON_ASSAULT_SHIP_CANNON");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_ASSAULT_SHIP_CANNON = new Constructor();
