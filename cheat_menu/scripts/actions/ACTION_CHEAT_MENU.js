// Cheat menu: eight modules (weather, fog, terrain, units, buildings &
// weapons, funds, COs, misc). Categories on step 0, commands on step 1,
// then command-specific MENU or FIELD steps. Menu placement is done in
// scripts/general/cheat_menu_install.js.
//
// Sign and multiplier are plain JS session state (not serialized, reset on
// reload): the "buttons" are their own one-click commands whose labels
// always show the current state, and the amount menus render the effective
// values with sign and multiplier already applied.
var Constructor = function()
{
    this.CAT_WEATHER = "CHEAT_CAT_WEATHER";
    this.CAT_FOG = "CHEAT_CAT_FOG";
    this.CAT_TERRAIN = "CHEAT_CAT_TERRAIN";
    this.CAT_UNIT = "CHEAT_CAT_UNIT";
    this.CAT_BUILDING = "CHEAT_CAT_BUILDING";
    this.CAT_FUNDS = "CHEAT_CAT_FUNDS";
    this.CAT_CO = "CHEAT_CAT_CO";
    this.CAT_MISC = "CHEAT_CAT_MISC";

    this.CMD_WEATHER_SET = "CHEAT_CMD_WEATHER_SET";
    this.CMD_FOG_TOGGLE = "CHEAT_CMD_FOG_TOGGLE";
    this.CMD_TERRAIN_REPLACE = "CHEAT_CMD_TERRAIN_REPLACE";
    this.CMD_UNIT_ADJUST = "CHEAT_CMD_UNIT_ADJUST";
    this.CMD_UNIT_SIGN = "CHEAT_CMD_UNIT_SIGN";
    this.CMD_UNIT_MULT = "CHEAT_CMD_UNIT_MULT";
    this.CMD_UNIT_TRANSFORM = "CHEAT_CMD_UNIT_TRANSFORM";
    this.CMD_UNIT_SPAWN = "CHEAT_CMD_UNIT_SPAWN";
    this.CMD_UNIT_DELETE = "CHEAT_CMD_UNIT_DELETE";
    this.CMD_UNIT_OWNER = "CHEAT_CMD_UNIT_OWNER";
    this.CMD_UNIT_MOVED = "CHEAT_CMD_UNIT_MOVED";
    this.CMD_BUILDING_PLACE = "CHEAT_CMD_BUILDING_PLACE";
    this.CMD_WEAPON_PLACE = "CHEAT_CMD_WEAPON_PLACE";
    this.CMD_WEAPON_HP = "CHEAT_CMD_WEAPON_HP";
    this.CMD_BUILDING_OWNER = "CHEAT_CMD_BUILDING_OWNER";
    this.CMD_FUNDS_ADJUST = "CHEAT_CMD_FUNDS_ADJUST";
    this.CMD_FUNDS_SIGN = "CHEAT_CMD_FUNDS_SIGN";
    this.CMD_FUNDS_MULT = "CHEAT_CMD_FUNDS_MULT";
    this.CMD_CO_CHANGE = "CHEAT_CMD_CO_CHANGE";
    this.CMD_CO_FILL = "CHEAT_CMD_CO_FILL";
    this.CMD_CO_EMPTY = "CHEAT_CMD_CO_EMPTY";
    this.CMD_MISC_WIN = "CHEAT_CMD_MISC_WIN";
    this.CMD_MISC_LOSE = "CHEAT_CMD_MISC_LOSE";
    this.CMD_MISC_STATS = "CHEAT_CMD_MISC_STATS";
    this.CMD_MISC_CONTROLLER = "CHEAT_CMD_MISC_CONTROLLER";

    this.STEP_MENU = "MENU";
    this.STEP_FIELD = "FIELD";
    // input steps consumed by the category pick plus the command pick
    this.PATH_STEPS = 2;
    // placeholder entry so an empty submenu never soft-locks the input loop
    this.MENU_EMPTY_ID = "CHEAT_MENU_EMPTY";

    this.MENU_ICON = "options";
    this.FIELD_COLOR_SELECT = "#C800FF00";
    this.FIELD_COLOR_DESTROY = "#C8FF0000";
    this.LOG_PREFIX = "CHEAT_MENU|";
    // GameConsole ERROR level: prints regardless of the configured log level
    this.LOG_LEVEL_ERROR = 3;

    this.MAX_HP = 10;
    this.WEAPON_MAX_HP = 999;
    this.UNIT_BASE_STEPS = [1, 2, 5];
    this.UNIT_MULT_CYCLE = [1, 10];
    this.FUNDS_BASE_STEPS = [1000, 2000, 3000];
    this.FUNDS_MULT_CYCLE = [1, 10, 100];
    this.NEUTRAL_OWNER = -1;
    this.CO_SLOT_COUNT = 2;

    this.STAT_HP = "HP";
    this.STAT_FUEL = "FUEL";
    this.STAT_AMMO1 = "AMMO1";
    this.STAT_AMMO2 = "AMMO2";

    // plain JS state below is not serialized: session-only cheat state,
    // resets on reload, which is exactly what a cheat menu wants
    this.adjustSign = 1;
    this.unitMultIndex = 0;
    this.fundsMultIndex = 0;
    this.savedFogMode = null;

    this.UNIT_IDS = [
        "INFANTRY", "MECH", "MOTORBIKE", "SNIPER", "RECON", "LIGHT_TANK",
        "HEAVY_TANK", "NEOTANK", "MEGATANK", "APC", "FLAK", "ARTILLERY",
        "ARTILLERYCRAFT", "ROCKETTHROWER", "MISSILE", "ANTITANKCANNON",
        "PIPERUNNER", "K_HELI", "T_HELI", "FIGHTER", "DUSTER", "BOMBER",
        "STEALTHBOMBER", "WATERPLANE", "TRANSPORTPLANE", "LANDER",
        "HOVERCRAFT", "HEAVY_HOVERCRAFT", "HOVERFLAK", "BLACK_BOAT",
        "BLACK_BOMB", "CRUISER", "DESTROYER", "SUBMARINE", "MISSILE_SUB",
        "BATTLESHIP", "BATTLECRUISER", "AIRCRAFTCARRIER", "GUNBOAT",
        "CANNONBOAT", "TORPEDOBOAT", "FRIGATE", "FLARE", "WATERMINE",
        "HOELLIUM", "ZCOUNIT_AT_CYCLE", "ZCOUNIT_AUTO_TANK",
        "ZCOUNIT_CHAPERON", "ZCOUNIT_COMMANDO", "ZCOUNIT_CRYSTAL_TANK",
        "ZCOUNIT_HOT_TANK", "ZCOUNIT_INTEL_TRUCK",
        "ZCOUNIT_IRON_SHIELD_GENERATOR", "ZCOUNIT_KIROV",
        "ZCOUNIT_LOGIC_TRUCK", "ZCOUNIT_MISSILE_SUB",
        "ZCOUNIT_NEOSPIDER_TANK", "ZCOUNIT_PARTISAN", "ZCOUNIT_RANGER",
        "ZCOUNIT_REPAIR_TANK", "ZCOUNIT_ROYAL_GUARD",
        "ZCOUNIT_SIEGE_CANNON", "ZCOUNIT_SMUGGLER",
        "ZCOUNIT_TANK_HUNTER"];

    this.TERRAIN_IDS = [
        "PLAINS", "PLAINS_DESTROYED", "PLAINS_PLASMA", "FOREST", "FOREST1",
        "FOREST2", "FOREST3", "MOUNTAIN", "STREET", "STREET1", "BRIDGE",
        "BRIDGE1", "BRIDGE2", "RIVER", "BEACH", "SEA", "ROUGH_SEA",
        "REAF", "LAKE", "DESERT", "DESERT_PATH", "DESERT_PATH1",
        "DESERT_FOREST", "DESERT_FOREST1", "DESERT_ROCK",
        "DESERT_TRY_RIVER", "DESERT_WASTELAND", "DESERT_RUIN",
        "DESERT_PIPELINE", "DESERT_WELD", "DESERT_DESTROYEDWELD",
        "SNOW", "SNOW_STREET", "SNOW_FOREST", "SNOW_FOREST1",
        "SNOW_FOREST2", "SNOW_MOUNTAIN", "SNOW_WASTELAND", "SNOW_RUIN",
        "SNOW_PIPELINE", "SNOW_WELD", "SNOW_DESTROYEDWELD", "WASTE",
        "WASTE_PATH", "WASTE_FOREST", "WASTE_MOUNTAIN", "WASTE_WASTELAND",
        "WASTE_RUIN", "WASTE_PIPELINE", "WASTE_WELD",
        "WASTE_DESTROYEDWELD", "WELD", "DESTROYEDWELD", "PIPELINE",
        "FIRE", "PLASMA", "METEOR", "RUIN", "WALL", "WEAK_WALL",
        "CREEPER", "FOG", "TELEPORTTILE"];

    this.BUILDING_IDS = [
        "TOWN", "FACTORY", "AIRPORT", "HARBOUR", "HQ", "TOWER", "DEPOT",
        "LABOR", "MINE", "OILRIG", "PIPESTATION", "POWERPLANT", "RADAR",
        "SILO", "SILO_ROCKET", "AMPHIBIOUSFACTORY", "TEMPORARY_AIRPORT",
        "TEMPORARY_HARBOUR", "FORTHQ"];

    this.WEAPON_IDS = [
        "ZMINICANNON_N", "ZMINICANNON_E", "ZMINICANNON_S",
        "ZMINICANNON_W", "ZBLACKHOLE_CANNON_N", "ZBLACKHOLE_CANNON_E",
        "ZBLACKHOLE_CANNON_S", "ZBLACKHOLE_CANNON_W", "ZDEATHRAY_N",
        "ZDEATHRAY_E", "ZDEATHRAY_S", "ZDEATHRAY_W", "ZLASER",
        "ZCRYSTALL", "ZTALON_GUN", "ZTALON_GUN_DESTROYED", "ZMONOLITH",
        "ZVOLCAN", "ZVOLCANDESERT", "ZVOLCANSNOW", "ZVOLCANWASTE",
        "ZFORTRESS", "ZBLACKHOLE_FACTORY", "ZBLACKHOLE_FACTORYDESERT",
        "ZBLACKHOLE_FACTORYSNOW", "ZBLACKHOLE_FACTORYWASTE",
        "ZGATE_N_S", "ZGATE_E_W", "ZDESTROYED_GATE_N_S",
        "ZDESTROYED_GATE_E_W", "ZWELD_N_S", "ZWELD_E_W", "ZSNOWWELD_N_S",
        "ZSNOWWELD_E_W", "ZDESERTWELD_N_S", "ZDESERTWELD_E_W",
        "ZWASTEWELD_N_S", "ZWASTEWELD_E_W", "ZNEST_CENTER",
        "ZNEST_FACTORY", "ZNEST_LEFT_MORTAR", "ZNEST_RIGHT_MORTAR",
        "ZNEST_NEST_LASER", "ZNEST_NEST_LASER_DESTROYED",
        "ZNEST_CENTER_LASER_LEFT", "ZNEST_CENTER_LASER_LEFT_DESTROYED",
        "ZNEST_CENTER_LASER_MIDDLE",
        "ZNEST_CENTER_LASER_MIDDLE_DESTROYED",
        "ZNEST_CENTER_LASER_RIGHT",
        "ZNEST_CENTER_LASER_RIGHT_DESTROYED", "ZGRAND_BOLT_MIDDLE1",
        "ZGRAND_BOLT_MIDDLE2", "ZGRAND_BOLT_MIDDLE3",
        "ZGRAND_BOLT_MIDDLE4", "ZGRAND_BOLT_MIDDLE5",
        "ZGRAND_BOLT_EYE_LEFT", "ZGRAND_BOLT_EYE_LEFT_DESTROYED",
        "ZGRAND_BOLT_EYE_MIDDLE", "ZGRAND_BOLT_EYE_MIDDLE_DESTROYED",
        "ZGRAND_BOLT_EYE_RIGHT", "ZGRAND_BOLT_EYE_RIGHT_DESTROYED",
        "ZOMEGA_BASE"];

    this.CO_IDS = [
        "CO_ANDY", "CO_MAX", "CO_SAMI", "CO_NELL", "CO_HACHI",
        "CO_JAKE", "CO_RACHEL", "CO_SASHA", "CO_GRIMM", "CO_SENSEI",
        "CO_COLIN", "CO_GRIT", "CO_OLAF", "CO_DRAKE", "CO_EAGLE",
        "CO_JAVIER", "CO_JESS", "CO_KANBEI", "CO_SONJA", "CO_FLAK",
        "CO_ADDER", "CO_LASH", "CO_HAWKE", "CO_STURM", "CO_KINDLE",
        "CO_KOAL", "CO_JUGGER", "CO_VON_BOLT", "CO_ZANDRA",
        "CO_BRENNER", "CO_WILL", "CO_LIN", "CO_ISABELLA", "CO_TABITHA",
        "CO_GAGE", "CO_TASHA", "CO_FORSYTHE", "CO_GREYFIELD",
        "CO_CAULDER", "CO_PENNY", "CO_WAYLON", "CO_BEAST", "CO_AIRIA",
        "CO_ALEXANDER", "CO_ALEXIS", "CO_AMY", "CO_ADAM", "CO_CAIRN",
        "CO_CASSIDY", "CO_CONRAD", "CO_DAVIS", "CO_EPOCH", "CO_GRAVES",
        "CO_IK_486_B7", "CO_JOEY", "CO_JULIA", "CO_MARY", "CO_MEIYO",
        "CO_MELANTHE", "CO_MINA", "CO_MINAMOTO", "CO_NANA",
        "CO_NAPOLEON", "CO_OZZY", "CO_PETER", "CO_RATTIGAN",
        "CO_ROBOANDY", "CO_ROBOSTURM", "CO_SABAKI", "CO_SANJURO",
        "CO_SMITAN", "CO_SOPHIE", "CO_VARLOT", "CO_WALTER", "CO_XAVIER",
        "CO_YUKIO", "CO_RANDOM", "CO_EMPTY_OS", "CO_EMPTY_BM",
        "CO_EMPTY_GE", "CO_EMPTY_YC", "CO_EMPTY_BH", "CO_EMPTY_BG",
        "CO_EMPTY_AC", "CO_EMPTY_BD", "CO_EMPTY_GS", "CO_EMPTY_MA",
        "CO_EMPTY_DM", "CO_EMPTY_PF", "CO_EMPTY_TI"];

    this.canBePerformed = function(action, map)
    {
        return true;
    };
    this.getActionText = function(map)
    {
        return qsTr("Cheat...");
    };
    this.getIcon = function(map)
    {
        return ACTION_CHEAT_MENU.MENU_ICON;
    };

    // ------------------------------------------------------------------
    // step routing

    this.builtinCategories = function()
    {
        var self = ACTION_CHEAT_MENU;
        return [
            {id: self.CAT_WEATHER, text: qsTr("Weather...")},
            {id: self.CAT_FOG, text: qsTr("Fog of war...")},
            {id: self.CAT_TERRAIN, text: qsTr("Terrain...")},
            {id: self.CAT_UNIT, text: qsTr("Units...")},
            {id: self.CAT_BUILDING, text: qsTr("Buildings & weapons...")},
            {id: self.CAT_FUNDS, text: qsTr("Funds...")},
            {id: self.CAT_CO, text: qsTr("CO...")},
            {id: self.CAT_MISC, text: qsTr("Misc...")}];
    };

    this.getCategories = function()
    {
        return ACTION_CHEAT_MENU.builtinCategories();
    };

    this.getCommand = function(id)
    {
        var self = ACTION_CHEAT_MENU;
        if (Object.prototype.hasOwnProperty.call(self.commands, id))
        {
            return self.commands[id];
        }
        return null;
    };

    this.commandsForCategory = function(category)
    {
        var self = ACTION_CHEAT_MENU;
        var found = [];
        for (var i = 0; i < self.commandOrder.length; ++i)
        {
            var command = self.commands[self.commandOrder[i]];
            if (command.category === category)
            {
                found.push(command);
            }
        }
        return found;
    };

    this.readPath = function(action)
    {
        var self = ACTION_CHEAT_MENU;
        var step = action.getInputStep();
        var path = {category: null, command: null, spec: null, args: []};
        action.startReading();
        if (step < 1)
        {
            return path;
        }
        path.category = action.readDataString();
        if (step < self.PATH_STEPS)
        {
            return path;
        }
        path.command = action.readDataString();
        path.spec = self.getCommand(path.command);
        if (path.spec === null)
        {
            return path;
        }
        var argCount = step - self.PATH_STEPS;
        for (var i = 0; i < argCount && i < path.spec.steps.length; ++i)
        {
            if (path.spec.steps[i].type === self.STEP_FIELD)
            {
                path.args.push({x: action.readDataInt32(),
                                y: action.readDataInt32()});
            }
            else
            {
                path.args.push(action.readDataString());
            }
        }
        return path;
    };

    this.getStepInputType = function(action, map)
    {
        var self = ACTION_CHEAT_MENU;
        var step = action.getInputStep();
        if (step < self.PATH_STEPS)
        {
            return self.STEP_MENU;
        }
        var path = self.readPath(action);
        if (path.spec === null)
        {
            return "";
        }
        var index = step - self.PATH_STEPS;
        if (index >= path.spec.steps.length)
        {
            return "";
        }
        return path.spec.steps[index].type;
    };

    this.isFinalStep = function(action, map)
    {
        var self = ACTION_CHEAT_MENU;
        var step = action.getInputStep();
        if (step < self.PATH_STEPS)
        {
            return false;
        }
        var path = self.readPath(action);
        if (path.spec === null)
        {
            // unknown command, finish instead of hanging the input loop
            return true;
        }
        return (step - self.PATH_STEPS) >= path.spec.steps.length;
    };

    this.getStepData = function(action, data, map)
    {
        var self = ACTION_CHEAT_MENU;
        var step = action.getInputStep();
        if (step === 0)
        {
            var categories = self.getCategories();
            for (var i = 0; i < categories.length; ++i)
            {
                data.addData(categories[i].text, categories[i].id,
                             self.MENU_ICON, 0, true);
            }
            return;
        }
        var path = self.readPath(action);
        if (step === 1)
        {
            var commands = self.commandsForCategory(path.category);
            for (var i2 = 0; i2 < commands.length; ++i2)
            {
                var command = commands[i2];
                var icon = (command.icon !== undefined) ?
                    command.icon : self.MENU_ICON;
                data.addData(command.text(map), command.id, icon, 0, true);
            }
            return;
        }
        if (path.spec === null)
        {
            return;
        }
        var stepSpec = path.spec.steps[step - self.PATH_STEPS];
        if (stepSpec === undefined)
        {
            return;
        }
        if (stepSpec.type === self.STEP_MENU)
        {
            var options = stepSpec.options(map, path.args);
            if (options.length === 0)
            {
                data.addData(qsTr("(nothing available)"),
                             self.MENU_EMPTY_ID, self.MENU_ICON, 0, true);
                return;
            }
            for (var i3 = 0; i3 < options.length; ++i3)
            {
                var option = options[i3];
                var optionIcon = (option.icon !== undefined) ?
                    option.icon : self.MENU_ICON;
                data.addData(option.text, option.id, optionIcon, 0, true);
            }
        }
        else
        {
            var points = stepSpec.points(map, path.args);
            for (var i4 = 0; i4 < points.length; ++i4)
            {
                data.addPoint(Qt.point(points[i4].x, points[i4].y));
            }
            data.setShowZData(false);
            var color = (stepSpec.color !== undefined) ?
                stepSpec.color : self.FIELD_COLOR_SELECT;
            data.setColor(color);
        }
    };

    this.getStepCursor = function(action, cursorData, map)
    {
        cursorData.setCursor("cursor+default");
        cursorData.setXOffset(0);
        cursorData.setYOffset(0);
        cursorData.setScale(1.0);
    };

    this.perform = function(action, map)
    {
        var self = ACTION_CHEAT_MENU;
        var path = self.readPath(action);
        if (path.spec === null)
        {
            self.print("unknown command " + path.command);
            return;
        }
        for (var i = 0; i < path.args.length; ++i)
        {
            if (path.args[i] === self.MENU_EMPTY_ID)
            {
                self.print("nothing available for " + path.command);
                return;
            }
        }
        path.spec.perform(map, path.args, action);
    };

    // ------------------------------------------------------------------
    // shared helpers

    this.print = function(message)
    {
        GameConsole.print(ACTION_CHEAT_MENU.LOG_PREFIX + message,
                          ACTION_CHEAT_MENU.LOG_LEVEL_ERROR);
    };

    this.allUnitPoints = function(map)
    {
        var points = [];
        for (var p = 0; p < map.getPlayerCount(); ++p)
        {
            var units = map.getPlayer(p).getUnits();
            for (var i = 0; i < units.size(); ++i)
            {
                var unit = units.at(i);
                points.push({x: unit.getX(), y: unit.getY()});
            }
        }
        return points;
    };

    this.allBuildingPoints = function(map)
    {
        var points = [];
        for (var y = 0; y < map.getMapHeight(); ++y)
        {
            for (var x = 0; x < map.getMapWidth(); ++x)
            {
                if (map.getTerrain(x, y).getBuilding() !== null)
                {
                    points.push({x: x, y: y});
                }
            }
        }
        return points;
    };

    this.allFieldPoints = function(map)
    {
        var points = [];
        for (var y = 0; y < map.getMapHeight(); ++y)
        {
            for (var x = 0; x < map.getMapWidth(); ++x)
            {
                points.push({x: x, y: y});
            }
        }
        return points;
    };

    this.playerOptions = function(map)
    {
        var options = [];
        for (var i = 0; i < map.getPlayerCount(); ++i)
        {
            options.push({id: String(i),
                          text: qsTr("Player ") + (i + 1)});
        }
        return options;
    };

    this.controllerOptions = function(map, args)
    {
        var player = map.getPlayer(parseInt(args[0]));
        var currentType = player.getControlType();
        var humanType = GameEnums.AiTypes_Human;
        var options = [
            {id: "human",
             text: qsTr("Player / human") +
                   (currentType === humanType ?
                    " (" + qsTr("configured") + ")" : "")},
            {id: "cpu",
             text: qsTr("CPU / normal AI") +
                   (currentType !== humanType ?
                    " (" + qsTr("configured") + ")" : "")}
        ];
        return options;
    };

    this.playerWithNeutralOptions = function(map)
    {
        var options = ACTION_CHEAT_MENU.playerOptions(map);
        options.push({id: String(ACTION_CHEAT_MENU.NEUTRAL_OWNER),
                      text: qsTr("Neutral")});
        return options;
    };

    this.unitAt = function(map, point)
    {
        return map.getTerrain(point.x, point.y).getUnit();
    };

    this.unitMult = function()
    {
        return ACTION_CHEAT_MENU.UNIT_MULT_CYCLE[
            ACTION_CHEAT_MENU.unitMultIndex];
    };

    this.fundsMult = function()
    {
        return ACTION_CHEAT_MENU.FUNDS_MULT_CYCLE[
            ACTION_CHEAT_MENU.fundsMultIndex];
    };

    this.signText = function()
    {
        return (ACTION_CHEAT_MENU.adjustSign >= 0) ? "+" : "-";
    };

    this.amountOptions = function(baseSteps, mult)
    {
        var self = ACTION_CHEAT_MENU;
        var options = [];
        for (var i = 0; i < baseSteps.length; ++i)
        {
            var value = baseSteps[i] * mult;
            options.push({id: String(value),
                          text: self.signText() + value});
        }
        return options;
    };

    // clamps a stat into [0, max]; returns the applied value
    // ------------------------------------------------------------------
    // mod-adaptive id lists
    //
    // Lists are queried live from the engine's sprite managers, so units,
    // buildings, terrains and COs added by other mods show up automatically.
    // The hardcoded arrays above only serve as a fallback when a manager is
    // not reachable (very old engine builds).

    // base-game special weapons are all Z-prefixed; the keyword list also
    // catches modded weapons that don't follow the Z convention
    this.WEAPON_KEYWORDS = [
        "CANNON", "LASER", "DEATHRAY", "TALON", "CRYSTALL", "VOLCAN",
        "FORTRESS", "MONOLITH", "NEST", "GRAND_BOLT", "OMEGA", "MORTAR",
        "GATE", "WELD"];

    this.managerIds = function(mgr, method, fallback)
    {
        if (mgr !== undefined && mgr !== null)
        {
            try
            {
                var ids = mgr[method]();
                if (ids !== null && ids !== undefined && ids.length > 0)
                {
                    return ids;
                }
            }
            catch (error)
            {
                ACTION_CHEAT_MENU.print("manager query " + method +
                                        " failed: " + error);
            }
        }
        return fallback;
    };

    this.globalObject = function(name)
    {
        if (typeof Global !== "undefined" && Global !== null)
        {
            return Global[name];
        }
        return undefined;
    };

    this.unitIds = function()
    {
        var self = ACTION_CHEAT_MENU;
        return self.managerIds(self.globalObject("unitSpriteManager"),
                               "getUnitsSorted", self.UNIT_IDS);
    };

    this.terrainIds = function()
    {
        var self = ACTION_CHEAT_MENU;
        return self.managerIds(self.globalObject("terrainSpriteManager"),
                               "getTerrainsSorted", self.TERRAIN_IDS);
    };

    this.coIds = function()
    {
        var self = ACTION_CHEAT_MENU;
        return self.managerIds(self.globalObject("coSpriteManager"),
                               "getCoIds", self.CO_IDS);
    };

    this.isWeaponId = function(id)
    {
        // case-insensitive: manager lists may differ in casing conventions
        var upper = String(id).toUpperCase();
        if (upper.charAt(0) === "Z")
        {
            return true;
        }
        var keywords = ACTION_CHEAT_MENU.WEAPON_KEYWORDS;
        for (var i = 0; i < keywords.length; ++i)
        {
            if (upper.indexOf(keywords[i]) >= 0)
            {
                return true;
            }
        }
        return false;
    };

    // splits every loaded building into civilian structures and special
    // weapons, so modded buildings land in the right submenu. The dynamic
    // manager list is unioned with the static base-game lists, so partial
    // or empty manager data can never leave a submenu blank.
    this.buildingLists = function()
    {
        var self = ACTION_CHEAT_MENU;
        var loaded = self.managerIds(
            self.globalObject("buildingSpriteManager"),
            "getLoadedBuildings", []);
        var seen = {};
        var all = [];
        var sources = [loaded, self.BUILDING_IDS, self.WEAPON_IDS];
        for (var s = 0; s < sources.length; ++s)
        {
            for (var j = 0; j < sources[s].length; ++j)
            {
                var id = String(sources[s][j]);
                var key = id.toUpperCase();
                if (!Object.prototype.hasOwnProperty.call(seen, key))
                {
                    seen[key] = true;
                    all.push(id);
                }
            }
        }
        var buildings = [];
        var weapons = [];
        for (var i = 0; i < all.length; ++i)
        {
            if (self.isWeaponId(all[i]))
            {
                weapons.push(all[i]);
            }
            else
            {
                buildings.push(all[i]);
            }
        }
        return {buildings: buildings, weapons: weapons};
    };

    // The engine lays menus out in columns sized by the LONGEST entry text.
    // Very long ids (ZNEST_CENTER_LASER_MIDDLE_DESTROYED is 35 chars) can
    // make the column wider than the screen on small displays, which breaks
    // the whole menu layout. The action id stays full; only the display
    // text is shortened.
    this.ID_TEXT_MAX = 20;
    this.ID_ABBREVIATIONS = [
        ["ZGRAND_BOLT_", "GB_"], ["ZBLACKHOLE_", "BH_"],
        ["ZMINICANNON_", "MCN_"], ["ZCOUNIT_", "ZU_"],
        ["DESTROYED", "DST"], ["CENTER", "CTR"], ["MIDDLE", "MID"],
        ["TEMPORARY", "TMP"], ["GENERATOR", "GEN"], ["LASER", "LSR"],
        ["CANNON", "CNN"], ["MORTAR", "MTR"], ["NEST", "NST"],
        ["FACTORY", "FCT"], ["AMPHIBIOUS", "AMPH"], ["TRANSPORT", "TRN"],
        ["STEALTH", "STL"], ["HOVERCRAFT", "HOV"], ["BATTLE", "BTL"],
        ["CRUISER", "CRS"], ["SUBMARINE", "SUB"], ["AIRCRAFT", "AIR"],
        ["WASTELAND", "WLD"], ["PIPELINE", "PIPE"], ["MOUNTAIN", "MTN"],
        ["FOREST", "FRS"]];

    this.shortId = function(id)
    {
        var s = String(id);
        if (s.length <= ACTION_CHEAT_MENU.ID_TEXT_MAX)
        {
            return s;
        }
        var reps = ACTION_CHEAT_MENU.ID_ABBREVIATIONS;
        for (var i = 0; i < reps.length; ++i)
        {
            while (s.indexOf(reps[i][0]) >= 0)
            {
                s = s.replace(reps[i][0], reps[i][1]);
            }
        }
        if (s.length > ACTION_CHEAT_MENU.ID_TEXT_MAX)
        {
            s = s.substring(0, ACTION_CHEAT_MENU.ID_TEXT_MAX - 1) + ".";
        }
        return s;
    };

    // id-list options with a safety net: any script error or empty result
    // falls back to the static list and logs the reason, so a submenu can
    // never render blank
    this.idOptions = function(ids, fallbackIds, label)
    {
        var self = ACTION_CHEAT_MENU;
        var source = ids;
        if (source === null || source === undefined || source.length === 0)
        {
            self.print(label + " list empty, using static fallback");
            source = fallbackIds;
        }
        var options = [];
        for (var i = 0; i < source.length; ++i)
        {
            var id = String(source[i]);
            options.push({id: id, text: self.shortId(id)});
        }
        return options;
    };

    this.safeBuildingLists = function()
    {
        var self = ACTION_CHEAT_MENU;
        try
        {
            return self.buildingLists();
        }
        catch (error)
        {
            self.print("buildingLists failed: " + error +
                       ", using static lists");
            return {buildings: self.BUILDING_IDS,
                    weapons: self.WEAPON_IDS};
        }
    };

    this.buildingOptions = function()
    {
        var self = ACTION_CHEAT_MENU;
        return self.idOptions(self.safeBuildingLists().buildings,
                              self.BUILDING_IDS, "building");
    };

    this.weaponOptions = function()
    {
        var self = ACTION_CHEAT_MENU;
        return self.idOptions(self.safeBuildingLists().weapons,
                              self.WEAPON_IDS, "weapon");
    };

    this.clamp = function(value, min, max)
    {
        if (value < min)
        {
            return min;
        }
        if (value > max)
        {
            return max;
        }
        return value;
    };

    this.performUnitStatAdjust = function(map, unit, stat, delta)
    {
        var self = ACTION_CHEAT_MENU;
        if (stat === self.STAT_HP)
        {
            var newHp = unit.getHp() + delta;
            if (newHp <= 0)
            {
                // HP at or below zero: the unit destroys itself
                self.print("unit hp <= 0, destroying " + unit.getUnitID());
                unit.killUnit();
                return;
            }
            // clamp at the maximum instead of overflowing
            unit.setHp(self.clamp(newHp, 0, self.MAX_HP));
            self.print("unit hp=" + unit.getHp());
        }
        else if (stat === self.STAT_FUEL)
        {
            var newFuel = self.clamp(unit.getFuel() + delta, 0,
                                     unit.getMaxFuel());
            unit.setFuel(newFuel);
            self.print("unit fuel=" + unit.getFuel());
        }
        else if (stat === self.STAT_AMMO1)
        {
            var newAmmo1 = self.clamp(unit.getAmmo1() + delta, 0,
                                      unit.getMaxAmmo1());
            unit.setAmmo1(newAmmo1);
            self.print("unit ammo1=" + unit.getAmmo1());
        }
        else if (stat === self.STAT_AMMO2)
        {
            var newAmmo2 = self.clamp(unit.getAmmo2() + delta, 0,
                                      unit.getMaxAmmo2());
            unit.setAmmo2(newAmmo2);
            self.print("unit ammo2=" + unit.getAmmo2());
        }
    };

    this.statOptions = function(map, args)
    {
        var self = ACTION_CHEAT_MENU;
        var unit = self.unitAt(map, args[0]);
        if (unit === null)
        {
            return [];
        }
        var options = [{id: self.STAT_HP, text: qsTr("HP") +
                        " (" + unit.getHp() + ")"},
                       {id: self.STAT_FUEL, text: qsTr("Fuel") +
                        " (" + unit.getFuel() + "/" +
                        unit.getMaxFuel() + ")"}];
        if (unit.hasAmmo1())
        {
            options.push({id: self.STAT_AMMO1,
                          text: qsTr("Ammo 1") + " (" +
                          unit.getAmmo1() + "/" + unit.getMaxAmmo1() + ")"});
        }
        if (unit.hasAmmo2())
        {
            options.push({id: self.STAT_AMMO2,
                          text: qsTr("Ammo 2") + " (" +
                          unit.getAmmo2() + "/" + unit.getMaxAmmo2() + ")"});
        }
        return options;
    };

    this.performWeather = function(map, args)
    {
        var rules = map.getGameRules();
        var index = parseInt(args[0]);
        // one full round for every player
        rules.changeWeather(index, map.getPlayerCount());
        rules.onWeatherChanged();
        ACTION_CHEAT_MENU.print("weather " +
                                rules.getWeather(index).getWeatherId());
    };

    this.toggleFog = function(map)
    {
        var self = ACTION_CHEAT_MENU;
        var rules = map.getGameRules();
        var current = rules.getFogMode();
        if (current !== GameEnums.Fog_Off)
        {
            // remember the map's original fog mode so "on" restores it
            self.savedFogMode = current;
            rules.setFogMode(GameEnums.Fog_Off);
        }
        else
        {
            var restored = (self.savedFogMode !== null) ?
                self.savedFogMode : GameEnums.Fog_OfWar;
            rules.setFogMode(restored);
        }
        rules.createFogVision();
        self.print("fog mode=" + rules.getFogMode());
    };

    this.performPlaceBuilding = function(map, args)
    {
        var self = ACTION_CHEAT_MENU;
        var buildingId = args[0];
        var ownerIndex = parseInt(args[1]);
        var point = args[2];
        // Large weapons are huge: the Grand Bolt middle part spans 7 tiles
        // and the footprint extends up-LEFT from the anchor tile. A click
        // meant as "somewhere inside the footprint" then silently fails the
        // engine's placement check. Probe anchor offsets around the click,
        // so the clicked tile may be any corner of the footprint; the
        // engine's own canBuildingBePlaced guards every probe.
        var MAX_PROBE = 7;
        for (var dy = 0; dy < MAX_PROBE; ++dy)
        {
            for (var dx = 0; dx < MAX_PROBE; ++dx)
            {
                var ax = point.x + dx;
                var ay = point.y + dy;
                if (ax >= map.getMapWidth() || ay >= map.getMapHeight())
                {
                    continue;
                }
                map.replaceBuilding(buildingId, ax, ay);
                var building = map.getTerrain(ax, ay).getBuilding();
                if (building !== null &&
                    building.getBuildingID() === buildingId)
                {
                    if (ownerIndex >= 0 &&
                        ownerIndex < map.getPlayerCount())
                    {
                        building.setOwner(map.getPlayer(ownerIndex));
                    }
                    else
                    {
                        building.setOwner(null);
                    }
                    // full refresh: the sprite spans multiple tiles
                    map.updateSprites();
                    self.print("placed " + buildingId + " anchor=" + ax +
                               "," + ay + " (clicked " + point.x + "," +
                               point.y + ") owner=" + ownerIndex);
                    return;
                }
            }
        }
        self.print("place " + buildingId + " failed near " + point.x +
                   "," + point.y + ": no valid anchor in a " + MAX_PROBE +
                   "x" + MAX_PROBE + " area (terrain type or map edge)");
    };

    this.coSlotOptions = function(map, args)
    {
        var options = [];
        var player = map.getPlayer(parseInt(args[0]));
        for (var index = 0;
             index < ACTION_CHEAT_MENU.CO_SLOT_COUNT; ++index)
        {
            var co = player.getCO(index);
            var label = (co !== null) ? co.getCoID() : qsTr("(empty)");
            options.push({id: String(index),
                          text: qsTr("CO slot ") + index + " (" +
                                label + ")"});
        }
        return options;
    };

    this.performCoFill = function(map, args, fill)
    {
        var self = ACTION_CHEAT_MENU;
        var player = map.getPlayer(parseInt(args[0]));
        var co = player.getCO(parseInt(args[1]));
        if (co === null)
        {
            self.print("co change failed: slot empty");
            return;
        }
        // powerFilled is measured in stars; full = every star lit,
        // the engine clamps at the star total so nothing can overflow
        var stars = fill ?
            co.getPowerStars() + co.getSuperpowerStars() : 0;
        co.setPowerFilled(stars);
        self.print("co " + co.getCoID() + " charge=" +
                   co.getPowerFilled());
    };

    // ------------------------------------------------------------------
    // command table

    this.commands = {};
    this.commandOrder = [];
    var owner = this;
    var define = function(id, category, textFn, steps, performFn, icon)
    {
        owner.commands[id] = {id: id, category: category, text: textFn,
                              steps: steps, perform: performFn,
                              icon: icon};
        owner.commandOrder.push(id);
    };

    var stepAllUnits = function(color)
    {
        return {type: owner.STEP_FIELD, color: color,
                points: function(map, args)
                {
                    return ACTION_CHEAT_MENU.allUnitPoints(map);
                }};
    };
    var stepAllBuildings = {type: owner.STEP_FIELD,
        points: function(map, args)
        {
            return ACTION_CHEAT_MENU.allBuildingPoints(map);
        }};
    var stepAllFields = {type: owner.STEP_FIELD,
        points: function(map, args)
        {
            return ACTION_CHEAT_MENU.allFieldPoints(map);
        }};
    var stepAllPlayers = {type: owner.STEP_MENU,
        options: function(map, args)
        {
            return ACTION_CHEAT_MENU.playerOptions(map);
        }};
    var stepPlayersWithNeutral = {type: owner.STEP_MENU,
        options: function(map, args)
        {
            return ACTION_CHEAT_MENU.playerWithNeutralOptions(map);
        }};
    var stepUnitIds = {type: owner.STEP_MENU,
        options: function(map, args)
        {
            var ids = ACTION_CHEAT_MENU.unitIds();
            var options = [];
            for (var i = 0; i < ids.length; ++i)
            {
                options.push({id: ids[i],
                              text: ACTION_CHEAT_MENU.shortId(ids[i])});
            }
            return options;
        }};
    var stepUnitAmount = {type: owner.STEP_MENU,
        options: function(map, args)
        {
            var self = ACTION_CHEAT_MENU;
            return self.amountOptions(self.UNIT_BASE_STEPS,
                                      self.unitMult());
        }};
    var stepCoSlots = {type: owner.STEP_MENU,
        options: function(map, args)
        {
            return ACTION_CHEAT_MENU.coSlotOptions(map, args);
        }};

    // -------------------------------- weather --------------------------------
    define(this.CMD_WEATHER_SET, this.CAT_WEATHER,
        function(map) { return qsTr("Set weather..."); },
        [{type: this.STEP_MENU, options: function(map, args)
        {
            var rules = map.getGameRules();
            var options = [];
            for (var i = 0; i < rules.getWeatherCount(); ++i)
            {
                options.push({id: String(i),
                              text: rules.getWeather(i).getWeatherId()});
            }
            return options;
        }}],
        function(map, args)
        {
            ACTION_CHEAT_MENU.performWeather(map, args);
        });

    // ---------------------------------- fog ----------------------------------
    define(this.CMD_FOG_TOGGLE, this.CAT_FOG,
        function(map)
        {
            var fogOn = (map.getGameRules().getFogMode() !==
                         GameEnums.Fog_Off);
            return fogOn ? qsTr("Fog of war: turn off") :
                           qsTr("Fog of war: turn on");
        },
        [],
        function(map, args)
        {
            ACTION_CHEAT_MENU.toggleFog(map);
        });

    // -------------------------------- terrain --------------------------------
    define(this.CMD_TERRAIN_REPLACE, this.CAT_TERRAIN,
        function(map) { return qsTr("Replace terrain..."); },
        [{type: this.STEP_MENU, options: function(map, args)
        {
            var ids = ACTION_CHEAT_MENU.terrainIds();
            var options = [];
            for (var i = 0; i < ids.length; ++i)
            {
                options.push({id: ids[i],
                              text: ACTION_CHEAT_MENU.shortId(ids[i])});
            }
            return options;
        }},
        stepAllFields],
        function(map, args)
        {
            // replaceTerrain with sprite update: river/road/pipeline
            // connections refresh automatically
            map.replaceTerrain(args[0], args[1].x, args[1].y, false, true);
            ACTION_CHEAT_MENU.print("terrain at " + args[1].x + "," +
                                    args[1].y + " -> " + args[0]);
        });

    // --------------------------------- units ---------------------------------
    define(this.CMD_UNIT_SIGN, this.CAT_UNIT,
        function(map)
        {
            return qsTr("Sign toggle (current: ") +
                   ACTION_CHEAT_MENU.signText() + ")";
        },
        [],
        function(map, args)
        {
            var self = ACTION_CHEAT_MENU;
            self.adjustSign = -self.adjustSign;
            self.print("unit adjust sign=" + self.signText());
        });
    define(this.CMD_UNIT_MULT, this.CAT_UNIT,
        function(map)
        {
            var self = ACTION_CHEAT_MENU;
            return qsTr("Multiplier toggle (current: x") +
                   self.unitMult() + ")";
        },
        [],
        function(map, args)
        {
            var self = ACTION_CHEAT_MENU;
            // one click multiplies by ten, the next click restores
            self.unitMultIndex =
                (self.unitMultIndex + 1) % self.UNIT_MULT_CYCLE.length;
            self.print("unit adjust multiplier=x" + self.unitMult());
        });
    define(this.CMD_UNIT_ADJUST, this.CAT_UNIT,
        function(map) { return qsTr("Adjust HP / fuel / ammo..."); },
        [stepAllUnits(undefined),
         {type: this.STEP_MENU, options: function(map, args)
         {
             return ACTION_CHEAT_MENU.statOptions(map, args);
         }},
         stepUnitAmount],
        function(map, args)
        {
            var self = ACTION_CHEAT_MENU;
            var unit = self.unitAt(map, args[0]);
            if (unit === null)
            {
                self.print("no unit at " + args[0].x + "," + args[0].y);
                return;
            }
            var delta = parseInt(args[2]) * self.adjustSign;
            self.performUnitStatAdjust(map, unit, args[1], delta);
        });
    define(this.CMD_UNIT_TRANSFORM, this.CAT_UNIT,
        function(map) { return qsTr("Transform unit type..."); },
        [stepAllUnits(undefined), stepUnitIds],
        function(map, args)
        {
            var self = ACTION_CHEAT_MENU;
            var unit = self.unitAt(map, args[0]);
            if (unit !== null)
            {
                // transformUnit keeps owner, position and HP in place
                unit.transformUnit(args[1]);
                self.print("unit at " + args[0].x + "," + args[0].y +
                           " -> " + args[1]);
            }
        });
    define(this.CMD_UNIT_SPAWN, this.CAT_UNIT,
        function(map) { return qsTr("Spawn unit..."); },
        [stepAllPlayers, stepUnitIds,
         {type: this.STEP_MENU, options: function(map, args)
         {
             var self = ACTION_CHEAT_MENU;
             var options = [];
             for (var i = 1; i <= self.MAX_HP; ++i)
             {
                 options.push({id: String(i),
                               text: qsTr("HP ") + i});
             }
             return options;
         }},
         stepAllFields],
        function(map, args)
        {
            var self = ACTION_CHEAT_MENU;
            var player = map.getPlayer(parseInt(args[0]));
            var unit = map.spawnUnit(args[3].x, args[3].y, args[1],
                                     player);
            if (unit !== null)
            {
                unit.setHp(parseInt(args[2]));
                self.print("spawn " + args[1] + " hp=" + args[2] +
                           " at " + args[3].x + "," + args[3].y +
                           " owner=" + args[0]);
            }
            else
            {
                self.print("spawn " + args[1] + " failed at " +
                           args[3].x + "," + args[3].y +
                           " (tile blocked or invalid)");
            }
        });
    define(this.CMD_UNIT_DELETE, this.CAT_UNIT,
        function(map) { return qsTr("Delete unit (silent)"); },
        [stepAllUnits(this.FIELD_COLOR_DESTROY)],
        function(map, args)
        {
            var unit = ACTION_CHEAT_MENU.unitAt(map, args[0]);
            if (unit !== null)
            {
                unit.removeUnit(false);
            }
        });
    define(this.CMD_UNIT_OWNER, this.CAT_UNIT,
        function(map) { return qsTr("Change unit owner..."); },
        [stepAllUnits(undefined), stepAllPlayers],
        function(map, args)
        {
            var unit = ACTION_CHEAT_MENU.unitAt(map, args[0]);
            if (unit !== null)
            {
                unit.setOwner(map.getPlayer(parseInt(args[1])));
            }
        });
    define(this.CMD_UNIT_MOVED, this.CAT_UNIT,
        function(map) { return qsTr("Has-moved state..."); },
        [stepAllUnits(undefined),
         {type: this.STEP_MENU, options: function(map, args)
         {
             return [{id: "0", text: qsTr("Can act")},
                     {id: "1", text: qsTr("Has moved")}];
         }}],
        function(map, args)
        {
            var unit = ACTION_CHEAT_MENU.unitAt(map, args[0]);
            if (unit !== null)
            {
                unit.setHasMoved(parseInt(args[1]) === 1);
            }
        });

    // ---------------------------- buildings --------------------------------
    define(this.CMD_BUILDING_PLACE, this.CAT_BUILDING,
        function(map) { return qsTr("Place building..."); },
        [{type: this.STEP_MENU, options: function(map, args)
        {
            return ACTION_CHEAT_MENU.buildingOptions();
        }},
        stepPlayersWithNeutral, stepAllFields],
        function(map, args)
        {
            ACTION_CHEAT_MENU.performPlaceBuilding(map, args);
        });
    define(this.CMD_WEAPON_PLACE, this.CAT_BUILDING,
        function(map) { return qsTr("Place weapon (cannon etc.)..."); },
        [{type: this.STEP_MENU, options: function(map, args)
        {
            return ACTION_CHEAT_MENU.weaponOptions();
        }},
        stepPlayersWithNeutral, stepAllFields],
        function(map, args)
        {
            ACTION_CHEAT_MENU.performPlaceBuilding(map, args);
        });
    define(this.CMD_WEAPON_HP, this.CAT_BUILDING,
        function(map) { return qsTr("Weapon HP adjust..."); },
        [stepAllBuildings, stepUnitAmount],
        function(map, args)
        {
            var self = ACTION_CHEAT_MENU;
            var terrain = map.getTerrain(args[0].x, args[0].y);
            var building = terrain.getBuilding();
            if (building === null)
            {
                self.print("no building at " + args[0].x + "," +
                           args[0].y);
                return;
            }
            var delta = parseInt(args[1]) * self.adjustSign;
            var newHp = building.getHp() + delta;
            if (newHp <= 0)
            {
                // HP at or below zero: destroy the building, same rule as
                // unit HP; the engine does not auto-destroy on setHp
                self.print("building " + building.getBuildingID() +
                           " at " + args[0].x + "," + args[0].y +
                           " destroyed");
                terrain.removeBuilding();
                map.updateSprites(args[0].x, args[0].y);
                return;
            }
            building.setHp(self.clamp(newHp, 0, self.WEAPON_MAX_HP));
            self.print("building " + building.getBuildingID() +
                       " hp=" + building.getHp());
        });

    define(this.CMD_BUILDING_OWNER, this.CAT_BUILDING,
        function(map) { return qsTr("Change owner (building & weapon)..."); },
        [stepAllBuildings, stepPlayersWithNeutral],
        function(map, args)
        {
            var self = ACTION_CHEAT_MENU;
            var building = map.getTerrain(args[0].x,
                                          args[0].y).getBuilding();
            if (building === null)
            {
                self.print("no building at " + args[0].x + "," +
                           args[0].y);
                return;
            }
            var ownerIndex = parseInt(args[1]);
            if (ownerIndex >= 0 && ownerIndex < map.getPlayerCount())
            {
                building.setOwner(map.getPlayer(ownerIndex));
            }
            else
            {
                building.setOwner(null);
            }
            map.updateSprites(args[0].x, args[0].y);
            self.print("building " + building.getBuildingID() +
                       " owner=" + ownerIndex);
        });

    // -------------------------------- funds ----------------------------------
    define(this.CMD_FUNDS_SIGN, this.CAT_FUNDS,
        function(map)
        {
            return qsTr("Sign toggle (current: ") +
                   ACTION_CHEAT_MENU.signText() + ")";
        },
        [],
        function(map, args)
        {
            var self = ACTION_CHEAT_MENU;
            self.adjustSign = -self.adjustSign;
            self.print("funds adjust sign=" + self.signText());
        });
    define(this.CMD_FUNDS_MULT, this.CAT_FUNDS,
        function(map)
        {
            var self = ACTION_CHEAT_MENU;
            return qsTr("Multiplier toggle (current: x") +
                   self.fundsMult() + ")";
        },
        [],
        function(map, args)
        {
            var self = ACTION_CHEAT_MENU;
            // x1 -> x10 -> x100 -> back to x1
            self.fundsMultIndex =
                (self.fundsMultIndex + 1) % self.FUNDS_MULT_CYCLE.length;
            self.print("funds adjust multiplier=x" + self.fundsMult());
        });
    define(this.CMD_FUNDS_ADJUST, this.CAT_FUNDS,
        function(map) { return qsTr("Adjust funds..."); },
        [stepAllPlayers,
         {type: this.STEP_MENU, options: function(map, args)
         {
             var self = ACTION_CHEAT_MENU;
             return self.amountOptions(self.FUNDS_BASE_STEPS,
                                       self.fundsMult());
         }}],
        function(map, args)
        {
            var self = ACTION_CHEAT_MENU;
            var player = map.getPlayer(parseInt(args[0]));
            var delta = parseInt(args[1]) * self.adjustSign;
            var newFunds = player.getFunds() + delta;
            if (newFunds < 0)
            {
                newFunds = 0;
            }
            player.setFunds(newFunds);
            self.print("player " + args[0] + " funds=" +
                       player.getFunds());
        });

    // --------------------------------- COs -----------------------------------
    define(this.CMD_CO_CHANGE, this.CAT_CO,
        function(map) { return qsTr("Change CO..."); },
        [stepAllPlayers, stepCoSlots,
         {type: this.STEP_MENU, options: function(map, args)
         {
             var ids = ACTION_CHEAT_MENU.coIds();
             var options = [];
             for (var i = 0; i < ids.length; ++i)
             {
                 options.push({id: ids[i],
                               text: ACTION_CHEAT_MENU.shortId(ids[i])});
             }
             return options;
         }}],
        function(map, args)
        {
            var player = map.getPlayer(parseInt(args[0]));
            var slot = parseInt(args[1]);
            player.setCO(args[2], slot);
            ACTION_CHEAT_MENU.print("player " + args[0] + " co slot " +
                                    slot + " -> " + args[2]);
        });
    define(this.CMD_CO_FILL, this.CAT_CO,
        function(map) { return qsTr("Fill CO power..."); },
        [stepAllPlayers, stepCoSlots],
        function(map, args)
        {
            ACTION_CHEAT_MENU.performCoFill(map, args, true);
        });
    define(this.CMD_CO_EMPTY, this.CAT_CO,
        function(map) { return qsTr("Empty CO power..."); },
        [stepAllPlayers, stepCoSlots],
        function(map, args)
        {
            ACTION_CHEAT_MENU.performCoFill(map, args, false);
        });

    // --------------------------------- misc ----------------------------------
    define(this.CMD_MISC_STATS, this.CAT_MISC,
        function(map) { return qsTr("Log content list stats"); },
        [],
        function(map, args)
        {
            var self = ACTION_CHEAT_MENU;
            var sample = function(list)
            {
                var head = [];
                for (var i = 0; i < list.length && i < 3; ++i)
                {
                    head.push(String(list[i]));
                }
                return "count=" + list.length + " first=[" +
                       head.join(",") + "]";
            };
            self.print("stats units|" + sample(self.unitIds()));
            self.print("stats terrains|" + sample(self.terrainIds()));
            self.print("stats cos|" + sample(self.coIds()));
            var lists = self.safeBuildingLists();
            self.print("stats buildings|" + sample(lists.buildings));
            self.print("stats weapons|" + sample(lists.weapons));
            var mgr = self.globalObject("buildingSpriteManager");
            self.print("stats buildingManager present=" +
                       (mgr !== undefined && mgr !== null));
        });
    define(this.CMD_MISC_WIN, this.CAT_MISC,
        function(map) { return qsTr("Declare victory..."); },
        [stepAllPlayers],
        function(map, args)
        {
            var winner = parseInt(args[0]);
            // defeating every other player triggers the standard victory
            for (var p = 0; p < map.getPlayerCount(); ++p)
            {
                if (p !== winner &&
                    !map.getPlayer(p).getIsDefeated())
                {
                    map.getPlayer(p).defeatPlayer(null, false);
                }
            }
            ACTION_CHEAT_MENU.print("player " + winner + " wins");
        });
    define(this.CMD_MISC_LOSE, this.CAT_MISC,
        function(map) { return qsTr("Declare defeat..."); },
        [stepAllPlayers],
        function(map, args)
        {
            map.getPlayer(parseInt(args[0])).defeatPlayer(null, false);
            ACTION_CHEAT_MENU.print("player " + args[0] + " defeated");
        });
    define(this.CMD_MISC_CONTROLLER, this.CAT_MISC,
        function(map)
        {
            return qsTr("Set player / CPU type (not live)...");
        },
        [stepAllPlayers,
         {type: this.STEP_MENU, options: function(map, args)
         {
             return ACTION_CHEAT_MENU.controllerOptions(map, args);
         }}],
        function(map, args)
        {
            var player = map.getPlayer(parseInt(args[0]));
            var isHuman = args[1] === "human";
            var controlType = isHuman ?
                GameEnums.AiTypes_Human : GameEnums.AiTypes_Normal;
            player.setControlType(controlType);
            ACTION_CHEAT_MENU.print("player " + args[0] +
                " controller setting=" + (isHuman ? "human" : "CPU") +
                (isHuman ? "" : "/normal AI") +
                "; active input unchanged (engine limitation)");
        });

    this.getName = function()
    {
        return qsTr("Cheat menu");
    };
    this.getDescription = function()
    {
        return qsTr("Cheat tools: change weather, toggle fog, replace terrain, adjust unit HP/fuel/ammo with sign and multiplier buttons, transform or spawn units, place buildings and cannons, adjust weapon HP, adjust funds, swap COs and fill or empty CO power, set a player's human/CPU control type, declare victory or defeat. The control type setting does not replace the active controller during a game. Single-player use only.");
    };
};

Constructor.prototype = ACTION;
var ACTION_CHEAT_MENU = new Constructor();
