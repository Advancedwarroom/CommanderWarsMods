// This file is loaded after all building scripts.
// It extends existing buildings to include MoreUnits content.

// Add MU_LARGEMISSILE to the Factory (Base) construction list so it can be produced.
try
{
    if (typeof FACTORY !== "undefined" && FACTORY !== null &&
        FACTORY.constructionList !== undefined && FACTORY.constructionList !== null &&
        typeof FACTORY.constructionList.push === "function")
    {
        FACTORY.constructionList.push("MU_LARGEMISSILE");
    }
}
catch (e) {}

// Add MU_BACKTRACKCAR to the Factory (Base) construction list.
try
{
    if (typeof FACTORY !== "undefined" && FACTORY !== null &&
        FACTORY.constructionList !== undefined && FACTORY.constructionList !== null &&
        typeof FACTORY.constructionList.push === "function")
    {
        FACTORY.constructionList.push("MU_BACKTRACKCAR");
    }
}
catch (e) {}

// Also add to HQ construction list if it exists (some mods allow HQ to build units).
try
{
    if (typeof HQ !== "undefined" && HQ !== null &&
        HQ.constructionList !== undefined && HQ.constructionList !== null &&
        typeof HQ.constructionList.push === "function")
    {
        HQ.constructionList.push("MU_LARGEMISSILE");
        HQ.constructionList.push("MU_BACKTRACKCAR");
        HQ.constructionList.push("MU_WEAPON_CONSTRUCTOR");
        HQ.constructionList.push("MU_PIPEBIN");
        HQ.constructionList.push("MU_PIPETHINKER");
    }
}
catch (e) {}

// Add MU_EMPOWER_TERRAIN_EDITOR to the Factory (Base) construction list.
// It is UnitType_Infantry, same as INFANTRY/MECH, so it can be produced at a Factory.
try
{
    if (typeof FACTORY !== "undefined" && FACTORY !== null &&
        FACTORY.constructionList !== undefined && FACTORY.constructionList !== null &&
        typeof FACTORY.constructionList.push === "function")
    {
        FACTORY.constructionList.push("MU_EMPOWER_TERRAIN_EDITOR");
    }
}
catch (e) {}

// Add MU_WEAPON_CONSTRUCTOR to the Factory (Base) construction list.
// It is UnitType_Ground with MOVE_TANK (Treads), same as LIGHT_TANK.
try
{
    if (typeof FACTORY !== "undefined" && FACTORY !== null &&
        FACTORY.constructionList !== undefined && FACTORY.constructionList !== null &&
        typeof FACTORY.constructionList.push === "function")
    {
        FACTORY.constructionList.push("MU_WEAPON_CONSTRUCTOR");
    }
}
catch (e) {}

// Add MU_PIPEBIN to the Factory (Base) construction list.
// It is UnitType_Ground with MOVE_PIPERUNNER, same as PIPERUNNER.
// Per user requirement: "Base可生产！因为地面基地能生产PipeRunner"
try
{
    if (typeof FACTORY !== "undefined" && FACTORY !== null &&
        FACTORY.constructionList !== undefined && FACTORY.constructionList !== null &&
        typeof FACTORY.constructionList.push === "function")
    {
        FACTORY.constructionList.push("MU_PIPEBIN");
    }
}
catch (e) {}

// Add MU_PIPETHINKER to the Factory (Base) construction list.
// It is GameEnums.PIPE_WEAPON with MOVE_PIPERUNNER, same as PipeBin.
// Per user requirement: "Base可生产！因为地面基地能生产PipeRunner"
try
{
    if (typeof FACTORY !== "undefined" && FACTORY !== null &&
        FACTORY.constructionList !== undefined && FACTORY.constructionList !== null &&
        typeof FACTORY.constructionList.push === "function")
    {
        FACTORY.constructionList.push("MU_PIPETHINKER");
    }
}
catch (e) {}

// Ensure Factory can repair/resupply Ground-type units (MU_LARGEMISSILE and MU_BACKTRACKCAR are UnitType_Ground).
try
{
    if (typeof FACTORY !== "undefined" && FACTORY !== null &&
        typeof FACTORY.getRepairTypes === "function")
    {
        var originalFactoryRepairTypes = FACTORY.getRepairTypes;
        FACTORY.getRepairTypes = function(building)
        {
            var types = originalFactoryRepairTypes.call(FACTORY, building);
            if (types === null || types === undefined)
            {
                types = [];
            }
            var hasGround = false;
            for (var i = 0; i < types.length; i++)
            {
                if (types[i] === GameEnums.UnitType_Ground)
                {
                    hasGround = true;
                    break;
                }
            }
            if (!hasGround)
            {
                types.push(GameEnums.UnitType_Ground);
            }
            // Also ensure Infantry type is repairable (for MU_EMPOWER_TERRAIN_EDITOR)
            var hasInfantry = false;
            for (var j = 0; j < types.length; j++)
            {
                if (types[j] === GameEnums.UnitType_Infantry)
                {
                    hasInfantry = true;
                    break;
                }
            }
            if (!hasInfantry)
            {
                types.push(GameEnums.UnitType_Infantry);
            }
            return types;
        };
    }
}
catch (e) {}

