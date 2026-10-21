var Constructor = function()
{
    this.getBuildingGroup = function()
    {
        return 4; // Bolt Guard tab in the map editor
    };
    this.init = function (building)
    {
        building.setHp(100);
        building.setAlwaysVisble(true);
    };
    this.loadSprites = function(building, neutral, map)
    {
        if (typeof GHOST_SYSTEM !== "undefined" && GHOST_SYSTEM !== null)
        {
            GHOST_SYSTEM.install();
        }
        // two frame idle animation: the fortress blinks between frame 1 and 2
        // the sprite is authored in faction-table coordinates: full-body
        // recolor, only the yellow lamps keep their fixed color
        building.loadSpriteV2("black+arc", GameEnums.Recoloring_Matrix, 400, Qt.point(0,0));
    };
    this.getBaseIncome = function()
    {
        return 0;
    };
    this.getDefense = function(building)
    {
        return 0;
    };
    this.actionList = ["ACTION_BLACK_ARC_BOMBARD"];
    this.startOfTurn = function(building, map)
    {
        building.setFireCount(1);
    };
    this.getActionTargetFields = function(building)
    {
        // used by the ai danger map: the blast radius around the impact point
        return globals.getCircle(0, 3);
    };
    this.getActionTargetOffset = function(building)
    {
        // reference point of large buildings is bound to the lower right corner
        return Qt.point(-2, -2);
    };
    this.getBuildingWidth = function()
    {
        return 4;
    };
    this.getBuildingHeigth = function()
    {
        return 4;
    };
    this.canBuildingBePlaced = function(terrain, building, map)
    {
        // the Black Arc flies: it can be deployed over any terrain -
        // plains, sea, mountains, pipes - only the map border stops it
        var placeX = terrain.getX();
        var placeY = terrain.getY();
        for (var x = 0; x < ZBLACK_ARC.getBuildingWidth(); x++)
        {
            for (var y = 0; y < ZBLACK_ARC.getBuildingHeigth(); y++)
            {
                if (!map.onMap(placeX - x, placeY - y))
                {
                    return false;
                }
            }
        }
        return true;
    };
    this.getMiniMapIcon = function()
    {
        return "minimap_blackholebuilding";
    };
    this.getName = function()
    {
        return qsTr("Black Arc");
    };
    this.getDamage = function(building, unit)
    {
        return 5;
    };
    this.getBuildingTargets = function()
    {
        return GameEnums.BuildingTarget_All;
    };
    this.onDestroyed = function(building, map)
    {
        var x = building.getX();
        var y = building.getY();
        var animation2 = GameAnimationFactory.createAnimation(map, 0, 0);
        animation2.addSprite2("white_pixel", 0, 0, 3200, map.getMapWidth(), map.getMapHeight());
        animation2.addTweenColor(0, "#00FFFFFF", "#FFFFFFFF", 3000, true);
        animation2.addScreenshake(45, 0.98, 3000, 200);
        animation2.setSound("black_canon_destroyed.wav");
        for (var xi = 0; xi < 4; xi++)
        {
            for (var yi = 0; yi < 4; yi++)
            {
                if (map.onMap(x - xi, y - yi))
                {
                    map.replaceTerrainOnly("PLAINS_DESTROYED", x - xi, y - yi);
                }
            }
        }
        if (typeof MAP_MISSION !== "undefined" && MAP_MISSION !== null &&
            MAP_MISSION.isMissionMap(map))
        {
            MAP_MISSION.clearUpperHalf(map);
        }
    };
    this.getDescription = function()
    {
        return qsTr("The flying fortress Black Arc. Once per turn it can bombard any tile on the whole map: enemy units within range 3 of the impact lose 5 HP, while your own and allied units are unaffected.");
    };
}

Constructor.prototype = BUILDING;
var ZBLACK_ARC = new Constructor();
