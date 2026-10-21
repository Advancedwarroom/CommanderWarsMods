var Constructor = function()
{
    this.postAnimationUnit = null;
    this.postAnimationTargetX = -1;
    this.postAnimationTargetY = -1;

    // ================================================================
    // canBePerformed: returns true if the PipeThinker can use Talk.
    // Conditions:
    //   1. Unit has not acted yet (getHasMoved === false)
    //   2. Unit has ammo1 > 0
    //   3. There is at least one enemy (non-remote) unit within range 1-3
    // ================================================================
    this.canBePerformed = function(action, map)
    {
        var unit = action.getTargetUnit();
        if (unit === null || unit.getHasMoved() === true)
        {
            return false;
        }
        if (unit.getAmmo1() <= 0)
        {
            return false;
        }

        var actionTarget = action.getActionTarget();
        var ux = actionTarget.x;
        var uy = actionTarget.y;
        var player = unit.getOwner();

        for (var dx = -3; dx <= 3; dx++)
        {
            for (var dy = -3; dy <= 3; dy++)
            {
                var dist = Math.abs(dx) + Math.abs(dy);
                if (dist >= 1 && dist <= 3)
                {
                    var tx = ux + dx;
                    var ty = uy + dy;
                    if (map.onMap(tx, ty))
                    {
                        var targetUnit = map.getTerrain(tx, ty).getUnit();
                        if (targetUnit !== null && targetUnit !== unit)
                        {
                            var targetOwner = targetUnit.getOwner();
                            if (targetOwner !== null && player.isEnemy(targetOwner))
                            {
                                var targetType = targetUnit.getUnitType();
                                if (targetType !== GameEnums.REMOTE_WEAPON &&
                                    targetType !== GameEnums.UnitType_RemoteWeapon)
                                {
                                    return true;
                                }
                            }
                        }
                    }
                }
            }
        }
        return false;
    };

    this.getActionText = function(map)
    {
        return qsTr("Talk");
    };

    this.getIcon = function(map)
    {
        return "icon_fire";
    };

    this.isFinalStep = function(action, map)
    {
        return action.getInputStep() === 1;
    };

    this.getStepInputType = function(action, map)
    {
        return "FIELD";
    };

    // ================================================================
    // getStepData: highlight enemy units within range 1-3 that can
    // be targeted for Talk conversion.
    // ================================================================
    this.getStepData = function(action, data, map)
    {
        var unit = action.getTargetUnit();
        var actionTarget = action.getActionTarget();
        var ux = actionTarget.x;
        var uy = actionTarget.y;
        var player = unit.getOwner();

        data.setColor("#C800FF00");
        for (var dx = -3; dx <= 3; dx++)
        {
            for (var dy = -3; dy <= 3; dy++)
            {
                var dist = Math.abs(dx) + Math.abs(dy);
                if (dist >= 1 && dist <= 3)
                {
                    var tx = ux + dx;
                    var ty = uy + dy;
                    if (map.onMap(tx, ty))
                    {
                        var targetUnit = map.getTerrain(tx, ty).getUnit();
                        if (targetUnit !== null && targetUnit !== unit)
                        {
                            var targetOwner = targetUnit.getOwner();
                            if (targetOwner !== null && player.isEnemy(targetOwner))
                            {
                                var targetType = targetUnit.getUnitType();
                                if (targetType !== GameEnums.REMOTE_WEAPON &&
                                    targetType !== GameEnums.UnitType_RemoteWeapon)
                                {
                                    data.addPoint(Qt.point(tx, ty));
                                }
                            }
                        }
                    }
                }
            }
        }
    };

    // ================================================================
    // perform: start the walking animation, move the unit, then
    // call performPostAnimation to apply the Talk effect.
    // ================================================================
    this.perform = function(action, map)
    {
        var unit = action.getTargetUnit();
        ACTION_MU_TALK.postAnimationUnit = unit;

        var animation = Global[unit.getUnitID()].doWalkingAnimation(action, map);
        animation.setEndOfAnimationCall("ACTION_MU_TALK", "performPostAnimation");
        Global[unit.getUnitID()].moveUnit(unit, action, map);

        action.startReading();
        ACTION_MU_TALK.postAnimationTargetX = action.readDataInt32();
        ACTION_MU_TALK.postAnimationTargetY = action.readDataInt32();
    };

    // ================================================================
    // performPostAnimation: apply the Talk effect.
    //
    // Logic:
    //   1. Check if this is a continuation of a previous talk
    //      (same target type + owner, and MU_TALK_ACTIVE was true)
    //   2. If continuation: progress += 10
    //      If new talk: progress = 10
    //   3. If progress >= 20: convert the target (change owner)
    //      Converted unit gets setHasMoved(true) — acts next turn
    //   4. Consume 1 ammo per use
    //   5. Set MU_TALK_ACTIVE = true so progress survives to next turn
    //
    // Variables on the PipeThinker unit:
    //   MU_TALK_PROGRESS      (Int32)  - current progress (10 or 20)
    //   MU_TALK_TARGET_TYPE   (String) - target unit ID for matching
    //   MU_TALK_TARGET_OWNER  (Int32)  - target owner player ID
    //   MU_TALK_ACTIVE        (Bool)   - true if talked this turn
    // ================================================================
    this.performPostAnimation = function(postAnimation, map)
    {
        var unit = ACTION_MU_TALK.postAnimationUnit;
        var targetX = ACTION_MU_TALK.postAnimationTargetX;
        var targetY = ACTION_MU_TALK.postAnimationTargetY;

        if (unit !== null && targetX !== -1 && targetY !== -1)
        {
            var targetUnit = map.getTerrain(targetX, targetY).getUnit();

            if (targetUnit !== null)
            {
                var unitVars = unit.getVariables();
                var player = unit.getOwner();

                // Check existing talk progress
                var progressVar = unitVars.getVariable("MU_TALK_PROGRESS");
                var progress = 0;
                if (progressVar !== null)
                {
                    progress = progressVar.readDataInt32();
                }

                // Determine if this is a continuation of a previous talk.
                // Note: MU_TALK_ACTIVE is used ONLY by startOfTurn for gap
                // detection. At this point it has already been set to false
                // by startOfTurn, so we must NOT check it here. We simply
                // check if progress > 0 and the target matches.
                var isContinuation = false;
                if (progress > 0)
                {
                    var storedTypeVar = unitVars.getVariable("MU_TALK_TARGET_TYPE");
                    var storedOwnerVar = unitVars.getVariable("MU_TALK_TARGET_OWNER");

                    if (storedTypeVar !== null && storedOwnerVar !== null)
                    {
                        var storedType = storedTypeVar.readDataString();
                        var storedOwner = storedOwnerVar.readDataInt32();
                        var targetType = targetUnit.getUnitID();
                        var targetOwner = targetUnit.getOwner().getPlayerID();

                        if (storedType === targetType && storedOwner === targetOwner)
                        {
                            isContinuation = true;
                        }
                    }
                }

                // Consume 1 ammo
                unit.setAmmo1(unit.getAmmo1() - 1);

                // Calculate new progress
                if (isContinuation)
                {
                    progress += 10;
                }
                else
                {
                    // New talk — reset progress to 10
                    progress = 10;
                }

                if (progress >= 20)
                {
                    // ====================================================
                    // CONVERSION COMPLETE!
                    // Change target's owner to PipeThinker's owner.
                    // HP and all other stats remain unchanged.
                    // Converted unit can't act this turn (setHasMoved).
                    // ====================================================
                    targetUnit.setOwner(player);
                    targetUnit.setHasMoved(true);

                    // Clear talk progress
                    unitVars.deleteVariable("MU_TALK_PROGRESS");
                    unitVars.deleteVariable("MU_TALK_TARGET_TYPE");
                    unitVars.deleteVariable("MU_TALK_TARGET_OWNER");
                    unitVars.deleteVariable("MU_TALK_ACTIVE");

                    // Play conversion effect
                    var convertAnim = GameAnimationFactory.createAnimation(map, targetX, targetY);
                    convertAnim.addSprite("powerOfBlack", -map.getImageSize() / 2, -map.getImageSize(), 0, 2);
                    convertAnim.setSound("powerOfBlack.wav");
                }
                else
                {
                    // ====================================================
                    // First talk — store progress and target info
                    // ====================================================
                    if (progressVar === null)
                    {
                        unitVars.createVariable("MU_TALK_PROGRESS").writeDataInt32(progress);
                    }
                    else
                    {
                        progressVar.writeDataInt32(progress);
                    }

                    var typeVar = unitVars.getVariable("MU_TALK_TARGET_TYPE");
                    if (typeVar === null)
                    {
                        unitVars.createVariable("MU_TALK_TARGET_TYPE").writeDataString(targetUnit.getUnitID());
                    }
                    else
                    {
                        typeVar.writeDataString(targetUnit.getUnitID());
                    }

                    var ownerVar = unitVars.getVariable("MU_TALK_TARGET_OWNER");
                    if (ownerVar === null)
                    {
                        unitVars.createVariable("MU_TALK_TARGET_OWNER").writeDataInt32(targetUnit.getOwner().getPlayerID());
                    }
                    else
                    {
                        ownerVar.writeDataInt32(targetUnit.getOwner().getPlayerID());
                    }

                    // Set MU_TALK_ACTIVE = true (talk was performed this turn)
                    var activeVar2 = unitVars.getVariable("MU_TALK_ACTIVE");
                    if (activeVar2 === null)
                    {
                        unitVars.createVariable("MU_TALK_ACTIVE").writeDataBool(true);
                    }
                    else
                    {
                        activeVar2.writeDataBool(true);
                    }
                }
            }

            unit.setHasMoved(true);
        }

        ACTION_MU_TALK.postAnimationUnit = null;
        ACTION_MU_TALK.postAnimationTargetX = -1;
        ACTION_MU_TALK.postAnimationTargetY = -1;
    };

    this.getName = function()
    {
        return qsTr("Talk");
    };

    this.getDescription = function()
    {
        return qsTr("Talk to an enemy unit within range 1-3 to convert it to your side. Requires 2 consecutive turns (10 progress per turn, 20 to complete). If you skip a turn, progress resets. Target movement does not break the link. Converted unit keeps its HP but can only act next turn. Each PipeThinker can only talk to 1 target at a time. Consumes 1 ammo per use. Does not cost funds.");
    };
}

Constructor.prototype = ACTION;
var ACTION_MU_TALK = new Constructor();
