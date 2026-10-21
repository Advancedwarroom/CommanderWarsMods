var Constructor = function()
{
    this.getName = function()
    {
        return "VICTORYRULE_MEANS_TO_END";
    };

    this.checkVictory = function(player, map)
    {
        if (!MAP_MEANS_TO_END.isMissionMap(map))
        {
            return false;
        }
        if (player === null || player === undefined)
        {
            return false;
        }
        var id = player.getPlayerID();
        if (id === 0 || id === 2)
        {
            return MAP_MEANS_TO_END.areAllCrystalsDestroyed(map) ||
                   MAP_MEANS_TO_END.areAllGrandBoltsDestroyed(map);
        }
        return false;
    };

    this.checkDefeat = function(player, map)
    {
        if (!MAP_MEANS_TO_END.isMissionMap(map) || player === null || player === undefined)
        {
            return false;
        }
        var id = player.getPlayerID();
        if (id === 1 || id === 3)
        {
            return MAP_MEANS_TO_END.areAllGrandBoltsDestroyed(map);
        }
        if (id === 2 || id === 3)
        {
            return MAP_MEANS_TO_END.areAllCrystalsDestroyed(map);
        }
        return false;
    };
};

Constructor.prototype = VICTORYRULE;
var VICTORYRULE_MEANS_TO_END = new Constructor();
