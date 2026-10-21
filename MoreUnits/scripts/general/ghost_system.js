// ghost_system.js - Attack restriction system for the Ghost Cannon
//
// A Ghost Cannon hovers high above the battlefield: only air units and
// anti-air weapons can touch it, ground and naval forces cannot.
//
// The engine decides building attacks in two places:
//  1. Unit::canAttackWithWeapon -> calls ACTION_FIRE.extendedCanAttackCheck
//     (a global mod hook, see game/unit.cpp) before the normal checks.
//  2. ACTION_FIRE / WeaponManager -> Global[weaponID].getEnviromentDamage(id)
//     with the terrain id (GHOST_PLATFORM) for human attacks and the
//     building id (ZGHOST_CANNON_*) for ai evaluation.
// We seal both paths here.

var GHOST_SYSTEM =
{
    GHOST_TERRAIN: "GHOST_PLATFORM",
    GHOST_BUILDING_PREFIX: "ZGHOST_CANNON",
    GHOST_DAMAGE: 45,

    // the Black Arc shares the air-only restriction but has armor:
    // it only takes 75% of the Ghost Cannon damage (25% damage reduction)
    BLACK_ARC_PREFIX: "ZBLACK_ARC",
    BLACK_ARC_DAMAGE: 45 * 0.75,

    isGhostId: function(enviromentId)
    {
        if (enviromentId === null || enviromentId === undefined)
        {
            return false;
        }
        return enviromentId === GHOST_SYSTEM.GHOST_TERRAIN ||
               enviromentId.indexOf(GHOST_SYSTEM.GHOST_BUILDING_PREFIX) === 0 ||
               enviromentId.indexOf(GHOST_SYSTEM.BLACK_ARC_PREFIX) === 0;
    },

    // environment damage for sky structures; returns null for normal targets
    // so the caller falls back to the weapon's original table
    getEnvDamageForId: function(enviromentId, weapon)
    {
        if (enviromentId === null || enviromentId === undefined)
        {
            return null;
        }
        if (enviromentId === GHOST_SYSTEM.GHOST_TERRAIN ||
            enviromentId.indexOf(GHOST_SYSTEM.GHOST_BUILDING_PREFIX) === 0)
        {
            return GHOST_SYSTEM.hasAirDamage(weapon) ? GHOST_SYSTEM.GHOST_DAMAGE : -1;
        }
        if (enviromentId.indexOf(GHOST_SYSTEM.BLACK_ARC_PREFIX) === 0)
        {
            return GHOST_SYSTEM.hasAirDamage(weapon) ? GHOST_SYSTEM.BLACK_ARC_DAMAGE : -1;
        }
        return null;
    },

    // building-id based lookup used by ACTION_FIRE (which normally only sees
    // the terrain id - the Black Arc sits on normal terrain, so its building
    // id must be checked explicitly). Returns null for non-sky targets.
    getSkyBuildingDamage: function(buildingID, weaponID)
    {
        if (buildingID === null || buildingID === undefined ||
            weaponID === "" || weaponID === null || weaponID === undefined)
        {
            return null;
        }
        GHOST_SYSTEM.wrapWeapon(weaponID);
        var weapon = Global[weaponID];
        if (buildingID.indexOf(GHOST_SYSTEM.GHOST_BUILDING_PREFIX) === 0)
        {
            return GHOST_SYSTEM.hasAirDamage(weapon) ? GHOST_SYSTEM.GHOST_DAMAGE : -1;
        }
        if (buildingID.indexOf(GHOST_SYSTEM.BLACK_ARC_PREFIX) === 0)
        {
            return GHOST_SYSTEM.hasAirDamage(weapon) ? GHOST_SYSTEM.BLACK_ARC_DAMAGE : -1;
        }
        return null;
    },

    // anything that can hurt a plane can hurt the Ghost Cannon:
    // air units themselves and every anti-air weapon qualify automatically,
    // which also adapts to units added by other mods.
    AIR_TARGET_KEYWORDS: ["FIGHTER", "BOMBER", "DUSTER", "PLANE", "HELI"],

    hasAirDamage: function(weapon)
    {
        if (weapon === null || weapon === undefined)
        {
            return false;
        }
        var table = weapon.damageTable;
        if (table === undefined || table === null)
        {
            return false;
        }
        for (var i = 0; i < table.length; i++)
        {
            var targetId = table[i][0];
            if (table[i][1] > 0)
            {
                for (var k = 0; k < GHOST_SYSTEM.AIR_TARGET_KEYWORDS.length; k++)
                {
                    if (targetId.toUpperCase().indexOf(GHOST_SYSTEM.AIR_TARGET_KEYWORDS[k]) >= 0)
                    {
                        return true;
                    }
                }
            }
        }
        return false;
    },

    wrapWeapon: function(weaponID)
    {
        if (weaponID === "" || weaponID === null || weaponID === undefined)
        {
            return;
        }
        var weapon = Global[weaponID];
        if (weapon === undefined || weapon === null || weapon.__ghostWrapped === true)
        {
            return;
        }
        if (typeof weapon.getEnviromentDamage === "function")
        {
            var original = weapon.getEnviromentDamage;
            weapon.getEnviromentDamage = function(enviromentId)
            {
                var skyDamage = GHOST_SYSTEM.getEnvDamageForId(enviromentId, this);
                if (skyDamage !== null)
                {
                    return skyDamage;
                }
                return original.call(this, enviromentId);
            };
            weapon.__ghostWrapped = true;
        }
    },

    // vanilla weapons that override getEnviromentDamage (others inherit the
    // patched WEAPON prototype below). Mod weapons get wrapped lazily in the
    // extendedCanAttackCheck hook the first time they aim at a Ghost Cannon.
    VANILLA_WEAPONS: ["WEAPON_A_AIR_GUN", "WEAPON_A_TANK_CANNON", "WEAPON_A_TANK_MISSILE",
                      "WEAPON_AIR_TO_AIR_MISSILE", "WEAPON_AIR_TO_GROUND_MISSILE",
                      "WEAPON_AIR_TO_GROUND_MISSILE_II", "WEAPON_AIR_TO_GROUND_MISSILE_STRIKER",
                      "WEAPON_AIRPLANE_MG", "WEAPON_ANTI_AIR_MISSILE", "WEAPON_ANTI_SHIP_CANNON",
                      "WEAPON_ANTI_SHIP_CRUISER_MISSILE", "WEAPON_ANTI_SHIP_MISSILE",
                      "WEAPON_BATTLECRUISER_A_AIR_GUN", "WEAPON_BATTLESHIP_CANNON",
                      "WEAPON_BAZOOKA", "WEAPON_BIKE_BAZOOKA", "WEAPON_BOAT_TORPEDO",
                      "WEAPON_BOMB", "WEAPON_CANNON", "WEAPON_CARGO",
                      "WEAPON_CARRIER_ANTI_AIR_MISSILE", "WEAPON_CRUISER_MISSILE",
                      "WEAPON_DESIGNATOR", "WEAPON_FIREBOMB", "WEAPON_FLARE",
                      "WEAPON_FLARE_MG", "WEAPON_FRIGATE_NAVAL_GUN", "WEAPON_GATLING",
                      "WEAPON_GUNBOAT_NAVAL_GUN", "WEAPON_HEAVY_HOVERCRAFT_GUN",
                      "WEAPON_HEAVY_HOVERCRAFT_MG", "WEAPON_HEAVY_TANK_GUN",
                      "WEAPON_HEAVY_TANK_MG", "WEAPON_HOVERCRAFT_GUN", "WEAPON_HOVERCRAFT_MG",
                      "WEAPON_HOVERVULCAN_CANNON", "WEAPON_INFANTRY_MG", "WEAPON_K_HELI_MG",
                      "WEAPON_LIGHT_TANK_GUN", "WEAPON_LIGHT_TANK_MG", "WEAPON_MECH_MG",
                      "WEAPON_MEGATANK_GUN", "WEAPON_MEGATANK_MG", "WEAPON_MOTORBIKE_MG",
                      "WEAPON_NEOTANK_GUN", "WEAPON_NEOTANK_MG", "WEAPON_PIPERUNNER_MISSILE",
                      "WEAPON_RECON_MG", "WEAPON_ROCKET_MISSILE", "WEAPON_SNIPER",
                      "WEAPON_STEALTHROCKET", "WEAPON_TANKHUNTER_GUN", "WEAPON_TORPEDO",
                      "WEAPON_VULCAN_CANNON", "WEAPON_WATERPLANE_MISSILE"],

    install: function()
    {
        // 1. patch the shared WEAPON prototype default so weapons without
        //    their own getEnviromentDamage are sealed as well
        if (typeof WEAPON !== "undefined" && WEAPON !== null && WEAPON.__ghostPrototypePatched !== true)
        {
            var protoOriginal = WEAPON.getEnviromentDamage;
            WEAPON.getEnviromentDamage = function(enviromentId)
            {
                var skyDamage = GHOST_SYSTEM.getEnvDamageForId(enviromentId, this);
                if (skyDamage !== null)
                {
                    return skyDamage;
                }
                if (protoOriginal !== undefined && protoOriginal !== null)
                {
                    return protoOriginal.call(this, enviromentId);
                }
                return -1;
            };
            WEAPON.__ghostPrototypePatched = true;
        }

        // 2. wrap all known vanilla weapons that override getEnviromentDamage
        for (var i = 0; i < GHOST_SYSTEM.VANILLA_WEAPONS.length; i++)
        {
            GHOST_SYSTEM.wrapWeapon(GHOST_SYSTEM.VANILLA_WEAPONS[i]);
        }

        // 3. unit-side gate: non air / non anti-air units may never target
        //    a Ghost Cannon, no matter what their weapon table says
        if (typeof ACTION_FIRE !== "undefined" && ACTION_FIRE !== null &&
            ACTION_FIRE.__ghostHookInstalled !== true)
        {
            var previousHook = ACTION_FIRE.extendedCanAttackCheck;
            ACTION_FIRE.extendedCanAttackCheck = function(unit, weaponIndex, weaponType,
                                                          unitX, unitY, targetX, targetY,
                                                          rangeCheck, map)
            {
                try
                {
                    if (map !== null && map.onMap(targetX, targetY))
                    {
                        var building = map.getTerrain(targetX, targetY).getBuilding();
                        if (building !== null &&
                            (building.getBuildingID().indexOf(GHOST_SYSTEM.GHOST_BUILDING_PREFIX) === 0 ||
                             building.getBuildingID().indexOf(GHOST_SYSTEM.BLACK_ARC_PREFIX) === 0))
                        {
                            var weaponID = (weaponIndex === 0) ? unit.getWeapon1ID() : unit.getWeapon2ID();
                            GHOST_SYSTEM.wrapWeapon(weaponID);
                            var weapon = (weaponID !== "") ? Global[weaponID] : null;
                            var isAir = (unit.getUnitType() === GameEnums.UnitType_Air);
                            var isAntiAir = (weapon !== null && weapon !== undefined &&
                                             GHOST_SYSTEM.hasAirDamage(weapon));
                            if (isAir || isAntiAir)
                            {
                                return; // fall through to the normal checks
                            }
                            return false; // ground and naval units cannot reach it
                        }
                    }
                }
                catch (e)
                {
                }
                if (previousHook !== undefined && previousHook !== null)
                {
                    return previousHook.apply(ACTION_FIRE, arguments);
                }
                return;
            };
            ACTION_FIRE.__ghostHookInstalled = true;
        }

        // 4. Ghost Platform is sky: only air units may cross it.
        //    File-level overrides cannot replace vanilla movement tables
        //    (base resources load last and win), so wrap MOVE_AIR directly.
        //    Every other movement type has no GHOST_PLATFORM entry and
        //    already treats it as impassable.
        if (typeof MOVE_AIR !== "undefined" && MOVE_AIR !== null &&
            MOVE_AIR.__ghostMovePatched !== true)
        {
            var prevMove = MOVE_AIR.getMovementpoints;
            MOVE_AIR.getMovementpoints = function(terrain, unit, currentTerrain, trapChecking, map)
            {
                if (terrain !== null && terrain !== undefined &&
                    terrain.getID() === GHOST_SYSTEM.GHOST_TERRAIN)
                {
                    return 1;
                }
                return prevMove.apply(MOVE_AIR, arguments);
            };
            MOVE_AIR.__ghostMovePatched = true;
        }
    },
};

// install at script load time so the restriction also survives save/load
GHOST_SYSTEM.install();
