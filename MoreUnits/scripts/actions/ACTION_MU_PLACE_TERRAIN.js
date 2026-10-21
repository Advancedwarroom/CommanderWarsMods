var Constructor = function()
{
    this.PLACE_COST = 1000;

    this.postAnimationUnit = null;
    this.postAnimationTargetX = -1;
    this.postAnimationTargetY = -1;
    this.postAnimationTerrainID = "";

    // Natural terrain types that can be placed and built upon
    this.validTerrainIDs = ["PLAINS", "FOREST", "STREET", "MOUNTAIN", "RIVER", "SEA", "BRIDGE",
                            "ROAD", "HILL", "PLAIN", "SNOW", "DESERT", "WASTE",
                            "SNOW_FOREST", "SNOW_MOUNTAIN", "DESERT_FOREST", "DESERT_MOUNTAIN",
                            "WASTE_FOREST", "WASTE_MOUNTAIN", "STREET1", "SNOW_STREET"];

    // Terrain types that can be placed
    this.placeableTerrainIDs = ["PLAINS", "FOREST", "STREET", "MOUNTAIN", "RIVER", "SEA", "BRIDGE"];

    this.isValidNaturalTerrain = function(terrainID)
    {
        if (terrainID === null || terrainID === undefined)
        {
            return false;
        }
        var upper = terrainID.toUpperCase();
        for (var i = 0; i < ACTION_MU_PLACE_TERRAIN.validTerrainIDs.length; i++)
        {
            if (upper === ACTION_MU_PLACE_TERRAIN.validTerrainIDs[i])
            {
                return true;
            }
        }
        return false;
    };

    this.canBePerformed = function(action, map)
    {
        var unit = action.getTargetUnit();
        if (unit === null)
        {
            return false;
        }

        // Check if unit is empowered
        var unitVars = unit.getVariables();
        var empoweredVar = unitVars.getVariable("MU_EMPOWERED");
        if (empoweredVar === null)
        {
            return false;
        }

        // Check funds (1000G from the empowered unit's owner)
        var owner = unit.getOwner();
        if (owner.getFunds() < ACTION_MU_PLACE_TERRAIN.PLACE_COST)
        {
            return false;
        }

        var actionTarget = action.getActionTarget();
        var targetField = action.getTarget();

        // Two-branch check (same pattern as ACTION_FIRE)
        var canPerformAtPosition = false;
        if ((unit.getHasMoved() === false &&
             actionTarget.x === targetField.x &&
             actionTarget.y === targetField.y) ||
            (action.getMovementTarget() === null &&
             unit.canMoveAndFire(targetField) &&
             unit.getBaseMovementCosts(actionTarget.x, actionTarget.y) > 0))
        {
            canPerformAtPosition = true;
        }

        if (!canPerformAtPosition)
        {
            return false;
        }

        // Check if there is at least one valid tile within range 1 (adjacent + own)
        var ux = actionTarget.x;
        var uy = actionTarget.y;
        for (var dx = -1; dx <= 1; dx++)
        {
            for (var dy = -1; dy <= 1; dy++)
            {
                if (Math.abs(dx) + Math.abs(dy) > 1)
                {
                    continue;
                }
                var tx = ux + dx;
                var ty = uy + dy;
                if (!map.onMap(tx, ty))
                {
                    continue;
                }
                var terrain = map.getTerrain(tx, ty);
                // Must be natural terrain
                if (!ACTION_MU_PLACE_TERRAIN.isValidNaturalTerrain(terrain.getID()))
                {
                    continue;
                }
                // Check for units
                var tileUnit = terrain.getUnit();
                if (tileUnit !== null)
                {
                    // Own tile (dx=0, dy=0) with self is OK
                    if (dx === 0 && dy === 0)
                    {
                        // This is the unit's own tile - OK
                    }
                    else
                    {
                        // Other tile with unit - can't place
                        continue;
                    }
                }
                // No building allowed on target tile
                var building = terrain.getBuilding();
                if (building !== null)
                {
                    continue;
                }
                return true;
            }
        }
        return false;
    };

    this.getActionText = function(map)
    {
        return qsTr("Place") + " " + ACTION_MU_PLACE_TERRAIN.PLACE_COST.toString();
    };

    this.getIcon = function(map)
    {
        return "icon_fire";
    };

    // Step 0: FIELD - select target tile (adjacent + own)
    // Step 1: MENU - select terrain type to place
    this.getStepInputType = function(action, map)
    {
        var step = action.getInputStep();
        if (step === 0)
        {
            return "FIELD";
        }
        if (step === 1)
        {
            return "MENU";
        }
        return "";
    };

    this.isFinalStep = function(action, map)
    {
        return action.getInputStep() >= 2;
    };

    this.getStepData = function(action, data, map)
    {
        var step = action.getInputStep();
        var unit = action.getTargetUnit();
        var actionTarget = action.getActionTarget();
        var ux = actionTarget.x;
        var uy = actionTarget.y;

        if (step === 0)
        {
            // FIELD: show valid tiles within range 1
            data.setColor("#C800FF00");
            for (var dx = -1; dx <= 1; dx++)
            {
                for (var dy = -1; dy <= 1; dy++)
                {
                    if (Math.abs(dx) + Math.abs(dy) > 1)
                    {
                        continue;
                    }
                    var tx = ux + dx;
                    var ty = uy + dy;
                    if (!map.onMap(tx, ty))
                    {
                        continue;
                    }
                    var terrain = map.getTerrain(tx, ty);
                    if (!ACTION_MU_PLACE_TERRAIN.isValidNaturalTerrain(terrain.getID()))
                    {
                        continue;
                    }
                    var tileUnit = terrain.getUnit();
                    if (tileUnit !== null && !(dx === 0 && dy === 0))
                    {
                        continue;
                    }
                    var building = terrain.getBuilding();
                    if (building !== null)
                    {
                        continue;
                    }
                    data.addPoint(Qt.point(tx, ty));
                }
            }
        }
        else if (step === 1)
        {
            // MENU: select terrain type to place
            var terrainLabels = [
                ["Plains", "PLAINS"],
                ["Forest", "FOREST"],
                ["Road", "STREET"],
                ["Mountain", "MOUNTAIN"],
                ["River", "RIVER"],
                ["Sea", "SEA"],
                ["Bridge", "BRIDGE"]
            ];
            for (var i = 0; i < terrainLabels.length; i++)
            {
                data.addData(qsTr(terrainLabels[i][0]), terrainLabels[i][1], "icon_fire",
                             ACTION_MU_PLACE_TERRAIN.PLACE_COST, true);
            }
        }
    };

    this.perform = function(action, map)
    {
        var unit = action.getTargetUnit();
        ACTION_MU_PLACE_TERRAIN.postAnimationUnit = unit;

        // Read action data FIRST (before moveUnit), following vanilla ACTION_FIRE pattern.
        action.startReading();
        ACTION_MU_PLACE_TERRAIN.postAnimationTargetX = action.readDataInt32();
        ACTION_MU_PLACE_TERRAIN.postAnimationTargetY = action.readDataInt32();

        var terrainID = "";
        try
        {
            terrainID = action.readDataString();
        }
        catch (e)
        {
            terrainID = "PLAINS";
        }
        ACTION_MU_PLACE_TERRAIN.postAnimationTerrainID = terrainID;

        // Record the engine fuel cost BEFORE moveUnit so we can undo it.
        // moveUnitAction reads action.getCosts() and deducts it as fuel.
        // Place Terrain is not a movement action, so we must prevent fuel drainage.
        var engineCost = action.getCosts();

        var animation = Global[unit.getUnitID()].doWalkingAnimation(action, map);
        animation.setEndOfAnimationCall("ACTION_MU_PLACE_TERRAIN", "performPostAnimation");

        Global[unit.getUnitID()].moveUnit(unit, action, map);

        // Restore the fuel that moveUnitAction just deducted and re-deduct
        // only the real movement cost (if the unit actually moved).
        var realCost = 0;
        try
        {
            var path = action.getMovePath();
            if (path !== null && path.length > 1)
            {
                for (var i = 0; i < path.length - 1; i++)
                {
                    var mc = unit.getMovementCosts(path[i].x, path[i].y,
                                                  path[i + 1].x, path[i + 1].y);
                    if (mc > 0)
                    {
                        realCost += mc;
                    }
                }
            }
        }
        catch (e)
        {
            realCost = 0;
        }

        unit.setFuel(unit.getFuel() + engineCost);
        var newFuel = unit.getFuel() - realCost;
        if (newFuel < 0)
        {
            newFuel = 0;
        }
        unit.setFuel(newFuel);

        // --- Core placement logic moved to perform() for reliability ---
        // Previously this was in performPostAnimation which may not fire
        // if the walking animation callback is lost.
        var ptx = ACTION_MU_PLACE_TERRAIN.postAnimationTargetX;
        var pty = ACTION_MU_PLACE_TERRAIN.postAnimationTargetY;
        var pTerrainID = ACTION_MU_PLACE_TERRAIN.postAnimationTerrainID;

        if (ptx !== -1 && pty !== -1)
        {
            var placeOwner = unit.getOwner();
            placeOwner.addFunds(-ACTION_MU_PLACE_TERRAIN.PLACE_COST);

            if (map.onMap(ptx, pty) && pTerrainID !== "")
            {
                var oldTerrain = map.getTerrain(ptx, pty);
                var oldTerrainID = oldTerrain.getID();

                var oldVars = oldTerrain.getVariables();
                var origVar = oldVars.createVariable("MU_ORIGINAL_TERRAIN");
                origVar.writeDataString(oldTerrainID);

                map.replaceTerrain(pTerrainID, ptx, pty);

                // Refresh adjacent sprites
                for (var rdx = -1; rdx <= 1; rdx++)
                {
                    for (var rdy = -1; rdy <= 1; rdy++)
                    {
                        var rtx = ptx + rdx;
                        var rty = pty + rdy;
                        if (map.onMap(rtx, rty))
                        {
                            var rt = map.getTerrain(rtx, rty);
                            try
                            {
                                Global[rt.getID()].loadBaseSprite(rt, map);
                            }
                            catch (e) {}
                        }
                    }
                }
            }
        }

        // Mark unit as moved IMMEDIATELY
        unit.setHasMoved(true);
    };

    this.performPostAnimation = function(postAnimation, map)
    {
        // Visual effects only - core logic is in perform()
        var targetX = ACTION_MU_PLACE_TERRAIN.postAnimationTargetX;
        var targetY = ACTION_MU_PLACE_TERRAIN.postAnimationTargetY;

        if (targetX !== -1 && targetY !== -1 && map.onMap(targetX, targetY))
        {
            var anim = GameAnimationFactory.createAnimation(map, targetX, targetY);
            anim.addSprite("rockets_explode", -map.getImageSize() / 2, -map.getImageSize() / 2, 0, 1.5);
            anim.setSound("build.wav", 1, 0);
        }

        ACTION_MU_PLACE_TERRAIN.postAnimationUnit = null;
        ACTION_MU_PLACE_TERRAIN.postAnimationTargetX = -1;
        ACTION_MU_PLACE_TERRAIN.postAnimationTargetY = -1;
        ACTION_MU_PLACE_TERRAIN.postAnimationTerrainID = "";
    };

    this.getName = function()
    {
        return qsTr("Place Terrain");
    };

    this.getDescription = function()
    {
        return qsTr("Place natural terrain (Plains, Forest, Road, Mountain, River, Sea, Bridge) on an adjacent tile or own tile. Only works on natural terrain tiles. Cannot place on tiles with units (except own tile) or buildings. Costs 1000G from the unit's owner.");
    };
}

Constructor.prototype = ACTION;
var ACTION_MU_PLACE_TERRAIN = new Constructor();
