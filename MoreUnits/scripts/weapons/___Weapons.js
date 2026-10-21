// ___Weapons.js - Post-processing for weapon damage tables
// This file is loaded after all weapon scripts.
// Adds MU_WEAPON_CONSTRUCTOR damage entries to all relevant weapons.
// Damage values are based on the unit being a heavy tread vehicle (28000G cost).

// Helper: safely add a damage entry to a weapon's damage table
function mu_wc_addDamage(weaponVarName, damage)
{
    try
    {
        var weapon = Global[weaponVarName];
        if (weapon !== null && weapon !== undefined &&
            weapon.damageTable !== null && weapon.damageTable !== undefined &&
            typeof weapon.damageTable.push === "function")
        {
            // Check if entry already exists
            for (var i = 0; i < weapon.damageTable.length; i++)
            {
                if (weapon.damageTable[i][0] === "MU_WEAPON_CONSTRUCTOR")
                {
                    return;  // Already exists
                }
            }
            weapon.damageTable.push(["MU_WEAPON_CONSTRUCTOR", damage]);
        }
    }
    catch (e) {}
}

// ====== Infantry Weapons ======
mu_wc_addDamage("WEAPON_INFANTRY_MG", 5);
mu_wc_addDamage("WEAPON_MECH_MG", 8);
mu_wc_addDamage("WEAPON_BAZOOKA", 35);
mu_wc_addDamage("WEAPON_BIKE_BAZOOKA", 30);
mu_wc_addDamage("WEAPON_SMG", 5);
mu_wc_addDamage("WEAPON_COMMANDO_MG", 10);
mu_wc_addDamage("WEAPON_LIGHT_SMG", 5);
mu_wc_addDamage("WEAPON_MOTORBIKE_MG", 5);
mu_wc_addDamage("WEAPON_MOUNTED_MG", 8);

// ====== Recon Weapons ======
mu_wc_addDamage("WEAPON_RECON_MG", 8);
mu_wc_addDamage("WEAPON_FLARE", 5);
mu_wc_addDamage("WEAPON_FLARE_MG", 5);

// ====== Tank Cannons ======
mu_wc_addDamage("WEAPON_LIGHT_TANK_GUN", 35);
mu_wc_addDamage("WEAPON_LIGHT_TANK_MG", 18);
mu_wc_addDamage("WEAPON_MEDIUM_TANK_GUN", 45);
mu_wc_addDamage("WEAPON_MEDIUM_TANK_MG", 22);
mu_wc_addDamage("WEAPON_HEAVY_TANK_GUN", 55);
mu_wc_addDamage("WEAPON_HEAVY_TANK_MG", 28);
mu_wc_addDamage("WEAPON_NEOTANK_GUN", 50);
mu_wc_addDamage("WEAPON_NEOTANK_MG", 25);
mu_wc_addDamage("WEAPON_MEGATANK_GUN", 65);
mu_wc_addDamage("WEAPON_MEGATANK_MG", 30);

// ====== Special Tank Weapons ======
mu_wc_addDamage("WEAPON_TANKHUNTER_GUN", 40);
mu_wc_addDamage("WEAPON_NEOTANK_GUN", 50);
mu_wc_addDamage("WEAPON_APFSDS", 55);
mu_wc_addDamage("WEAPON_ENGINEER_CANNON", 30);
mu_wc_addDamage("WEAPON_MINESWEEPER_CANNON", 30);
mu_wc_addDamage("WEAPON_FIELD_CANNON", 35);

// ====== Artillery / Ranged ======
mu_wc_addDamage("WEAPON_MORTAR", 40);
mu_wc_addDamage("WEAPON_HOWITZER", 45);
mu_wc_addDamage("WEAPON_HEAVY_HOWITZER", 50);
mu_wc_addDamage("WEAPON_ROCKET_MISSILE", 45);
mu_wc_addDamage("WEAPON_MISSILE", 40);
mu_wc_addDamage("WEAPON_MISSILE_LAUNCHER", 40);
mu_wc_addDamage("WEAPON_TACTICAL_MISSILE", 55);
mu_wc_addDamage("WEAPON_AUTO_GRENADE_LAUNCHER", 25);

// ====== Anti-Tank ======
mu_wc_addDamage("WEAPON_ATGM", 45);
mu_wc_addDamage("WEAPON_AT_SNIPER", 40);
mu_wc_addDamage("WEAPON_ANTITANKCANNON", 45);
mu_wc_addDamage("WEAPON_STEALTHROCKET", 40);

