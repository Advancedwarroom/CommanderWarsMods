# Cheat Menu — a Commander Wars mod

Adds a **"Cheat..."** entry to the empty-field menu, directly above
End Turn, with eight cheat modules. Every command is a real game action.
**Single-player use only — keep it out of ranked and multiplayer matches.**

## Installation

1. Copy the whole `cheat_menu` folder into the game's `mods` directory
   (next to the bundled `debug_menu`, `map_creator`, etc.).
2. When starting a new game, enable **Cheat Menu** in the mod selection.
3. In game, click an empty field and pick "Cheat..."
   (right above End Turn).

## Mod-adaptive content lists

Unit, terrain, building and CO lists are **queried live from the engine's
sprite managers** (`unitSpriteManager`, `terrainSpriteManager`,
`buildingSpriteManager`, `coSpriteManager`). Content added by other mods —
new units, new terrains, new COs, modded cannons — shows up in the menus
automatically, no configuration needed. Loaded buildings are split into the
two submenus by convention: Z-prefixed ids and weapon keywords
(CANNON/LASER/DEATHRAY/TALON/CRYSTALL/VOLCAN/FORTRESS/MONOLITH/NEST/
GRAND_BOLT/OMEGA/MORTAR/GATE/WELD) go to the weapon list, everything else to
the building list. If a manager is unreachable on very old engine builds,
the mod falls back to the built-in base-game lists. The weather list is
read from the active game rules, so modded weathers were always included.

## The eight modules

### 1. Weather
Lists every loaded weather (including modded ones) and applies the chosen
one for a full round.

### 2. Fog of War
One-click toggle. Turning fog off remembers the map's original fog mode and
turning it back on restores that mode.

### 3. Terrain
Pick a target terrain (70+ base-game terrains plus anything mods add), then
click a tile to replace it. River/road/pipeline connections refresh
automatically.

### 4. Units (six sub-tools)
- **Stat adjust**: click a unit on the map → pick HP / fuel / ammo
  (ammo entries only appear for weapons the unit actually has) → pick a
  1 / 2 / 5 step.
  - **Sign toggle** and **multiplier toggle (×1 ↔ ×10)** are separate
    one-click commands whose labels always show the current state; one
    click multiplies by ten, the next restores. The amount menu renders
    the effective values (at ×10: +10/+20/+50).
  - Safety logic: HP clamps at 10 instead of overflowing; HP at or below
    0 destroys the unit; ammo and fuel clamp into [0, max], never negative.
- **Transform**: pick a unit → pick a new type from the full unit list,
  transformed in place, owner untouched.
- **Spawn**: pick an owner → a unit type → HP (1–10) → click a target tile.
  A blocked or invalid tile prints a failure to the log instead of crashing.
- **Delete**: click a unit, silently removed.
- **Change owner**: pick a unit → pick the new owner.
- **Has-moved state**: pick a unit → set moved / not moved.

### 5. Buildings & weapons
- **Place building**: pick a structure → an owner (including neutral) →
  click a target tile.
- **Place weapon**: pick a special weapon (Mini Cannon, Black Hole
  cannons, death rays, lasers, crystals, volcano guns, fortresses, nest and
  Grand Bolt parts, modded weapons, …) → an owner → click to place.
  **Giant weapons are handled**: their footprint extends up-left from the
  engine's anchor tile and can span up to 7 tiles (e.g. the Grand Bolt
  middle part). The placer probes anchor offsets around your click, so the
  clicked tile may be any corner of the footprint — if one spot fails the
  engine's placement check (terrain type or map edge), nearby anchors are
  tried automatically and the actual anchor is logged.
- **Weapon HP adjust**: click a tile with a building → pick a step (shares
  the sign/multiplier buttons with unit adjust, same behavior). HP clamps
  at 999 on the high end; at or below 0 the building is destroyed
  (same rule as unit HP — the engine does not auto-destroy on its own).
- **Change owner (building & weapon)**: click a tile with a building or
  weapon → pick the new owner (including neutral). Colors and ownership
  effects update immediately.

### 6. Funds
Pick a player → a 1000 / 2000 / 3000 step. Same sign button and a
multiplier button that cycles ×1 → ×10 → ×100 → back to ×1. Funds never
go below zero.

### 7. COs
Pick a player → a CO slot (0/1, showing the current CO or an empty slot) →
- **Change CO**: swap in any CO from the full loaded list (including
  CO_RANDOM, the per-army empty COs and modded COs);
- **Fill power**: charges to full superpower (the engine itself clamps at
  the star total, no overflow possible);
- **Empty power**.

### 8. Misc
- **Player / CPU type setting**: choose a player and set its configured
  control type to human or normal AI. The engine's scripting API exposes
  `setControlType`, but that only changes the configured type; it does not
  replace the active human/AI controller during a running game. The menu
  therefore reports this as a setting change, not a live handover.
- **Declare victory**: the chosen player wins (everyone else is instantly
  defeated).
- **Declare defeat**: the chosen player is instantly defeated.

## Technical notes

- Built entirely on the engine's JavaScript modding API, mirroring the
  structure of the bundled `debug_menu` mod:
  `scripts/general/cheat_menu_install.js` inserts the menu entry,
  `scripts/actions/ACTION_CHEAT_MENU.js` implements all commands, and
  `scripts/mapstart.js` re-installs the entry at every game start so
  later-loading mods cannot wipe it.
- Sign/multiplier state is session-only (never serialized into savegames)
  and resets to +/×1 on reload.
- All operations run through the standard action system; every change is
  confirmed in the log (GameConsole, error level, always visible).
