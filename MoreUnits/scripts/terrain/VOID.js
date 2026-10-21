var Constructor = function()
{
    this.getTerrainGroup = function()
    {
        return 1;
    };
    this.getDefaultPalette = function()
    {
        return "palette_clear";
    };
    this.init = function (terrain)
    {
        if (terrain.getPalette() === "")
        {
            terrain.setPalette(VOID.getDefaultPalette());
        }
        terrain.setTerrainName(VOID.getName());
    };
    this.getName = function()
    {
        return qsTr("Void");
    };
    this.canBePlaced = function(x, y, map)
    {
        return map !== null && map !== undefined && map.onMap(x, y);
    };
    this.getDefense = function()
    {
        return 0;
    };
    this.installMovementBlock = function()
    {
        if (typeof MOVEMENTTABLE === "undefined" || MOVEMENTTABLE === null ||
            MOVEMENTTABLE.__voidMovementBlockInstalled === true)
        {
            return;
        }
        var originalGetMovementpointsFromTable = MOVEMENTTABLE.getMovementpointsFromTable;
        if (typeof originalGetMovementpointsFromTable !== "function")
        {
            throw new Error("MOVEMENTTABLE.getMovementpointsFromTable is unavailable");
        }
        MOVEMENTTABLE.getMovementpointsFromTable = function(terrain)
        {
            if (terrain !== null && terrain !== undefined && terrain.getID() === "VOID")
            {
                return -1;
            }
            return originalGetMovementpointsFromTable.apply(this, arguments);
        };
        MOVEMENTTABLE.__voidMovementBlockInstalled = true;
    };
    this.loadBaseSprite = function(terrain, currentTerrainID, map)
    {
        VOID.installMovementBlock();
        // fully transparent: only the map background is visible
        terrain.loadBaseSprite("void");
    };
    this.getMiniMapIcon = function()
    {
        return "minimap_blackholebuilding";
    };
    this.getDescription = function()
    {
        return qsTr("The void of the sky. No unit can enter this tile - not even air units. It is nothing but empty background.");
    };
    this.getTerrainSprites = function()
    {
        return ["void"];
    };
};
Constructor.prototype = TERRAIN;
var VOID = new Constructor();
