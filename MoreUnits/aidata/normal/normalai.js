// normalai.js - Normal AI behavior for MoreUnits mod
// Handles per-unit decision making for all units including MoreUnits custom units.
// Priority order for each unit:
// 1. ETA: Empower nearby allies if possible
// 2. Empowered units: Mine pipe if standing on one
// 3. All units: Attack nearby enemies
// 4. All units: Move toward nearest enemy
// 5. All units: Wait

var NORMALAI =
{
    // Map building IDs to their menu functions
    buildingMenuFunctions: function(buildingID)
    {
        if (buildingID === "FACTORY" || buildingID === "HQ")
        {
            return COREAI.getFactoryMenuItem;
        }
        return null;
    },

    getBuildingMenuItem: function(building, map, coData, productionSystem)
    {
        return COREAI.getFactoryMenuItem(building, map, coData, productionSystem);
    },

    groupDistribution: [1, 1, 1, 1],

    initializeSimpleProductionSystem: function(coData, map, difficulty, ruleset, productionSystem)
    {
        COREAI.initializeSimpleProductionSystem(coData, map, difficulty, ruleset, productionSystem);
    },

    buildUnitSimpleProductionSystem: function(building, map, coData, productionSystem, forcedUnit)
    {
        return COREAI.buildUnitSimpleProductionSystem(building, map, coData, productionSystem, forcedUnit);
    },

    onNewBuildQueue: function(coData, map, productionSystem)
    {
        COREAI.onNewBuildQueue(coData, map, productionSystem);
    },

    getHighPrioBuildings: function(player, map)
    {
        return COREAI.getHighPrioBuildings(player, map);
    },

    // Main per-unit decision function
    GenericPredefinedUnitMapScriptBehaviour: function(unit, action, map)
    {
        try
        {
            var unitID = unit.getUnitID();

            // ================================================================
            // CRITICAL FIX: Only handle MoreUnits custom units (MU_ / THE_ prefix).
            // Standard units (INFANTRY, TANK, etc.) return false so the
            // original CoreAI professional logic takes over.
            // ================================================================
            if (unitID.indexOf("MU_") !== 0 && unitID.indexOf("THE_") !== 0)
            {
                return false;
            }

            var owner = unit.getOwner();
            var ux = unit.getX();
            var uy = unit.getY();
            var actionList = unit.getActionList();

            // ================================================================
            // 1. ETA: Try to empower nearby allies
            // ================================================================
            if (unitID === "MU_EMPOWER_TERRAIN_EDITOR" &&
                actionList.indexOf("ACTION_MU_EMPOWER") >= 0 &&
                unit.getAmmo2() > 0)
            {
                // Find the best ally to empower (prefer high-value units)
                var bestTarget = null;
                var bestScore = -1;

                for (var dx = -2; dx <= 2; dx++)
                {
                    for (var dy = -2; dy <= 2; dy++)
                    {
                        var dist = Math.abs(dx) + Math.abs(dy);
                        if (dist === 0 || dist > 2)
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
                        var target = terrain.getUnit();
                        if (target === null)
                        {
                            continue;
                        }
                        // Check if already empowered
                        var targetVars = target.getVariables();
                        if (targetVars.getVariable("MU_EMPOWERED") !== null)
                        {
                            continue;
                        }
                        // Score: prefer tanks and ranged units
                        var score = 1;
                        var tID = target.getUnitID();
                        if (tID.indexOf("TANK") >= 0 || tID.indexOf("MEGATANK") >= 0)
                        {
                            score = 10;
                        }
                        else if (tID.indexOf("ARTILLERY") >= 0 || tID.indexOf("MISSILE") >= 0 ||
                                 tID.indexOf("ROCKET") >= 0)
                        {
                            score = 8;
                        }
                        else if (tID.indexOf("INFANTRY") >= 0 || tID.indexOf("MECH") >= 0)
                        {
                            score = 5;
                        }
                        if (score > bestScore)
                        {
                            bestScore = score;
                            bestTarget = Qt.point(tx, ty);
                        }
                    }
                }

                if (bestTarget !== null)
                {
                    action.setActionID("ACTION_MU_EMPOWER");
                    action.writeDataInt32(bestTarget.x);
                    action.writeDataInt32(bestTarget.y);
                    action.setMovepath(Qt.point(ux, uy), 0);
                    action.setInputStep(1);
                    return true;
                }
            }

            // ================================================================
            // 1b. MU_PIPEBIN: Attack enemies to stack rubbish layers.
            //     Prioritize enemies that already have rubbish layers (to
            //     push them toward 3-layer bad or 4-layer death).
            //     Also consider attacking high-value enemies (tanks) even
            //     without existing layers, to start stacking.
            // ================================================================
            if (unitID === "MU_PIPEBIN" &&
                actionList.indexOf("ACTION_FIRE") >= 0 &&
                unit.getAmmo1() > 0)
            {
                var weaponRange = unit.getMaxRange();
                var minRange = unit.getMinRange();
                var bestEnemy = null;
                var bestScore = -1;

                for (var pdx = -weaponRange; pdx <= weaponRange; pdx++)
                {
                    for (var pdy = -weaponRange; pdy <= weaponRange; pdy++)
                    {
                        var pdist = Math.abs(pdx) + Math.abs(pdy);
                        if (pdist < minRange || pdist > weaponRange)
                        {
                            continue;
                        }
                        var ptx = ux + pdx;
                        var pty = uy + pdy;
                        if (!map.onMap(ptx, pty))
                        {
                            continue;
                        }
                        var pTerrain = map.getTerrain(ptx, pty);
                        var pTarget = pTerrain.getUnit();
                        if (pTarget === null)
                        {
                            continue;
                        }
                        var pTargetOwner = pTarget.getOwner();
                        if (!owner.isEnemy(pTargetOwner))
                        {
                            continue;
                        }
                        // Score: heavily prioritize units with existing rubbish layers
                        var pScore = 1;
                        var pTargetVars = pTarget.getVariables();
                        var pRubbishVar = pTargetVars.getVariable("MU_PIPEBIN_RUBBISH");
                        if (pRubbishVar !== null)
                        {
                            var pLayers = pRubbishVar.readDataInt32();
                            if (pLayers >= 2)
                            {
                                // Near death (3 layers = bad, 4 = death)
                                pScore = 100 + pLayers * 10;
                            }
                            else
                            {
                                pScore = 50 + pLayers * 10;
                            }
                        }
                        // Bonus for high-value targets (tanks)
                        var pTargetID = pTarget.getUnitID();
                        if (pTargetID.indexOf("TANK") >= 0 || pTargetID.indexOf("MEGATANK") >= 0)
                        {
                            pScore += 5;
                        }
                        if (pScore > bestScore)
                        {
                            bestScore = pScore;
                            bestEnemy = Qt.point(ptx, pty);
                        }
                    }
                }

                if (bestEnemy !== null)
                {
                    action.setActionID("ACTION_FIRE");
                    action.writeDataInt32(bestEnemy.x);
                    action.writeDataInt32(bestEnemy.y);
                    action.setMovepath(Qt.point(ux, uy), 0);
                    action.setInputStep(1);
                    return true;
                }
            }

            // ================================================================
            // 1c. MU_PIPETHINKER: Talk to nearby enemies to convert them.
            //     Prioritize continuing an existing talk (same target type+owner).
            //     Otherwise, start talking to the highest-value enemy in range.
            // ================================================================
            if (unitID === "MU_PIPETHINKER" &&
                actionList.indexOf("ACTION_MU_TALK") >= 0 &&
                unit.getAmmo1() > 0)
            {
                var talkRange = 3;
                var bestTalkTarget = null;
                var bestTalkScore = -1;

                // Check for existing talk progress (continuation)
                var ptVars = unit.getVariables();
                var ptProgressVar = ptVars.getVariable("MU_TALK_PROGRESS");
                var ptHasProgress = (ptProgressVar !== null && ptProgressVar.readDataInt32() > 0);
                var ptStoredType = null;
                var ptStoredOwner = -1;
                if (ptHasProgress)
                {
                    var ptTypeVar = ptVars.getVariable("MU_TALK_TARGET_TYPE");
                    var ptOwnerVar = ptVars.getVariable("MU_TALK_TARGET_OWNER");
                    if (ptTypeVar !== null && ptOwnerVar !== null)
                    {
                        ptStoredType = ptTypeVar.readDataString();
                        ptStoredOwner = ptOwnerVar.readDataInt32();
                    }
                }

                for (var tdx = -talkRange; tdx <= talkRange; tdx++)
                {
                    for (var tdy = -talkRange; tdy <= talkRange; tdy++)
                    {
                        var tdist = Math.abs(tdx) + Math.abs(tdy);
                        if (tdist < 1 || tdist > talkRange)
                        {
                            continue;
                        }
                        var ttx = ux + tdx;
                        var tty = uy + tdy;
                        if (!map.onMap(ttx, tty))
                        {
                            continue;
                        }
                        var tTerrain = map.getTerrain(ttx, tty);
                        var tTarget = tTerrain.getUnit();
                        if (tTarget === null || tTarget === unit)
                        {
                            continue;
                        }
                        var tTargetOwner = tTarget.getOwner();
                        if (!owner.isEnemy(tTargetOwner))
                        {
                            continue;
                        }
                        var tType = tTarget.getUnitType();
                        if (tType === GameEnums.REMOTE_WEAPON ||
                            tType === GameEnums.UnitType_RemoteWeapon)
                        {
                            continue;
                        }

                        var tScore = 1;
                        // Continuation bonus
                        if (ptHasProgress && ptStoredType !== null &&
                            ptStoredType === tTarget.getUnitID() &&
                            ptStoredOwner === tTargetOwner.getPlayerID())
                        {
                            tScore = 1000; // Always prioritize continuation
                        }
                        // High-value target bonus
                        var tTargetID = tTarget.getUnitID();
                        if (tTargetID.indexOf("MEGATANK") >= 0)
                        {
                            tScore += 50;
                        }
                        else if (tTargetID.indexOf("TANK") >= 0)
                        {
                            tScore += 30;
                        }
                        else if (tTargetID.indexOf("ROCKET") >= 0 ||
                                 tTargetID.indexOf("MISSILE") >= 0 ||
                                 tTargetID.indexOf("ARTILLERY") >= 0)
                        {
                            tScore += 20;
                        }

                        if (tScore > bestTalkScore)
                        {
                            bestTalkScore = tScore;
                            bestTalkTarget = Qt.point(ttx, tty);
                        }
                    }
                }

                if (bestTalkTarget !== null)
                {
                    action.setActionID("ACTION_MU_TALK");
                    action.writeDataInt32(bestTalkTarget.x);
                    action.writeDataInt32(bestTalkTarget.y);
                    action.setMovepath(Qt.point(ux, uy), 0);
                    action.setInputStep(1);
                    return true;
                }
            }

            // ================================================================
            // 2. Empowered units: Mine pipe if standing on one
            // ================================================================
            if (actionList.indexOf("ACTION_MU_MINE_PIPE") >= 0)
            {
                var terrain = unit.getTerrain();
                if (terrain !== null)
                {
                    var tID = terrain.getID();
                    if (tID !== null && tID.toUpperCase().indexOf("PIPE") >= 0)
                    {
                        var mineOwner = unit.getOwner();
                        var miningVars = unit.getVariables();
                        var isAlreadyMining = (miningVars.getVariable("MU_MINING_PROGRESS") !== null);
                        if (isAlreadyMining || mineOwner.getFunds() >= 3000)
                        {
                            action.setActionID("ACTION_MU_MINE_PIPE");
                            action.setMovepath(Qt.point(ux, uy), 0);
                            action.setInputStep(1);
                            return true;
                        }
                    }
                }
            }

            // ================================================================
            // 3. All units: Attack nearby enemies
            // ================================================================
            if (actionList.indexOf("ACTION_FIRE") >= 0)
            {
                var weaponRange = 1;
                try
                {
                    weaponRange = unit.getMaxRange();
                }
                catch (e)
                {
                    weaponRange = 1;
                }

                var bestEnemy = null;
                var bestDamage = -1;

                for (var edx = -weaponRange; edx <= weaponRange; edx++)
                {
                    for (var edy = -weaponRange; edy <= weaponRange; edy++)
                    {
                        var edist = Math.abs(edx) + Math.abs(edy);
                        if (edist < unit.getMinRange() || edist > weaponRange)
                        {
                            continue;
                        }
                        var etx = ux + edx;
                        var ety = uy + edy;
                        if (!map.onMap(etx, ety))
                        {
                            continue;
                        }
                        var eTerrain = map.getTerrain(etx, ety);
                        var enemy = eTerrain.getUnit();
                        if (enemy === null)
                        {
                            continue;
                        }
                        var enemyOwner = enemy.getOwner();
                        if (!owner.isEnemy(enemyOwner))
                        {
                            continue;
                        }
                        // Score by predicted damage
                        var damage = 10; // simplified
                        if (damage > bestDamage)
                        {
                            bestDamage = damage;
                            bestEnemy = Qt.point(etx, ety);
                        }
                    }
                }

                if (bestEnemy !== null)
                {
                    action.setActionID("ACTION_FIRE");
                    action.writeDataInt32(bestEnemy.x);
                    action.writeDataInt32(bestEnemy.y);
                    action.setMovepath(Qt.point(ux, uy), 0);
                    action.setInputStep(1);
                    return true;
                }
            }

            // ================================================================
            // 4. All units: Move toward nearest enemy
            // ================================================================
            var nearestEnemy = null;
            var nearestDist = 999999;

            // Search in expanding rings
            for (var range = 1; range <= 15; range++)
            {
                for (var sdx = -range; sdx <= range; sdx++)
                {
                    for (var sdy = -range; sdy <= range; sdy++)
                    {
                        var sdist = Math.abs(sdx) + Math.abs(sdy);
                        if (sdist !== range && sdist !== range - 1)
                        {
                            continue;
                        }
                        var stx = ux + sdx;
                        var sty = uy + sdy;
                        if (!map.onMap(stx, sty))
                        {
                            continue;
                        }
                        var sTerrain = map.getTerrain(stx, sty);
                        var sUnit = sTerrain.getUnit();
                        if (sUnit === null)
                        {
                            continue;
                        }
                        var sOwner = sUnit.getOwner();
                        if (owner.isEnemy(sOwner))
                        {
                            if (sdist < nearestDist)
                            {
                                nearestDist = sdist;
                                nearestEnemy = Qt.point(stx, sty);
                            }
                        }
                    }
                }
                if (nearestEnemy !== null)
                {
                    break;
                }
            }

            if (nearestEnemy !== null)
            {
                // Move toward the enemy (simplified: just move in the right direction)
                var movePoints = 3;
                try
                {
                    movePoints = unit.getMovementPoints();
                }
                catch (e)
                {
                    movePoints = 3;
                }

                var dxSign = 0;
                var dySign = 0;
                if (nearestEnemy.x > ux)
                {
                    dxSign = 1;
                }
                else if (nearestEnemy.x < ux)
                {
                    dxSign = -1;
                }
                if (nearestEnemy.y > uy)
                {
                    dySign = 1;
                }
                else if (nearestEnemy.y < uy)
                {
                    dySign = -1;
                }

                // Try to move toward the enemy
                var targetX = ux;
                var targetY = uy;
                for (var step = 0; step < movePoints; step++)
                {
                    var nextX = targetX;
                    var nextY = targetY;
                    if (Math.abs(nearestEnemy.x - targetX) > Math.abs(nearestEnemy.y - targetY))
                    {
                        nextX += dxSign;
                    }
                    else
                    {
                        nextY += dySign;
                    }
                    if (map.onMap(nextX, nextY))
                    {
                        var checkTerrain = map.getTerrain(nextX, nextY);
                        if (checkTerrain.getUnit() === null)
                        {
                            targetX = nextX;
                            targetY = nextY;
                        }
                        else
                        {
                            break;
                        }
                    }
                    else
                    {
                        break;
                    }
                }

                if (targetX !== ux || targetY !== uy)
                {
                    action.setActionID("ACTION_WAIT");
                    action.setMovepath(Qt.point(targetX, targetY), 1);
                    action.setInputStep(1);
                    return true;
                }
            }

            // ================================================================
            // 5. Wait
            // ================================================================
            action.setActionID("ACTION_WAIT");
            action.setMovepath(Qt.point(ux, uy), 0);
            action.setInputStep(1);
            return true;
        }
        catch (e)
        {
            // 任何异常都返回 false，让原版 CoreAI 处理
            // 绝对不能返回 true，否则单位会原地 WAIT
            return false;
        }
    },
};
