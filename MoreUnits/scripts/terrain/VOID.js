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
    this.getDefense = function()
    {
        return 0;
    };
    this.loadBaseSprite = function(terrain, currentTerrainID, map)
    {
        // fully transparent: only the map background is visible
        terrain.loadBaseSprite("void");
    };
    this.getMiniMapIcon = function()
    {
        return "minimap_plains";
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
