var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("Light Torpedo");
    };
    this.damageTable = 	[["GUNBOAT", 105],
	                        ["CANNONBOAT", 100],
	                        ["BLACK_BOAT", 95],
	                        ["TORPEDOBOAT", 110],
	                        ["LANDER", 95],
	                        ["FRIGATE", 90],
	                        ["DESTROYER", 65],
	                        ["CRUISER", 60],
	                        ["SUBMARINE", 60],
							["NUCLEAR_SUBMARINE", 45],
	                        ["BATTLECRUISER", 50],
	                        ["BATTLESHIP", 45],
	                        ["AIRCRAFTCARRIER", 35],
                        ["MU_LARGEMISSILE", 0],
                        ["MU_WEAPON_CONSTRUCTOR", 0],
                        ["MU_PIPEBIN", 0],
                        ["MU_BACKTRACKCAR", 0]];
    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, WEAPON_LIGHT_TORPEDO.damageTable, "WEAPON_LIGHT_TORPEDO");
    };
};

Constructor.prototype = WEAPON;
var WEAPON_LIGHT_TORPEDO = new Constructor();
