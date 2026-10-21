var Constructor = function()
{
    this.canBePerformed = function(action, map)
    {
        if (!MAP_MISSION.isMissionMap(map) || !MAP_MISSION.isArcAlive(map))
        {
            return false;
        }
        var unit = action.getTargetUnit();
        var playerThree = map.getPlayer(2);
        return unit !== null &&
               unit.getUnitType() === GameEnums.UnitType_Air &&
               unit.getX() === MAP_MISSION.HQ_X &&
               unit.getY() === MAP_MISSION.HQ_Y &&
               unit.getOwner() === map.getCurrentPlayer() &&
               playerThree !== null &&
               MAP_MISSION.hasAirliftDestination(map);
    };
    this.getActionText = function(map)
    {
        return qsTr("Move");
    };
    this.getIcon = function(map)
    {
        return "icon_move";
    };
    this.getStepInputType = function(action, map)
    {
        return "FIELD";
    };
    this.getStepCursor = function(action, cursorData, map)
    {
        cursorData.setCursor("cursor+move");
    };
    this.getStepData = function(action, data, map)
    {
        MAP_MISSION.addAirliftDestination(data, map);
    };
    this.isFinalStep = function(action, map)
    {
        return action.getInputStep() === 1;
    };
    this.perform = function(action, map)
    {
        var unit = action.getTargetUnit();
        var target = action.getTarget();
        if (target === null || target === undefined)
        {
            throw new Error("Missing Black Arc airlift destination");
        }
        if (unit === null || unit.getUnitType() !== GameEnums.UnitType_Air ||
            unit.getX() !== MAP_MISSION.HQ_X || unit.getY() !== MAP_MISSION.HQ_Y ||
            unit.getOwner() !== map.getCurrentPlayer() || map.getPlayer(2) === null)
        {
            throw new Error("Invalid Black Arc airlift unit");
        }
        var allowed = false;
        for (var i = 0; i < MAP_MISSION.AIRLIFT_FIELDS.length; i++)
        {
            var point = MAP_MISSION.AIRLIFT_FIELDS[i];
            if (target.x === point[0] && target.y === point[1])
            {
                allowed = true;
                break;
            }
        }
        if (!allowed || !MAP_MISSION.isMissionMap(map) ||
            !MAP_MISSION.isArcAlive(map) ||
            map.getTerrain(target.x, target.y).getUnit() !== null)
        {
            throw new Error("Invalid Black Arc airlift destination");
        }
        unit.moveUnitToField(target.x, target.y);
        unit.setOwner(map.getPlayer(2));
        unit.setHasMoved(true);
    };
    this.getName = function()
    {
        return qsTr("Move");
    };
    this.getDescription = function()
    {
        return qsTr("Teleport this air unit from the southern HQ to a random field in the Black Arc's upper-left area and transfer it to Player 3.");
    };
};

Constructor.prototype = ACTION;
var ACTION_BLACK_ARC_AIRLIFT = new Constructor();
