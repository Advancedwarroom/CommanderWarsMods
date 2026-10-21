var MAP_MEANS_TO_END =
{
    MAP_VARIABLE: "MU_MEANS_TO_END_MISSION",
    VICTORY_RULE: "VICTORYRULE_MEANS_TO_END",
    MAP_NAME_HINT: "Means",
    MAP_WIDTH: 19,
    MAP_HEIGHT: 52,
    UPPER_HALF_Y_MAX: 26,
    LOWER_HALF_Y_MIN: 26,
    CYCLE_LENGTH: 6,
    LOCKED_TURNS: 5,
    CRYSTAL_BUILDING_ID: "ZCRYSTALL",
    GRAND_BOLT_PREFIX: "ZGRAND_BOLT_",
    HASCRYSTAL_DESTROYED_VARIABLE: "MU_MEANS_TO_END_CRYSTAL_DESTROYED",

    matchesMapLayout: function(map)
    {
        if (map === null || map === undefined)
        {
            return false;
        }
        if (map.getMapWidth() !== MAP_MEANS_TO_END.MAP_WIDTH ||
            map.getMapHeight() !== MAP_MEANS_TO_END.MAP_HEIGHT)
        {
            return false;
        }
        var mapName = "";
        if (typeof map.getMapName === "function")
        {
            mapName = map.getMapName();
        }
        return mapName.indexOf(MAP_MEANS_TO_END.MAP_NAME_HINT) >= 0 ||
               mapName.indexOf("Means to an") >= 0 ||
               mapName.indexOf("Means") >= 0;
    },

    isMissionMap: function(map)
    {
        if (map === null || map === undefined)
        {
            return false;
        }
        var variable = map.getVariables().getVariable(MAP_MEANS_TO_END.MAP_VARIABLE);
        return (variable !== null && variable.readDataBool()) ||
               MAP_MEANS_TO_END.matchesMapLayout(map);
    },

    install: function(map)
    {
        if (!MAP_MEANS_TO_END.matchesMapLayout(map))
        {
            return;
        }
        var variables = map.getVariables();
        if (variables.getVariable(MAP_MEANS_TO_END.MAP_VARIABLE) === null)
        {
            variables.createVariable(MAP_MEANS_TO_END.MAP_VARIABLE).writeDataBool(true);
        }
        var rules = map.getGameRules();
        if (rules !== null && rules !== undefined && !rules.hasVictoryRule(MAP_MEANS_TO_END.VICTORY_RULE))
        {
            rules.addVictoryRule(MAP_MEANS_TO_END.VICTORY_RULE);
        }
        MAP_MEANS_TO_END.installTeleportActions();
        MAP_MEANS_TO_END.ensureTrackingVariables(map);
    },

    ensureTrackingVariables: function(map)
    {
        if (!MAP_MEANS_TO_END.isMissionMap(map))
        {
            return;
        }
        var variables = map.getVariables();
        var names = [
            MAP_MEANS_TO_END.HASCRYSTAL_DESTROYED_VARIABLE,
            "MU_MEANS_TO_END_TURN_CYCLE",
            "MU_MEANS_TO_END_TURN_INDEX",
            "MU_MEANS_TO_END_UPPER_CLEAR"
        ];
        for (var i = 0; i < names.length; i++)
        {
            if (variables.getVariable(names[i]) === null)
            {
                variables.createVariable(names[i]).writeDataBool(false);
            }
        }
    },

    installTeleportActions: function()
    {
        for (var unitID in Global)
        {
            var definition = Global[unitID];
            if (definition === null || definition === undefined ||
                definition.actionList === null || definition.actionList === undefined ||
                typeof definition.actionList.indexOf !== "function" ||
                typeof definition.actionList.push !== "function")
            {
                continue;
            }
            if (definition.actionList.indexOf("ACTION_MEANS_TO_END_TP") < 0)
            {
                definition.actionList.push("ACTION_MEANS_TO_END_TP");
            }
        }
    },

    getCurrentTurnNumber: function(map)
    {
        if (map === null || map === undefined)
        {
            return 0;
        }
        if (typeof map.getCurrentDay === "function")
        {
            return map.getCurrentDay();
        }
        if (typeof map.getCurrentTurn === "function")
        {
            return map.getCurrentTurn();
        }
        if (typeof map.getTurn === "function")
        {
            return map.getTurn();
        }
        if (map.getGameRules && map.getGameRules() !== null && map.getGameRules() !== undefined)
        {
            var rules = map.getGameRules();
            if (typeof rules.getCurrentTurn === "function")
            {
                return rules.getCurrentTurn();
            }
            if (typeof rules.getTurn === "function")
            {
                return rules.getTurn();
            }
        }
        return 0;
    },

    getTurnCycleState: function(map)
    {
        if (!MAP_MEANS_TO_END.isMissionMap(map))
        {
            return { turn: 0, index: 0, locked: false };
        }
        var turn = MAP_MEANS_TO_END.getCurrentTurnNumber(map);
        if (turn <= 0)
        {
            return { turn: 0, index: 0, locked: false };
        }
        var index = ((turn - 1) % MAP_MEANS_TO_END.CYCLE_LENGTH);
        return {
            turn: turn,
            index: index,
            locked: index > 0
        };
    },

    canWeakPointOperate: function(map)
    {
        if (!MAP_MEANS_TO_END.isMissionMap(map))
        {
            return true;
        }
        var state = MAP_MEANS_TO_END.getTurnCycleState(map);
        return state.index === 0;
    },

    getBuilding: function(map, x, y)
    {
        if (map === null || map === undefined || !map.onMap(x, y))
        {
            return null;
        }
        return map.getTerrain(x, y).getBuilding();
    },

    isBuildingOfType: function(building, prefix)
    {
        return building !== null && building !== undefined &&
               typeof building.getBuildingID === "function" &&
               building.getBuildingID().indexOf(prefix) === 0;
    },

    getCrystalLocations: function(map)
    {
        var result = [];
        for (var x = 0; x < map.getMapWidth(); x++)
        {
            for (var y = 0; y < map.getMapHeight(); y++)
            {
                var building = MAP_MEANS_TO_END.getBuilding(map, x, y);
                if (building !== null && building.getBuildingID() === MAP_MEANS_TO_END.CRYSTAL_BUILDING_ID)
                {
                    result.push({ x: x, y: y, building: building });
                }
            }
        }
        return result;
    },

    getWeakPointLocations: function(map)
    {
        var weakPointIds = [
            "ZGRAND_BOLT_EYE_LEFT",
            "ZGRAND_BOLT_EYE_MIDDLE",
            "ZGRAND_BOLT_EYE_RIGHT",
            "ZGRAND_BOLT_EYE_LEFT_DESTROYED",
            "ZGRAND_BOLT_EYE_MIDDLE_DESTROYED",
            "ZGRAND_BOLT_EYE_RIGHT_DESTROYED"
        ];
        var result = [];
        for (var x = 0; x < map.getMapWidth(); x++)
        {
            for (var y = 0; y < map.getMapHeight(); y++)
            {
                var building = MAP_MEANS_TO_END.getBuilding(map, x, y);
                if (building === null ||
                    typeof building.getBuildingID !== "function")
                {
                    continue;
                }
                var buildingId = building.getBuildingID();
                for (var i = 0; i < weakPointIds.length; i++)
                {
                    if (buildingId === weakPointIds[i])
                    {
                        result.push({
                            x: x,
                            y: y,
                            building: building,
                            destroyed: buildingId.indexOf("_DESTROYED") >= 0
                        });
                        break;
                    }
                }
            }
        }
        return result;
    },

    isWeakPointLocked: function(map, building)
    {
        if (!MAP_MEANS_TO_END.isMissionMap(map) ||
            building === null || building === undefined)
        {
            return false;
        }
        var points = MAP_MEANS_TO_END.getWeakPointLocations(map);
        for (var i = 0; i < points.length; i++)
        {
            if (points[i].building === building)
            {
                var crystals = MAP_MEANS_TO_END.getCrystalLocations(map);
                return crystals.length > 0 && crystals.length < 3;
            }
        }
        return false;
    },

    areAllCrystalsDestroyed: function(map)
    {
        if (!MAP_MEANS_TO_END.isMissionMap(map))
        {
            return false;
        }
        var crystals = MAP_MEANS_TO_END.getCrystalLocations(map);
        for (var i = 0; i < crystals.length; i++)
        {
            if (crystals[i].building !== null && crystals[i].building.getHp() > 0)
            {
                return false;
            }
        }
        return crystals.length > 0;
    },

    areAllGrandBoltsDestroyed: function(map)
    {
        if (!MAP_MEANS_TO_END.isMissionMap(map))
        {
            return false;
        }
        var weakPoints = MAP_MEANS_TO_END.getWeakPointLocations(map);
        if (weakPoints.length === 0)
        {
            return false;
        }
        for (var i = 0; i < weakPoints.length; i++)
        {
            if (!weakPoints[i].destroyed &&
                weakPoints[i].building !== null &&
                weakPoints[i].building.getHp() > 0)
            {
                return false;
            }
        }
        return true;
    },

    onWeakPointDestroyed: function(building, map)
    {
        if (!MAP_MEANS_TO_END.isMissionMap(map))
        {
            return;
        }
        if (MAP_MEANS_TO_END.areAllGrandBoltsDestroyed(map))
        {
            var playerTwo = map.getPlayer(1);
            var playerFour = map.getPlayer(3);
            if (playerTwo !== null)
            {
                playerTwo.setDefeated(true);
            }
            if (playerFour !== null)
            {
                playerFour.setDefeated(true);
            }
            if (map.getGameRules !== undefined && map.getGameRules() !== null)
            {
                map.getGameRules().checkVictory();
            }
        }
    },

    onCrystalDestroyed: function(building, map)
    {
        if (!MAP_MEANS_TO_END.isMissionMap(map))
        {
            return;
        }
        if (MAP_MEANS_TO_END.areAllCrystalsDestroyed(map))
        {
            for (var i = 0; i < 4; i++)
            {
                var player = map.getPlayer(i);
                if (player !== null && (i === 2 || i === 3))
                {
                    player.setDefeated(true);
                }
            }
            MAP_MEANS_TO_END.clearUpperHalf(map);
            if (map.getGameRules !== undefined && map.getGameRules() !== null)
            {
                map.getGameRules().checkVictory();
            }
        }
    },

    clearUpperHalf: function(map)
    {
        if (map === null || map === undefined)
        {
            return;
        }
        for (var x = 0; x < map.getMapWidth(); x++)
        {
            for (var y = 0; y < MAP_MEANS_TO_END.UPPER_HALF_Y_MAX && y < map.getMapHeight(); y++)
            {
                var unit = map.getTerrain(x, y).getUnit();
                var building = map.getTerrain(x, y).getBuilding();
                if (building !== null && building !== undefined)
                {
                    building.setHp(0);
                }
                if (unit !== null && unit !== undefined)
                {
                    unit.killUnit();
                }
            }
        }
    },

    getTeleportDestinations: function(map)
    {
        var destinations = [];
        if (map === null || map === undefined)
        {
            return destinations;
        }
        var hq = null;
        for (var x = 0; x < map.getMapWidth(); x++)
        {
            for (var y = 0; y < MAP_MEANS_TO_END.UPPER_HALF_Y_MAX && y < map.getMapHeight(); y++)
            {
                var terrain = map.getTerrain(x, y);
                if (terrain === null || terrain === undefined)
                {
                    continue;
                }
                var building = terrain.getBuilding();
                if (building !== null && building !== undefined &&
                    building.getBuildingID() === "HQ" &&
                    building.getOwner() !== null &&
                    building.getOwner().getPlayerID() === 2)
                {
                    hq = { x: x, y: y, unit: terrain.getUnit() };
                    break;
                }
            }
            if (hq !== null)
            {
                break;
            }
        }
        if (hq !== null && hq.unit === null)
        {
            return [{ x: hq.x, y: hq.y }];
        }
        for (var x2 = 0; x2 < map.getMapWidth(); x2++)
        {
            for (var y2 = 0; y2 < MAP_MEANS_TO_END.UPPER_HALF_Y_MAX &&
                 y2 < map.getMapHeight(); y2++)
            {
                var otherTerrain = map.getTerrain(x2, y2);
                if (otherTerrain === null || otherTerrain === undefined ||
                    otherTerrain.getUnit() !== null)
                {
                    continue;
                }
                var otherBuilding = otherTerrain.getBuilding();
                if (otherBuilding !== null && otherBuilding !== undefined &&
                    otherBuilding.getBuildingID() !== "HQ" &&
                    otherBuilding.getOwner() !== null &&
                    otherBuilding.getOwner().getPlayerID() === 2)
                {
                    destinations.push({ x: x2, y: y2 });
                }
            }
        }
        return destinations;
    },

    getLowerHqTeleportAction: function(map)
    {
        if (!MAP_MEANS_TO_END.isMissionMap(map))
        {
            return null;
        }
        return "ACTION_MEANS_TO_END_TP";
    },

    onEndTurn: function(map)
    {
        if (!MAP_MEANS_TO_END.isMissionMap(map))
        {
            return;
        }
        var state = MAP_MEANS_TO_END.getTurnCycleState(map);
        if (state.turn >= 26)
        {
            var variables = map.getVariables();
            var timeLimit = variables.getVariable("MU_MEANS_TO_END_TIME_LIMIT");
            if (timeLimit !== null && timeLimit.readDataBool())
            {
                return;
            }
            if (timeLimit === null)
            {
                timeLimit = variables.createVariable("MU_MEANS_TO_END_TIME_LIMIT");
            }
            timeLimit.writeDataBool(true);
            var playerOne = map.getPlayer(0);
            var playerThree = map.getPlayer(2);
            if (playerOne !== null && !playerOne.getIsDefeated())
            {
                playerOne.defeatPlayer(null, false);
            }
            if (playerThree !== null && !playerThree.getIsDefeated())
            {
                playerThree.defeatPlayer(null, false);
            }
            var rules = map.getGameRules();
            if (rules !== null && rules !== undefined)
            {
                rules.checkVictory();
            }
        }
    },
};

MAP_MEANS_TO_END.installTeleportActions();
