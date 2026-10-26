var Constructor = function()
{
    // Use own damage ID so weapons can have custom damage values
    this.getUnitDamageID = function(unit)
    {
        return "MU_PIPEBIN";
    };

    this.init = function(unit)
    {
        // Weapon 1: rubbish layering attack (deals 0 damage, adds debuff layers)
        unit.setAmmo1(12);
        unit.setMaxAmmo1(12);
        unit.setWeapon1ID("WEAPON_MU_PIPEBIN");

        // No secondary weapons
        unit.setAmmo2(0);
        unit.setMaxAmmo2(0);
        unit.setWeapon2ID("");

        // Fuel: 50/50
        unit.setFuel(50);
        unit.setMaxFuel(50);

        // Movement: 8 tiles (MOVE_PIPERUNNER)
        unit.setBaseMovementPoints(8);

        // Attack range: 1-2 (adjacent + one ring out)
        unit.setMinRange(1);
        unit.setMaxRange(2);

        // Fog of war vision: 2
        unit.setVision(2);
    };

    this.initForMods = function(unit, map)
    {
    };

    this.loadSprites = function(unit)
    {
        unit.loadSpriteV2("MU_PIPEBIN+mask", GameEnums.Recoloring_Matrix);
        unit.loadSpriteV2("MU_PIPEBIN", GameEnums.Recoloring_None);
    };

    this.doWalkingAnimation = function(action, map)
    {
        var unit = action.getTargetUnit();
        var animation = GameAnimationFactory.createWalkingAnimation(map, unit, action);
        animation.loadSpriteV2("MU_PIPEBIN+mask", GameEnums.Recoloring_Matrix, 1);
        animation.loadSpriteV2("MU_PIPEBIN", GameEnums.Recoloring_None, 1);
        animation.setSound("move pipe.wav", -2);
        return animation;
    };

    this.getMovementType = function()
    {
        return "MOVE_PIPERUNNER";
    };

    this.getBaseCost = function()
    {
        return 18000;
    };

    this.getName = function()
    {
        return qsTr("PipeBin");
    };

    this.getDescription = function()
    {
        return qsTr("A pipe waste recycling station. At turn start, inflicts 1 layer of rubbish on all units within range 1-2 (including allies) that don't already have it. Attacking adds 1 more layer (no damage). At 3 layers: bad debuff (skip next turn, -3 HP for ALL units). Adjacent units that first contact a 3-layer bad unit get contaminated with 1 rubbish layer and a dirty buff. While dirty, no more contact stimulation; if healing clears all rubbish or rubbish is re-applied, dirty is removed for 10 HP damage. At 4 layers: instant death. Any healing clears all debuffs. Fuel 50/50, Ammo 12/12, Movement 8, Vision 2, Piperunner.");
    };

    this.canMoveAndFire = function()
    {
        return true;
    };

    this.getUnitType = function()
    {
        return GameEnums.UnitType_Ground;
    };

    this.getTypeOfWeapon1 = function(unit)
    {
        // WeaponType_Indirect allows the unit to attack within its
        // minRange/maxRange (1-2), but the engine DOES NOT allow indirect
        // weapons to counterattack when the unit is attacked. This means
        // PipeBin never fires back when targeted by an enemy, which is the
        // intended behavior (it is a passive recycling station, not a fighter).
        return GameEnums.WeaponType_Indirect;
    };

    this.getTypeOfWeapon2 = function(unit)
    {
        return GameEnums.WeaponType_Both;
    };

    // Action list: Fire (layer attack), Join, Load, Wait
    this.actionList = ["ACTION_FIRE", "ACTION_JOIN", "ACTION_LOAD", "ACTION_WAIT"];

    this.useTerrainDefense = function()
    {
        return true;
    };

    this.useTerrainHide = function()
    {
        return false;
    };

    this.startOfTurn = function(unit, map)
    {
        // Call UNIT.startOfTurn (wrapped by mu_system.js for flag clearing,
        // healing detection, and bad debuff processing).
        if (typeof UNIT.startOfTurn === "function")
        {
            UNIT.startOfTurn.call(this, unit, map);
        }

        // Ground units do NOT consume fuel in vanilla Commander Wars.

        // ============================================================
        // PipeBin turn-start: apply 1 rubbish layer to all units in
        // range 1-2 (including allies) that DON'T already have rubbish.
        // Multiple PipeBins don't stack: only applies if the target
        // has no existing rubbish layers.
        // ============================================================
        var ux = unit.getX();
        var uy = unit.getY();
        var ownerID = unit.getOwner().getPlayerID();
        for (var dx = -2; dx <= 2; dx++)
        {
            for (var dy = -2; dy <= 2; dy++)
            {
                var dist = Math.abs(dx) + Math.abs(dy);
                if (dist >= 1 && dist <= 2)
                {
                    var tx = ux + dx;
                    var ty = uy + dy;
                    if (map.onMap(tx, ty))
                    {
                        var targetUnit = map.getTerrain(tx, ty).getUnit();
                        if (targetUnit !== null)
                        {
                            // Only apply if the target doesn't already have rubbish
                            var targetVars = targetUnit.getVariables();
                            var targetRubbish = targetVars.getVariable("MU_PIPEBIN_RUBBISH");
                            if (targetRubbish === null || targetRubbish.readDataInt32() === 0)
                            {
                                MU_PIPEBIN.applyRubbish(targetUnit, 1, map, false, ownerID);
                            }
                        }
                    }
                }
            }
        }
    };

    // ================================================================
    // postBattleActions: attacking adds 1 rubbish layer to the target.
    // The weapon deals 0 actual damage (damageTable value 1 -> 0 HP
    // after the /10 conversion). Any residual damage is healed back.
    // ================================================================
    this.postBattleActions = function(unit, damage, otherUnit, gotAttacked, weapon, action)
    {
        // chain the global MU armor-funds tracker (MU_ARMOR_SYSTEM)
        try
        {
            if (typeof UNIT.postBattleActions === "function")
            {
                UNIT.postBattleActions.call(this, unit, damage, otherUnit, gotAttacked, weapon, action, map);
            }
        }
        catch (muChainError)
        {
            // never let tracking break the battle
        }

        if (!gotAttacked && otherUnit !== null)
        {
            // Heal back any damage dealt (weapon should deal 0, safety net)
            if (damage > 0 && otherUnit.getHp() > 0)
            {
                var healed = otherUnit.getHp() + damage;
                if (healed > 10)
                {
                    healed = 10;
                }
                otherUnit.setHp(healed);
            }
            // Apply 1 rubbish layer with source owner
            var map = unit.getOwner().getMap();
            MU_PIPEBIN.applyRubbish(otherUnit, 1, map, true, unit.getOwner().getPlayerID());
        }
    };

    this.getEditorPlacementSound = function()
    {
        return "move pipe.wav";
    };
};

