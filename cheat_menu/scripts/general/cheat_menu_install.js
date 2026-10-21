// Installs ACTION_CHEAT_MENU into the empty-field menu directly above End
// Turn. Mirrors the proven debug_menu install pattern: runs at script load
// and re-applies at game start in case a later-loading mod clobbered the
// global ACTION or PLAYER objects.
var CHEAT_MENU_INSTALL =
{
    ACTION_ID: "ACTION_CHEAT_MENU",
    END_TURN_ID: "ACTION_NEXT_PLAYER",

    install: function()
    {
        CHEAT_MENU_INSTALL.installMenuEntry();
    },

    // called by the engine via scripts/mapstart.js at every new-game start,
    // after all script loading
    onGameStart: function(map)
    {
        CHEAT_MENU_INSTALL.install();
        CHEAT_MENU_INSTALL.ensureAllowed(map);
    },

    installMenuEntry: function()
    {
        var list = ACTION.emptyFieldActions;
        if (list.indexOf(CHEAT_MENU_INSTALL.ACTION_ID) < 0)
        {
            var endTurn = list.indexOf(CHEAT_MENU_INSTALL.END_TURN_ID);
            if (endTurn >= 0)
            {
                list.splice(endTurn, 0, CHEAT_MENU_INSTALL.ACTION_ID);
            }
            else
            {
                list.push(CHEAT_MENU_INSTALL.ACTION_ID);
            }
        }
    },

    // mutating allowed actions must happen in a symmetric hook, never in a
    // UI getter, or the map hash desyncs in multiplayer
    ensureAllowed: function(map)
    {
        if (map === null || map === undefined)
        {
            return;
        }
        var rules = map.getGameRules();
        var allowed = rules.getAllowedActions();
        if (allowed.indexOf(CHEAT_MENU_INSTALL.ACTION_ID) < 0)
        {
            allowed.push(CHEAT_MENU_INSTALL.ACTION_ID);
            rules.setAllowedActions(allowed);
        }
    }
};

CHEAT_MENU_INSTALL.install();

// second pass in case a later-loading mod replaced the globals
CHEAT_MENU_INSTALL.previousFinalizeLoading = finalizeLoading;
finalizeLoading = function()
{
    CHEAT_MENU_INSTALL.previousFinalizeLoading();
    CHEAT_MENU_INSTALL.install();
};
