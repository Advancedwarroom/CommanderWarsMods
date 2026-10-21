var Constructor = function()
{
    this.getVictoryInfo = function(map)
    {
        return qsTr("Defeat the Grand Bolt team before day 26.");
    };

    this.gameStart = function(map)
    {
        if (typeof MAP_MEANS_TO_END === "undefined" ||
            MAP_MEANS_TO_END === null)
        {
            throw new Error("Means to end.js requires the MoreUnits mod.");
        }
        MAP_MEANS_TO_END.install(map);
    };

    this.onGameLoaded = function(menu, map)
    {
        if (typeof MAP_MEANS_TO_END === "undefined" ||
            MAP_MEANS_TO_END === null)
        {
            throw new Error("Means to end.js requires the MoreUnits mod.");
        }
        MAP_MEANS_TO_END.install(map);
    };

    this.actionDone = function(action, map)
    {
        if (typeof MAP_MEANS_TO_END === "undefined" ||
            MAP_MEANS_TO_END === null)
        {
            throw new Error("Means to end.js requires the MoreUnits mod.");
        }
        MAP_MEANS_TO_END.onWeakPointDestroyed(null, map);
        MAP_MEANS_TO_END.onCrystalDestroyed(null, map);
    };

    this.turnStart = function(day, playerId, map)
    {
        if (typeof MAP_MEANS_TO_END === "undefined" ||
            MAP_MEANS_TO_END === null)
        {
            throw new Error("Means to end.js requires the MoreUnits mod.");
        }
        if (day >= 26 && playerId === 0)
        {
            MAP_MEANS_TO_END.onEndTurn(map);
        }
    };
};

Constructor.prototype = BASEGAMESCRIPT;
var gameScript = new Constructor();
