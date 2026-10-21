// mu_damage_patch.js - Centralized damage table patch for MoreUnits custom units
// Intercepts WEAPON.getDamageFromTable to inject custom damage values
// for MU_PIPEBIN and MU_PIPETHINKER without modifying individual weapon files.

var MU_DAMAGE_PATCH =
{
    // ================================================================
    // Damage values for MU_PIPEBIN (getUnitDamageID = "MU_PIPEBIN")
    // User requirements:
    //   步兵系:      25-30  → 28
    //   坦克炮:      70-80  → 75
    //   反坦克炮:    90-95  → 92
    //   火箭炮:      75-85  → 80
    //   战斗机/轰炸机: 50-60  → 55
    //   直升机:      40-50  → 45
    //   战舰炮:      80-90  → 85
    //   PipeRunner导弹: ~60 (not specified, reasonable default)
    // ================================================================
    MU_PIPEBIN: {
        // ---- 步兵系 (Infantry MGs, SMGs, vulcans, autocannons) = 28 ----
        "weapon_infantry_mg": 28,
        "weapon_mech_mg": 28,
        "weapon_smg": 28,
        "WEAPON_LIGHT_SMG": 28,
        "weapon_motorbike_mg": 28,
        "weapon_recon_mg": 28,
        "weapon_airplane_mg": 28,
        "weapon_mounted_mg": 28,
        "WEAPON_COMMANDO_MG": 28,
        "weapon_flare_mg": 28,
        "weapon_heavy_tank_mg": 28,
        "weapon_light_tank_mg": 28,
        "weapon_medium_tank_mg": 28,
        "weapon_megatank_mg": 28,
        "weapon_neotank_mg": 28,
        "weapon_hovercraft_mg": 28,
        "weapon_heavy_hovercraft_mg": 28,
        "weapon_vulcan_cannon": 28,
        "weapon_vulcan_cannon_II": 28,
        "weapon_25mm_vulcan": 28,
        "weapon_hovervulcan_cannon": 28,
        "weapon_gatling": 28,
        "WEAPON_25MM_AUTOCANNON": 28,
        "WEAPON_25MM_AUTOCANNON_II": 28,
        "weapon_30mm_cannon": 28,
        "WEAPON_MU_ETA_RIFLE": 28,
        "WEAPON_MU_WC_CANNON": 28,
        "weapon_sniper": 28,
        "weapon_minesweeper_cannon": 28,
        "WEAPON_MU_BACKTRACKCAR": 28,

        // ---- 坦克炮 (Tank Guns) = 75 ----
        "weapon_light_tank_gun": 75,
        "weapon_medium_tank_gun": 75,
        "weapon_heavy_tank_gun": 75,
        "weapon_megatank_gun": 75,
        "weapon_neotank_gun": 75,
        "weapon_hovercraft_gun": 75,
        "weapon_heavy_hovercraft_gun": 75,
        "weapon_tankhunter_gun": 75,
        "WEAPON_APFSDS": 75,
        "weapon_engineer_cannon": 75,

        // ---- 反坦克炮 (Anti-Tank) = 92 ----
        "weapon_a_tank_cannon": 92,
        "weapon_a_tank_missile": 92,
        "weapon_atgm": 92,
        "weapon_bazooka": 92,
        "weapon_bike_bazooka": 92,
        "weapon_at_sniper": 92,

        // ---- 火箭炮 (Rockets/Artillery) = 80 ----
        "weapon_rocket_missile": 80,
        "weapon_missile_launcher": 80,
        "weapon_cannon": 80,
        "weapon_howitzer": 80,
        "weapon_missile": 80,
        "weapon_mortar": 80,
        "weapon_field_cannon": 80,
        "weapon_auto_grenade_launcher": 80,
        "weapon_incendiary_launcher": 80,
        "weapon_tactical_missile": 80,
        "weapon_hypersonic_missile": 80,
        "weapon_firebomb": 80,
        "WEAPON_MU_LARGE_MISSILE": 80,

        // ---- 战斗机/轰炸机 (Fighter/Bomber air-to-ground) = 55 ----
        "weapon_bomb": 55,
        "weapon_heavy_bomb": 55,
        "weapon_air_to_ground_missile": 55,
        "weapon_air_to_ground_missile_II": 55,
        "weapon_air_to_ground_missile_striker": 55,
        "weapon_gbu": 55,
        "weapon_stealthrocket": 55,

        // ---- 直升机 (Helicopter) = 45 ----
        "weapon_k_heli_mg": 45,
        "weapon_30mm_cannon_gunship": 45,
        "weapon_agm": 45,
        "weapon_agm_drone": 45,
        "WEAPON_IR_AGM": 45,

        // ---- 战舰炮 (Battleship/Naval) = 85 ----
        "weapon_battleship_cannon": 85,
        "weapon_cruiser_missile": 85,
        "weapon_anti_ship_cannon": 85,
        "weapon_assault_ship_cannon": 85,
        "weapon_frigate_naval_gun": 85,
        "weapon_gunboat_naval_gun": 85,
        "weapon_anti_ship_missile": 85,
        "WEAPON_ANTI_SHIP_MISSILE1": 85,
        "weapon_anti_ship_cruiser_missile": 85,

        // ---- PipeRunner导弹 = 60 ----
        "weapon_piperunner_missile": 60,

        // ---- PipeBin's own weapon = 1 (deals ~0 damage) ----
        "WEAPON_MU_PIPEBIN": 1,
    },

    // ================================================================
    // Damage values for MU_PIPETHINKER (getUnitDamageID = "MU_PIPETHINKER")
    // User requirements:
    //   步兵系:      15-20  → 18
    //   坦克炮:      65-75  → 70
    //   反坦克炮:    80-90  → 85
    //   火箭炮:      70-80  → 75
    //   战斗机/轰炸机: 40-55  → 48
    //   直升机:      30-40  → 35
    //   战舰炮:      75-85  → 80
    //   潜艇/鱼雷:    30-40  → 35
    //   PipeRunner导弹: 55-65  → 60
    // ================================================================
    MU_PIPETHINKER: {
        // ---- 步兵系 = 18 ----
        "weapon_infantry_mg": 18,
        "weapon_mech_mg": 18,
        "weapon_smg": 18,
        "WEAPON_LIGHT_SMG": 18,
        "weapon_motorbike_mg": 18,
        "weapon_recon_mg": 18,
        "weapon_airplane_mg": 18,
        "weapon_mounted_mg": 18,
        "WEAPON_COMMANDO_MG": 18,
        "weapon_flare_mg": 18,
        "weapon_heavy_tank_mg": 18,
        "weapon_light_tank_mg": 18,
        "weapon_medium_tank_mg": 18,
        "weapon_megatank_mg": 18,
        "weapon_neotank_mg": 18,
        "weapon_hovercraft_mg": 18,
        "weapon_heavy_hovercraft_mg": 18,
        "weapon_vulcan_cannon": 18,
        "weapon_vulcan_cannon_II": 18,
        "weapon_25mm_vulcan": 18,
        "weapon_hovervulcan_cannon": 18,
        "weapon_gatling": 18,
        "WEAPON_25MM_AUTOCANNON": 18,
        "WEAPON_25MM_AUTOCANNON_II": 18,
        "weapon_30mm_cannon": 18,
        "WEAPON_MU_ETA_RIFLE": 18,
        "WEAPON_MU_WC_CANNON": 18,
        "weapon_sniper": 18,
        "weapon_minesweeper_cannon": 18,
        "WEAPON_MU_BACKTRACKCAR": 18,

        // ---- 坦克炮 = 70 ----
        "weapon_light_tank_gun": 70,
        "weapon_medium_tank_gun": 70,
        "weapon_heavy_tank_gun": 70,
        "weapon_megatank_gun": 70,
        "weapon_neotank_gun": 70,
        "weapon_hovercraft_gun": 70,
        "weapon_heavy_hovercraft_gun": 70,
        "weapon_tankhunter_gun": 70,
        "WEAPON_APFSDS": 70,
        "weapon_engineer_cannon": 70,

        // ---- 反坦克炮 = 85 ----
        "weapon_a_tank_cannon": 85,
        "weapon_a_tank_missile": 85,
        "weapon_atgm": 85,
        "weapon_bazooka": 85,
        "weapon_bike_bazooka": 85,
        "weapon_at_sniper": 85,

        // ---- 火箭炮 = 75 ----
        "weapon_rocket_missile": 75,
        "weapon_missile_launcher": 75,
        "weapon_cannon": 75,
        "weapon_howitzer": 75,
        "weapon_missile": 75,
        "weapon_mortar": 75,
        "weapon_field_cannon": 75,
        "weapon_auto_grenade_launcher": 75,
        "weapon_incendiary_launcher": 75,
        "weapon_tactical_missile": 75,
        "weapon_hypersonic_missile": 75,
        "weapon_firebomb": 75,
        "WEAPON_MU_LARGE_MISSILE": 75,

        // ---- 战斗机/轰炸机 = 48 ----
        "weapon_bomb": 48,
        "weapon_heavy_bomb": 48,
        "weapon_air_to_ground_missile": 48,
        "weapon_air_to_ground_missile_II": 48,
        "weapon_air_to_ground_missile_striker": 48,
        "weapon_gbu": 48,
        "weapon_stealthrocket": 48,

        // ---- 直升机 = 35 ----
        "weapon_k_heli_mg": 35,
        "weapon_30mm_cannon_gunship": 35,
        "weapon_agm": 35,
        "weapon_agm_drone": 35,
        "WEAPON_IR_AGM": 35,

        // ---- 战舰炮 = 80 ----
        "weapon_battleship_cannon": 80,
        "weapon_cruiser_missile": 80,
        "weapon_anti_ship_cannon": 80,
        "weapon_assault_ship_cannon": 80,
        "weapon_frigate_naval_gun": 80,
        "weapon_gunboat_naval_gun": 80,
        "weapon_anti_ship_missile": 80,
        "WEAPON_ANTI_SHIP_MISSILE1": 80,
        "weapon_anti_ship_cruiser_missile": 80,

        // ---- 潜艇/鱼雷 = 35 ----
        "weapon_boat_torpedo": 35,
        "weapon_torpedo": 35,
        "WEAPON_LIGHT_TORPEDO": 35,
        "TORPEDO_GUIDED_MISSILE": 35,
        "WEAPON_ANTI_SUBMARINE_MISSILE": 35,

        // ---- PipeRunner导弹 = 60 ----
        "weapon_piperunner_missile": 60,

        // ---- PipeBin's own weapon = 1 (deals ~0 damage) ----
        "WEAPON_MU_PIPEBIN": 1,
    },

    // ================================================================
    // Damage values for MU_SPITOR (Oozium variant - vulnerable to MG, resistant to explosives)
    // ================================================================
    MU_SPITOR: {
        // ---- 步兵系 (Machine Guns) = 35 (Oozium weakness) ----
        "weapon_infantry_mg": 35,
        "weapon_mech_mg": 35,
        "weapon_smg": 35,
        "WEAPON_LIGHT_SMG": 35,
        "weapon_motorbike_mg": 35,
        "weapon_recon_mg": 35,
        "weapon_airplane_mg": 35,
        "weapon_mounted_mg": 35,
        "WEAPON_COMMANDO_MG": 35,
        "weapon_flare_mg": 35,
        "weapon_heavy_tank_mg": 35,
        "weapon_light_tank_mg": 35,
        "weapon_medium_tank_mg": 35,
        "weapon_megatank_mg": 35,
        "weapon_neotank_mg": 35,
        "weapon_hovercraft_mg": 35,
        "weapon_heavy_hovercraft_mg": 35,
        "weapon_vulcan_cannon": 35,
        "weapon_vulcan_cannon_II": 35,
        "weapon_25mm_vulcan": 35,
        "weapon_hovervulcan_cannon": 35,
        "weapon_gatling": 35,
        "WEAPON_25MM_AUTOCANNON": 35,
        "WEAPON_25MM_AUTOCANNON_II": 35,
        "weapon_30mm_cannon": 35,
        "WEAPON_MU_ETA_RIFLE": 35,
        "WEAPON_MU_WC_CANNON": 35,
        "weapon_sniper": 35,
        "weapon_minesweeper_cannon": 35,
        "WEAPON_MU_BACKTRACKCAR": 35,

        // ---- 坦克炮 (Tank Guns) = 60 ----
        "weapon_light_tank_gun": 60,
        "weapon_medium_tank_gun": 60,
        "weapon_heavy_tank_gun": 60,
        "weapon_megatank_gun": 60,
        "weapon_neotank_gun": 60,
        "weapon_hovercraft_gun": 60,
        "weapon_heavy_hovercraft_gun": 60,
        "weapon_tankhunter_gun": 60,
        "WEAPON_APFSDS": 60,
        "weapon_engineer_cannon": 60,

        // ---- 反坦克炮 (Anti-Tank) = 75 ----
        "weapon_a_tank_cannon": 75,
        "weapon_a_tank_missile": 75,
        "weapon_atgm": 75,
        "weapon_bazooka": 75,
        "weapon_bike_bazooka": 75,
        "weapon_at_sniper": 75,

        // ---- 火箭炮 (Rockets/Artillery) = 50 (resistant) ----
        "weapon_rocket_missile": 50,
        "weapon_missile_launcher": 50,
        "weapon_cannon": 50,
        "weapon_howitzer": 50,
        "weapon_missile": 50,
        "weapon_mortar": 50,
        "weapon_field_cannon": 50,
        "weapon_auto_grenade_launcher": 50,
        "weapon_incendiary_launcher": 50,
        "weapon_tactical_missile": 50,
        "weapon_hypersonic_missile": 50,
        "weapon_firebomb": 50,
        "WEAPON_MU_LARGE_MISSILE": 50,

        // ---- 战斗机/轰炸机 = 45 ----
        "weapon_bomb": 45,
        "weapon_heavy_bomb": 45,
        "weapon_air_to_ground_missile": 45,
        "weapon_air_to_ground_missile_II": 45,
        "weapon_air_to_ground_missile_striker": 45,
        "weapon_gbu": 45,
        "weapon_stealthrocket": 45,

        // ---- 直升机 = 40 ----
        "weapon_k_heli_mg": 40,
        "weapon_30mm_cannon_gunship": 40,
        "weapon_agm": 40,
        "weapon_agm_drone": 40,
        "WEAPON_IR_AGM": 40,

        // ---- 战舰炮 = 55 ----
        "weapon_battleship_cannon": 55,
        "weapon_cruiser_missile": 55,
        "weapon_anti_ship_cannon": 55,
        "weapon_assault_ship_cannon": 55,
        "weapon_frigate_naval_gun": 55,
        "weapon_gunboat_naval_gun": 55,
        "weapon_anti_ship_missile": 55,
        "WEAPON_ANTI_SHIP_MISSILE1": 55,
        "weapon_anti_ship_cruiser_missile": 55,

        // ---- 潜艇/鱼雷 = 40 ----
        "weapon_boat_torpedo": 40,
        "weapon_torpedo": 40,
        "WEAPON_LIGHT_TORPEDO": 40,
        "TORPEDO_GUIDED_MISSILE": 40,
        "WEAPON_ANTI_SUBMARINE_MISSILE": 40,

        // ---- PipeRunner导弹 = 50 ----
        "weapon_piperunner_missile": 50,
    }
};