// ================================================================
// Large weapon destruction -> convert tiles to Plains
// When a synthesized large weapon (Black Cannon, Death Ray, Black Obelisk)
// is destroyed, its 3x3 area becomes Plains terrain instead of remaining
// as dead/impassable terrain.
// ================================================================
try
{
    if (typeof BUILDING !== "undefined" && BUILDING !== null)
    {
        // Check if a building ID is a large weapon that should turn to Plains
        var mu_isLargeWeapon = function(buildingID)
        {
            if (buildingID === null || buildingID === undefined)
            {
                return false;
            }
            if (buildingID === "ZMONOLITH") return true;
            if (buildingID.indexOf("ZBLACKHOLE_CANNON") === 0) return true;
            if (buildingID.indexOf("ZDEATHRAY") === 0) return true;
            return false;
        };

        // Convert a 3x3 area centered on the building's anchor (bottom-right) to Plains
        var mu_convertToPlains = function(building, map)
        {
            try
            {
                var terrain = building.getTerrain();
                if (terrain === null)
                {
                    return;
                }
                var bx = terrain.getX();
                var by = terrain.getY();
                // 3x3 building: anchor at bottom-right, spans (bx-2, by-2) to (bx, by)
                for (var dx = -2; dx <= 0; dx++)
                {
                    for (var dy = -2; dy <= 0; dy++)
                    {
                        var tx = bx + dx;
                        var ty = by + dy;
                        if (map.onMap(tx, ty))
                        {
                            map.replaceTerrain("PLAINS", tx, ty);
                            // Refresh adjacent sprites
                            for (var rdx = -1; rdx <= 1; rdx++)
                            {
                                for (var rdy = -1; rdy <= 1; rdy++)
                                {
                                    var rtx = tx + rdx;
                                    var rty = ty + rdy;
                                    if (map.onMap(rtx, rty))
                                    {
                                        var rt = map.getTerrain(rtx, rty);
                                        try
                                        {
                                            Global[rt.getID()].loadBaseSprite(rt, map);
                                        }
                                        catch (e2) {}
                                    }
                                }
                            }
                        }
                    }
                }
            }
            catch (e) {}
        };

        // Wrap BUILDING.onDestroyed (prototype-level, catches all buildings
        // that don't override onDestroyed themselves)
        var originalBuildingOnDestroyed = BUILDING.onDestroyed;
        BUILDING.onDestroyed = function(building, map)
        {
            try
            {
                var buildingID = building.getBuildingID();
                if (mu_isLargeWeapon(buildingID))
                {
                    mu_convertToPlains(building, map);
                }
            }
            catch (e) {}

            if (typeof originalBuildingOnDestroyed === "function")
            {
                originalBuildingOnDestroyed.call(this, building, map);
            }
        };

        // Also wrap individual large weapon building objects in case they
        // have their own onDestroyed that shadows the prototype.
        var mu_largeWeaponIDs = [
            "ZMONOLITH",
            "ZBLACKHOLE_CANNON_E", "ZBLACKHOLE_CANNON_N",
            "ZBLACKHOLE_CANNON_S", "ZBLACKHOLE_CANNON_W",
            "ZDEATHRAY_E", "ZDEATHRAY_N",
            "ZDEATHRAY_S", "ZDEATHRAY_W"
        ];
        for (var lwI = 0; lwI < mu_largeWeaponIDs.length; lwI++)
        {
            var lwID = mu_largeWeaponIDs[lwI];
            try
            {
                var lwObj = Global[lwID];
                if (lwObj !== null && lwObj !== undefined)
                {
                    var lwOrigOnDestroyed = lwObj.onDestroyed;
                    // Only wrap if the object has its own onDestroyed (not inherited)
                    if (lwObj.hasOwnProperty("onDestroyed") &&
                        typeof lwOrigOnDestroyed === "function")
                    {
                        lwObj.onDestroyed = function(building, map)
                        {
                            try
                            {
                                mu_convertToPlains(building, map);
                            }
                            catch (e) {}
                            lwOrigOnDestroyed.call(this, building, map);
                        };
                    }
                }
            }
            catch (e) {}
        }
    }
}
catch (e) {}

// Ensure HQ can also repair/resupply Ground-type units.
try
{
    if (typeof HQ !== "undefined" && HQ !== null &&
        typeof HQ.getRepairTypes === "function")
    {
        var originalHQRepairTypes = HQ.getRepairTypes;
        HQ.getRepairTypes = function(building)
        {
            var types = originalHQRepairTypes.call(HQ, building);
            if (types === null || types === undefined)
            {
                types = [];
            }
            var hasGround = false;
            for (var i = 0; i < types.length; i++)
            {
                if (types[i] === GameEnums.UnitType_Ground)
                {
                    hasGround = true;
                    break;
                }
            }
            if (!hasGround)
            {
                types.push(GameEnums.UnitType_Ground);
            }
            var hasInfantry2 = false;
            for (var k = 0; k < types.length; k++)
            {
                if (types[k] === GameEnums.UnitType_Infantry)
                {
                    hasInfantry2 = true;
                    break;
                }
            }
            if (!hasInfantry2)
            {
                types.push(GameEnums.UnitType_Infantry);
            }
            return types;
        };
    }
}
catch (e) {}
