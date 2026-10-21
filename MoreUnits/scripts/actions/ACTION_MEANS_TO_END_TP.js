var Constructor = function()
{
    this.canBePerformed = function(action, map)
    {
        if (!MAP_MEANS_TO_END.isMissionMap(map))
        {
            return false;
        }
        var unit = action.getTargetUnit();
        if (unit === null || unit === undefined)
        {
            return false;
        }
        return MAP_MEANS_TO_END.getTeleportDestinations(map).length > 0 &&
               unit.getOwner() === map.getCurrentPlayer();
    };

    this.getActionText = function(map)
    {
        return qsTr("TP");
    };

    this.getName = function()
    {
        return qsTr("TP");
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
        var destinations = MAP_MEANS_TO_END.getTeleportDestinations(map);
        for (var i = 0; i < destinations.length; i++)
        {
            data.addPoint(Qt.point(destinations[i].x, destinations[i].y));
        }
    };

    this.isFinalStep = function(action, map)
    {
        return action.getInputStep() === 1;
    };

    this.perform = function(action, map)
    {
        var unit = action.getTargetUnit();
        if (unit === null || unit === undefined)
        {
            throw new Error("Missing teleport target unit");
        }
        var target = action.getTarget();
        if (target === null || target === undefined)
        {
            throw new Error("Missing teleport destination");
        }
        var destinations = MAP_MEANS_TO_END.getTeleportDestinations(map);
        var valid = false;
        for (var i = 0; i < destinations.length; i++)
        {
            if (destinations[i].x === target.x && destinations[i].y === target.y)
            {
                valid = true;
                break;
            }
        }
        if (!valid)
        {
            throw new Error("Invalid teleport destination");
        }
        unit.moveUnitToField(target.x, target.y);
        unit.setOwner(map.getPlayer(2));
        unit.setHasMoved(true);
    };

    this.getDescription = function()
    {
        return qsTr("Teleport this unit to a free tile in the upper P3 area.");
    };
};

Constructor.prototype = ACTION;
var ACTION_MEANS_TO_END_TP = new Constructor();