// ================================================================
// Install the damage patch by wrapping WEAPON.getDamageFromTable.
// When a weapon attacks a unit with a custom damage ID (MU_PIPEBIN
// or MU_PIPETHINKER), the custom damage table is used instead of
// the weapon's built-in damage table.
// ================================================================
(function()
{
    if (typeof WEAPON === "undefined" || WEAPON === null)
    {
        return;
    }
    if (typeof MU_DAMAGE_PATCH_INSTALLED !== "undefined" && MU_DAMAGE_PATCH_INSTALLED)
    {
        return;
    }

    var originalGetDamageFromTable = WEAPON.getDamageFromTable;

    WEAPON.getDamageFromTable = function(unit, damageTable, weaponID)
    {
        // Get the target unit's custom damage ID
        var damageID = unit.getUnitID();
        try
        {
            if (typeof Global !== "undefined" && Global[unit.getUnitID()] !== undefined &&
                typeof Global[unit.getUnitID()].getUnitDamageID === "function")
            {
                damageID = Global[unit.getUnitID()].getUnitDamageID(unit);
            }
        }
        catch (e) {}

        // ================================================================
        // THE GREAT OWL special handling
        // When elevated (hidden), completely invulnerable — return 0.
        // When not elevated, uses BOMBER damage values at 90%.
        // ================================================================
        if (damageID === "THE_GREAT_OWL")
        {
            if (unit.getHidden() === true)
            {
                return 0;
            }
            if (typeof damageTable !== "undefined" && damageTable !== null)
            {
                for (var j = 0; j < damageTable.length; j++)
                {
                    if (damageTable[j][0] === "BOMBER")
                    {
                        // Slightly lower than bomber: 90% rounded down
                        return Math.floor(damageTable[j][1] * 0.9);
                    }
                }
            }
            // Weapon has no BOMBER entry → cannot attack air units
            return 0;
        }

        // ================================================================
        // THE BLACK ONYX special handling
        // Completely invulnerable to all conventional weapon attacks.
        // Only non-weapon damage (missile silos, Oozium, etc.) can kill it.
        // ================================================================
        if (damageID === "THE_BLACK_ONYX")
        {
            return 0;
        }

        // ================================================================
        // Forcefield damage reduction:
        //   - Temporary (BOS_FORCEFIELD): -70% damage (30% remaining)
        //   - Unbreakable (BOS_UNBREAKABLE): complete immunity (0%)
        // ================================================================
        try
        {
            if (typeof map !== "undefined" && map !== null)
            {
                var targetTerrain = map.getTerrain(unit.getX(), unit.getY());
                if (targetTerrain !== null)
                {
                    var tVars = targetTerrain.getVariables();
                    var unbVar = tVars.getVariable("BOS_UNBREAKABLE");
                    if (unbVar !== null && unbVar.readDataBool() === true)
                    {
                        return 0; // Unbreakable = complete immunity
                    }
                    var ffVar = tVars.getVariable("BOS_FORCEFIELD");
                    if (ffVar !== null && ffVar.readDataBool() === true)
                    {
                        // Temporary forcefield: compute raw damage first, then apply -70%
                        var rawDamage = 0;
                        var rawFound = false;

                        // Check custom damage tables first
                        if (typeof MU_DAMAGE_PATCH !== "undefined" && MU_DAMAGE_PATCH[damageID])
                        {
                            var customDmg = MU_DAMAGE_PATCH[damageID][weaponID];
                            if (customDmg !== undefined && customDmg !== null)
                            {
                                rawDamage = customDmg;
                                rawFound = true;
                            }
                            else
                            {
                                rawDamage = 0;
                                rawFound = true;
                            }
                        }

                        // Fall back to original damage table
                        if (!rawFound && typeof originalGetDamageFromTable === "function")
                        {
                            rawDamage = originalGetDamageFromTable.call(this, unit, damageTable, weaponID);
                        }

                        return Math.floor(rawDamage * 0.3); // 30% damage remaining
                    }
                }
            }
        }
        catch (e) {}

        // Check custom damage tables
        if (typeof MU_DAMAGE_PATCH !== "undefined" && MU_DAMAGE_PATCH[damageID])
        {
            var customDamage = MU_DAMAGE_PATCH[damageID][weaponID];
            if (customDamage !== undefined && customDamage !== null)
            {
                return customDamage;
            }
            // If the unit has a custom damage ID but this weapon isn't in
            // the table, return 0 (weapon can't damage this unit)
            return 0;
        }

        // Fall back to original damage table lookup
        if (typeof originalGetDamageFromTable === "function")
        {
            return originalGetDamageFromTable.call(this, unit, damageTable, weaponID);
        }
        return 0;
    };

    MU_DAMAGE_PATCH_INSTALLED = true;
})();

