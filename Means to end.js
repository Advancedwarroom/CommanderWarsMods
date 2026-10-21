var MAP_MEANS_TO_END =
{
    WIDTH: 19,
    HEIGHT: 52,
    UPPER_Y_END: 26,
    CRYSTAL_ID: "ZCRYSTALL",
    EYE_IDS: [
        "ZGRAND_BOLT_EYE_LEFT",
        "ZGRAND_BOLT_EYE_MIDDLE",
        "ZGRAND_BOLT_EYE_RIGHT",
        "ZGRAND_BOLT_EYE_LEFT_DESTROYED",
        "ZGRAND_BOLT_EYE_MIDDLE_DESTROYED",
        "ZGRAND_BOLT_EYE_RIGHT_DESTROYED"
    ],
    TP_ACTION: "ACTION_MAP_MEANS_END_TP",
    CRYSTAL_POINTS_VAR: "MAP_MTE_CRYSTAL_POINTS",

    matches: function(map)
    {
        if (map === null || map === undefined ||
            map.getMapWidth() !== MAP_MEANS_TO_END.WIDTH ||
            map.getMapHeight() !== MAP_MEANS_TO_END.HEIGHT)
        {
            return false;
        }
        return map.getMapName().indexOf("Means") >= 0;
    },

    buildingAt: function(map, x, y)
    {
        if (!map.onMap(x, y))
        {
            return null;
        }
        return map.getTerrain(x, y).getBuilding();
    },

    isEye: function(building)
    {
        if (building === null || building === undefined)
        {
            return false;
        }
        var id = building.getBuildingID();
        return MAP_MEANS_TO_END.EYE_IDS.indexOf(id) >= 0;
    },

    isDestroyedEye: function(building)
    {
        return MAP_MEANS_TO_END.isEye(building) &&
               building.getBuildingID().indexOf("_DESTROYED") >= 0;
    },

    sortedBuildings: function(map, predicate)
    {
        var list = [];
        var seen = [];
        for (var y = 0; y < map.getMapHeight(); y++)
        {
            for (var x = 0; x < map.getMapWidth(); x++)
            {
                var building = MAP_MEANS_TO_END.buildingAt(map, x, y);
                if (building !== null && predicate(building))
                {
                    if (seen.indexOf(building) < 0)
                    {
                        seen.push(building);
                        list.push(building);
                    }
                }
            }
        }
        list.sort(function(a, b)
        {
            if (a.getX() !== b.getX())
            {
                return a.getX() - b.getX();
            }
            return a.getY() - b.getY();
        });
        return list;
    },

    crystalPoints: function(map)
    {
        var vars = map.getVariables();
        var saved = vars.getVariable(MAP_MEANS_TO_END.CRYSTAL_POINTS_VAR);
        if (saved !== null)
        {
            var values = saved.readDataListInt32();
            var restored = [];
            for (var i = 0; i + 1 < values.length; i += 2)
            {
                restored.push({x: values[i], y: values[i + 1]});
            }
            if (restored.length > 0)
            {
                return restored;
            }
        }
        var crystals = MAP_MEANS_TO_END.sortedBuildings(map, function(building)
        {
            return building.getBuildingID() === MAP_MEANS_TO_END.CRYSTAL_ID;
        });
        var points = [];
        var serialized = [];
        for (var j = 0; j < crystals.length; j++)
        {
            var point = {x: crystals[j].getX(), y: crystals[j].getY()};
            points.push(point);
            serialized.push(point.x, point.y);
        }
        if (points.length > 0)
        {
            if (saved === null)
            {
                saved = vars.createVariable(MAP_MEANS_TO_END.CRYSTAL_POINTS_VAR);
            }
            saved.writeDataListInt32(serialized);
        }
        return points;
    },

    eyeBuildings: function(map)
    {
        return MAP_MEANS_TO_END.sortedBuildings(map, function(building)
        {
            return MAP_MEANS_TO_END.isEye(building);
        });
    },

    crystalIsAlive: function(map, point)
    {
        var building = MAP_MEANS_TO_END.buildingAt(map, point.x, point.y);
        return building !== null &&
               building.getBuildingID() === MAP_MEANS_TO_END.CRYSTAL_ID &&
               building.getHp() > 0;
    },

    eyeIsLocked: function(map, eye)
    {
        var eyes = MAP_MEANS_TO_END.eyeBuildings(map);
        var crystals = MAP_MEANS_TO_END.crystalPoints(map);
        var index = eyes.indexOf(eye);
        return index >= 0 && index < crystals.length &&
               MAP_MEANS_TO_END.crystalIsAlive(map, crystals[index]);
    },

    allCrystalsDestroyed: function(map)
    {
        var points = MAP_MEANS_TO_END.crystalPoints(map);
        if (points.length !== 3)
        {
            return false;
        }
        for (var i = 0; i < points.length; i++)
        {
            if (MAP_MEANS_TO_END.crystalIsAlive(map, points[i]))
            {
                return false;
            }
        }
        return true;
    },

    allEyesDestroyed: function(map)
    {
        var eyes = MAP_MEANS_TO_END.eyeBuildings(map);
        if (eyes.length !== 3)
        {
            return false;
        }
        for (var i = 0; i < eyes.length; i++)
        {
            if (!MAP_MEANS_TO_END.isDestroyedEye(eyes[i]) &&
                eyes[i].getHp() > 0)
            {
                return false;
            }
        }
        return true;
    },

    currentDay: function(map)
    {
        return (typeof map.getCurrentDay === "function") ?
               map.getCurrentDay() : 1;
    },

    install: function(map)
    {
        if (!MAP_MEANS_TO_END.matches(map))
        {
            return;
        }
        MAP_MEANS_TO_END.crystalPoints(map);
        MAP_MEANS_TO_END.installDamageLock();
        MAP_MEANS_TO_END.installEyeActionSchedule();
        MAP_MEANS_TO_END.installMissileBoundary();
        MAP_MEANS_TO_END.installTeleportAction();
    },

    installDamageLock: function()
    {
        if (MAP_MEANS_TO_END.fireWrapped ||
            typeof ACTION_FIRE === "undefined" ||
            typeof ACTION_FIRE.calcEnviromentDamage !== "function")
        {
            return;
        }
        MAP_MEANS_TO_END.fireWrapped = true;
        var original = ACTION_FIRE.calcEnviromentDamage;
        ACTION_FIRE.calcEnviromentDamage = function(action, attacker, weapon,
                                                    attackerPosition, target,
                                                    terrainId, luckMode)
        {
            var map = attacker.getMap();
            if (MAP_MEANS_TO_END.matches(map))
            {
                var building = MAP_MEANS_TO_END.buildingAt(map,
                                                           target.x, target.y);
                if (MAP_MEANS_TO_END.isEye(building) &&
                    MAP_MEANS_TO_END.eyeIsLocked(map, building))
                {
                    return 0;
                }
            }
            return original.call(ACTION_FIRE, action, attacker, weapon,
                                 attackerPosition, target, terrainId, luckMode);
        };
    },

    installEyeActionSchedule: function()
    {
        if (MAP_MEANS_TO_END.produceWrapped ||
            typeof ACTION_PRODUCE_OOZIUM_FREE === "undefined")
        {
            return;
        }
        MAP_MEANS_TO_END.produceWrapped = true;
        var original = ACTION_PRODUCE_OOZIUM_FREE.canBePerformed;
        ACTION_PRODUCE_OOZIUM_FREE.canBePerformed = function(action, map)
        {
            if (MAP_MEANS_TO_END.matches(map))
            {
                var building = action.getTargetBuilding();
                if (MAP_MEANS_TO_END.isEye(building) &&
                    ((MAP_MEANS_TO_END.currentDay(map) - 1) % 6) !== 0)
                {
                    return false;
                }
            }
            return original.call(ACTION_PRODUCE_OOZIUM_FREE, action, map);
        };
    },

    installMissileBoundary: function()
    {
        if (MAP_MEANS_TO_END.missileWrapped ||
            typeof ACTION_MISSILE === "undefined")
        {
            return;
        }
        MAP_MEANS_TO_END.missileWrapped = true;
        ACTION_MISSILE.getStepData = function(action, data, map)
        {
            var unit = action.getTargetUnit();
            var owner = (unit !== null) ? unit.getOwner() : null;
            var input = (owner !== null) ? owner.getBaseGameInput() : null;
            var upperAi = owner !== null &&
                          (owner.getPlayerID() === 2 ||
                           owner.getPlayerID() === 3) &&
                          input !== null &&
                          input.getAiType() !== GameEnums.AiTypes_Human;
            if (MAP_MEANS_TO_END.matches(map) && upperAi)
            {
                for (var y = 0; y < MAP_MEANS_TO_END.UPPER_Y_END; y++)
                {
                    for (var x = 0; x < map.getMapWidth(); x++)
                    {
                        data.addPoint(Qt.point(x, y));
                    }
                }
                data.setShowZData(false);
                return;
            }
            data.setAllFields(true);
            data.setShowZData(false);
        };
    },

    installTeleportAction: function()
    {
        for (var id in Global)
        {
            var unit = Global[id];
            if (unit !== null && unit !== undefined &&
                unit.actionList !== undefined &&
                typeof unit.actionList.indexOf === "function" &&
                unit.actionList.indexOf(MAP_MEANS_TO_END.TP_ACTION) < 0)
            {
                unit.actionList.push(MAP_MEANS_TO_END.TP_ACTION);
            }
        }
    },

    teleportDestinations: function(map)
    {
        var hq = null;
        var fallback = [];
        for (var y = 0; y < MAP_MEANS_TO_END.UPPER_Y_END; y++)
        {
            for (var x = 0; x < map.getMapWidth(); x++)
            {
                var terrain = map.getTerrain(x, y);
                if (terrain.getUnit() !== null)
                {
                    continue;
                }
                var building = terrain.getBuilding();
                if (building === null || building.getOwner() === null ||
                    building.getOwner().getPlayerID() !== 2)
                {
                    continue;
                }
                var point = {x: x, y: y};
                if (building.getBuildingID() === "HQ")
                {
                    hq = point;
                }
                else
                {
                    fallback.push(point);
                }
            }
        }
        if (hq !== null)
        {
            return [hq];
        }
        return fallback;
    },

    updateMission: function(map)
    {
        if (!MAP_MEANS_TO_END.matches(map))
        {
            return;
        }
        if (MAP_MEANS_TO_END.allEyesDestroyed(map))
        {
            MAP_MEANS_TO_END.defeatPlayers(map, [1, 3]);
        }
        if (MAP_MEANS_TO_END.allCrystalsDestroyed(map))
        {
            MAP_MEANS_TO_END.defeatPlayers(map, [2, 3]);
            MAP_MEANS_TO_END.clearUpperHalf(map);
        }
    },

    defeatPlayers: function(map, playerIds)
    {
        for (var i = 0; i < playerIds.length; i++)
        {
            var player = map.getPlayer(playerIds[i]);
            if (player !== null && !player.getIsDefeated())
            {
                player.defeatPlayer(null, false);
            }
        }
        map.getGameRules().checkVictory();
    },

    clearUpperHalf: function(map)
    {
        for (var y = 0; y < MAP_MEANS_TO_END.UPPER_Y_END; y++)
        {
            for (var x = 0; x < map.getMapWidth(); x++)
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

    onTurnStart: function(day, playerId, map)
    {
        if (MAP_MEANS_TO_END.matches(map) && day >= 26 && playerId === 0)
        {
            var winner = map.getPlayer(1);
            for (var i = 0; i < map.getPlayerCount(); i++)
            {
                var player = map.getPlayer(i);
                if (player !== winner && !player.isAlly(winner) &&
                    !player.getIsDefeated())
                {
                    player.defeatPlayer(null, false);
                }
            }
            map.getGameRules().checkVictory();
        }
    },

    fireWrapped: false,
    produceWrapped: false,
    missileWrapped: false
};

var Constructor = function()
{
    this.gameStart = function(map)
    {
        MAP_MEANS_TO_END.install(map);
    };

    this.onGameLoaded = function(menu, map)
    {
        MAP_MEANS_TO_END.install(map);
        MAP_MEANS_TO_END.updateMission(map);
    };

    this.actionDone = function(action, map)
    {
        MAP_MEANS_TO_END.updateMission(map);
    };

    this.turnStart = function(day, playerId, map)
    {
        MAP_MEANS_TO_END.onTurnStart(day, playerId, map);
    };

    this.getVictoryInfo = function(map)
    {
        return qsTr("Destroy the three Grand Bolt eyes before day 26.");
    };
};

Constructor.prototype = BASEGAMESCRIPT;
var gameScript = new Constructor();

var TeleportConstructor = function()
{
    this.canBePerformed = function(action, map)
    {
        if (!MAP_MEANS_TO_END.matches(map))
        {
            return false;
        }
        var unit = action.getTargetUnit();
        if (unit === null || unit.getOwner() !== map.getCurrentPlayer() ||
            unit.getY() < MAP_MEANS_TO_END.UPPER_Y_END)
        {
            return false;
        }
        var terrain = map.getTerrain(unit.getX(), unit.getY());
        var building = terrain.getBuilding();
        return building !== null && building.getBuildingID() === "HQ" &&
               MAP_MEANS_TO_END.teleportDestinations(map).length > 0;
    };

    this.getActionText = function(map) { return qsTr("TP"); };
    this.getName = function() { return qsTr("TP"); };
    this.getIcon = function(map) { return "icon_move"; };
    this.getStepInputType = function(action, map) { return "FIELD"; };
    this.getStepCursor = function(action, cursor)
    {
        cursor.setCursor("cursor+move");
    };
    this.getStepData = function(action, data, map)
    {
        var destinations = MAP_MEANS_TO_END.teleportDestinations(map);
        for (var i = 0; i < destinations.length; i++)
        {
            data.addPoint(Qt.point(destinations[i].x, destinations[i].y));
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
            target === undefined)
        {
            throw new Error("Invalid Means to end teleport");
        }
        var destinations = MAP_MEANS_TO_END.teleportDestinations(map);
        var valid = false;
        for (var i = 0; i < destinations.length; i++)
        {
            if (destinations[i].x === target.x &&
                destinations[i].y === target.y)
            {
                valid = true;
                break;
            }
        }
        if (!valid)
        {
            throw new Error("Invalid Means to end teleport destination");
        }
        unit.moveUnitToField(target.x, target.y);
        unit.setOwner(map.getPlayer(2));
        unit.setHasMoved(true);
    };
    this.getDescription = function()
    {
        return qsTr("Teleport a unit from the lower HQ to the upper P3 HQ or an available P3 building.");
    };
};

Constructor.prototype = ACTION;
var ACTION_MAP_MEANS_END_TP = new TeleportConstructor();
