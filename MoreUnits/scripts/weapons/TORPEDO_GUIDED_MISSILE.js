var Constructor = function()
{
	
    this.damageTable = [["GUNBOAT", 110],
                        ["CANNONBOAT", 110],
                        ["BLACK_BOAT", 100],
                        ["TORPEDOBOAT", 110],
                        ["LANDER", 95],
                        ["FRIGATE", 90],
                        ["DESTROYER", 75],
                        ["CRUISER", 70],
                        ["SUBMARINE", 75],
                        ["BATTLECRUISER", 65],
                        ["BATTLESHIP", 65],
						["NUCLEAR_SUBMARINE", 50],
                        ["AIRCRAFTCARRIER", 55],
                        ["MU_LARGEMISSILE", 0],
                        ["MU_WEAPON_CONSTRUCTOR", 0],
                        ["MU_PIPEBIN", 0],
                        ["MU_BACKTRACKCAR", 0]];

    this.getName = function()
    {
        return qsTr("Guided Torpedo");
    };
    this.getBaseDamage = function(unit)
    {
        return WEAPON.getDamageFromTable(unit, TORPEDO_GUIDED_MISSILE.damageTable, "TORPEDO_GUIDED_MISSILE");
    };
};

Constructor.prototype = WEAPON;
var TORPEDO_GUIDED_MISSILE = new Constructor();
