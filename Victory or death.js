var MAP_VICTORY_OR_DEATH =
{
    WIDTH: 24,
    HEIGHT: 25,
    ARC: {x: 16, y: 7},
    CRYSTAL: {x: 21, y: 19},
    LOWER_HQ: {x: 1, y: 19},
    FACTORY: {x: 13, y: 18},
    CANNONS: [[12, 3], [17, 3], [12, 8], [17, 8]],
    AIRLIFT: [[0, 4], [1, 4], [1, 5], [1, 6], [1, 7]],
    AIRLIFT_ACTION: "ACTION_MAP_BLACK_ARC_AIRLIFT",

    matches: function(map)
    {
        return map !== null && map !== undefined &&
               map.getMapWidth() === MAP_VICTORY_OR_DEATH.WIDTH &&
               map.getMapHeight() === MAP_VICTORY_OR_DEATH.HEIGHT;
    },

    buildingAt: function(map, x, y)
    {
        if (!map.onMap(x, y))
        {
            return null;
        }
        return map.getTerrain(x, y).getBuilding();
    },

    arcAt: function(map, x, y)
    {
        var building = MAP_VICTORY_OR_DEATH.buildingAt(map, x, y);
        return building !== null && building !== undefined &&
               building.getBuildingID().indexOf("ZBLACK_ARC") === 0;
    },

    savedFlag: function(map, name)
    {
        var vars = map.getVariables();
        var flag = vars.getVariable(name);
        if (flag === null)
        {
            flag = vars.createVariable(name);
            flag.writeDataBool(false);
        }
        return flag;
    },

    install: function(map)
    {
        if (!MAP_VICTORY_OR_DEATH.matches(map))
        {
            return;
        }
        MAP_VICTORY_OR_DEATH.savedFlag(map, "MAP_VOD_ARC_DESTROYED");
        MAP_VICTORY_OR_DEATH.savedFlag(map, "MAP_VOD_CRYSTAL_DESTROYED");
        MAP_VICTORY_OR_DEATH.installFireProtection();
        MAP_VICTORY_OR_DEATH.installBombardTarget();
        MAP_VICTORY_OR_DEATH.installAirlift();
    },

    installFireProtection: function()
    {
        if (MAP_VICTORY_OR_DEATH.fireWrapped ||
            typeof ACTION_FIRE === "undefined" ||
            typeof ACTION_FIRE.calcEnviromentDamage !== "function")
        {
            return;
        }
        MAP_VICTORY_OR_DEATH.fireWrapped = true;
        var original = ACTION_FIRE.calcEnviromentDamage;
        ACTION_FIRE.calcEnviromentDamage = function(action, attacker, weapon,
                                                    attackerPosition, target,
                                                    terrainId, luckMode)
        {
            var map = attacker.getMap();
            if (MAP_VICTORY_OR_DEATH.matches(map) &&
                MAP_VICTORY_OR_DEATH.arcAt(map, target.x, target.y))
            {
                return 0;
            }
            return original.call(ACTION_FIRE, action, attacker, weapon,
                                 attackerPosition, target, terrainId, luckMode);
        };
    },

    installBombardTarget: function()
    {
        if (typeof ACTION_BLACK_ARC_BOMBARD === "undefined" ||
            ACTION_BLACK_ARC_BOMBARD === null)
        {
            return;
        }
        ACTION_BLACK_ARC_BOMBARD.getStepData = function(action, data, map)
        {
            if (MAP_VICTORY_OR_DEATH.matches(map) &&
                MAP_VICTORY_OR_DEATH.arcAt(map,
                    MAP_VICTORY_OR_DEATH.ARC.x,
                    MAP_VICTORY_OR_DEATH.ARC.y))
            {
                data.addPoint(Qt.point(MAP_VICTORY_OR_DEATH.FACTORY.x,
                                       MAP_VICTORY_OR_DEATH.FACTORY.y));
            }
            else
            {
                data.setAllFields(true);
            }
            data.setShowZData(false);
        };
    },

    installAirlift: function()
    {
        for (var id in Global)
        {
            var unit = Global[id];
            if (unit !== null && unit !== undefined &&
                unit.actionList !== undefined &&
                typeof unit.actionList.indexOf === "function" &&
                typeof unit.getUnitType === "function" &&
                unit.getUnitType() === GameEnums.UnitType_Air &&
                unit.actionList.indexOf(MAP_VICTORY_OR_DEATH.AIRLIFT_ACTION) < 0)
            {
                unit.actionList.push(MAP_VICTORY_OR_DEATH.AIRLIFT_ACTION);
            }
        }
    },

    airliftDestinations: function(map)
    {
        var result = [];
        for (var i = 0; i < MAP_VICTORY_OR_DEATH.AIRLIFT.length; i++)
        {
            var point = MAP_VICTORY_OR_DEATH.AIRLIFT[i];
            if (map.onMap(point[0], point[1]) &&
                map.getTerrain(point[0], point[1]).getUnit() === null)
            {
                result.push(point);
            }
        }
        return result;
    },

    destroyArcAndClearSky: function(map)
    {
        var flag = MAP_VICTORY_OR_DEATH.savedFlag(map, "MAP_VOD_ARC_DESTROYED");
        if (flag.readDataBool())
        {
            return;
        }
        var arc = MAP_VICTORY_OR_DEATH.buildingAt(map,
            MAP_VICTORY_OR_DEATH.ARC.x, MAP_VICTORY_OR_DEATH.ARC.y);
        if (arc !== null && arc.getBuildingID().indexOf("ZBLACK_ARC") === 0)
        {
            arc.setHp(0);
            Global[arc.getBuildingID()].onDestroyed(arc, map);
        }
        flag.writeDataBool(true);
        for (var x = 0; x < map.getMapWidth(); x++)
        {
            for (var y = 0; y < 12; y++)
            {
                var terrain = map.getTerrain(x, y);
                if (terrain.getUnit() !== null)
                {
                    terrain.getUnit().killUnit();
                }
                if (terrain.getBuilding() !== null)
                {
                    terrain.removeBuilding();
                }
                map.replaceTerrainOnly("PLAINS", x, y);
            }
        }
    },

    updateMission: function(map)
    {
        if (!MAP_VICTORY_OR_DEATH.matches(map))
        {
            return;
        }
        var allCannonsGone = true;
        for (var i = 0; i < MAP_VICTORY_OR_DEATH.CANNONS.length; i++)
        {
            var p = MAP_VICTORY_OR_DEATH.CANNONS[i];
            var cannon = MAP_VICTORY_OR_DEATH.buildingAt(map, p[0], p[1]);
            if (cannon !== null &&
                cannon.getBuildingID().indexOf("ZGHOST_CANNON_") === 0)
            {
                allCannonsGone = false;
                break;
            }
        }
        if (allCannonsGone)
        {
            MAP_VICTORY_OR_DEATH.destroyArcAndClearSky(map);
        }
        var crystalFlag = MAP_VICTORY_OR_DEATH.savedFlag(
            map, "MAP_VOD_CRYSTAL_DESTROYED");
        var crystal = MAP_VICTORY_OR_DEATH.buildingAt(map,
            MAP_VICTORY_OR_DEATH.CRYSTAL.x,
            MAP_VICTORY_OR_DEATH.CRYSTAL.y);
        if (!crystalFlag.readDataBool() &&
            (crystal === null || crystal.getBuildingID() !== "ZCRYSTALL"))
        {
            crystalFlag.writeDataBool(true);
            var p1 = map.getPlayer(0);
            var p3 = map.getPlayer(2);
            for (var playerId = 0; playerId < map.getPlayerCount(); playerId++)
            {
                var player = map.getPlayer(playerId);
                if (player !== p1 && player !== p3 &&
                    !player.isAlly(p1) && !player.isAlly(p3) &&
                    !player.getIsDefeated())
                {
                    player.defeatPlayer(null, false);
                }
            }
            map.getGameRules().checkVictory();
        }
    },

    fireWrapped: false
};

