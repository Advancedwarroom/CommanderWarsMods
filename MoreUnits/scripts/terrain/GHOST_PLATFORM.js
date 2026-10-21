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
            terrain.setPalette(GHOST_PLATFORM.getDefaultPalette());
        }
        terrain.setTerrainName(GHOST_PLATFORM.getName());
    };
    this.getName = function()
    {
        return qsTr("Ghost Platform");
    };
    this.getDefense = function()
    {
        return 0;
    };
    this.loadBaseSprite = function(terrain, currentTerrainID, map)
    {
        // make sure the air movement patch is installed even on maps
        // that have a Ghost Platform but no sky weapons
        if (typeof GHOST_SYSTEM !== "undefined" && GHOST_SYSTEM !== null)
        {
            GHOST_SYSTEM.install();
        }
        terrain.loadBaseSprite("ghost+platform");
    };
    this.getMiniMapIcon = function()
    {
        return "minimap_plains";
    };
    this.getDescription = function()
    {
        return qsTr("A hovering platform of the Black Arc, high in the sky. Only air units can fly over it - ground, naval and pipeline units cannot enter. Purely decorative, but it makes a fine nest for a Ghost Cannon.");
    };
    this.getTerrainSprites = function()
    {
        return ["ghost+platform"];
    };
};
Constructor.prototype = TERRAIN;
var GHOST_PLATFORM = new Constructor();