Constructor.prototype = UNIT;
var MU_PIPEBIN = new Constructor();

// ================================================================
// MU_PIPEBIN helper functions: centralised debuff logic.
// Called from startOfTurn, postBattleActions, and the
// mu_system.js moveUnit wrapper (for contact contamination).
//
// Variable names on target units:
//   MU_PIPEBIN_RUBBISH     (Int32)  - rubbish layer count (0-4)
//   MU_PIPEBIN_BAD         (Int32)  - 0=none, 1=just reached 3 layers,
//                                     2=skip this turn (clear next turn)
//   MU_PIPEBIN_DIRTY       (Bool)   - contact contamination immunity
//   MU_PIPEBIN_SOURCE_OWNER(Int32)  - player ID of the PipeBin that
//                                     applied the rubbish (for friendly -3HP)
//   MU_PIPEBIN_LAST_HP     (Int32)  - stored HP for healing detection
// ================================================================

// Apply rubbish layers to a target unit and handle debuff transitions.
// unit          = the target unit receiving rubbish
// amount        = number of layers to add
// map           = the current map
// fromAttack    = true if from PipeBin attack, false if from turn-start auto
// sourceOwnerID = player ID of the PipeBin that caused this (for friendly -3HP)
MU_PIPEBIN.applyRubbish = function(unit, amount, map, fromAttack, sourceOwnerID)
{
    if (unit === null || unit === undefined)
    {
        return;
    }

    var vars = unit.getVariables();
    var rubbishVar = vars.getVariable("MU_PIPEBIN_RUBBISH");
    var layers = 0;
    if (rubbishVar !== null)
    {
        layers = rubbishVar.readDataInt32();
    }

    // If dirty buff exists and rubbish is being re-applied,
    // remove dirty and deal 10 HP damage (per requirement: "被再次附加一次")
    var dirtyVar = vars.getVariable("MU_PIPEBIN_DIRTY");
    if (dirtyVar !== null && dirtyVar.readDataBool() === true)
    {
        vars.deleteVariable("MU_PIPEBIN_DIRTY");
        var newHp = unit.getHp() - 10;
        if (newHp <= 0)
        {
            unit.killUnit();
            return;
        }
        unit.setHp(newHp);
        // Layers continue from current count (NOT reset)
    }

    layers += amount;
    if (layers > 4)
    {
        layers = 4;
    }

    // Write the new layer count
    if (rubbishVar === null)
    {
        vars.createVariable("MU_PIPEBIN_RUBBISH").writeDataInt32(layers);
    }
    else
    {
        rubbishVar.writeDataInt32(layers);
    }

    // Store source owner for friendly -3 HP check
    if (sourceOwnerID !== undefined && sourceOwnerID !== null)
    {
        var srcVar = vars.getVariable("MU_PIPEBIN_SOURCE_OWNER");
        if (srcVar === null)
        {
            vars.createVariable("MU_PIPEBIN_SOURCE_OWNER").writeDataInt32(sourceOwnerID);
        }
        else
        {
            srcVar.writeDataInt32(sourceOwnerID);
        }
    }

    // ============================================================
    // Layer threshold checks
    // ============================================================

    // 4 layers = instant death
    if (layers >= 4)
    {
        unit.killUnit();
        return;
    }

    // 3 layers = bad debuff: skip next turn + -3 HP (friendly only)
    if (layers >= 3)
    {
        var badVar = vars.getVariable("MU_PIPEBIN_BAD");
        if (badVar === null || badVar.readDataInt32() === 0)
        {
            // Set bad = 1 (first turn of bad debuff)
            if (badVar === null)
            {
                vars.createVariable("MU_PIPEBIN_BAD").writeDataInt32(1);
            }
            else
            {
                badVar.writeDataInt32(1);
            }

            // ====================================================
            // Contaminate adjacent units (first contact with a
            // newly-bad unit). Uses a depth guard to prevent
            // excessive chain reactions.
            // ====================================================
            if (MU_PIPEBIN._contaminationDepth < 10)
            {
                MU_PIPEBIN._contaminationDepth++;
                MU_PIPEBIN.contaminateAdjacent(unit, map);
                MU_PIPEBIN._contaminationDepth--;
            }
        }
    }
};

