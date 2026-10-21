var Constructor = function()
{
    // ======== Post-Animation State ========
    // Stores data needed by performPostAnimation, which the engine calls
    // when the walking animation finishes. Without setEndOfAnimationCall
    // the engine freezes waiting for animation completion that never fires.
    this.postAnimationUnit = null;
    this.postAnimationTargetX = -1;
    this.postAnimationTargetY = -1;
    this.postAnimationMode = "";  // "START", "PROGRESS", or "COMPLETE"

    // ======== Constants ========
    this.MAX_PROGRESS = 30;
    this.PROGRESS_PER_TURN = 10;

    // Weapon options: [baseID, displayName, cost, needsDirection]
    this.WEAPON_OPTIONS = [
        ["ZCRYSTALL", "Crystal", 15000, false],
        ["ZMINICANNON", "MiniCannon", 20000, true],
        ["ZLASER", "LaserCannon", 20000, false]
    ];

    // Valid terrain for construction
    this.VALID_TERRAIN = ["PLAINS", "FOREST", "STREET", "ROAD", "MOUNTAIN", "HILL", "PLAIN",
                          "SNOW", "DESERT", "WASTE", "SNOW_FOREST", "SNOW_MOUNTAIN",
                          "DESERT_FOREST", "DESERT_MOUNTAIN", "WASTE_FOREST", "WASTE_MOUNTAIN",
                          "STREET1", "SNOW_STREET"];

    // ======== Helper Functions ========

    this.isValidTerrain = function(terrainID)
    {
        if (terrainID === null || terrainID === undefined)
        {
            return false;
        }
        var upper = terrainID.toUpperCase();
        for (var i = 0; i < ACTION_MU_SET_WEAPON.VALID_TERRAIN.length; i++)
        {
            if (upper === ACTION_MU_SET_WEAPON.VALID_TERRAIN[i])
            {
                return true;
            }
        }
        return false;
    };

    this.isConstructing = function(unit)
    {
        try
        {
            var unitVars = unit.getVariables();
            return unitVars.getVariable("MU_WC_SET_ACTIVE") !== null;
        }
        catch (e)
        {
            return false;
        }
    };

    this.getMinCost = function()
    {
        var min = ACTION_MU_SET_WEAPON.WEAPON_OPTIONS[0][2];
        for (var i = 1; i < ACTION_MU_SET_WEAPON.WEAPON_OPTIONS.length; i++)
        {
            if (ACTION_MU_SET_WEAPON.WEAPON_OPTIONS[i][2] < min)
            {
                min = ACTION_MU_SET_WEAPON.WEAPON_OPTIONS[i][2];
            }
        }
        return min;
    };

    this.addOwnershipOptions = function(data, unit, map)
    {
        var owner = unit.getOwner();
        var ownerID = owner.getPlayerID();

        // Self
        data.addData(qsTr("Self"), "SELF", "icon_fire", 0, true);

        // Other players
        var playerCount = 2;
        try
        {
            playerCount = map.getPlayerCount();
        }
        catch (e)
        {
            playerCount = 2;
        }

        var ownerTeam = -1;
        try
        {
            ownerTeam = owner.getTeam();
        }
        catch (e) {}

        for (var i = 0; i < playerCount; i++)
        {
            var player = null;
            try
            {
                player = map.getPlayer(i);
            }
            catch (e)
            {
                continue;
            }
            if (player === null || player === undefined)
            {
                continue;
            }
            if (player.getPlayerID() === ownerID)
            {
                continue;
            }

            var playerTeam = -1;
            try
            {
                playerTeam = player.getTeam();
            }
            catch (e) {}

            var label, dataStr;
            if (ownerTeam >= 0 && playerTeam >= 0 && playerTeam === ownerTeam)
            {
                label = qsTr("Ally: Player ") + (i + 1);
                dataStr = "ALLY:" + player.getPlayerID();
            }
            else
            {
                label = qsTr("Enemy: Player ") + (i + 1);
                dataStr = "ENEMY:" + player.getPlayerID();
            }
            data.addData(label, dataStr, "icon_fire", 0, true);
        }
    };

    // LOGIC ONLY - no animation creation here.
    // Visual animations are handled in performPostAnimation.
    this.completeConstruction = function(unit, map)
    {
        var unitVars = unit.getVariables();

        var targetX = -1, targetY = -1, weaponType = "", direction = "", ownerID = -1;
        try
        {
            targetX = unitVars.getVariable("MU_WC_SET_TARGET_X").readDataInt32();
            targetY = unitVars.getVariable("MU_WC_SET_TARGET_Y").readDataInt32();
            weaponType = unitVars.getVariable("MU_WC_SET_WEAPON_TYPE").readDataString();
            var dirVar = unitVars.getVariable("MU_WC_SET_DIRECTION");
            if (dirVar !== null)
            {
                direction = dirVar.readDataString();
            }
            ownerID = unitVars.getVariable("MU_WC_SET_OWNER_ID").readDataInt32();
        }
        catch (e)
        {
            ACTION_MU_SET_WEAPON.cancelConstruction(unit);
            return;
        }

        // Build the actual building ID
        var buildingID = weaponType;
        if (weaponType === "ZMINICANNON" && direction !== "")
        {
            buildingID = "ZMINICANNON_" + direction;
        }

        // Verify target tile is still valid
        if (!map.onMap(targetX, targetY))
        {
            ACTION_MU_SET_WEAPON.cancelConstruction(unit);
            return;
        }
        var terrain = map.getTerrain(targetX, targetY);
        if (terrain.getUnit() !== null || terrain.getBuilding() !== null)
        {
            ACTION_MU_SET_WEAPON.cancelConstruction(unit);
            return;
        }

        // Place the building
        terrain.loadBuilding(buildingID);
        var building = terrain.getBuilding();
        if (building === null)
        {
            ACTION_MU_SET_WEAPON.cancelConstruction(unit);
            return;
        }

        // Set owner
        if (ownerID >= 0 && ownerID !== unit.getOwner().getPlayerID())
        {
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
        }
        else
        {
            building.setUnitOwner(unit);
        }

        // Set fire count so it can fire on the owner's next turn
        try
        {
            building.setFireCount(1);
        }
        catch (e) {}

        // Clear construction variables
        ACTION_MU_SET_WEAPON.cancelConstruction(unit);

        // Record the build (logic only - no animation here)
        try { map.getGameRecorder().buildUnit(building.getOwner().getPlayerID(), buildingID, unit.getOwner().getPlayerID()); } catch (e) {}
    };

    this.cancelConstruction = function(unit)
    {
        try
        {
            var unitVars = unit.getVariables();
            unitVars.deleteVariable("MU_WC_SET_ACTIVE");
            unitVars.deleteVariable("MU_WC_SET_TARGET_X");
            unitVars.deleteVariable("MU_WC_SET_TARGET_Y");
            unitVars.deleteVariable("MU_WC_SET_WEAPON_TYPE");
            unitVars.deleteVariable("MU_WC_SET_DIRECTION");
            unitVars.deleteVariable("MU_WC_SET_OWNER_ID");
            unitVars.deleteVariable("MU_WC_SET_PROGRESS");
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
        var buildVar = unitVars.getVariable("MU_WC_SET_ACTIVE");

        if (buildVar !== null)
        {
            // Construction in progress - allow continuing
            return true;
        }

        // No construction in progress - check basic prerequisites only.
        // Terrain/target validation happens in getStepData (FIELD selection).
        if (unit.getAmmo2() <= 0)
        {
            return false;
        }

        var owner = unit.getOwner();
        if (owner.getFunds() < ACTION_MU_SET_WEAPON.getMinCost())
        {
            return false;
        }

        return true;
    };

    this.getActionText = function(map)
    {
        return qsTr("Set Weapon");
    };

    this.getIcon = function(map)
    {
        return "icon_fire";
    };

    this.getStepInputType = function(action, map)
    {
        var unit = action.getTargetUnit();
        if (ACTION_MU_SET_WEAPON.isConstructing(unit))
        {
            return "";  // No input needed, isFinalStep returns true
        }

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
            // Check weapon type to determine if this is direction or ownership
            try
            {
                action.startReading();
                action.readDataInt32();  // targetX
                action.readDataInt32();  // targetY
                var weaponType = action.readDataString();
                if (weaponType === "ZMINICANNON")
                {
                    return "MENU";  // direction selection
                }
                return "MENU";  // ownership selection
            }
            catch (e)
            {
                return "MENU";
            }
        }
        if (step === 3)
        {
            return "MENU";  // ownership (only for MiniCannon)
        }
        return "";
    };

    this.isFinalStep = function(action, map)
    {
        var unit = action.getTargetUnit();
        if (ACTION_MU_SET_WEAPON.isConstructing(unit))
        {
            return true;  // No selection needed, just continue construction
        }

        var step = action.getInputStep();
        if (step <= 1)
        {
            return false;
        }

        // Read weapon type to determine step count
        try
        {
            action.startReading();
            action.readDataInt32();  // targetX
            action.readDataInt32();  // targetY
            var weaponType = action.readDataString();
            if (weaponType === "ZMINICANNON")
            {
                return step >= 3;  // tile, type, direction, ownership
            }
            else
            {
                return step >= 2;  // tile, type, ownership
            }
        }
        catch (e)
        {
            return step >= 3;
        }
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
            // FIELD: show valid adjacent tiles
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
                    if (!ACTION_MU_SET_WEAPON.isValidTerrain(terrain.getID()))
                    {
                        continue;
                    }
                    if (terrain.getUnit() !== null)
                    {
                        continue;
                    }
                    if (terrain.getBuilding() !== null)
                    {
                        continue;
                    }
                    data.addPoint(Qt.point(tx, ty));
                }
            }
        }
        else if (step === 1)
        {
            // MENU: weapon type selection
            var owner = unit.getOwner();
            for (var i = 0; i < ACTION_MU_SET_WEAPON.WEAPON_OPTIONS.length; i++)
            {
                var opt = ACTION_MU_SET_WEAPON.WEAPON_OPTIONS[i];
                var canAfford = owner.getFunds() >= opt[2];
                data.addData(qsTr(opt[1]) + " (" + opt[2] + "G)", opt[0], "icon_fire", opt[2], canAfford);
            }
        }
        else if (step === 2)
        {
            // Read weapon type from step 1
            var weaponType = "";
            try
            {
                action.startReading();
                action.readDataInt32();
                action.readDataInt32();
                weaponType = action.readDataString();
            }
            catch (e) {}

            if (weaponType === "ZMINICANNON")
            {
                // Direction selection - game has E/N/S/W variants
                data.addData(qsTr("East"), "E", "icon_fire", 0, true);
                data.addData(qsTr("North"), "N", "icon_fire", 0, true);
                data.addData(qsTr("South"), "S", "icon_fire", 0, true);
                data.addData(qsTr("West"), "W", "icon_fire", 0, true);
            }
            else
            {
                // Ownership selection
                ACTION_MU_SET_WEAPON.addOwnershipOptions(data, unit, map);
            }
        }
        else if (step === 3)
        {
            // Ownership selection (only for MiniCannon)
            ACTION_MU_SET_WEAPON.addOwnershipOptions(data, unit, map);
        }
    };

    this.perform = function(action, map)
    {
        var unit = action.getTargetUnit();
        var unitVars = unit.getVariables();
        var buildVar = unitVars.getVariable("MU_WC_SET_ACTIVE");
        var isContinuation = (buildVar !== null);

        // --- Read start-phase data BEFORE moveUnit (following ACTION_MU_EMPOWER pattern) ---
        var targetX = -1, targetY = -1;
        var weaponType = "ZCRYSTALL";
        var direction = "";
        var ownership = "SELF";
        if (!isContinuation)
        {
            action.startReading();
            targetX = action.readDataInt32();
            targetY = action.readDataInt32();
            try
            {
                weaponType = action.readDataString();
            }
            catch (e)
            {
                weaponType = "ZCRYSTALL";
            }

            if (weaponType === "ZMINICANNON")
            {
                try
                {
                    direction = action.readDataString();
                }
                catch (e)
                {
                    direction = "E";
                }
                try
                {
                    ownership = action.readDataString();
                }
                catch (e)
                {
                    ownership = "SELF";
                }
            }
            else
            {
                try
                {
                    ownership = action.readDataString();
                }
                catch (e)
                {
                    ownership = "SELF";
                }
            }
        }

        // ====== Common: walking animation + setEndOfAnimationCall + moveUnit ======
        // CRITICAL FIX: Without setEndOfAnimationCall the engine freezes waiting
        // for the walking animation completion callback that never fires.
        // This pattern is used for BOTH the start and continuation phases.
        var engineCost = action.getCosts();
        var animation = Global[unit.getUnitID()].doWalkingAnimation(action, map);
        animation.setEndOfAnimationCall("ACTION_MU_SET_WEAPON", "performPostAnimation");
        Global[unit.getUnitID()].moveUnit(unit, action, map);

        // Restore fuel - only deduct the real movement cost.
        // The constructor does not actually move while constructing, but we
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
        ACTION_MU_SET_WEAPON.postAnimationUnit = unit;
        ACTION_MU_SET_WEAPON.postAnimationTargetX = -1;
        ACTION_MU_SET_WEAPON.postAnimationTargetY = -1;
        ACTION_MU_SET_WEAPON.postAnimationMode = "";

        if (isContinuation)
        {
            // ====== Construction in progress - continue ======
            // Increment progress
            var progressVar = unitVars.getVariable("MU_WC_SET_PROGRESS");
            var progress = 0;
            try
            {
                progress = progressVar.readDataInt32();
            }
            catch (e) {}
            progress += ACTION_MU_SET_WEAPON.PROGRESS_PER_TURN;

            // Read target coordinates BEFORE completeConstruction clears variables
            var cTargetX = -1, cTargetY = -1;
            try
            {
                cTargetX = unitVars.getVariable("MU_WC_SET_TARGET_X").readDataInt32();
                cTargetY = unitVars.getVariable("MU_WC_SET_TARGET_Y").readDataInt32();
            }
            catch (e) {}

            if (progress >= ACTION_MU_SET_WEAPON.MAX_PROGRESS)
            {
                // Complete construction (logic only - animations go in performPostAnimation)
                ACTION_MU_SET_WEAPON.completeConstruction(unit, map);
                ACTION_MU_SET_WEAPON.postAnimationMode = "COMPLETE";
                ACTION_MU_SET_WEAPON.postAnimationTargetX = cTargetX;
                ACTION_MU_SET_WEAPON.postAnimationTargetY = cTargetY;
            }
            else
            {
                progressVar.writeDataInt32(progress);
                ACTION_MU_SET_WEAPON.postAnimationMode = "PROGRESS";
                ACTION_MU_SET_WEAPON.postAnimationTargetX = cTargetX;
                ACTION_MU_SET_WEAPON.postAnimationTargetY = cTargetY;
            }

            unit.setHasMoved(true);
            return;
        }

        // ====== Start new construction ======
        if (unit.getAmmo2() <= 0)
        {
            unit.setHasMoved(true);
            return;
        }

        // Find the weapon cost
        var weaponCost = 0;
        for (var i2 = 0; i2 < ACTION_MU_SET_WEAPON.WEAPON_OPTIONS.length; i2++)
        {
            if (ACTION_MU_SET_WEAPON.WEAPON_OPTIONS[i2][0] === weaponType)
            {
                weaponCost = ACTION_MU_SET_WEAPON.WEAPON_OPTIONS[i2][2];
                break;
            }
        }

        // Determine owner ID
        var ownerID = unit.getOwner().getPlayerID();
        if (ownership !== "SELF")
        {
            var parts = ownership.split(":");
            if (parts.length >= 2)
            {
                ownerID = parseInt(parts[1]);
            }
        }

        // Deduct funds from the unit's owner (always the constructor's owner pays)
        var owner = unit.getOwner();
        if (owner.getFunds() < weaponCost)
        {
            // Can't afford - abort
            unit.setHasMoved(true);
            return;
        }
        owner.addFunds(-weaponCost);

        // Consume 1 construction ammo
        unit.setAmmo2(unit.getAmmo2() - 1);

        // Set construction variables
        unitVars.createVariable("MU_WC_SET_ACTIVE").writeDataBool(true);
        unitVars.createVariable("MU_WC_SET_TARGET_X").writeDataInt32(targetX);
        unitVars.createVariable("MU_WC_SET_TARGET_Y").writeDataInt32(targetY);
        unitVars.createVariable("MU_WC_SET_WEAPON_TYPE").writeDataString(weaponType);
        if (direction !== "")
        {
            unitVars.createVariable("MU_WC_SET_DIRECTION").writeDataString(direction);
        }
        unitVars.createVariable("MU_WC_SET_OWNER_ID").writeDataInt32(ownerID);
        unitVars.createVariable("MU_WC_SET_PROGRESS").writeDataInt32(ACTION_MU_SET_WEAPON.PROGRESS_PER_TURN);

        // Protect unit from being destroyed during construction
        unitVars.createVariable("MU_PROTECTED").writeDataBool(true);

        // Set postAnimation state for the start animation
        ACTION_MU_SET_WEAPON.postAnimationMode = "START";
        ACTION_MU_SET_WEAPON.postAnimationTargetX = targetX;
        ACTION_MU_SET_WEAPON.postAnimationTargetY = targetY;

        unit.setHasMoved(true);
    };

    // Called by the engine when the walking animation finishes.
    // Visual effects only - all core logic is in perform().
    this.performPostAnimation = function(postAnimation, map)
    {
        var mode = ACTION_MU_SET_WEAPON.postAnimationMode;
        var targetX = ACTION_MU_SET_WEAPON.postAnimationTargetX;
        var targetY = ACTION_MU_SET_WEAPON.postAnimationTargetY;

        if (mode === "COMPLETE")
        {
            // Construction finished - play the completion animation
            if (targetX >= 0 && targetY >= 0 && map.onMap(targetX, targetY))
            {
                var anim = GameAnimationFactory.createAnimation(map, targetX, targetY);
                anim.addSprite("rockets_explode", -map.getImageSize() / 2, -map.getImageSize() / 2, 0, 1.5);
                anim.setSound("build.wav", 1, 0);
            }
        }
        else if (mode === "PROGRESS")
        {
            // Construction in progress - play the progress animation
            if (targetX >= 0 && targetY >= 0 && map.onMap(targetX, targetY))
            {
                var anim2 = GameAnimationFactory.createAnimation(map, targetX, targetY);
                anim2.addSprite("capture_background", 0, 0, 0, 1);
                anim2.setSound("build.wav", 1, 0);
            }
        }
        else if (mode === "START")
        {
            // Construction started - play the start animation
            if (targetX >= 0 && targetY >= 0 && map.onMap(targetX, targetY))
            {
                var anim3 = GameAnimationFactory.createAnimation(map, targetX, targetY);
                anim3.addSprite("capture_background", 0, 0, 0, 1);
                anim3.setSound("build.wav", 1, 0);
            }
        }

        // Reset postAnimation state
        ACTION_MU_SET_WEAPON.postAnimationUnit = null;
        ACTION_MU_SET_WEAPON.postAnimationTargetX = -1;
        ACTION_MU_SET_WEAPON.postAnimationTargetY = -1;
        ACTION_MU_SET_WEAPON.postAnimationMode = "";
    };

    this.getName = function()
    {
        return qsTr("Set Weapon");
    };

    this.getDescription = function()
    {
        return qsTr("Construct a stationary weapon on an adjacent tile. Crystal (15000G), MiniCannon (20000G, choose direction), or LaserCannon (20000G). Valid terrain: Plains, Forest, Road, Hill. Construction takes 3 turns. Cannot move or attack during construction. Consumes 1 construction ammo. Choose ownership: Self, Ally, or Enemy.");
    };
}

Constructor.prototype = ACTION;
var ACTION_MU_SET_WEAPON = new Constructor();
