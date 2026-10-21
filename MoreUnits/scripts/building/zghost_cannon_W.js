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
        building.loadSpriteV2("ghost+cannon+W", GameEnums.Recoloring_Matrix, 400, Qt.point(0,0)); // sprite is authored in faction-table coordinates: full-body recolor
    };
    this.getBaseIncome = function()
    {
        return 0;
    };
    this.getDefense = function(building)
    {
        return 0;
    };
    this.actionList = ["ACTION_CANNON_FIRE"];
    this.startOfTurn = function(building, map)
    {
        building.setFireCount(1);
    };
    this.getActionTargetFields = function(building)
    {
        return globals.getShotFields(1, 4, -1, 0);
    };
    this.getMiniMapIcon = function()
    {
        return "minimap_blackholebuilding";
    };
    this.getName = function()
    {
        return qsTr("Ghost Cannon");
    };
    this.getDamage = function(building, unit)
    {
        return 3;
    };
    this.getBuildingTargets = function()
    {
        return GameEnums.BuildingTarget_Enemy;
    };
    this.canBuildingBePlaced = function(terrain, building, map)
    {
        // Ghost Cannons float: they can be mounted anywhere - plains, sea,
        // mountains, even pipes. The Ghost Platform is purely decorative now.
        return true;
    };
    this.onDestroyed = function(building, map)
    {
        var x = building.getX();
        var y = building.getY();
        // the cannon crashes down, the terrain below stays untouched
        map.getTerrain(x, y).removeBuilding();
        var animation = GameAnimationFactory.createAnimation(map, x, y);
        animation.addSprite("explosion+land", -map.getImageSize() / 2, -map.getImageSize(), 0, 2);
        animation.addScreenshake(30, 0.95, 1000, 200);
        animation.setSound("explosion+land.wav");
    };
    this.getShotAnimation = function(building, map)
    {
        var animation = GameAnimationFactory.createAnimation(map, building.getX(), building.getY(), 70);
        animation.addSprite("minicanon_west", -map.getImageSize() * 0.5, -map.getImageSize() * 1.5, 0, 2);
        animation.setSound("minicanon_shot.wav");
        return animation;
    };
    this.getDescription = function()
    {
        return qsTr("A cannon of the flying fortress Black Arc, hovering high above the battlefield. Deals 3 HP of damage to a single unit in front of it. Only air units and anti-air weapons can attack it - ground and naval forces cannot reach it.");
    };
}

Constructor.prototype = BUILDING;
var ZGHOST_CANNON_W = new Constructor();
