var Constructor = function()
{
    this.getVictoryInfo = function(map)
    {
        return qsTr("Destroy the Black Crystal, or eliminate the opposing team.");
    };

    this.gameStart = function(map)
    {
        if (typeof MAP_MISSION === "undefined" || MAP_MISSION === null)
        {
            throw new Error("Victory or death.js requires the MoreUnits mod.");
        }
        MAP_MISSION.install(map);
    };

    this.onGameLoaded = function(menu, map)
    {
        if (typeof MAP_MISSION === "undefined" || MAP_MISSION === null)
        {
            throw new Error("Victory or death.js requires the MoreUnits mod.");
        }
        MAP_MISSION.install(map);
    };
};

Constructor.prototype = BASEGAMESCRIPT;
var gameScript = new Constructor();
