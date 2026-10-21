var Constructor = function()
{
    // Movement type name
    this.getName = function()
    {
        return qsTr("Example Movement");
    };

    // ===== Movement Cost Table =====
    // Format: ["terrain_id", movement_cost]
    // -1 = impassable
    this.movementpointsTable = [
        ["PLAINS", 1],
        ["FOREST", 2],
        ["MOUNTAIN", -1],
        ["RIVER", -1],
        ["SEA", -1],
        ["STREET", 1],
        ["FACTORY", 1],
        ["HQ", 1],
        ["TOWN", 1],
        ["AIRPORT", 1],
        ["HARBOUR", 1],
        ["BEACH", 1],
        ["RUIN", 1],
        ["WASTELAND", 1],
        ["SNOW", 2],
        ["DESERT", 1],
    ];

    // Core function to get movement cost
    this.getMovementpoints = function(terrain, unit, currentTerrain, trapChecking = false, map)
    {
        var id = terrain.getID();
        var currentUnit = terrain.getUnit();

        // Check enemy unit blocking (optional)
        if ((currentUnit !== null && unit !== null) &&
            (unit.getOwner().isEnemy(currentUnit.getOwner())))
        {
            if (!currentUnit.isStealthed(unit.getOwner()) || trapChecking)
            {
                return -1; // Blocked by enemy unit
            }
        }

        // Lookup movement cost from table
        return MOVEMENTTABLE.getMovementpointsFromTable(terrain, EXAMPLE_MOVE.movementpointsTable);
    };
}

Constructor.prototype = MOVEMENTTABLE;
var EXAMPLE_MOVE = new Constructor();