var Constructor = function()
{
    this.gameStart = function(map)
    {
        MAP_VICTORY_OR_DEATH.install(map);
    };

    this.onGameLoaded = function(menu, map)
    {
        MAP_VICTORY_OR_DEATH.install(map);
        MAP_VICTORY_OR_DEATH.updateMission(map);
    };

    this.actionDone = function(action, map)
    {
        MAP_VICTORY_OR_DEATH.updateMission(map);
    };

    this.getVictoryInfo = function(map)
    {
        return qsTr("Destroy the Black Crystal or eliminate the enemy team.");
    };
};

Constructor.prototype = BASEGAMESCRIPT;
var gameScript = new Constructor();

var AirliftConstructor = function()
{
    this.canBePerformed = function(action, map)
    {
        var unit = action.getTargetUnit();
        if (!MAP_VICTORY_OR_DEATH.matches(map) || unit === null ||
            unit.getUnitType() !== GameEnums.UnitType_Air ||
            unit.getX() !== MAP_VICTORY_OR_DEATH.LOWER_HQ.x ||
            unit.getY() !== MAP_VICTORY_OR_DEATH.LOWER_HQ.y ||
            unit.getOwner() !== map.getCurrentPlayer())
        {
            return false;
        }
        return MAP_VICTORY_OR_DEATH.airliftDestinations(map).length > 0;
    };

    this.getActionText = function(map) { return qsTr("Move"); };
    this.getName = function() { return qsTr("Move"); };
    this.getIcon = function(map) { return "icon_move"; };
    this.getStepInputType = function(action, map) { return "FIELD"; };
    this.getStepCursor = function(action, cursor)
    {
        cursor.setCursor("cursor+move");
    };
    this.getStepData = function(action, data, map)
    {
        var free = MAP_VICTORY_OR_DEATH.airliftDestinations(map);
        if (free.length > 0)
        {
            var point = free[globals.randInt(0, free.length - 1)];
            data.addPoint(Qt.point(point[0], point[1]));
        }
    };
    this.isFinalStep = function(action, map)
    {
        return action.getInputStep() === 1;
    };
    this.perform = function(action, map)
    {
        var unit = action.getTargetUnit();
        var target = action.getTarget();
        if (!this.canBePerformed(action, map) || target === null ||
            target === undefined || map.getTerrain(target.x, target.y).getUnit() !== null)
        {
            throw new Error("Invalid Black Arc airlift");
        }
        unit.moveUnitToField(target.x, target.y);
        unit.setOwner(map.getPlayer(2));
        unit.setHasMoved(true);
    };
    this.getDescription = function()
    {
        return qsTr("Move this air unit from the southern HQ to a free upper-sky tile and transfer it to P3.");
    };
};

Constructor.prototype = ACTION;
var ACTION_MAP_BLACK_ARC_AIRLIFT = new AirliftConstructor();
