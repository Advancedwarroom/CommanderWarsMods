// mapstart.js - Game start hook for MoreUnits mod
//
// The engine calls MapStart.gameStart(map) only when starting a NEW game,
// NOT when loading a savegame (gamemenue.cpp:2442 if(!m_SaveGame) gates it).
// Therefore, the persistent UNIT wrapper hooks are installed in
// mu_system.js (general script, loaded at engine startup) instead of here.
// This gameStart function serves as a backup call to ensure wrappers
// are installed on new game start.

var MapStart =
{
    gameStart: function(map)
    {
        // Install persistent wrappers (safe to call multiple times -
        // installWrappers checks MU_WRAPPERS_INSTALLED flag)
        if (typeof MU_SYSTEM !== "undefined" && MU_SYSTEM !== null)
        {
            MU_SYSTEM.installWrappers();
            MU_SYSTEM.registerTransportUnits();
            MU_SYSTEM.registerAirportUnit();
        }
    },
};