// Recursion depth guard for chain contamination
MU_PIPEBIN._contaminationDepth = 0;

// Clear all PipeBin debuffs from a unit (called when healing is detected).
// If dirty buff exists, removing it deals 10 HP damage.
MU_PIPEBIN.clearDebuffs = function(unit, map)
{
    if (unit === null || unit === undefined)
    {
        return;
    }

    var vars = unit.getVariables();
    var rubbishVar = vars.getVariable("MU_PIPEBIN_RUBBISH");
    if (rubbishVar === null)
    {
        return; // no debuff to clear
    }

    // Check if dirty buff exists — if so, removing it deals 10 HP damage
    var dirtyVar = vars.getVariable("MU_PIPEBIN_DIRTY");
    if (dirtyVar !== null && dirtyVar.readDataBool() === true)
    {
        vars.deleteVariable("MU_PIPEBIN_DIRTY");
        var newHp = unit.getHp() - 10;
        if (newHp <= 0)
        {
            vars.deleteVariable("MU_PIPEBIN_RUBBISH");
            vars.deleteVariable("MU_PIPEBIN_BAD");
            vars.deleteVariable("MU_PIPEBIN_SOURCE_OWNER");
            unit.killUnit();
            return;
        }
        unit.setHp(newHp);
    }

    vars.deleteVariable("MU_PIPEBIN_RUBBISH");
    vars.deleteVariable("MU_PIPEBIN_BAD");
    vars.deleteVariable("MU_PIPEBIN_SOURCE_OWNER");
};

