var Constructor = function()
{
    // ======== Post-Animation State ========
    // Stores data needed by performPostAnimation, which the engine calls
    // when the walking animation finishes. Without setEndOfAnimationCall
    // the engine freezes waiting for animation completion that never fires.
    this.postAnimationUnit = null;
    this.postAnimationAnchorX = -1;
    this.postAnimationAnchorY = -1;
    this.postAnimationMode = "";  // "START", "PROGRESS", or "COMPLETE"

    // ======== Constants ========
    this.MAX_PROGRESS = 40;
    this.PROGRESS_PER_TURN = 10;

    // Synthesis costs: paid by the constructor's owner when starting synthesis
    this.SYNTHESIS_COSTS = {
        "ZMONOLITH": 5000,           // Black Obelisk (from 4 Crystal)
        "ZBLACKHOLE_CANNON": 8000,   // Black Cannon (from 4 MiniCannon)
        "ZDEATHRAY": 25000           // Death Ray (from 4 LaserCannon)
    };

    // Minimum synthesis cost (for canBePerformed check)
    this.MIN_SYNTH_COST = 5000;

    // Synthesis mapping: small weapon base type -> large weapon base ID
    // ZCRYSTALL -> ZMONOLITH (no direction)
    // ZMINICANNON -> ZBLACKHOLE_CANNON (E/N/S/W)
    // ZLASER -> ZDEATHRAY (E/N/S/W)

    // ======== Helper Functions ========

    this.getSynthesisCost = function(resultBaseID)
    {
        if (resultBaseID === "ZMONOLITH") return 5000;
        if (resultBaseID === "ZBLACKHOLE_CANNON") return 8000;
        if (resultBaseID === "ZDEATHRAY") return 25000;
        return 0;
    };

    this.getWeaponBaseType = function(buildingID)
    {
        if (buildingID === null || buildingID === undefined)
        {
            return null;
        }
        if (buildingID === "ZCRYSTALL")
        {
            return "CRYSTAL";
        }
        if (buildingID === "ZLASER")
        {
            return "LASER";
        }
        if (buildingID.indexOf("ZMINICANNON") === 0)
        {
            return "MINICANNON";
        }
        return null;
    };

    this.getResultBaseID = function(baseType)
    {
        if (baseType === "CRYSTAL")
        {
            return "ZMONOLITH";
        }
        if (baseType === "MINICANNON")
        {
            return "ZBLACKHOLE_CANNON";
        }
        if (baseType === "LASER")
        {
            return "ZDEATHRAY";
        }
        return null;
    };

    this.needsDirection = function(baseType)
    {
        return baseType === "MINICANNON" || baseType === "LASER";
    };

    this.isSynthesizing = function(unit)
    {
        try
        {
            var unitVars = unit.getVariables();
            return unitVars.getVariable("MU_WC_FIX_ACTIVE") !== null;
        }
        catch (e)
        {
            return false;
        }
    };

    // Find a valid 2x2 group of same-type same-owner special weapons
    // Returns { tiles: [{x,y}x4], anchorX, anchorY, baseType, ownerID } or null
    //
    // IMPORTANT: We do NOT check the surrounding 3x3 area for units/buildings here.
    // The previous version checked all 5 extra tiles in the 3x3 for units and buildings,
    // but this caused the Weapon Constructor ITSELF (standing adjacent to the 2x2)
    // to fail the unit check, making it impossible to select ANY target tile.
    // In Commander Wars, units and buildings can coexist on the same tile, so the
    // 3x3 large building can be placed even if units or regular buildings are present.
    this.find2x2Group = function(map, bx, by)
    {
        var patterns = [
            [[0, 0], [1, 0], [0, 1], [1, 1]],       // (bx,by) = top-left
            [[-1, 0], [0, 0], [-1, 1], [0, 1]],      // (bx,by) = top-right
            [[0, -1], [1, -1], [0, 0], [1, 0]],      // (bx,by) = bottom-left
            [[-1, -1], [0, -1], [-1, 0], [0, 0]]     // (bx,by) = bottom-right
        ];

        for (var p = 0; p < patterns.length; p++)
        {
            var tiles = [];
            var valid = true;
            var baseType = null;
            var ownerID = -1;

            for (var t = 0; t < 4; t++)
            {
                var tx = bx + patterns[p][t][0];
                var ty = by + patterns[p][t][1];
                if (!map.onMap(tx, ty))
                {
                    valid = false;
                    break;
                }
                var terrain = map.getTerrain(tx, ty);
                var building = terrain.getBuilding();
                if (building === null)
                {
                    valid = false;
                    break;
                }

                var buildingID = building.getBuildingID();
                var bt = ACTION_MU_FIX_WEAPON.getWeaponBaseType(buildingID);
                if (bt === null)
                {
                    valid = false;
                    break;
                }

                if (baseType === null)
                {
                    baseType = bt;
                    try
                    {
                        var bOwner = building.getOwner();
                        if (bOwner !== null && bOwner !== undefined)
                        {
                            ownerID = bOwner.getPlayerID();
                        }
                    }
                    catch (e) {}
                }
                else
                {
                    if (bt !== baseType)
                    {
                        valid = false;
                        break;
                    }
                    var curOwnerID = -1;
                    try
                    {
                        var bOwner2 = building.getOwner();
                        if (bOwner2 !== null && bOwner2 !== undefined)
                        {
                            curOwnerID = bOwner2.getPlayerID();
                        }
                    }
                    catch (e) {}
                    if (curOwnerID !== ownerID)
                    {
                        valid = false;
                        break;
                    }
                }

                tiles.push({x: tx, y: ty});
            }

            if (valid)
            {
                // The anchor is the bottom-right of the 2x2 (last tile)
                var anchorX = tiles[3].x;
                var anchorY = tiles[3].y;

                return {
                    tiles: tiles,
                    anchorX: anchorX,
                    anchorY: anchorY,
                    baseType: baseType,
                    ownerID: ownerID
                };
            }
        }

        return null;
    };

    // LOGIC ONLY - no animation creation here.
    // Visual animations are handled in performPostAnimation.
    this.completeSynthesis = function(unit, map)
    {
        var unitVars = unit.getVariables();

        var anchorX = -1, anchorY = -1, resultBaseID = "", direction = "", ownerID = -1;
        var tilesData = "";
        try
        {
            anchorX = unitVars.getVariable("MU_WC_FIX_ANCHOR_X").readDataInt32();
            anchorY = unitVars.getVariable("MU_WC_FIX_ANCHOR_Y").readDataInt32();
            resultBaseID = unitVars.getVariable("MU_WC_FIX_RESULT_TYPE").readDataString();
            var dirVar = unitVars.getVariable("MU_WC_FIX_DIRECTION");
            if (dirVar !== null)
            {
                direction = dirVar.readDataString();
            }
            ownerID = unitVars.getVariable("MU_WC_FIX_OWNER_ID").readDataInt32();
            tilesData = unitVars.getVariable("MU_WC_FIX_TILES").readDataString();
        }
        catch (e)
        {
            ACTION_MU_FIX_WEAPON.cancelSynthesis(unit);
            return;
        }

        // Parse tiles data: "x1:y1;x2:y2;x3:y3;x4:y4"
        var tilePairs = tilesData.split(";");
        if (tilePairs.length < 4)
        {
            ACTION_MU_FIX_WEAPON.cancelSynthesis(unit);
            return;
        }

        // Verify all 4 buildings still exist
        for (var i = 0; i < 4; i++)
        {
            var parts = tilePairs[i].split(":");
            if (parts.length < 2)
            {
                ACTION_MU_FIX_WEAPON.cancelSynthesis(unit);
                return;
            }
            var tx = parseInt(parts[0]);
            var ty = parseInt(parts[1]);
            if (!map.onMap(tx, ty))
            {
                ACTION_MU_FIX_WEAPON.cancelSynthesis(unit);
                return;
            }
            var terrain = map.getTerrain(tx, ty);
            if (terrain.getBuilding() === null)
            {
                // One of the buildings was destroyed - abort
                ACTION_MU_FIX_WEAPON.cancelSynthesis(unit);
                return;
            }
        }

        // Remove the 4 buildings
        for (var i2 = 0; i2 < 4; i2++)
        {
            var parts2 = tilePairs[i2].split(":");
            var tx2 = parseInt(parts2[0]);
            var ty2 = parseInt(parts2[1]);
            var terrain2 = map.getTerrain(tx2, ty2);
            terrain2.removeBuilding();
        }

        // Build the result building ID
        var buildingID = resultBaseID;
        if (direction !== "" && (resultBaseID === "ZBLACKHOLE_CANNON" || resultBaseID === "ZDEATHRAY"))
        {
            buildingID = resultBaseID + "_" + direction;
        }

        // Place the 3x3 building at the anchor
        if (!map.onMap(anchorX, anchorY))
        {
            ACTION_MU_FIX_WEAPON.cancelSynthesis(unit);
            return;
        }
        var anchorTerrain = map.getTerrain(anchorX, anchorY);
        anchorTerrain.loadBuilding(buildingID);
        var building = anchorTerrain.getBuilding();
        if (building === null)
        {
            ACTION_MU_FIX_WEAPON.cancelSynthesis(unit);
            return;
        }

        // Set owner (inherited from the 4 original weapons)
        var targetPlayer = map.getPlayer(ownerID);
        if (targetPlayer !== null && targetPlayer !== undefined)
        {
            try
            {
                building.setOwner(targetPlayer);
            }
            catch (e)
            {
                building.setUnitOwner(unit);
            }
        }
        else
        {
            building.setUnitOwner(unit);
        }

        // Set fire count
        try
        {
            if (resultBaseID === "ZDEATHRAY")
            {
                building.setFireCount(0);  // Death Ray needs 7 turns to charge
            }
            else
            {
                building.setFireCount(1);
            }
        }
        catch (e) {}

        // Clear synthesis variables
        ACTION_MU_FIX_WEAPON.cancelSynthesis(unit);

        // Record the build (logic only - no animation here)
        try { map.getGameRecorder().buildUnit(building.getOwner().getPlayerID(), buildingID, unit.getOwner().getPlayerID()); } catch (e) {}
    };

    this.cancelSynthesis = function(unit)
    {
        try
        {
            var unitVars = unit.getVariables();
            unitVars.deleteVariable("MU_WC_FIX_ACTIVE");
            unitVars.deleteVariable("MU_WC_FIX_TILES");
            unitVars.deleteVariable("MU_WC_FIX_RESULT_TYPE");
            unitVars.deleteVariable("MU_WC_FIX_DIRECTION");
            unitVars.deleteVariable("MU_WC_FIX_ANCHOR_X");
            unitVars.deleteVariable("MU_WC_FIX_ANCHOR_Y");
            unitVars.deleteVariable("MU_WC_FIX_OWNER_ID");
            unitVars.deleteVariable("MU_WC_FIX_PROGRESS");
            unitVars.deleteVariable("MU_PROTECTED");
        }
        catch (e) {}
    };

    // ======== Action Interface ========

    this.canBePerformed = function(action, map)
    {
        var unit = action.getTargetUnit();
        if (unit === null || unit.getHasMoved() === true)
        {
            return false;
        }

        var unitVars = unit.getVariables();
        var fixVar = unitVars.getVariable("MU_WC_FIX_ACTIVE");

        if (fixVar !== null)
        {
            // Synthesis in progress - allow continuing
            return true;
        }

        // No synthesis in progress - check basic prerequisites only.
        // Target validation happens in getStepData (FIELD selection).
        if (unit.getAmmo2() <= 0)
        {
            return false;
        }

        var owner = unit.getOwner();
        if (owner.getFunds() < ACTION_MU_FIX_WEAPON.MIN_SYNTH_COST)
        {
            return false;
        }

        return true;
    };

    this.getActionText = function(map)
    {
        return qsTr("Fix Weapon");
    };

    this.getIcon = function(map)
    {
        return "icon_fire";
    };

    this.getStepInputType = function(action, map)
    {
        var unit = action.getTargetUnit();
        if (ACTION_MU_FIX_WEAPON.isSynthesizing(unit))
        {
            return "";
        }

        var step = action.getInputStep();
        if (step === 0)
        {
            return "FIELD";
        }
        if (step === 1)
        {
            // Check if direction is actually needed
            try
            {
                action.startReading();
                var selX = action.readDataInt32();
                var selY = action.readDataInt32();
                if (map.onMap(selX, selY))
                {
                    var terrain = map.getTerrain(selX, selY);
                    var building = terrain.getBuilding();
                    if (building !== null)
                    {
                        var baseType = ACTION_MU_FIX_WEAPON.getWeaponBaseType(building.getBuildingID());
                        if (baseType !== null && !ACTION_MU_FIX_WEAPON.needsDirection(baseType))
                        {
                            return "";  // No direction needed, this step is final
                        }
                    }
                }
            }
            catch (e) {}
            return "MENU";  // direction selection (for Black Cannon / Death Ray)
        }
        return "";
    };

    this.isFinalStep = function(action, map)
    {
        var unit = action.getTargetUnit();
        if (ACTION_MU_FIX_WEAPON.isSynthesizing(unit))
        {
            return true;
        }

        var step = action.getInputStep();
        if (step === 0)
        {
            return false;
        }

        // Check if direction selection is needed
        try
        {
            action.startReading();
            var selX = action.readDataInt32();
            var selY = action.readDataInt32();
            if (map.onMap(selX, selY))
            {
                var terrain = map.getTerrain(selX, selY);
                var building = terrain.getBuilding();
                if (building !== null)
                {
                    var baseType = ACTION_MU_FIX_WEAPON.getWeaponBaseType(building.getBuildingID());
                    if (baseType !== null && !ACTION_MU_FIX_WEAPON.needsDirection(baseType))
                    {
                        return step >= 1;  // No direction needed, step 1 is final
                    }
                }
            }
        }
        catch (e) {}

        return step >= 2;  // direction step + final
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
            // FIELD: show adjacent tiles with valid 2x2 special weapon groups
            data.setColor("#C800FF00");
            for (var dx = -1; dx <= 1; dx++)
            {
                for (var dy = -1; dy <= 1; dy++)
                {
                    if (Math.abs(dx) + Math.abs(dy) !== 1)
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
                    var building = terrain.getBuilding();
                    if (building === null)
                    {
                        continue;
                    }
                    if (ACTION_MU_FIX_WEAPON.getWeaponBaseType(building.getBuildingID()) === null)
                    {
                        continue;
                    }
                    var group = ACTION_MU_FIX_WEAPON.find2x2Group(map, tx, ty);
                    if (group !== null)
                    {
                        data.addPoint(Qt.point(tx, ty));
                    }
                }
            }
        }
        else if (step === 1)
        {
            // MENU: direction selection (for Black Cannon / Death Ray)
            // Read the selected tile from step 0
            var selX = -1, selY = -1;
            try
            {
                action.startReading();
                selX = action.readDataInt32();
                selY = action.readDataInt32();
            }
            catch (e) {}

            if (selX >= 0 && selY >= 0 && map.onMap(selX, selY))
            {
                var terrain2 = map.getTerrain(selX, selY);
                var building2 = terrain2.getBuilding();
                if (building2 !== null)
                {
                    var baseType = ACTION_MU_FIX_WEAPON.getWeaponBaseType(building2.getBuildingID());
                    if (baseType !== null && ACTION_MU_FIX_WEAPON.needsDirection(baseType))
                    {
                        var resultID2 = ACTION_MU_FIX_WEAPON.getResultBaseID(baseType);
                        var cost2 = ACTION_MU_FIX_WEAPON.getSynthesisCost(resultID2);
                        var costStr = " (" + cost2 + "G)";
                        var unit2 = action.getTargetUnit();
                        var canAfford2 = unit2.getOwner().getFunds() >= cost2;
                        data.addData(qsTr("East") + costStr, "E", "icon_fire", cost2, canAfford2);
                        data.addData(qsTr("North") + costStr, "N", "icon_fire", cost2, canAfford2);
                        data.addData(qsTr("South") + costStr, "S", "icon_fire", cost2, canAfford2);
                        data.addData(qsTr("West") + costStr, "W", "icon_fire", cost2, canAfford2);
                    }
                    // If no direction needed (Crystal -> Monolith), isFinalStep already returned true
                }
            }
        }
    };

    this.perform = function(action, map)
    {
        var unit = action.getTargetUnit();
        var unitVars = unit.getVariables();
        var fixVar = unitVars.getVariable("MU_WC_FIX_ACTIVE");
        var isContinuation = (fixVar !== null);

        // --- Read start-phase data BEFORE moveUnit (following ACTION_MU_EMPOWER pattern) ---
        var selX = -1, selY = -1;
        var direction = "";
        var group = null;
        if (!isContinuation)
        {
            action.startReading();
            selX = action.readDataInt32();
            selY = action.readDataInt32();

            // Find the 2x2 group at the selected tile
            if (map.onMap(selX, selY))
            {
                group = ACTION_MU_FIX_WEAPON.find2x2Group(map, selX, selY);
            }

            // Read direction if the weapon type requires it
            if (group !== null && ACTION_MU_FIX_WEAPON.needsDirection(group.baseType))
            {
                try
                {
                    direction = action.readDataString();
                }
                catch (e)
                {
                    direction = "E";
                }
            }
        }

        // ====== Common: walking animation + setEndOfAnimationCall + moveUnit ======
        // CRITICAL FIX: Without setEndOfAnimationCall the engine freezes waiting
        // for the walking animation completion callback that never fires.
        // This pattern is used for BOTH the start and continuation phases.
        var engineCost = action.getCosts();
        var animation = Global[unit.getUnitID()].doWalkingAnimation(action, map);
        animation.setEndOfAnimationCall("ACTION_MU_FIX_WEAPON", "performPostAnimation");
        Global[unit.getUnitID()].moveUnit(unit, action, map);

        // Restore fuel - only deduct the real movement cost.
        // The constructor does not actually move while synthesizing, but we
        // follow the safe fuel-handling pattern from ACTION_MU_EMPOWER.
        var realCost = 0;
        try
        {
            var path = action.getMovePath();
            if (path !== null && path.length > 1)
            {
                for (var i = 0; i < path.length - 1; i++)
                {
                    var mc = unit.getMovementCosts(path[i].x, path[i].y, path[i + 1].x, path[i + 1].y);
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

        // Initialize postAnimation state (will be filled by the logic below)
        ACTION_MU_FIX_WEAPON.postAnimationUnit = unit;
        ACTION_MU_FIX_WEAPON.postAnimationAnchorX = -1;
        ACTION_MU_FIX_WEAPON.postAnimationAnchorY = -1;
        ACTION_MU_FIX_WEAPON.postAnimationMode = "";

        if (isContinuation)
        {
            // ====== Synthesis in progress - continue ======
            // Increment progress
            var progressVar = unitVars.getVariable("MU_WC_FIX_PROGRESS");
            var progress = 0;
            try
            {
                progress = progressVar.readDataInt32();
            }
            catch (e) {}
            progress += ACTION_MU_FIX_WEAPON.PROGRESS_PER_TURN;

            // Read anchor coordinates BEFORE completeSynthesis clears variables
            var anchorX = -1, anchorY = -1;
            try
            {
                anchorX = unitVars.getVariable("MU_WC_FIX_ANCHOR_X").readDataInt32();
                anchorY = unitVars.getVariable("MU_WC_FIX_ANCHOR_Y").readDataInt32();
            }
            catch (e) {}

            if (progress >= ACTION_MU_FIX_WEAPON.MAX_PROGRESS)
            {
                // Complete synthesis (logic only - animations go in performPostAnimation)
                ACTION_MU_FIX_WEAPON.completeSynthesis(unit, map);
                ACTION_MU_FIX_WEAPON.postAnimationMode = "COMPLETE";
                ACTION_MU_FIX_WEAPON.postAnimationAnchorX = anchorX;
                ACTION_MU_FIX_WEAPON.postAnimationAnchorY = anchorY;
            }
            else
            {
                progressVar.writeDataInt32(progress);
                ACTION_MU_FIX_WEAPON.postAnimationMode = "PROGRESS";
                ACTION_MU_FIX_WEAPON.postAnimationAnchorX = anchorX;
                ACTION_MU_FIX_WEAPON.postAnimationAnchorY = anchorY;
            }

            unit.setHasMoved(true);
            return;
        }

        // ====== Start new synthesis ======
        if (unit.getAmmo2() <= 0)
        {
            unit.setHasMoved(true);
            return;
        }

        if (group === null)
        {
            // No valid group found - abort
            unit.setHasMoved(true);
            return;
        }

        var resultBaseID = ACTION_MU_FIX_WEAPON.getResultBaseID(group.baseType);
        if (resultBaseID === null)
        {
            unit.setHasMoved(true);
            return;
        }

        // Check and deduct synthesis cost
        var synthCost = ACTION_MU_FIX_WEAPON.getSynthesisCost(resultBaseID);
        var synthOwner = unit.getOwner();
        if (synthOwner.getFunds() < synthCost)
        {
            // Can't afford synthesis - abort
            unit.setHasMoved(true);
            return;
        }
        synthOwner.addFunds(-synthCost);

        // Consume 1 construction ammo
        unit.setAmmo2(unit.getAmmo2() - 1);

        // Build tiles data string
        var tilesData = "";
        for (var i2 = 0; i2 < 4; i2++)
        {
            if (i2 > 0)
            {
                tilesData += ";";
            }
            tilesData += group.tiles[i2].x + ":" + group.tiles[i2].y;
        }

        // Set synthesis variables
        unitVars.createVariable("MU_WC_FIX_ACTIVE").writeDataBool(true);
        unitVars.createVariable("MU_WC_FIX_TILES").writeDataString(tilesData);
        unitVars.createVariable("MU_WC_FIX_RESULT_TYPE").writeDataString(resultBaseID);
        if (direction !== "")
        {
            unitVars.createVariable("MU_WC_FIX_DIRECTION").writeDataString(direction);
        }
        unitVars.createVariable("MU_WC_FIX_ANCHOR_X").writeDataInt32(group.anchorX);
        unitVars.createVariable("MU_WC_FIX_ANCHOR_Y").writeDataInt32(group.anchorY);
        unitVars.createVariable("MU_WC_FIX_OWNER_ID").writeDataInt32(group.ownerID);
        unitVars.createVariable("MU_WC_FIX_PROGRESS").writeDataInt32(ACTION_MU_FIX_WEAPON.PROGRESS_PER_TURN);

        // Protect unit during synthesis
        unitVars.createVariable("MU_PROTECTED").writeDataBool(true);

        // Set postAnimation state for the start animation
        ACTION_MU_FIX_WEAPON.postAnimationMode = "START";
        ACTION_MU_FIX_WEAPON.postAnimationAnchorX = group.anchorX;
        ACTION_MU_FIX_WEAPON.postAnimationAnchorY = group.anchorY;

        unit.setHasMoved(true);
    };

    // Called by the engine when the walking animation finishes.
    // Visual effects only - all core logic is in perform().
    this.performPostAnimation = function(postAnimation, map)
    {
        var mode = ACTION_MU_FIX_WEAPON.postAnimationMode;
        var anchorX = ACTION_MU_FIX_WEAPON.postAnimationAnchorX;
        var anchorY = ACTION_MU_FIX_WEAPON.postAnimationAnchorY;

        if (mode === "COMPLETE")
        {
            // Synthesis finished - play the completion animation
            if (anchorX >= 0 && anchorY >= 0 && map.onMap(anchorX - 1, anchorY - 1))
            {
                var anim = GameAnimationFactory.createAnimation(map, anchorX - 1, anchorY - 1);
                anim.addSprite("rockets_explode", -map.getImageSize() / 2, -map.getImageSize() / 2, 0, 2);
                anim.setSound("powerOfBlack.wav", 1, 0);
            }
        }
        else if (mode === "PROGRESS")
        {
            // Synthesis in progress - play the progress animation
            if (anchorX >= 0 && anchorY >= 0 && map.onMap(anchorX - 1, anchorY - 1))
            {
                var anim2 = GameAnimationFactory.createAnimation(map, anchorX - 1, anchorY - 1);
                anim2.addSprite("capture_background", 0, 0, 0, 1);
                anim2.setSound("build.wav", 1, 0);
            }
        }
        else if (mode === "START")
        {
            // Synthesis started - play the start animation
            if (anchorX >= 0 && anchorY >= 0 && map.onMap(anchorX - 1, anchorY - 1))
            {
                var anim3 = GameAnimationFactory.createAnimation(map, anchorX - 1, anchorY - 1);
                anim3.addSprite("capture_background", 0, 0, 0, 1);
                anim3.setSound("powerOfBlack.wav", 1, 0);
            }
        }

        // Reset postAnimation state
        ACTION_MU_FIX_WEAPON.postAnimationUnit = null;
        ACTION_MU_FIX_WEAPON.postAnimationAnchorX = -1;
        ACTION_MU_FIX_WEAPON.postAnimationAnchorY = -1;
        ACTION_MU_FIX_WEAPON.postAnimationMode = "";
    };

    this.getName = function()
    {
        return qsTr("Fix Weapon");
    };

    this.getDescription = function()
    {
        return qsTr("Synthesize 4 same-type same-faction weapons in a 2x2 pattern into a larger weapon. 4 Crystal -> Black Obelisk (5000G), 4 MiniCannon -> Black Cannon (8000G, choose direction), 4 LaserCannon -> Death Ray (25000G, choose direction). Directions of the 4 weapons can differ. Synthesis takes 4 turns. Cannot move or attack during synthesis. Consumes 1 construction ammo. Ownership inherited from original weapons. Large weapons turn tiles to Plains when destroyed.");
    };
}

Constructor.prototype = ACTION;
var ACTION_MU_FIX_WEAPON = new Constructor();
