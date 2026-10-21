# MoreUnits Mod

A mod for **Commander Wars** that adds new units, weapons, and buildings.

## Current Status

- Version: 0.1.0
- Content: Framework is ready. Waiting for specific unit/weapon/building content.

## Folder Structure

```
MoreUnits/
├── mod.txt                          ← Mod info (name, version, etc.)
├── scripts/
│   ├── units/                       ← Unit scripts
│   │   └── EXAMPLE_UNIT.js          ← Example unit template
│   ├── weapons/                     ← Weapon scripts
│   │   └── EXAMPLE_WEAPON.js        ← Example weapon template
│   ├── building/                    ← Building scripts
│   │   └── EXAMPLE_BUILDING.js      ← Example building template
│   ├── movementtables/              ← Movement type scripts
│   │   └── EXAMPLE_MOVE.js          ← Example movement table template
│   ├── actions/                     ← Custom actions (optional)
│   ├── battleanimations/            ← Battle animations (optional)
│   ├── terrain/                     ← Terrain scripts (optional)
│   ├── cos/                         ← Commanding Officers (optional, not used)
│   ├── co_perks/                    ← CO perks (optional)
│   ├── gamerules/                   ← Game rules (optional)
│   └── general/                     ← Base class overrides (optional)
└── images/                          ← Image assets
    ├── units/                       ← Unit sprites
    ├── building/                    ← Building sprites
    ├── terrain/                     ← Terrain sprites
    ├── co/                          ← CO portraits (optional)
    ├── battleanimations/            ← Battle animation sprites (optional)
    └── game/                        ← UI sprites (optional)
```

## How to Add New Content

### 1. Add a New Unit

Copy `scripts/units/EXAMPLE_UNIT.js`, then modify:
- Filename to your unit ID (e.g., `MY_TANK.js`)
- Variable name inside (e.g., `EXAMPLE_UNIT` -> `MY_TANK`)
- Property values as needed

### 2. Add a New Weapon

Copy `scripts/weapons/EXAMPLE_WEAPON.js`, then modify:
- Filename to your weapon ID (e.g., `MY_CANNON.js`)
- Variable name inside (e.g., `EXAMPLE_WEAPON` -> `MY_CANNON`)
- Damage table entries

### 3. Add a New Building

Copy `scripts/building/EXAMPLE_BUILDING.js`, then modify:
- Filename to your building ID (e.g., `MY_FACTORY.js`)
- Variable name inside (e.g., `EXAMPLE_BUILDING` -> `MY_FACTORY`)
- Property values as needed

### 4. Batch-Define Weapons (Recommended for Many)

You can also use `weapons/weapontable.csv` for batch weapon definitions:

```csv
weaponid;weaponname;@custom;TARGET_UNIT_1;TARGET_UNIT_2;...
MY_WEAPON;My Weapon;this.getEnviromentDamage = function(enviromentId){return 10};100;50;...
```

## Sprite Requirements

- Unit sprites: `images/units/UNIT_ID.png` and `images/units/UNIT_ID+mask.png`
- Building sprites: `images/building/BUILDING_ID.png` and `images/building/BUILDING_ID+mask.png`
- Recommended size: 32x32 pixels (same as vanilla)

If no sprite is provided, the unit will appear transparent/blank.

## Important Notes

1. All IDs must be unique. Do not conflict with vanilla or other mods.
2. Recommended ID prefix: `MU_` (MoreUnits) to avoid conflicts.
3. No CO folder is required. This mod does not include Commanding Officers.
4. No actions folder is required unless you add custom actions.
5. No battleanimations folder is required unless you add custom battle animations.

## Modding Reference

For full engine documentation, see the `读我.txt` (Chinese) or the Commander Wars GitHub repository.

Key concepts:
- Scripts in mod folders override vanilla scripts with the same filename.
- `Constructor.prototype = UNIT` means your script extends the base UNIT class.
- `Constructor.prototype = WEAPON` means your script extends the base WEAPON class.
- `Constructor.prototype = BUILDING` means your script extends the base BUILDING class.
- `Constructor.prototype = MOVEMENTTABLE` means your script extends the base MOVEMENTTABLE class.

## Sky Weapons (Bolt Guard tab)

### Ghost Cannon
Four facings (N/S/E/W), like the vanilla MiniCannon it fires in a straight line
(range 4, damage 3) once per turn. Unlike the MiniCannon it floats on clouds:
**only air units and anti-air units can attack it** — fighters and bombers
included, ground and naval units cannot touch it. The restriction is enforced
for human players, the AI, and even weapons from other mods (any weapon whose
damage table can hit air units counts as anti-air).

Placement: **anywhere** - it floats, so plains, sea, mountains and even
pipes are all valid. The new **Ghost Platform** terrain (map editor:
Terrain -> Ghost Platform) is decorative: only air units can cross it.

### Black Arc
A 4x4 fortress with a blinking two-frame animation. Unlike the original it
**can be attacked and destroyed**: 100 HP, but only air units and anti-air
weapons can touch it (same rule as the Ghost Cannon), and its armor reduces
every hit to 75% damage. Once per turn it can
**bombard any tile on the whole map**: enemy units within range 3 of the target
tile lose 5 HP, and units at 0 HP are destroyed. Your own and allied units are
unaffected. The AI will use it automatically, aiming at the most valuable
enemy cluster.

Placement: **any terrain** - it flies. When destroyed it flashes white, shakes the screen and leaves a 4x4 field of
destroyed plains.
### Void
A fully transparent terrain that shows only the map background. **No unit can
enter it** - not even air units. The shared movement-table lookup treats it as
impassable, including for movement tables added by mods that use the standard
lookup helper. Useful for carving out sky regions on Black Arc themed maps. It
uses a distinct Black Arc icon in the editor/minimap so its placement is
identifiable even though the terrain itself is transparent.