// ================================================================
// Forcefield damage reduction for BUILDINGS:
// WEAPON.getDamageFromTable only handles unit-vs-unit combat.
// Building damage uses getDeffensiveFieldBonus() for defence bonuses.
// We patch BUILDING base so ALL buildings check for forcefield vars.
// ================================================================
(function()
{
    if (typeof BUILDING === "undefined" || BUILDING === null)
    {
        return;
    }
    if (typeof BOS_BUILDING_PATCH_INSTALLED !== "undefined" && BOS_BUILDING_PATCH_INSTALLED)
    {
        return;
    }

    var originalBuildingGetDeffensiveFieldBonus = BUILDING.getDeffensiveFieldBonus;

    BUILDING.getDeffensiveFieldBonus = function(building, attacker, atkX, atkY, defender, defX, defY, isAttacker, action, luckMode, map)
    {
        try
        {
            if (typeof map !== "undefined" && map !== null)
            {
                var terrain = map.getTerrain(defX, defY);
                if (terrain !== null)
                {
                    var tVars = terrain.getVariables();
                    var unbVar = tVars.getVariable("BOS_UNBREAKABLE");
                    if (unbVar !== null && unbVar.readDataBool() === true)
                    {
                        // Unbreakable = complete immunity (100% defence)
                        return 100;
                    }
                    var ffVar = tVars.getVariable("BOS_FORCEFIELD");
                    if (ffVar !== null && ffVar.readDataBool() === true)
                    {
                        // Temporary forcefield: 70% defence = 30% damage remaining
                        return 70;
                    }
                }
            }
        }
        catch (e) {}

        if (typeof originalBuildingGetDeffensiveFieldBonus === "function")
        {
            return originalBuildingGetDeffensiveFieldBonus.apply(this, arguments);
        }
        return 0;
    };

    BOS_BUILDING_PATCH_INSTALLED = true;
})();
