// mu_system.js - Core system for MoreUnits mod
// Provides death tracking for the BackTrackCar resurrection system.
// Deaths are recorded on terrain variables and persist for the entire game.
//
// Also installs persistent UNIT wrapper hooks (getActions, onDeath, onKilled,
// startOfTurn, moveUnit) that survive save/load cycles. The engine does NOT
// call MapStart.gameStart when loading a savegame (gamemenue.cpp:2442
// if(!m_SaveGame) gates it), so wrappers set only in gameStart are lost.
// By installing at script-load time (here) and re-checking from each unit
// script, wrappers are always present regardless of save/load.

var MU_SYSTEM =
{
    // Maximum number of death records per tile
    MAX_DEATHS_PER_TILE: 10,

    // Unit IDs that cannot be resurrected (special weapons)
    isResurrectable: function(unitID, unitType)
    {
        if (unitID === null || unitID === undefined)
        {
            return false;
        }

        var upperID = unitID.toUpperCase();

        // Cannot resurrect DeathRay-type weapons
        if (upperID.indexOf("DEATHRAY") >= 0 ||
            upperID.indexOf("NUKE") >= 0 ||
            upperID.indexOf("LASER") >= 0)
        {
            return false;
        }

        // Cannot resurrect remote/special weapons
        if (unitType === GameEnums.REMOTE_WEAPON ||
            unitType === GameEnums.UnitType_RemoteWeapon)
        {
            return false;
        }

        return true;
    },

    // Record a unit death on the terrain where it died
    recordDeath: function(unit, map)
    {
        if (unit === null || unit === undefined)
        {
            return;
        }

        var unitID = unit.getUnitID();
        var unitType = unit.getUnitType();

        // Only record resurrectable units
        if (!MU_SYSTEM.isResurrectable(unitID, unitType))
        {
            return;
        }

        var owner = unit.getOwner();
        if (owner === null || owner === undefined)
        {
            return;
        }

        var ownerID = owner.getPlayerID();
        var x = unit.getX();
        var y = unit.getY();

        if (!map.onMap(x, y))
        {
            return;
        }

        var terrain = map.getTerrain(x, y);
        var terrainVars = terrain.getVariables();
        var deathVar = terrainVars.createVariable("MU_DEATH_LIST");

        var existingData = deathVar.readDataString();
        var newEntry = unitID + ":" + ownerID;

        if (existingData === null || existingData === "")
        {
            deathVar.writeDataString(newEntry);
        }
        else
        {
            var entries = existingData.split(";");
            entries.push(newEntry);

            // Limit to last N entries
            if (entries.length > MU_SYSTEM.MAX_DEATHS_PER_TILE)
            {
                entries = entries.slice(entries.length - MU_SYSTEM.MAX_DEATHS_PER_TILE);
            }

            deathVar.writeDataString(entries.join(";"));
        }
    },

    // Get the death list for a specific tile
    getDeathList: function(terrain)
    {
        if (terrain === null || terrain === undefined)
        {
            return [];
        }

        var terrainVars = terrain.getVariables();
        var deathVar = terrainVars.getVariable("MU_DEATH_LIST");

        if (deathVar === null)
        {
            return [];
        }

        var deathData = deathVar.readDataString();
        if (deathData === null || deathData === "")
        {
            return [];
        }

        var entries = deathData.split(";");
        var result = [];

        for (var i = 0; i < entries.length; i++)
        {
            var parts = entries[i].split(":");
            if (parts.length >= 2)
            {
                result.push({
                    unitID: parts[0],
                    ownerID: parseInt(parts[1]),
                    index: i
                });
            }
        }

        return result;
    },

    // Check if a tile has any resurrectable dead units
    hasResurrectableDeaths: function(terrain)
    {
        var deaths = MU_SYSTEM.getDeathList(terrain);

        for (var i = 0; i < deaths.length; i++)
        {
            if (MU_SYSTEM.isResurrectable(deaths[i].unitID, null))
            {
                return true;
            }
        }

        return false;
    },

    // Remove a specific death entry from a tile's death list
    removeDeathEntry: function(terrain, entryIndex)
    {
        if (terrain === null || terrain === undefined)
        {
            return;
        }

        var terrainVars = terrain.getVariables();
        var deathVar = terrainVars.getVariable("MU_DEATH_LIST");

        if (deathVar === null)
        {
            return;
        }

        var deathData = deathVar.readDataString();
        if (deathData === null || deathData === "")
        {
            return;
        }

        var entries = deathData.split(";");

        if (entryIndex >= 0 && entryIndex < entries.length)
        {
            entries.splice(entryIndex, 1);

            if (entries.length > 0)
            {
                deathVar.writeDataString(entries.join(";"));
            }
            else
            {
                terrainVars.deleteVariable("MU_DEATH_LIST");
            }
        }
    },

    // Calculate the resurrection cost for a unit (25% of production cost)
    getResurrectionCost: function(unitID)
    {
        if (unitID === null || unitID === undefined)
        {
            return 0;
        }

        if (Global[unitID] !== undefined &&
            Global[unitID].getBaseCost !== undefined)
        {
            return Math.floor(Global[unitID].getBaseCost() * 0.25);
        }

        return 0;
    },

    // Get the display name for a unit
    getUnitName: function(unitID)
    {
        if (unitID === null || unitID === undefined)
        {
            return "Unknown";
        }

        if (Global[unitID] !== undefined &&
            Global[unitID].getName !== undefined)
        {
            return Global[unitID].getName();
        }

        return unitID;
    },

    // ================================================================
    // installWrappers: Install persistent UNIT hooks.
    // Called from: (1) this script's top-level, (2) each MoreUnits
    // unit script's bottom, (3) mapstart.js gameStart.
    // Uses MU_WRAPPERS_INSTALLED flag to prevent double-wrapping.
    // ================================================================
    installWrappers: function()
    {
        // Prevent double installation
        if (typeof MU_WRAPPERS_INSTALLED !== "undefined" && MU_WRAPPERS_INSTALLED)
        {
            return;
        }
        // UNIT must exist (loaded from general/unit.js)
        if (typeof UNIT === "undefined" || UNIT === null)
        {
            return;
        }

        // ============================================================
        // 1. Wrap UNIT.onDeath to record deaths for resurrection system
        // ============================================================
        var originalOnDeath = UNIT.onDeath;
        UNIT.onDeath = function(unit, map)
        {
            if (typeof originalOnDeath === "function")
            {
                originalOnDeath.call(this, unit, map);
            }
            if (typeof MU_SYSTEM !== "undefined" && MU_SYSTEM !== null)
            {
                try
                {
                    MU_SYSTEM.recordDeath(unit, map);
                }
                catch (e) {}
            }
        };

        // ============================================================
        // 2. Override UNIT.onKilled to protect resurrected units
        // ============================================================
        UNIT.onKilled = function(animation, map)
        {
            animation.seekBuffer();
            var x = animation.readDataInt32();
            var y = animation.readDataInt32();
            var terrain = map.getTerrain(x, y);
            if (terrain === null)
            {
                return;
            }
            var unit = terrain.getUnit();
            if (unit !== null)
            {
                var unitVars = unit.getVariables();
                var protectedVar = unitVars.getVariable("MU_PROTECTED");
                if (protectedVar !== null)
                {
                    return;
                }
                unit.removeUnit();
            }
        };

        // ============================================================
        // 3. Wrap UNIT.startOfTurn to:
        //    a) Detect healing and clear PipeBin debuffs
        //    b) Process PipeBin bad debuff (-3 HP friendly, skip turn)
        //    c) Clear MU_PROTECTED flag
        // ============================================================
        var originalStartOfTurn = UNIT.startOfTurn;
        UNIT.startOfTurn = function(unit, map)
        {
            if (unit !== null && unit !== undefined)
            {
                try
                {
                    var unitVars = unit.getVariables();

                    // ====================================================
                    // PipeBin healing detection: compare current HP with
                    // stored last HP. If HP increased, unit was healed ->
                    // clear all PipeBin debuffs.
                    // ====================================================
                    var pbLastHpVar = unitVars.getVariable("MU_PIPEBIN_LAST_HP");
                    var pbCurrentHp = unit.getHp();
                    if (pbLastHpVar !== null)
                    {
                        var pbLastHp = pbLastHpVar.readDataInt32();
                        if (pbCurrentHp > pbLastHp)
                        {
                            // Healing detected! Clear all PipeBin debuffs.
                            if (typeof MU_PIPEBIN !== "undefined" && MU_PIPEBIN !== null)
                            {
                                MU_PIPEBIN.clearDebuffs(unit, map);
                            }
                        }
                    }

                    // ====================================================
                    // PipeBin bad debuff processing:
                    //   bad=1: First turn of bad debuff. Apply -3 HP to
                    //          the unit itself (the 3-layer unit).
                    //          Then set bad=2 to skip this turn's actions.
                    //   bad=2: Second turn. Clear the bad flag.
                    // ====================================================
                    var pbBadVar = unitVars.getVariable("MU_PIPEBIN_BAD");
                    if (pbBadVar !== null)
                    {
                        var pbBadState = pbBadVar.readDataInt32();
                        if (pbBadState === 1)
                        {
                            // -3 HP to the bad unit itself
                            var pbNewHp = unit.getHp() - 3;
                            if (pbNewHp <= 0)
                            {
                                unit.killUnit();
                            }
                            else
                            {
                                unit.setHp(pbNewHp);
                            }
                            // Set bad=2 (skip this turn's actions)
                            pbBadVar.writeDataInt32(2);
                        }
                        else if (pbBadState === 2)
                        {
                            // Clear bad debuff (one turn of skip is done)
                            unitVars.deleteVariable("MU_PIPEBIN_BAD");
                        }
                    }

                    // ====================================================
                    // PipeBin stun processing: if unit was contaminated via
                    // contact, skip this turn (setHasMoved) and clear flag.
                    // ====================================================
                    var pbStunVar = unitVars.getVariable("MU_PIPEBIN_STUNNED");
                    if (pbStunVar !== null && pbStunVar.readDataBool() === true)
                    {
                        unit.setHasMoved(true);
                        unitVars.deleteVariable("MU_PIPEBIN_STUNNED");
                    }

                    // ====================================================
                    // Store current HP for next turn's healing detection
                    // ====================================================
                    unitVars.createVariable("MU_PIPEBIN_LAST_HP").writeDataInt32(unit.getHp());

                    // ====================================================
                    // Clear MU_PROTECTED flag (original behavior)
                    // ====================================================
                    var protectedVar = unitVars.getVariable("MU_PROTECTED");
                    if (protectedVar !== null)
                    {
                        unitVars.deleteVariable("MU_PROTECTED");
                    }
                }
                catch (e) {}
            }
            if (typeof originalStartOfTurn === "function")
            {
                originalStartOfTurn.call(this, unit, map);
            }
        };

        // ============================================================
        // 4. Wrap UNIT.getActions to inject Place/Mine for empowered
        //    units. This wrapper is the key fix for the save/load bug:
        //    it must be present whenever the engine queries actions,
        //    including after loading a savegame.
        // ============================================================
        var originalGetActions = UNIT.getActions;
        UNIT.getActions = function(unit, map)
        {
            var actions = [];
            var unitGlobal = Global[unit.getUnitID()];
            var origReturned = false;

            if (typeof originalGetActions === "function")
            {
                try
                {
                    var origActions = originalGetActions.call(unitGlobal, unit, map);
                    if (origActions !== null && origActions !== undefined &&
                        origActions instanceof Array && origActions.length > 0)
                    {
                        actions = origActions;
                        origReturned = true;
                    }
                }
                catch (e) {}
            }

            if (!origReturned)
            {
                var sourceList = null;
                if (unitGlobal !== null && unitGlobal !== undefined &&
                    typeof unitGlobal.actionList !== "undefined")
                {
                    sourceList = unitGlobal.actionList;
                }
                else if (typeof UNIT !== "undefined" && UNIT !== null &&
                         typeof UNIT.actionList !== "undefined")
                {
                    sourceList = UNIT.actionList;
                }
                if (sourceList !== null)
                {
                    for (var i = 0; i < sourceList.length; i++)
                    {
                        actions.push(sourceList[i]);
                    }
                }
            }

            // Inject Place and Mine for empowered units
            if (unit !== null && unit !== undefined)
            {
                try
                {
                    var unitVars = unit.getVariables();
                    var empoweredVar = unitVars.getVariable("MU_EMPOWERED");
                    if (empoweredVar !== null)
                    {
                        if (actions.indexOf("ACTION_MU_PLACE_TERRAIN") === -1)
                        {
                            actions.push("ACTION_MU_PLACE_TERRAIN");
                        }
                        if (actions.indexOf("ACTION_MU_MINE_PIPE") === -1)
                        {
                            actions.push("ACTION_MU_MINE_PIPE");
                        }
                    }
                }
                catch (e) {}
            }

            // ============================================================
            // Restrict actions during Weapon Constructor construction
            // or synthesis. Only the active action and WAIT are allowed.
            // ============================================================
            if (unit !== null && unit !== undefined)
            {
                try
                {
                    var unitVars2 = unit.getVariables();
                    var setVar = unitVars2.getVariable("MU_WC_SET_ACTIVE");
                    var fixVar = unitVars2.getVariable("MU_WC_FIX_ACTIVE");
                    if (setVar !== null || fixVar !== null)
                    {
                        var restricted = ["ACTION_WAIT"];
                        if (setVar !== null)
                        {
                            restricted.push("ACTION_MU_SET_WEAPON");
                        }
                        if (fixVar !== null)
                        {
                            restricted.push("ACTION_MU_FIX_WEAPON");
                        }
                        actions = restricted;
                    }
                }
                catch (e) {}
            }

            // ============================================================
            // PipeBin bad debuff: restrict to WAIT only (bad=2 = skip turn)
            // ============================================================
            if (unit !== null && unit !== undefined)
            {
                try
                {
                    var pbVars3 = unit.getVariables();
                    var pbBadActVar = pbVars3.getVariable("MU_PIPEBIN_BAD");
                    if (pbBadActVar !== null && pbBadActVar.readDataInt32() === 2)
                    {
                        actions = ["ACTION_WAIT"];
                    }
                }
                catch (e) {}
            }

            // ============================================================
            // The Great Owl: if just flew up this turn, restrict to WAIT only
            // ============================================================
            if (unit !== null && unit !== undefined && unit.getUnitID() === "THE_GREAT_OWL")
            {
                try
                {
                    var tgoVars = unit.getVariables();
                    var flewVar = tgoVars.getVariable("TGO_FLEW_UP_THIS_TURN");
                    if (flewVar !== null && flewVar.readDataBool() === true)
                    {
                        actions = ["ACTION_WAIT"];
                    }
                }
                catch (e) {}
            }

            return actions;
        };

        // ============================================================
        // 5. Wrap UNIT.moveUnit to reset mining/construction/synthesis
        //    progress on move
        // ============================================================
        var originalMoveUnit = UNIT.moveUnit;
        UNIT.moveUnit = function(unit, action, map)
        {
            if (unit !== null && unit !== undefined)
            {
                try
                {
                    var unitVars = unit.getVariables();
                    var actionTarget = action.getActionTarget();
                    var targetField = action.getTarget();
                    var moved = (actionTarget.x !== targetField.x ||
                                 actionTarget.y !== targetField.y);

                    // Reset mining progress on move
                    var miningVar = unitVars.getVariable("MU_MINING_PROGRESS");
                    if (miningVar !== null && moved)
                    {
                        unitVars.deleteVariable("MU_MINING_PROGRESS");
                        unitVars.deleteVariable("MU_MINING_X");
                        unitVars.deleteVariable("MU_MINING_Y");
                    }

                    // Reset Weapon Constructor construction on move
                    if (moved)
                    {
                        var setActive = unitVars.getVariable("MU_WC_SET_ACTIVE");
                        if (setActive !== null)
                        {
                            unitVars.deleteVariable("MU_WC_SET_ACTIVE");
                            unitVars.deleteVariable("MU_WC_SET_TARGET_X");
                            unitVars.deleteVariable("MU_WC_SET_TARGET_Y");
                            unitVars.deleteVariable("MU_WC_SET_WEAPON_TYPE");
                            unitVars.deleteVariable("MU_WC_SET_DIRECTION");
                            unitVars.deleteVariable("MU_WC_SET_OWNER_ID");
                            unitVars.deleteVariable("MU_WC_SET_PROGRESS");
                            // Note: MU_PROTECTED is cleared at next startOfTurn
                        }

                        // Reset Weapon Constructor synthesis on move
                        var fixActive = unitVars.getVariable("MU_WC_FIX_ACTIVE");
                        if (fixActive !== null)
                        {
                            unitVars.deleteVariable("MU_WC_FIX_ACTIVE");
                            unitVars.deleteVariable("MU_WC_FIX_TILES");
                            unitVars.deleteVariable("MU_WC_FIX_RESULT_TYPE");
                            unitVars.deleteVariable("MU_WC_FIX_DIRECTION");
                            unitVars.deleteVariable("MU_WC_FIX_ANCHOR_X");
                            unitVars.deleteVariable("MU_WC_FIX_ANCHOR_Y");
                            unitVars.deleteVariable("MU_WC_FIX_OWNER_ID");
                            unitVars.deleteVariable("MU_WC_FIX_PROGRESS");
                        }
                    }
                }
                catch (e) {}
            }
            if (typeof originalMoveUnit === "function")
            {
                originalMoveUnit.call(this, unit, action, map);
            }

            // ============================================================
            // PipeBin contact contamination: after a unit moves, check
            // if it is now adjacent to a 3-layer bad unit. If so, give
            // 1 rubbish layer + dirty buff (first contact only).
            // ============================================================
            if (unit !== null && unit !== undefined)
            {
                try
                {
                    var pbActionTarget = action.getActionTarget();
                    var pbTargetField = action.getTarget();
                    var pbMoved = (pbActionTarget.x !== pbTargetField.x ||
                                  pbActionTarget.y !== pbTargetField.y);
                    if (pbMoved && typeof MU_PIPEBIN !== "undefined" && MU_PIPEBIN !== null)
                    {
                        MU_PIPEBIN.checkContactContamination(unit, map);
                    }
                }
                catch (e) {}
            }
        };

        MU_WRAPPERS_INSTALLED = true;

        // ============================================================
        // 6. Register THE_GREAT_OWL at Airport
        // ============================================================
        MU_SYSTEM.registerAirportUnit();

        // ============================================================
        // 7. Patch HOELLIUM movement table to allow entering Spitor cells
        // ============================================================
        if (typeof MOVE_HOELLIUM !== "undefined" && MOVE_HOELLIUM !== null)
        {
            var originalHoelliumGetMovementPoints = MOVE_HOELLIUM.getMovementpoints;
            MOVE_HOELLIUM.getMovementpoints = function(terrain, unit, currentTerrain, trapChecking, map)
            {
                var targetUnit = terrain.getUnit();
                if (targetUnit !== null &&
                    targetUnit.getUnitID() === "MU_SPITOR" &&
                    targetUnit.getOwner() === unit.getOwner() &&
                    targetUnit.getLoadedUnitCount() < targetUnit.getLoadingPlace())
                {
                    return 1;
                }
                return originalHoelliumGetMovementPoints.call(this, terrain, unit, currentTerrain, trapChecking, map);
            };
        }
    },

    // ================================================================
    // registerAirportUnit: Add THE_GREAT_OWL to Airport production list.
    // Called from: installWrappers, registerTransportUnits, mapstart.js.
    // Idempotent — checks for duplicates before adding.
    // ================================================================
    registerAirportUnit: function()
    {
        if (typeof AIRPORT !== "undefined" && AIRPORT !== null &&
            typeof AIRPORT.constructionList !== "undefined" &&
            AIRPORT.constructionList !== null)
        {
            var list = AIRPORT.constructionList;
            if (list.indexOf("THE_GREAT_OWL") === -1)
            {
                list.push("THE_GREAT_OWL");
            }
            if (list.indexOf("THE_BLACK_ONYX") === -1)
            {
                list.push("THE_BLACK_ONYX");
            }
        }
    },

    // ================================================================
    // registerTransportUnits: Add custom unit IDs to vanilla transport
    // units' transportList arrays.
    // Called from: each MoreUnits unit script + mapstart.js gameStart.
    // Idempotent — checks for duplicates before adding.
    // ================================================================
    registerTransportUnits: function()
    {
        // ETA (infantry) → APC, T_HELI (Transport Helicopter), LANDER
        var infantryTransports = ["APC", "T_HELI", "LANDER"];
        var etaID = "MU_EMPOWER_TERRAIN_EDITOR";

        // BackTrackCar, LargeMissile (ground) → LANDER (ship), TRANSPORTPLANE (special aircraft)
        var groundTransports = ["LANDER", "TRANSPORTPLANE"];
        var groundUnits = ["MU_BACKTRACKCAR", "MU_LARGEMISSILE", "MU_WEAPON_CONSTRUCTOR", "MU_PIPEBIN", "MU_PIPETHINKER", "MU_SPITOR"];

        var i, j, transport, list;

        // Add ETA to infantry carriers (APC, T_HELI, LANDER)
        for (i = 0; i < infantryTransports.length; i++)
        {
            transport = Global[infantryTransports[i]];
            if (transport !== null && transport !== undefined &&
                transport.transportList !== null && transport.transportList !== undefined)
            {
                list = transport.transportList;
                if (list.indexOf(etaID) === -1)
                {
                    list.push(etaID);
                }
            }
        }

        // Add ground units to ground carriers (LANDER, TRANSPORTPLANE)
        // Note: LANDER appears in both lists — ETA is added as infantry above,
        // BackTrackCar/LargeMissile added as ground here. No conflict since
        // LANDER's transportList already carries both infantry and ground units.
        for (i = 0; i < groundTransports.length; i++)
        {
            transport = Global[groundTransports[i]];
            if (transport !== null && transport !== undefined &&
                transport.transportList !== null && transport.transportList !== undefined)
            {
                list = transport.transportList;
                for (j = 0; j < groundUnits.length; j++)
                {
                    if (list.indexOf(groundUnits[j]) === -1)
                    {
                        list.push(groundUnits[j]);
                    }
                }
            }
        }
        // Also ensure THE_GREAT_OWL is registered at Airport
        MU_SYSTEM.registerAirportUnit();
    }
};

// ================================================================
// Attempt to install wrappers immediately.
// UNIT may not be loaded yet (if mu_system.js loads before unit.js),
// in which case unit scripts will call installWrappers() later.
// ================================================================
MU_SYSTEM.installWrappers();
MU_SYSTEM.registerTransportUnits();
