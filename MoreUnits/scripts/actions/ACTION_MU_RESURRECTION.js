var Constructor = function()
{
    this.postAnimationUnit = null;
    this.postAnimationTargetX = -1;
    this.postAnimationTargetY = -1;
    this.postAnimationSelectedData = null;

    this.canBePerformed = function(action, map)
    {
        if (typeof MU_SYSTEM === "undefined" || MU_SYSTEM === null)
        {
            return false;
        }
        var unit = action.getTargetUnit();
        if (unit === null)
        {
            return false;
        }
        if (unit.getAmmo1() <= 0)
        {
            return false;
        }

        var actionTarget = action.getActionTarget();
        var targetField = action.getTarget();

        // Two-branch check following the same pattern as ACTION_FIRE:
        // Branch 1: not moved and staying in place
        // Branch 2: moving to a new reachable tile (does NOT check getHasMoved,
        //           allows canMoveAndFire units to act after moving)
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

        // Check if there's at least one valid resurrection target within range 1
        var ux = actionTarget.x;
        var uy = actionTarget.y;
        var player = unit.getOwner();

        for (var dx = -1; dx <= 1; dx++)
        {
            for (var dy = -1; dy <= 1; dy++)
            {
                if (dx === 0 && dy === 0)
                {
                    continue;
                }
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
                if (terrain.getUnit() !== null)
                {
                    continue;
                }
                var deaths = MU_SYSTEM.getDeathList(terrain);
                for (var i = 0; i < deaths.length; i++)
                {
                    if (MU_SYSTEM.isResurrectable(deaths[i].unitID, null))
                    {
                        var cost = MU_SYSTEM.getResurrectionCost(deaths[i].unitID);
                        if (player.getFunds() >= cost)
                        {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    };

    this.getActionText = function(map)
    {
        return qsTr("Resurrection");
    };

    this.getIcon = function(map)
    {
        return "icon_fire";
    };

    // Step 0: FIELD - select target tile
    // Step 1: MENU - select dead unit from tile
    // Step 2: MENU - select ownership mode (Original Owner / Self Owner)
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
        if (step === 2)
        {
            return "MENU";
        }
        return "";
    };

    this.isFinalStep = function(action, map)
    {
        return action.getInputStep() >= 3;
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
            // FIELD: show tiles within range 1 that have valid, affordable dead units
            data.setColor("#C800FF00");
            var player = unit.getOwner();

            for (var dx = -1; dx <= 1; dx++)
            {
                for (var dy = -1; dy <= 1; dy++)
                {
                    if (dx === 0 && dy === 0)
                    {
                        continue;
                    }
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
                    if (terrain.getUnit() !== null)
                    {
                        continue;
                    }
                    var deaths = MU_SYSTEM.getDeathList(terrain);
                    var hasValid = false;
                    for (var i = 0; i < deaths.length; i++)
                    {
                        if (MU_SYSTEM.isResurrectable(deaths[i].unitID, null))
                        {
                            var cost = MU_SYSTEM.getResurrectionCost(deaths[i].unitID);
                            if (player.getFunds() >= cost)
                            {
                                hasValid = true;
                                break;
                            }
                        }
                    }
                    if (hasValid)
                    {
                        data.addPoint(Qt.point(tx, ty));
                    }
                }
            }
        }
        else if (step === 1)
        {
            // MENU: show dead units at the selected tile
            var targetX = -1;
            var targetY = -1;

            try
            {
                action.startReading();
                targetX = action.readDataInt32();
                targetY = action.readDataInt32();
            }
            catch (e)
            {
                targetX = -1;
                targetY = -1;
            }

            var player2 = unit.getOwner();

            if (targetX >= 0 && targetY >= 0 && map.onMap(targetX, targetY))
            {
                var terrainAt = map.getTerrain(targetX, targetY);
                var deathsAt = MU_SYSTEM.getDeathList(terrainAt);

                for (var j = 0; j < deathsAt.length; j++)
                {
                    if (!MU_SYSTEM.isResurrectable(deathsAt[j].unitID, null))
                    {
                        continue;
                    }
                    var costJ = MU_SYSTEM.getResurrectionCost(deathsAt[j].unitID);
                    var nameJ = MU_SYSTEM.getUnitName(deathsAt[j].unitID);
                    var canAffordJ = player2.getFunds() >= costJ;
                    var labelJ = nameJ + " (" + costJ + "G)";
                    var dataStrJ = targetX + ":" + targetY + ":" + deathsAt[j].unitID + ":" + deathsAt[j].ownerID + ":" + deathsAt[j].index;
                    data.addData(labelJ, dataStrJ, "icon_fire", costJ, canAffordJ);
                }
            }
            else
            {
                // Fallback: show all dead units from all adjacent tiles
                for (var dx2 = -1; dx2 <= 1; dx2++)
                {
                    for (var dy2 = -1; dy2 <= 1; dy2++)
                    {
                        if (dx2 === 0 && dy2 === 0)
                        {
                            continue;
                        }
                        if (Math.abs(dx2) + Math.abs(dy2) !== 1)
                        {
                            continue;
                        }
                        var tx2 = ux + dx2;
                        var ty2 = uy + dy2;
                        if (!map.onMap(tx2, ty2))
                        {
                            continue;
                        }
                        var terrain2 = map.getTerrain(tx2, ty2);
                        if (terrain2.getUnit() !== null)
                        {
                            continue;
                        }
                        var deaths2 = MU_SYSTEM.getDeathList(terrain2);
                        for (var k = 0; k < deaths2.length; k++)
                        {
                            if (!MU_SYSTEM.isResurrectable(deaths2[k].unitID, null))
                            {
                                continue;
                            }
                            var costK = MU_SYSTEM.getResurrectionCost(deaths2[k].unitID);
                            var nameK = MU_SYSTEM.getUnitName(deaths2[k].unitID);
                            var canAffordK = player2.getFunds() >= costK;
                            var labelK = nameK + " (" + costK + "G) [" + tx2 + "," + ty2 + "]";
                            var dataStrK = tx2 + ":" + ty2 + ":" + deaths2[k].unitID + ":" + deaths2[k].ownerID + ":" + deaths2[k].index;
                            data.addData(labelK, dataStrK, "icon_fire", costK, canAffordK);
                        }
                    }
                }
            }
        }
        else if (step === 2)
        {
            // MENU: choose ownership mode
            // "ORIGINAL" = resurrect under the dead unit's original owner
            // "SELF" = resurrect under the BackTrackCar's owner
            data.addData(qsTr("Original Owner"), "ORIGINAL", "icon_fire", 0, true);
            data.addData(qsTr("Self Owner"), "SELF", "icon_fire", 0, true);
        }
    };

    this.perform = function(action, map)
    {
        var unit = action.getTargetUnit();
        ACTION_MU_RESURRECTION.postAnimationUnit = unit;

        // Record the engine fuel cost BEFORE moveUnit so we can undo it.
        // moveUnitAction reads action.getCosts() and deducts it as fuel.
        // For this custom resurrection action, the engine's cost value does
        // NOT reflect actual movement (resurrection targets an adjacent tile
        // but the BackTrackCar does not move onto it). We want:
        //   - If the BackTrackCar genuinely moved this turn, the real movement
        //     fuel cost is deducted as normal.
        //   - The resurrection itself must NOT drain fuel.
        // So we capture the engine cost, let moveUnit deduct it, then restore
        // the fuel and only re-deduct the true movement cost.
        var engineCost = action.getCosts();

        var animation = Global[unit.getUnitID()].doWalkingAnimation(action, map);
        animation.setEndOfAnimationCall("ACTION_MU_RESURRECTION", "performPostAnimation");
        Global[unit.getUnitID()].moveUnit(unit, action, map);

        // Restore the fuel that moveUnitAction just deducted (engineCost) and
        // re-deduct only the real movement cost.
        // If the BackTrackCar moved, getCosts() at this point still holds the
        // genuine per-tile movement cost the engine computed; if it stayed in
        // place, the real cost is 0.
        var realCost = 0;
        try
        {
            // The true movement fuel cost is the sum of terrain movement costs
            // along the unit's path. We recompute it from the move path so the
            // BackTrackCar pays for real movement only.
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

        // Undo the engine deduction and apply only the real movement cost.
        unit.setFuel(unit.getFuel() + engineCost);
        var newFuel = unit.getFuel() - realCost;
        if (newFuel < 0)
        {
            newFuel = 0;
        }
        unit.setFuel(newFuel);

        action.startReading();
        ACTION_MU_RESURRECTION.postAnimationTargetX = action.readDataInt32();
        ACTION_MU_RESURRECTION.postAnimationTargetY = action.readDataInt32();

        var selectedUnitData = "";
        try
        {
            selectedUnitData = action.readDataString();
        }
        catch (e)
        {
            selectedUnitData = "";
        }

        var ownershipMode = "";
        try
        {
            ownershipMode = action.readDataString();
        }
        catch (e)
        {
            ownershipMode = "";
        }

        // Combine all selection data: unitData + "|" + mode
        ACTION_MU_RESURRECTION.postAnimationSelectedData = selectedUnitData + "|" + ownershipMode;
    };

    this.performPostAnimation = function(postAnimation, map)
    {
        var unit = ACTION_MU_RESURRECTION.postAnimationUnit;
        var targetX = ACTION_MU_RESURRECTION.postAnimationTargetX;
        var targetY = ACTION_MU_RESURRECTION.postAnimationTargetY;
        var selectedData = ACTION_MU_RESURRECTION.postAnimationSelectedData;

        if (unit !== null && targetX !== -1 && targetY !== -1)
        {
            var deadUnitID = null;
            var deadOwnerID = -1;
            var entryIndex = -1;
            var ownershipMode = "SELF";

            if (selectedData !== null && selectedData !== "")
            {
                // Split into unit data and mode
                var pipeParts = selectedData.split("|");
                var unitDataPart = pipeParts[0];
                if (pipeParts.length >= 2)
                {
                    ownershipMode = pipeParts[1];
                }

                var parts = unitDataPart.split(":");
                if (parts.length >= 5)
                {
                    deadUnitID = parts[2];
                    deadOwnerID = parseInt(parts[3]);
                    entryIndex = parseInt(parts[4]);
                }
            }

            if (deadUnitID === null)
            {
                // Fallback: find most recent valid dead unit at target tile
                var terrain = map.getTerrain(targetX, targetY);
                var deaths = MU_SYSTEM.getDeathList(terrain);
                for (var i = deaths.length - 1; i >= 0; i--)
                {
                    if (MU_SYSTEM.isResurrectable(deaths[i].unitID, null))
                    {
                        deadUnitID = deaths[i].unitID;
                        deadOwnerID = deaths[i].ownerID;
                        entryIndex = deaths[i].index;
                        break;
                    }
                }
            }

            if (deadUnitID !== null)
            {
                var btCarOwner = unit.getOwner();
                var cost = MU_SYSTEM.getResurrectionCost(deadUnitID);

                // Determine the owner for the resurrected unit
                var spawnOwner = btCarOwner;
                if (ownershipMode === "ORIGINAL" && deadOwnerID >= 0)
                {
                    var originalOwner = map.getPlayer(deadOwnerID);
                    if (originalOwner !== null && originalOwner !== undefined)
                    {
                        spawnOwner = originalOwner;
                    }
                }

                // Check if BackTrackCar's owner can afford it (always the payer)
                if (btCarOwner.getFunds() >= cost)
                {
                    // Consume 1 resurrection ammo and deduct funds
                    unit.setAmmo1(unit.getAmmo1() - 1);
                    btCarOwner.addFunds(-cost);

                    // Protect the BackTrackCar from onKilled callbacks.
                    // A pending death animation (from the unit that died at the
                    // target tile) may fire AFTER the walking animation ends.
                    // onKilled reads (x,y) from the animation buffer and removes
                    // whatever unit is at that position. By setting MU_PROTECTED
                    // on the BackTrackCar, our overridden onKilled will skip it.
                    try
                    {
                        unit.getVariables().createVariable("MU_PROTECTED").writeDataBool(true);
                    }
                    catch (e) {}

                    // Spawn the unit at the exact target tile.
                    var spawnedUnit = map.spawnUnit(targetX, targetY, deadUnitID, spawnOwner, 0, true);
                    if (spawnedUnit !== null && spawnedUnit !== undefined)
                    {
                        // Ensure fuel and ammo are at max after spawn
                        var sMaxFuel = spawnedUnit.getMaxFuel();
                        if (sMaxFuel > 0)
                        {
                            spawnedUnit.setFuel(sMaxFuel);
                        }
                        spawnedUnit.setAmmo1(spawnedUnit.getMaxAmmo1());
                        spawnedUnit.setAmmo2(spawnedUnit.getMaxAmmo2());
                        // Resurrected unit starts at 50% HP
                        spawnedUnit.setHp(5);
                        // Allow immediate movement on the turn of resurrection
                        spawnedUnit.setHasMoved(false);

                        // Protect the resurrected unit from onKilled callbacks.
                        // The pending death animation at this tile will fire and
                        // try to remove whatever unit is here. Our overridden
                        // onKilled checks for MU_PROTECTED and skips removal.
                        // The flag is cleared at the next startOfTurn.
                        try
                        {
                            spawnedUnit.getVariables().createVariable("MU_PROTECTED").writeDataBool(true);
                        }
                        catch (e) {}

                        // Record the build for replay purposes only
                        try { map.getGameRecorder().buildUnit(spawnOwner.getPlayerID(), deadUnitID, btCarOwner.getPlayerID()); } catch (e) {}

                        // Remove the death entry so the unit can't be resurrected again
                        var terrain2 = map.getTerrain(targetX, targetY);
                        MU_SYSTEM.removeDeathEntry(terrain2, entryIndex);

                        // Play resurrection effect
                        var resAnimation = GameAnimationFactory.createAnimation(map, targetX, targetY);
                        resAnimation.addSprite("explosion+land", -map.getImageSize() / 2, -map.getImageSize(), 0, 2);
                        resAnimation.setSound("powerOfBlack.wav");
                    }
                }
            }

            unit.setHasMoved(true);
        }

        ACTION_MU_RESURRECTION.postAnimationUnit = null;
        ACTION_MU_RESURRECTION.postAnimationTargetX = -1;
        ACTION_MU_RESURRECTION.postAnimationTargetY = -1;
        ACTION_MU_RESURRECTION.postAnimationSelectedData = null;
    };

    this.getName = function()
    {
        return qsTr("Resurrection");
    };

    this.getDescription = function()
    {
        return qsTr("Resurrect a fallen unit on an adjacent tile (range 1). Resurrected unit starts at 50% HP, costs 25% of original production cost. Choose ownership: Original Owner (returns to its former army) or Self Owner (joins your army). Cannot resurrect special weapons (DeathRay, etc.). Consumes 1 resurrection ammo.");
    };
}

Constructor.prototype = ACTION;
var ACTION_MU_RESURRECTION = new Constructor();
