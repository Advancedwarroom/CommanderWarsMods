var MAP_MISSION =
{
    MAP_VARIABLE: "MU_BLACK_ARC_MISSION",
    CRYSTAL_DESTROYED_VARIABLE: "MU_BLACK_ARC_CRYSTAL_DESTROYED",
    VICTORY_RULE: "VICTORYRULE_BLACK_ARC_MISSION",
    BLACK_ARC_X: 16,
    BLACK_ARC_Y: 7,
    CRYSTAL_X: 21,
    CRYSTAL_Y: 19,
    HQ_X: 1,
    HQ_Y: 19,
    FACTORY_X: 13,
    FACTORY_Y: 18,
    GHOST_CANNONS: [[12, 3], [17, 3], [12, 8], [17, 8]],
    AIRLIFT_FIELDS: [[0, 4], [1, 4], [1, 5], [1, 6], [1, 7]],

    getBuilding: function(map, x, y)
    {
        if (map === null || map === undefined || !map.onMap(x, y))
        {
            return null;
        }
        return map.getTerrain(x, y).getBuilding();
    },

    matchesMapLayout: function(map)
    {
        if (map === null || map === undefined ||
            map.getMapWidth() !== 24 || map.getMapHeight() !== 25)
        {
            return false;
        }
        var arc = MAP_MISSION.getBuilding(map, MAP_MISSION.BLACK_ARC_X, MAP_MISSION.BLACK_ARC_Y);
        var crystal = MAP_MISSION.getBuilding(map, MAP_MISSION.CRYSTAL_X, MAP_MISSION.CRYSTAL_Y);
        return arc !== null && arc.getBuildingID().indexOf("ZBLACK_ARC") === 0 &&
               crystal !== null && crystal.getBuildingID() === "ZCRYSTALL";
    },

    isMissionMap: function(map)
    {
        if (map === null || map === undefined)
        {
            return false;
        }
        var variable = map.getVariables().getVariable(MAP_MISSION.MAP_VARIABLE);
        return (variable !== null && variable.readDataBool()) ||
               MAP_MISSION.matchesMapLayout(map);
    },

    install: function(map)
    {
        if (!MAP_MISSION.matchesMapLayout(map))
        {
            return;
        }
        var variables = map.getVariables();
        var missionVariable = variables.getVariable(MAP_MISSION.MAP_VARIABLE);
        if (missionVariable === null)
        {
            variables.createVariable(MAP_MISSION.MAP_VARIABLE).writeDataBool(true);
        }
        var rules = map.getGameRules();
        if (!rules.hasVictoryRule(MAP_MISSION.VICTORY_RULE))
        {
            rules.addVictoryRule(MAP_MISSION.VICTORY_RULE);
        }
        MAP_MISSION.installAirActions();
    },

    installAirActions: function()
    {
        for (var unitID in Global)
        {
            var definition = Global[unitID];
            if (definition !== null && definition !== undefined &&
                definition.actionList !== null && definition.actionList !== undefined &&
                typeof definition.actionList.indexOf === "function" &&
                typeof definition.actionList.push === "function" &&
                typeof definition.getUnitType === "function" &&
                definition.getUnitType() === GameEnums.UnitType_Air &&
                definition.actionList.indexOf("ACTION_BLACK_ARC_AIRLIFT") < 0)
            {
                definition.actionList.push("ACTION_BLACK_ARC_AIRLIFT");
            }
        }
    },

    isProtectedArc: function(building, map)
    {
        return MAP_MISSION.isMissionMap(map) && building !== null && building !== undefined &&
               building.getX() === MAP_MISSION.BLACK_ARC_X &&
               building.getY() === MAP_MISSION.BLACK_ARC_Y &&
               building.getBuildingID().indexOf("ZBLACK_ARC") === 0;
    },

    isArcAlive: function(map)
    {
        var arc = MAP_MISSION.getBuilding(map, MAP_MISSION.BLACK_ARC_X, MAP_MISSION.BLACK_ARC_Y);
        return arc !== null && arc.getBuildingID().indexOf("ZBLACK_ARC") === 0 &&
               arc.getHp() > 0;
    },

    areGhostCannonsDestroyed: function(map)
    {
        for (var i = 0; i < MAP_MISSION.GHOST_CANNONS.length; i++)
        {
            var point = MAP_MISSION.GHOST_CANNONS[i];
            var cannon = MAP_MISSION.getBuilding(map, point[0], point[1]);
            if (cannon !== null && cannon.getBuildingID().indexOf("ZGHOST_CANNON_") === 0)
            {
                return false;
            }
        }
        return true;
    },

    onGhostCannonDestroyed: function(building, map)
    {
        if (!MAP_MISSION.isMissionMap(map) ||
            building === null || building === undefined ||
            building.getBuildingID().indexOf("ZGHOST_CANNON_") !== 0)
        {
            return;
        }
        var isMissionCannon = false;
        for (var i = 0; i < MAP_MISSION.GHOST_CANNONS.length; i++)
        {
            var point = MAP_MISSION.GHOST_CANNONS[i];
            if (building.getX() === point[0] && building.getY() === point[1])
            {
                isMissionCannon = true;
                break;
            }
        }
        if (isMissionCannon && MAP_MISSION.areGhostCannonsDestroyed(map))
        {
            MAP_MISSION.destroyArc(map);
        }
    },

    destroyArc: function(map)
    {
        var arc = MAP_MISSION.getBuilding(map, MAP_MISSION.BLACK_ARC_X, MAP_MISSION.BLACK_ARC_Y);
        if (arc !== null && arc.getBuildingID().indexOf("ZBLACK_ARC") === 0 && arc.getHp() > 0)
        {
            arc.setHp(0);
            Global[arc.getBuildingID()].onDestroyed(arc, map);
        }
    },

    clearUpperHalf: function(map)
    {
        for (var x = 0; x < map.getMapWidth(); x++)
        {
            for (var y = 0; y < 12 && y < map.getMapHeight(); y++)
            {
                map.replaceTerrainOnly("PLAINS", x, y);
            }
        }
    },

    hasAirliftDestination: function(map)
    {
        for (var i = 0; i < MAP_MISSION.AIRLIFT_FIELDS.length; i++)
        {
            var point = MAP_MISSION.AIRLIFT_FIELDS[i];
            if (map.onMap(point[0], point[1]) &&
                map.getTerrain(point[0], point[1]).getUnit() === null)
            {
                return true;
            }
        }
        return false;
    },

    addAirliftDestination: function(data, map)
    {
        var available = [];
        for (var i = 0; i < MAP_MISSION.AIRLIFT_FIELDS.length; i++)
        {
            var point = MAP_MISSION.AIRLIFT_FIELDS[i];
            if (map.onMap(point[0], point[1]) &&
                map.getTerrain(point[0], point[1]).getUnit() === null)
            {
                available.push(point);
            }
        }
        if (available.length > 0)
        {
            var target = available[globals.randInt(0, available.length - 1)];
            data.addPoint(Qt.point(target[0], target[1]));
        }
    },

    markCrystalDestroyed: function(map)
    {
        if (!MAP_MISSION.isMissionMap(map))
        {
            return;
        }
        var variables = map.getVariables();
        var variable = variables.getVariable(MAP_MISSION.CRYSTAL_DESTROYED_VARIABLE);
        if (variable === null)
        {
            variable = variables.createVariable(MAP_MISSION.CRYSTAL_DESTROYED_VARIABLE);
        }
        variable.writeDataBool(true);
        map.getGameRules().checkVictory();
    },

    crystalWasDestroyed: function(map)
    {
        var variable = map.getVariables().getVariable(MAP_MISSION.CRYSTAL_DESTROYED_VARIABLE);
        return variable !== null && variable.readDataBool();
    },
};

MAP_MISSION.installAirActions();
