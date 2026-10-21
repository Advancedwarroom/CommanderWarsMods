var Constructor = function()
{
    this.postAnimationUnit = null;
    this.postAnimationTargetX = -1;
    this.postAnimationTargetY = -1;

    this.canBePerformed = function(action, map)
    {
        var unit = action.getTargetUnit();
        if (unit === null)
        {
            return false;
        }
        // Need empowerment ammo (ammo2)
        if (unit.getAmmo2() <= 0)
        {
            return false;
        }

        var actionTarget = action.getActionTarget();
        var targetField = action.getTarget();

        // Two-branch check (same pattern as ACTION_FIRE / ACTION_MU_RESURRECTION)
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

        // Check if there is at least one valid target unit within range 0-2
        var ux = actionTarget.x;
        var uy = actionTarget.y;
        for (var dx = -2; dx <= 2; dx++)
        {
            for (var dy = -2; dy <= 2; dy++)
            {
                var dist = Math.abs(dx) + Math.abs(dy);
                if (dist > 2)
                {
                    continue;
                }
                var tx = ux + dx;
                var ty = uy + dy;
                if (!map.onMap(tx, ty))
                {
                    continue;
                }
                // Skip the ETA's own tile only if distance > 0
                // (distance 0 = self, can't empower self)
                if (dist === 0)
                {
                    continue;
                }
                var terrain = map.getTerrain(tx, ty);
                var targetUnit = terrain.getUnit();
                if (targetUnit !== null)
                {
                    // Any unit (friend or foe) is a valid empowerment target
                    // Skip special weapons (remote weapons)
                    var targetType = targetUnit.getUnitType();
                    if (targetType === GameEnums.UnitType_RemoteWeapon ||
                        targetType === GameEnums.REMOTE_WEAPON)
                    {
                        continue;
                    }
                    return true;
                }
            }
        }
        return false;
    };

    this.getActionText = function(map)
    {
        return qsTr("Empower");
    };

    this.getIcon = function(map)
    {
        return "icon_fire";
    };

    // Step 0: FIELD - select target unit within range 0-2
    this.getStepInputType = function(action, map)
    {
        var step = action.getInputStep();
        if (step === 0)
        {
            return "FIELD";
        }
        return "";
    };

    this.isFinalStep = function(action, map)
    {
        return action.getInputStep() >= 1;
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
            // FIELD: show tiles within range 0-2 that have valid units
            data.setColor("#C800FFFF");
            for (var dx = -2; dx <= 2; dx++)
            {
                for (var dy = -2; dy <= 2; dy++)
                {
                    var dist = Math.abs(dx) + Math.abs(dy);
                    if (dist > 2 || dist === 0)
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
                    var targetUnit = terrain.getUnit();
                    if (targetUnit !== null)
                    {
                        var targetType = targetUnit.getUnitType();
                        if (targetType === GameEnums.UnitType_RemoteWeapon ||
                            targetType === GameEnums.REMOTE_WEAPON)
                        {
                            continue;
                        }
                        data.addPoint(Qt.point(tx, ty));
                    }
                }
            }
        }
    };

    this.perform = function(action, map)
    {
        var unit = action.getTargetUnit();
        ACTION_MU_EMPOWER.postAnimationUnit = unit;

        // Read action data FIRST (before moveUnit), following vanilla ACTION_FIRE pattern.
        action.startReading();
        ACTION_MU_EMPOWER.postAnimationTargetX = action.readDataInt32();
        ACTION_MU_EMPOWER.postAnimationTargetY = action.readDataInt32();

        // Record the engine fuel cost BEFORE moveUnit so we can undo it.
        // moveUnitAction reads action.getCosts() and deducts it as fuel.
        // Empower is not a movement action, so we must prevent fuel drainage.
        var engineCost = action.getCosts();

        var animation = Global[unit.getUnitID()].doWalkingAnimation(action, map);
        animation.setEndOfAnimationCall("ACTION_MU_EMPOWER", "performPostAnimation");

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

        // --- Core empowerment logic moved to perform() for reliability ---
        // Previously this was in performPostAnimation which may not fire
        // if the walking animation callback is lost. Doing it here ensures
        // the empowerment always takes effect immediately, for any target
        // (friend, foe, or ally).
        var tx = ACTION_MU_EMPOWER.postAnimationTargetX;
        var ty = ACTION_MU_EMPOWER.postAnimationTargetY;

        // Consume one empowerment ammo
        unit.setAmmo2(unit.getAmmo2() - 1);

        // Empower the target unit immediately
        if (tx !== -1 && ty !== -1 && map.onMap(tx, ty))
        {
            var targetTerrain = map.getTerrain(tx, ty);
            var targetUnit = targetTerrain.getUnit();
            if (targetUnit !== null)
            {
                var targetVars = targetUnit.getVariables();
                var empowerVar = targetVars.createVariable("MU_EMPOWERED");
                empowerVar.writeDataInt32(1);
            }
        }

        // Mark unit as moved IMMEDIATELY
        unit.setHasMoved(true);
    };

    this.performPostAnimation = function(postAnimation, map)
    {
        // Visual effects only - core logic is in perform()
        var targetX = ACTION_MU_EMPOWER.postAnimationTargetX;
        var targetY = ACTION_MU_EMPOWER.postAnimationTargetY;

        if (targetX !== -1 && targetY !== -1 && map.onMap(targetX, targetY))
        {
            var terrain = map.getTerrain(targetX, targetY);
            var targetUnit = terrain.getUnit();
            if (targetUnit !== null)
            {
                // Visual feedback: spawn a small animation on the target
                var anim = GameAnimationFactory.createAnimation(map, targetX, targetY);
                anim.addSprite("power_up", -map.getImageSize() / 2, -map.getImageSize() / 2, 0, 1.5);
                anim.setSound("powerup.wav", 1, 0);
            }
        }

        ACTION_MU_EMPOWER.postAnimationUnit = null;
        ACTION_MU_EMPOWER.postAnimationTargetX = -1;
        ACTION_MU_EMPOWER.postAnimationTargetY = -1;
    };

    this.getName = function()
    {
        return qsTr("Empower");
    };

    this.getDescription = function()
    {
        return qsTr("Empower a target unit (range 0-2, any unit except special weapons). The empowered unit gains the ability to Place terrain (1000G) and Mine pipes (3000G). Costs 1 empowerment charge. The Empower Terrain Editor waits after empowering.");
    };
}

Constructor.prototype = ACTION;
var ACTION_MU_EMPOWER = new Constructor();
