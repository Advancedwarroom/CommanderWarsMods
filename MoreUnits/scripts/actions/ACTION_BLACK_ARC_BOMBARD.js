var Constructor = function()
{
    this.canBePerformed = function(action, map)
    {
        var building = action.getTargetBuilding();
        if (building.getFireCount() >= 1)
        {
            return true;
        }
        return false;
    };
    this.getActionText = function(map)
    {
        return qsTr("Bombard");
    };
    this.getIcon = function(map)
    {
        return "icon_fire";
    };
    this.getStepInputType = function(action, map)
    {
        return "FIELD";
    };
    this.getStepCursor = function(action, cursorData, map)
    {
        cursorData.setCursor("cursor+missile");
        cursorData.setXOffset(- map.getImageSize() * 2);
        cursorData.setYOffset(- map.getImageSize() * 2);
        cursorData.setScale(2);
    };
    this.getStepData = function(action, data, map)
    {
        // the whole map is a valid target - the Black Arc rains death anywhere
        data.setAllFields(true);
        data.setShowZData(false);
        data.setColor("#C8FF0000");
    };
    this.isFinalStep = function(action, map)
    {
        if (action.getInputStep() === 1)
        {
            return true;
        }
        return false;
    };

    this.postAnimationBuilding = null;
    this.postAnimationTargetX = -1;
    this.postAnimationTargetY = -1;

    this.perform = function(action, map)
    {
        var building = action.getTargetBuilding();
        building.setFireCount(building.getFireCount() - 1);
        action.startReading();
        ACTION_BLACK_ARC_BOMBARD.postAnimationBuilding = building;
        ACTION_BLACK_ARC_BOMBARD.postAnimationTargetX = action.readDataInt32();
        ACTION_BLACK_ARC_BOMBARD.postAnimationTargetY = action.readDataInt32();

        // launch animation at the fortress
        var offset = Global[building.getBuildingID()].getActionTargetOffset(building);
        var launch = GameAnimationFactory.createAnimation(map, building.getX() + offset.x, building.getY() + offset.y, 70);
        launch.addSprite("minicanon_north", -map.getImageSize() * 0.5, -map.getImageSize() * 1.5, 0, 2);
        launch.setSound("missile_launch.wav");
        // impact animation at the target field
        var impact = GameAnimationFactory.createAnimation(map, ACTION_BLACK_ARC_BOMBARD.postAnimationTargetX - 3,
                                                          ACTION_BLACK_ARC_BOMBARD.postAnimationTargetY - 5, 50);
        impact.addSprite("silo+impact", -4, map.getImageSize(), 0, 2, 0);
        impact.setSound("missle_explosion.wav");
        impact.addScreenshake(30, 0.95, 1000, 200);
        impact.setEndOfAnimationCall("ACTION_BLACK_ARC_BOMBARD", "performPostAnimation");
        launch.queueAnimation(impact);
    };

    this.performPostAnimation = function(postAnimation, map)
    {
        var targetX = ACTION_BLACK_ARC_BOMBARD.postAnimationTargetX;
        var targetY = ACTION_BLACK_ARC_BOMBARD.postAnimationTargetY;
        var fields = globals.getCircle(0, 3);
        var size = fields.size();
        var specialDestruction = map.getGameRules().getSpecialDestruction();
        for (var i = 0; i < size; i++)
        {
            var x = fields.at(i).x + targetX;
            var y = fields.at(i).y + targetY;
            if (map.onMap(x, y))
            {
                var unit = map.getTerrain(x, y).getUnit();
                if (unit !== null)
                {
                    // no mercy: friend and foe alike lose 5 hp
                    var newHp = unit.getHpRounded() - 5;
                    if (!specialDestruction && newHp <= 0.1)
                    {
                        newHp = 0.1;
                    }
                    unit.setHp(newHp);
                    if (unit.getHp() <= 0)
                    {
                        unit.killUnit();
                    }
                }
            }
        }
        ACTION_BLACK_ARC_BOMBARD.postAnimationBuilding = null;
        ACTION_BLACK_ARC_BOMBARD.postAnimationTargetX = -1;
        ACTION_BLACK_ARC_BOMBARD.postAnimationTargetY = -1;
    };

    this.getName = function()
    {
        return qsTr("Bombard");
    };
    this.getDescription = function()
    {
        return qsTr("Orders the Black Arc to bombard any tile on the map. All units within range 3 of the impact lose 5 HP, including your own and allied units.");
    };
}

Constructor.prototype = ACTION;
var ACTION_BLACK_ARC_BOMBARD = new Constructor();
