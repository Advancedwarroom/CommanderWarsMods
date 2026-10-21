var Constructor = function()
{
    // Building group: 0=neutral (city), 1=military (factory), 2=HQ
    this.getBuildingGroup = function()
    {
        return 1;
    };

    // Load sprites
    this.loadSprites = function(building, neutral, map)
    {
        if (building.getOwnerID() >= 0 && !neutral)
        {
            // Owned version with faction colors
            building.loadSprite("EXAMPLE_BUILDING", false);
            building.loadSpriteV2("EXAMPLE_BUILDING+mask", GameEnums.Recoloring_Matrix);
        }
        else
        {
            // Neutral version
            building.loadSprite("EXAMPLE_BUILDING+neutral", false);
        }
    };

    // Weather change callback (optional)
    this.onWeatherChanged = function(building, weather, map)
    {
    };

    // Base income (for city-type buildings)
    this.getBaseIncome = function()
    {
        return 1000;
    };

    // Building name
    this.getName = function()
    {
        return qsTr("Example Factory");
    };

    // Building description
    this.getDescription = function()
    {
        return qsTr("This is an example building. Replace this with your own description.");
    };

    // Buildable units list (for factory/airport/harbor)
    this.getConstructionList = function (building) {
        return BUILDING.assembleConstructionList(building);
    };

    // Actions this building can perform
    this.actionList = ["ACTION_BUILD_CARRY"];

    // Vision bonus
    this.getVision = function(building, map)
    {
        return map.getGameRules().getBuildingVision();
    };

    // Hide vision (like forests)
    this.getVisionHide = function(building)
    {
        return false;
    };
}

Constructor.prototype = BUILDING;
var EXAMPLE_BUILDING = new Constructor();