// ====== Anti-Air (can target ground in some games) ======
mu_wc_addDamage("WEAPON_VULCAN_CANNON", 15);
mu_wc_addDamage("WEAPON_VULCAN_CANNON_II", 18);
mu_wc_addDamage("WEAPON_A_AIR_GUN", 10);
mu_wc_addDamage("WEAPON_GATLING", 12);
mu_wc_addDamage("WEAPON_25MM_AUTOCANNON", 15);
mu_wc_addDamage("WEAPON_25MM_AUTOCANNON_II", 18);

// ====== Air-to-Ground ======
mu_wc_addDamage("WEAPON_BOMB", 55);
mu_wc_addDamage("WEAPON_HEAVY_BOMB", 65);
mu_wc_addDamage("WEAPON_AGM", 50);
mu_wc_addDamage("WEAPON_AIR_TO_GROUND_MISSILE", 50);
mu_wc_addDamage("WEAPON_AIR_TO_GROUND_MISSILE_II", 55);
mu_wc_addDamage("WEAPON_AIR_TO_GROUND_MISSILE_STRIKER", 45);
mu_wc_addDamage("WEAPON_IR_AGM", 45);
mu_wc_addDamage("WEAPON_GBU", 55);
mu_wc_addDamage("WEAPON_FIREBOMB", 35);
mu_wc_addDamage("WEAPON_INCFNDIARY_LAUNCHER", 35);

// ====== Helicopter Weapons ======
mu_wc_addDamage("WEAPON_K_HELI_MG", 20);
mu_wc_addDamage("WEAPON_30MM_CANNON_GUNSHIP", 30);

// ====== Naval Weapons ======
mu_wc_addDamage("WEAPON_BATTLESHIP_CANNON", 65);
mu_wc_addDamage("WEAPON_CRUISER_MISSILE", 50);
mu_wc_addDamage("WEAPON_FRIGATE_NAVAL_GUN", 45);
mu_wc_addDamage("WEAPON_GUNBOAT_NAVAL_GUN", 40);
mu_wc_addDamage("WEAPON_ANTI_SHIP_CANNON", 50);
mu_wc_addDamage("WEAPON_ANTI_SHIP_MISSILE", 45);
mu_wc_addDamage("WEAPON_ANTI_SHIP_CRUISER_MISSILE", 50);
mu_wc_addDamage("WEAPON_ASSAULT_SHIP_CANNON", 45);
mu_wc_addDamage("WEAPON_HEAVY_HOVERCRAFT_GUN", 45);
mu_wc_addDamage("WEAPON_HEAVY_HOVERCRAFT_MG", 20);
mu_wc_addDamage("WEAPON_HOVERCRAFT_GUN", 35);
mu_wc_addDamage("WEAPON_HOVERCRAFT_MG", 15);
mu_wc_addDamage("WEAPON_HOVERVULCAN_CANNON", 20);
mu_wc_addDamage("WEAPON_BOAT_TORPEDO", 35);

// ====== Cannon (generic) ======
mu_wc_addDamage("WEAPON_CANNON", 35);

// ====== Naval Torpedoes ======
mu_wc_addDamage("WEAPON_TORPEDO", 0);  // Torpedoes can't hit ground units
mu_wc_addDamage("WEAPON_LIGHT_TORPEDO", 0);
mu_wc_addDamage("WEAPON_ANTI_SUBMARINE_MISSILE", 0);

// ====== Air-to-Air (can't target ground) ======
mu_wc_addDamage("WEAPON_AIR_TO_AIR_MISSILE", 0);
mu_wc_addDamage("WEAPON_INTERCEPTOR_MISSILE", 0);
mu_wc_addDamage("WEAPON_FOX3_MISSILE", 0);
mu_wc_addDamage("WEAPON_AIRPLANE_MG", 0);

// ====== Nukes / Special ======
mu_wc_addDamage("WEAPON_NUCLEAR_MISSILE", 100);
mu_wc_addDamage("WEAPON_NUCLEAR_MISSILE2", 100);
mu_wc_addDamage("WEAPON_HYPERSONIC_MISSILE", 65);

// ====== Other MoreUnits weapons ======
mu_wc_addDamage("WEAPON_MU_LARGE_MISSILE", 50);
