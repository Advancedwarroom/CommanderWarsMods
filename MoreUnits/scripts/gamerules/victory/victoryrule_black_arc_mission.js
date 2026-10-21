var Constructor = function()
{
    this.getRuleName = function(rule, itemNumber, map)
    {
        return qsTr("Destroy the Black Crystal");
    };
    this.getRuleDescription = function(rule, itemNumber, map)
    {
        return qsTr("Destroying the Black Crystal makes Player 1 and Player 3's team win.");
    };
    this.getRuleType = function()
    {
        return "checkbox";
    };
    this.getDefaultRuleValue = function(itemNumber)
    {
        return 1;
    };
    this.init = function(rule, map)
    {
    };
    this.checkDefeat = function(rule, player, map)
    {
        if (!MAP_MISSION.isMissionMap(map) || !MAP_MISSION.crystalWasDestroyed(map))
        {
            return GameEnums.DefeatType_Alive;
        }
        var playerOne = map.getPlayer(0);
        var playerThree = map.getPlayer(2);
        var playerID = player.getPlayerID();
        if (playerID === 0 || playerID === 2 ||
            player.isAlly(playerOne) || player.isAlly(playerThree))
        {
            return GameEnums.DefeatType_Alive;
        }
        return GameEnums.DefeatType_Defeated;
    };
};

Constructor.prototype = VICTORYRULE;
var VICTORYRULE_BLACK_ARC_MISSION = new Constructor();