// Check adjacent units for 3-layer "bad" contamination (called from moveUnit hook).
// When a unit moves adjacent to a 3-layer bad unit, it gets:
//   1. 1 rubbish layer (regardless of current layers)
//   2. dirty buff (prevents further contact stimulation)
//   3. stun (skip next turn)
//   4. -3 HP if the contaminated unit is friendly to the bad unit's owner
// Only triggers on first contact (dirty buff prevents re-triggering).
MU_PIPEBIN.checkContactContamination = function(unit, map)
{
    if (unit === null || unit === undefined)
    {
        return;
    }

    var ux = unit.getX();
    var uy = unit.getY();
    var vars = unit.getVariables();

    // If this unit already has dirty, no stimulation
    var dirtyVar = vars.getVariable("MU_PIPEBIN_DIRTY");
    if (dirtyVar !== null && dirtyVar.readDataBool() === true)
    {
        return;
    }

    // Check 4 adjacent tiles for 3-layer bad units
    var dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (var i = 0; i < 4; i++)
    {
        var tx = ux + dirs[i][0];
        var ty = uy + dirs[i][1];
        if (map.onMap(tx, ty))
        {
            var adjUnit = map.getTerrain(tx, ty).getUnit();
            if (adjUnit !== null && adjUnit !== unit)
            {
                var adjVars = adjUnit.getVariables();
                var adjRubbish = adjVars.getVariable("MU_PIPEBIN_RUBBISH");
                if (adjRubbish !== null && adjRubbish.readDataInt32() >= 3)
                {
                    // Contamination! Get source owner from the bad unit
                    var sourceOwnerID = -1;
                    var adjSourceVar = adjVars.getVariable("MU_PIPEBIN_SOURCE_OWNER");
                    if (adjSourceVar !== null)
                    {
                        sourceOwnerID = adjSourceVar.readDataInt32();
                    }

                    // Give 1 rubbish layer (regardless of current layers)
                    MU_PIPEBIN.applyRubbish(unit, 1, map, false, sourceOwnerID);

                    // Set dirty buff (only if unit is still alive after applyRubbish)
                    var uVars = unit.getVariables();
                    var dVar = uVars.getVariable("MU_PIPEBIN_DIRTY");
                    if (dVar === null)
                    {
                        uVars.createVariable("MU_PIPEBIN_DIRTY").writeDataBool(true);
                    }
                    else
                    {
                        dVar.writeDataBool(true);
                    }

                    // Set stun flag (skip next turn)
                    var stunVar = uVars.getVariable("MU_PIPEBIN_STUNNED");
                    if (stunVar === null)
                    {
                        uVars.createVariable("MU_PIPEBIN_STUNNED").writeDataBool(true);
                    }
                    else
                    {
                        stunVar.writeDataBool(true);
                    }

                    // Friendly -3 HP: if contaminated unit's owner is the same
                    // as the bad unit's owner, apply -3 HP
                    if (unit.getHp() > 0)
                    {
                        var badUnitOwner = adjUnit.getOwner();
                        if (badUnitOwner !== null && unit.getOwner() === badUnitOwner)
                        {
                            var newHp = unit.getHp() - 3;
                            if (newHp <= 0)
                            {
                                unit.killUnit();
                            }
                            else
                            {
                                unit.setHp(newHp);
                            }
                        }
                    }

                    return; // Only first contact triggers
                }
            }
        }
    }
};

// Contaminate adjacent units when a unit reaches 3 layers (called from applyRubbish).
// This handles the case where a unit is already adjacent when another unit reaches 3 layers.
MU_PIPEBIN.contaminateAdjacent = function(unit, map)
{
    if (unit === null || unit === undefined)
    {
        return;
    }

    var ux = unit.getX();
    var uy = unit.getY();
    var dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    for (var i = 0; i < 4; i++)
    {
        var tx = ux + dirs[i][0];
        var ty = uy + dirs[i][1];
        if (map.onMap(tx, ty))
        {
            var adjUnit = map.getTerrain(tx, ty).getUnit();
            if (adjUnit !== null && adjUnit !== unit)
            {
                // Check if adjacent unit already has dirty (skip if so)
                var adjVars = adjUnit.getVariables();
                var adjDirty = adjVars.getVariable("MU_PIPEBIN_DIRTY");
                if (adjDirty === null || adjDirty.readDataBool() === false)
                {
                    // Get source owner from the newly-bad unit
                    var sourceOwnerID = -1;
                    var srcVar = unit.getVariables().getVariable("MU_PIPEBIN_SOURCE_OWNER");
                    if (srcVar !== null)
                    {
                        sourceOwnerID = srcVar.readDataInt32();
                    }

                    // Apply 1 rubbish layer
                    MU_PIPEBIN.applyRubbish(adjUnit, 1, map, false, sourceOwnerID);

                    // Set dirty buff
                    var aVars = adjUnit.getVariables();
                    var dVar = aVars.getVariable("MU_PIPEBIN_DIRTY");
                    if (dVar === null)
                    {
                        aVars.createVariable("MU_PIPEBIN_DIRTY").writeDataBool(true);
                    }
                    else
                    {
                        dVar.writeDataBool(true);
                    }

                    // Set stun flag
                    var stunVar = aVars.getVariable("MU_PIPEBIN_STUNNED");
                    if (stunVar === null)
                    {
                        aVars.createVariable("MU_PIPEBIN_STUNNED").writeDataBool(true);
                    }
                    else
                    {
                        stunVar.writeDataBool(true);
                    }

                    // Friendly -3 HP
                    if (adjUnit.getHp() > 0)
                    {
                        var badUnitOwner = unit.getOwner();
                        if (badUnitOwner !== null && adjUnit.getOwner() === badUnitOwner)
                        {
                            var newHp = adjUnit.getHp() - 3;
                            if (newHp <= 0)
                            {
                                adjUnit.killUnit();
                            }
                            else
                            {
                                adjUnit.setHp(newHp);
                            }
                        }
                    }
                }
            }
        }
    }
};

// Ensure persistent wrappers are installed.
// Unit scripts load after general/unit.js, so UNIT is guaranteed to exist.
if (typeof MU_SYSTEM !== "undefined" && MU_SYSTEM !== null)
{
    MU_SYSTEM.installWrappers();
    MU_SYSTEM.registerTransportUnits();
}
