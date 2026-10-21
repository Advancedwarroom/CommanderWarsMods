var Constructor = function()
{
    // Use own damage ID so weapons can have custom damage values
    this.getUnitDamageID = function(unit)
    {
        return "MU_EMPOWER_TERRAIN_EDITOR";
    };

    this.init = function(unit)
    {
        // Weapon 1: standard rifle (direct attack)
        unit.setAmmo1(6);
        unit.setMaxAmmo1(6);
        unit.setWeapon1ID("WEAPON_MU_ETA_RIFLE");

        // Ammo 2: empowerment charges (used by ACTION_MU_EMPOWER, not a weapon)
        unit.setAmmo2(7);
        unit.setMaxAmmo2(7);
        unit.setWeapon2ID("");

        // Fuel: 80/80
        unit.setFuel(80);
        unit.setMaxFuel(80);

        // Movement: 3 tiles (MOVE_FEET, same as INFANTRY)
        unit.setBaseMovementPoints(3);

        // Direct attack only (range 1)
        unit.setMinRange(1);
        unit.setMaxRange(1);

        // Fog of war vision: 2 (same as INFANTRY, mountains give bonus via terrain)
        unit.setVision(2);
    };

    this.initForMods = function(unit, map)
    {
    };

    this.loadSprites = function(unit)
    {
        unit.loadSpriteV2("MU_EMPOWER_TERRAIN_EDITOR+mask", GameEnums.Recoloring_Matrix);
        unit.loadSpriteV2("MU_EMPOWER_TERRAIN_EDITOR", GameEnums.Recoloring_None);
    };

    this.doWalkingAnimation = function(action, map)
    {
        var unit = action.getTargetUnit();
        var animation = GameAnimationFactory.createWalkingAnimation(map, unit, action);
        // No separate walk sprite; reuse the standing sprite for walking.
        animation.loadSpriteV2("MU_EMPOWER_TERRAIN_EDITOR+mask", GameEnums.Recoloring_Matrix, 1);
        animation.loadSpriteV2("MU_EMPOWER_TERRAIN_EDITOR", GameEnums.Recoloring_None, 1);
        animation.setSound("moveinfant.wav", -2);
        return animation;
    };

    this.getMovementType = function()
    {
        return "MOVE_FEET";
    };

    this.getBaseCost = function()
    {
        return 7000;
    };

    this.getName = function()
    {
        return qsTr("Empower Terrain Editor");
    };

    this.getDescription = function()
    {
        return qsTr("An infantry unit that can empower other units (range 0-2, 7 charges). Empowered units gain the ability to Place terrain (1000G, builds Forest/Road/Hill/River/Sea/Plains/Bridge on natural terrain tiles) and Mine pipes (3000G, destroys Pipe into Plains over 2 turns like capturing). Can attack with a rifle slightly stronger than standard infantry. Fuel 80/80, Rifle Ammo 6/6, Empower Ammo 7/7, Movement 3, Vision 2, Infantry (MOVE_FEET).");
    };

    this.canMoveAndFire = function()
    {
        return true;
    };

    this.getUnitType = function()
    {
        return GameEnums.UnitType_Infantry;
    };

    this.getTypeOfWeapon1 = function(unit)
    {
        return GameEnums.WeaponType_Direct;
    };

    this.getTypeOfWeapon2 = function(unit)
    {
        return GameEnums.WeaponType_Direct;
    };

    // Action list: Fire, Empower, Join, Load, Unload, Wait, CO units
    // Place and Mine are dynamically added by mu_system.js wrapper when empowered
    this.actionList = ["ACTION_FIRE", "ACTION_MU_EMPOWER", "ACTION_CAPTURE", "ACTION_JOIN", "ACTION_LOAD", "ACTION_UNLOAD", "ACTION_WAIT", "ACTION_CO_UNIT_0", "ACTION_CO_UNIT_1"];

    this.useTerrainDefense = function()
    {
        return true;
    };

    this.useTerrainHide = function()
    {
        return true;
    };

    this.startOfTurn = function(unit, map)
    {
        // Call UNIT.startOfTurn (wrapped by mu_system.js for mining progress and flag clearing).
        // Ground infantry units do NOT consume fuel in vanilla Commander Wars.
        if (typeof UNIT.startOfTurn === "function")
        {
            UNIT.startOfTurn.call(this, unit, map);
        }
    };

    this.getEditorPlacementSound = function()
    {
        return "moveinfant.wav";
    };
}

Constructor.prototype = UNIT;
var MU_EMPOWER_TERRAIN_EDITOR = new Constructor();

// Ensure persistent wrappers are installed.
// Unit scripts load after general/unit.js, so UNIT is guaranteed to exist.
if (typeof MU_SYSTEM !== "undefined" && MU_SYSTEM !== null)
{
    MU_SYSTEM.installWrappers();
    MU_SYSTEM.registerTransportUnits();
}
