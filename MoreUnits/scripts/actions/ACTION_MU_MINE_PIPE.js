var Constructor = function()
{
    this.MINE_COST = 3000;
    this.MAX_MINING_POINTS = 20;

    this.postAnimationUnit = null;
    this.postAnimationTargetX = -1;
    this.postAnimationTargetY = -1;

    // Check if a terrain ID is pipe/weld that can be mined.
    // Commander Wars uses:
    //   PIPELINE (pipe body) + variants: DESERT_PIPELINE, SNOW_PIPELINE, WASTE_PIPELINE
    //   WELD (pipe seam / PipeSeam) + variants: DESERT_WELD, SNOW_WELD, WASTE_WELD
    //   (DESTROYEDWELD is already destroyed, so excluded)
    this.isPipeTerrain = function(terrainID)
    {
        if (terrainID === null || terrainID === undefined)
        {
            return false;
        }
        var upper = terrainID.toUpperCase();
        // Pipe body: PIPELINE and climate variants
        if (upper.indexOf("PIPELINE") >= 0)
        {
            return true;
        }
        // Pipe seam (PipeSeam): WELD and climate variants
        // Exclude DESTROYEDWELD (already destroyed)
        if (upper.indexOf("WELD") >= 0 && upper.indexOf("DESTROYED") < 0)
        {
            return true;
        }
        // Legacy PIPE id (some mods may use this)
        if (upper === "PIPE")
        {
            return true;
        }
        return false;
    };

    // Check if the unit is adjacent to at least one pipe/weld tile.
    // "Adjacent" means Manhattan distance 1 (up/down/left/right).
    this.hasAdjacentPipe = function(x, y, map)
    {
        var dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        for (var i = 0; i < dirs.length; i++)
        {
            var tx = x + dirs[i][0];
            var ty = y + dirs[i][1];
            if (!map.onMap(tx, ty))
            {
                continue;
            }
            var terrain = map.getTerrain(tx, ty);
            if (ACTION_MU_MINE_PIPE.isPipeTerrain(terrain.getID()))
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

        // Standard two-branch position check
        var actionTarget = action.getActionTarget();
        var targetField = action.getTarget();
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

        // The unit mines from its current/destination position (actionTarget).
        // Check if there's at least one adjacent pipe/weld tile.
        if (!ACTION_MU_MINE_PIPE.hasAdjacentPipe(actionTarget.x, actionTarget.y, map))
        {
            return false;
        }

        // Check if already mining (continue mining is free)
        var miningVar = unitVars.getVariable("MU_MINING_PROGRESS");
        var isAlreadyMining = (miningVar !== null);

        if (!isAlreadyMining)
        {
            // Starting new mining: check funds (3000G)
            var owner = unit.getOwner();
            if (owner.getFunds() < ACTION_MU_MINE_PIPE.MINE_COST)
            {
                return false;
            }
        }
        else
        {
            // Already mining: verify the stored target is still adjacent and still pipe.
            // If the unit moved away, the moveUnit wrapper should have cleared mining vars.
            // But double-check here for safety.
            var mx = -1;
            var my = -1;
            try
            {
                mx = unitVars.getVariable("MU_MINING_X").readDataInt32();
                my = unitVars.getVariable("MU_MINING_Y").readDataInt32();
            }
            catch (e) {}

            if (mx >= 0 && my >= 0 && map.onMap(mx, my))
            {
                var dist = Math.abs(mx - actionTarget.x) + Math.abs(my - actionTarget.y);
                if (dist !== 1)
                {
                    // Target is no longer adjacent — mining was interrupted
                    return false;
                }
                var targetTerrain = map.getTerrain(mx, my);
                if (!ACTION_MU_MINE_PIPE.isPipeTerrain(targetTerrain.getID()))
                {
                    // Target is no longer a pipe — already destroyed?
                    return false;
                }
            }
        }

        return true;
    };

    this.getActionText = function(map)
    {
        return qsTr("Mine");
    };

    this.getIcon = function(map)
    {
        return "icon_fire";
    };

    // If already mining: no step input needed (isFinalStep returns true at step 0).
    // If starting new mining: step 0 = FIELD (select adjacent pipe/weld tile).
    this.isFinalStep = function(action, map)
    {
        var step = action.getInputStep();
        if (step === 0)
        {
            // Check if already mining — if so, skip selection
            var unit = action.getTargetUnit();
            if (unit !== null)
            {
                try
                {
                    var unitVars = unit.getVariables();
                    var miningVar = unitVars.getVariable("MU_MINING_PROGRESS");
                    if (miningVar !== null)
                    {
                        // Already mining — verify target is still valid
                        var mx = unitVars.getVariable("MU_MINING_X").readDataInt32();
                        var my = unitVars.getVariable("MU_MINING_Y").readDataInt32();
                        var actionTarget = action.getActionTarget();
                        var dist = Math.abs(mx - actionTarget.x) + Math.abs(my - actionTarget.y);
                        if (dist === 1)
                        {
                            return true; // Skip FIELD selection, go straight to perform
                        }
                    }
                }
                catch (e) {}
            }
            return false; // Need FIELD selection
        }
        return true; // step >= 1
    };

    this.getStepInputType = function(action, map)
    {
        var step = action.getInputStep();
        if (step === 0)
        {
            return "FIELD";
        }
        return "";
    };

    this.getStepData = function(action, data, map)
    {
        var step = action.getInputStep();
        if (step !== 0)
        {
            return;
        }

        var unit = action.getTargetUnit();
        var actionTarget = action.getActionTarget();
        var ux = actionTarget.x;
        var uy = actionTarget.y;

        // Show adjacent pipe/weld tiles (Manhattan distance 1)
        data.setColor("#C8FF0000");
        var dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        for (var i = 0; i < dirs.length; i++)
        {
            var tx = ux + dirs[i][0];
            var ty = uy + dirs[i][1];
            if (!map.onMap(tx, ty))
            {
                continue;
            }
            var terrain = map.getTerrain(tx, ty);
            if (ACTION_MU_MINE_PIPE.isPipeTerrain(terrain.getID()))
            {
                data.addPoint(Qt.point(tx, ty));
            }
        }
    };

    this.perform = function(action, map)
    {
        var unit = action.getTargetUnit();
        ACTION_MU_MINE_PIPE.postAnimationUnit = unit;

        // Record the engine fuel cost BEFORE moveUnit so we can undo it.
        var engineCost = action.getCosts();

        var animation = Global[unit.getUnitID()].doWalkingAnimation(action, map);
        animation.setEndOfAnimationCall("ACTION_MU_MINE_PIPE", "performPostAnimation");

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

        // --- Core mining logic ---
        var unitVars = unit.getVariables();
        var miningVar = unitVars.getVariable("MU_MINING_PROGRESS");
        var owner = unit.getOwner();
        var ux = unit.getX();
        var uy = unit.getY();

        var targetX = -1;
        var targetY = -1;

        if (miningVar !== null)
        {
            // Already mining — continue on stored target (no FIELD selection was needed)
            try
            {
                targetX = unitVars.getVariable("MU_MINING_X").readDataInt32();
                targetY = unitVars.getVariable("MU_MINING_Y").readDataInt32();
            }
            catch (e)
            {
                targetX = -1;
                targetY = -1;
            }

            // Verify target is still adjacent and still pipe
            if (targetX >= 0 && targetY >= 0 && map.onMap(targetX, targetY))
            {
                var dist = Math.abs(targetX - ux) + Math.abs(targetY - uy);
                var targetTerrain = map.getTerrain(targetX, targetY);
                if (dist === 1 && ACTION_MU_MINE_PIPE.isPipeTerrain(targetTerrain.getID()))
                {
                    // Continue mining: add HP-based progress
                    var currentProgress = miningVar.readDataInt32();
                    var rate = unit.getCaptureRate(Qt.point(ux, uy));
                    if (rate <= 0)
                    {
                        rate = unit.getHp();
                    }
                    currentProgress += rate;
                    miningVar.writeDataInt32(currentProgress);
                }
                else
                {
                    // Target no longer valid — reset
                    unitVars.deleteVariable("MU_MINING_PROGRESS");
                    unitVars.deleteVariable("MU_MINING_X");
                    unitVars.deleteVariable("MU_MINING_Y");
                    miningVar = null;
                }
            }
            else
            {
                // Target invalid — reset
                unitVars.deleteVariable("MU_MINING_PROGRESS");
                unitVars.deleteVariable("MU_MINING_X");
                unitVars.deleteVariable("MU_MINING_Y");
                miningVar = null;
            }
        }

        if (miningVar === null)
        {
            // Starting new mining — read selected target from action data
            action.startReading();
            targetX = action.readDataInt32();
            targetY = action.readDataInt32();

            // Verify target is adjacent and is pipe/weld
            if (targetX >= 0 && targetY >= 0 && map.onMap(targetX, targetY))
            {
                var dist2 = Math.abs(targetX - ux) + Math.abs(targetY - uy);
                var pipeTerrain = map.getTerrain(targetX, targetY);
                if (dist2 === 1 && ACTION_MU_MINE_PIPE.isPipeTerrain(pipeTerrain.getID()))
                {
                    // Deduct cost
                    owner.addFunds(-ACTION_MU_MINE_PIPE.MINE_COST);

                    // Start mining
                    var captureRate = unit.getCaptureRate(Qt.point(ux, uy));
                    if (captureRate <= 0)
                    {
                        captureRate = unit.getHp();
                    }
                    miningVar = unitVars.createVariable("MU_MINING_PROGRESS");
                    miningVar.writeDataInt32(captureRate);

                    var posVarX = unitVars.createVariable("MU_MINING_X");
                    posVarX.writeDataInt32(targetX);
                    var posVarY = unitVars.createVariable("MU_MINING_Y");
                    posVarY.writeDataInt32(targetY);
                }
            }
        }

        ACTION_MU_MINE_PIPE.postAnimationTargetX = targetX;
        ACTION_MU_MINE_PIPE.postAnimationTargetY = targetY;

        // Check if mining is complete
        if (miningVar !== null)
        {
            var progress = miningVar.readDataInt32();
            if (progress >= ACTION_MU_MINE_PIPE.MAX_MINING_POINTS)
            {
                // Mining complete! Replace pipe/weld with Plains
                if (targetX >= 0 && targetY >= 0 && map.onMap(targetX, targetY))
                {
                    map.replaceTerrain("PLAINS", targetX, targetY);

                    // Refresh adjacent sprites
                    for (var dx = -1; dx <= 1; dx++)
                    {
                        for (var dy = -1; dy <= 1; dy++)
                        {
                            var rtx = targetX + dx;
                            var rty = targetY + dy;
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

                    // Clear mining variables
                    unitVars.deleteVariable("MU_MINING_PROGRESS");
                    unitVars.deleteVariable("MU_MINING_X");
                    unitVars.deleteVariable("MU_MINING_Y");
                }
            }
        }

        // Mark unit as moved IMMEDIATELY
        unit.setHasMoved(true);
    };

    this.performPostAnimation = function(postAnimation, map)
    {
        // Visual effects only - core logic is in perform()
        var targetX = ACTION_MU_MINE_PIPE.postAnimationTargetX;
        var targetY = ACTION_MU_MINE_PIPE.postAnimationTargetY;

        if (targetX >= 0 && targetY >= 0 && map.onMap(targetX, targetY))
        {
            // Mining effect on the target tile
            var anim = GameAnimationFactory.createAnimation(map, targetX, targetY);
            anim.addSprite("mg_hit", -map.getImageSize() / 2, -map.getImageSize() / 2, 0, 1.0);
            anim.setSound("drill.wav", 1, 0);

            // If mining just completed, show explosion
            var terrain = map.getTerrain(targetX, targetY);
            if (terrain !== null && terrain.getID() === "PLAINS")
            {
                var doneAnim = GameAnimationFactory.createAnimation(map, targetX, targetY);
                doneAnim.addSprite("rockets_explode", -map.getImageSize() / 2, -map.getImageSize() / 2, 0, 2.0);
                doneAnim.setSound("rockets_explode.wav", 1, 0);
            }
        }

        ACTION_MU_MINE_PIPE.postAnimationUnit = null;
        ACTION_MU_MINE_PIPE.postAnimationTargetX = -1;
        ACTION_MU_MINE_PIPE.postAnimationTargetY = -1;
    };

    this.getName = function()
    {
        return qsTr("Mine Pipe");
    };

    this.getDescription = function()
    {
        return qsTr("Mine and destroy an adjacent Pipe or PipeSeam (Weld) terrain tile, turning it into Plains. Costs 3000G to start. Takes 2 turns at full HP (20 mining points, progress scales with HP like capturing). While mining, the unit cannot perform other actions. The unit mines from an adjacent tile — it does not need to stand on the pipe.");
    };
}

Constructor.prototype = ACTION;
var ACTION_MU_MINE_PIPE = new Constructor();
