// __coreai.js - Core AI data for MoreUnits mod
// Provides unit group definitions and production planning.
// This is a simplified AI that supports all standard units plus MoreUnits custom units.

var COREAI =
{
    // Infantry group - includes standard infantry + MoreUnits infantry
    infantryGroup: ["INFANTRY", "MECH", "MU_EMPOWER_TERRAIN_EDITOR"],

    // Light tank group
    lightTankGroup: ["LIGHT_TANK", "HOVERCRAFT"],

    // Medium tank group
    mediumTankGroup: ["MEDIUM_TANK", "NEOTANK"],

    // Heavy tank group
    heavyTankGroup: ["HEAVY_TANK", "MEGATANK"],

    // Ranged group
    rangedGroup: ["ARTILLERY", "ROCKETTHROWER", "MISSILE", "ANTITANKCANNON"],

    // Recon group
    reconGroup: ["RECON", "FLARE"],

    // Support group
    supportGroup: ["APC", "TRUCK"],

    // Special units from MoreUnits
    specialGroup: ["MU_LARGEMISSILE", "MU_BACKTRACKCAR", "MU_WEAPON_CONSTRUCTOR", "MU_PIPEBIN", "MU_PIPETHINKER"],

    // All ground units that can be built at a Factory
    allGroundUnits: ["INFANTRY", "MECH", "RECON", "FLARE", "APC", "TRUCK",
                     "LIGHT_TANK", "HOVERCRAFT", "MEDIUM_TANK", "NEOTANK",
                     "HEAVY_TANK", "MEGATANK", "ARTILLERY", "ROCKETTHROWER",
                     "MISSILE", "ANTITANKCANNON",
                     "MU_LARGEMISSILE", "MU_BACKTRACKCAR", "MU_EMPOWER_TERRAIN_EDITOR", "MU_WEAPON_CONSTRUCTOR", "MU_PIPEBIN", "MU_PIPETHINKER"],

    // Production: pick a unit to build from the factory
    getFactoryMenuItem: function(building, map, coData, productionSystem)
    {
        try
        {
            var owner = building.getOwner();
            var funds = owner.getFunds();
            var constructionList = building.getConstructionList();
            if (constructionList === null || constructionList === undefined)
            {
                return "";
            }

            // Find the most expensive unit we can afford
            var bestUnit = "";
            var bestCost = 0;

            for (var i = 0; i < constructionList.length; i++)
            {
                var unitID = constructionList[i];
                if (Global[unitID] !== undefined && Global[unitID] !== null)
                {
                    var cost = Global[unitID].getBaseCost();
                    if (cost <= funds && cost > bestCost)
                    {
                        bestCost = cost;
                        bestUnit = unitID;
                    }
                }
            }

            return bestUnit;
        }
        catch (e)
        {
            return "";
        }
    },

    // Initialize production system (simplified)
    initializeSimpleProductionSystem: function(coData, map, difficulty, ruleset, productionSystem)
    {
        // Minimal initialization - the production system handles the rest
    },

    // Build unit from production system
    buildUnitSimpleProductionSystem: function(building, map, coData, productionSystem, forcedUnit)
    {
        if (forcedUnit !== null && forcedUnit !== undefined && forcedUnit !== "")
        {
            return forcedUnit;
        }
        return COREAI.getFactoryMenuItem(building, map, coData, productionSystem);
    },

    // New build queue callback (simplified)
    onNewBuildQueue: function(coData, map, productionSystem)
    {
        // Minimal - no forced production adjustments
    },

    // Get high priority buildings for defense
    getHighPrioBuildings: function(player, map)
    {
        return [];
    },
};
