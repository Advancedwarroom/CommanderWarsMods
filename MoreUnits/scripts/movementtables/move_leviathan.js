var Constructor = function()
{
    // every passable tile costs exactly 1 -> with 1 movement point the
    // Leviathan creeps a single tile per turn, Oozium-style
    this.movementpointsTable = [
        ["SEA", 1],
        ["LAKE", 1],
        ["ROUGH_SEA", 1],
        ["REAF", 1],
        ["FOG", 1],
        ["HARBOUR", 1],
        ["TEMPORARY_HARBOUR", 1],
        ["BEACH", 1],
        ["RIVER", 1],
        ["DESERT_TRY_RIVER", 1],
        ["OILRIG", 1],
        ["BRIDGE", 1],
        ["BRIDGE1", 1],
        ["BRIDGE2", 1],
    ];

    this.getMovementpoints = function(terrain, unit, currentTerrain, trapChecking, map)
    {
        if (terrain !== null)
        {
            var id = terrain.getID();
            for (var i = 0; i < this.movementpointsTable.length; i++)
            {
                if (this.movementpointsTable[i][0] === id)
                {
                    return this.movementpointsTable[i][1];
                }
            }
        }
        return -1;
    };
};

Constructor.prototype = MOVEMENTTABLE;
var MOVE_LEVIATHAN = new Constructor();
