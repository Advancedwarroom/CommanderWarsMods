var Constructor = function()
{
    // Use MU_BACKTRACKCAR as damage ID so weapon tables can target it
    this.getUnitDamageID = function(unit)
    {
        return "MU_BACKTRACKCAR";
    };

    this.init = function(unit)
    {
        // Resurrection ammo (4 uses)
        unit.setAmmo1(4);
        unit.setMaxAmmo1(4);
        unit.setWeapon1ID("WEAPON_MU_BACKTRACKCAR");

        // No secondary weapon
        unit.setAmmo2(0);
        unit.setMaxAmmo2(0);
        unit.setWeapon2ID("");

        // Fuel: 40/40
        unit.setFuel(40);
        unit.setMaxFuel(40);

        // Movement: 3 tiles
        unit.setBaseMovementPoints(3);

        // No attack range (cannot attack)
        unit.setMinRange(1);
        unit.setMaxRange(1);

        // Fog of war vision: 1 tile
        unit.setVision(1);
    };

    this.loadSprites = function(unit)
    {
        unit.loadSpriteV2("MU_BACKTRACKCAR+mask", GameEnums.Recoloring_Matrix);
    };

    this.doWalkingAnimation = function(action, map)
    {
        var unit = action.getTargetUnit();
        var animation = GameAnimationFactory.createWalkingAnimation(map, unit, action);
        animation.loadSpriteV2("MU_BACKTRACKCAR+walk+mask", GameEnums.Recoloring_Matrix, 1);
        animation.setSound("movetank.wav", -2);
        return animation;
    };

    this.getMovementType = function()
    {
        return "MOVE_TANK";
    };

    this.getBaseCost = function()
    {
        return 30000;
    };

    this.getName = function()
    {
        return qsTr("BackTrack Car");
    };

    this.getDescription = function()
    {
        return qsTr("A time-manipulation vehicle that can resurrect fallen units. Cannot attack. Use the Resurrection action to revive dead units on adjacent tiles (range 1). Resurrected units start at 50% HP and cost 25% of their original production cost. Can resurrect any unit type except special weapons (DeathRay, etc.). Choose ownership mode: Original Owner (returns to its former army) or Self Owner (joins your army). Fuel 40/40, Resurrection Ammo 4/4, Movement 3, Vision 1, Treads.");
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
        return GameEnums.WeaponType_Direct;
    };

    this.getTypeOfWeapon2 = function(unit)
    {
        return GameEnums.WeaponType_Direct;
    };

    // Action list: Resurrection, Join, Wait (no ACTION_FIRE)
    this.actionList = ["ACTION_MU_RESURRECTION", "ACTION_JOIN", "ACTION_LOAD", "ACTION_WAIT"];

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
        // Call UNIT.startOfTurn (wrapped by mu_system.js to clear the MU_PROTECTED flag).
        // Note: vanilla UNIT.startOfTurn is null, so this only runs the mu_system wrapper
        // which clears MU_PROTECTED. We do NOT call any fuel-deduction logic here.
        if (typeof UNIT.startOfTurn === "function")
        {
            UNIT.startOfTurn.call(this, unit, map);
        }
        // Ground units do NOT consume fuel in vanilla Commander Wars.
        // BackTrackCar is UnitType_Ground, same as LIGHT_TANK / INFANTRY which have
        // no startOfTurn at all. Previously this deducted (1 + CO fuel modifier) fuel
        // every turn, slowly draining the 40-fuel tank until it hit negative values,
        // at which point GameMap::checkFuel() called killUnit() — appearing as
        // "sudden self-destruction after resurrecting". Removing the drain fixes this.
    };

    this.getEditorPlacementSound = function()
    {
        return "movetank.wav";
    };
}

Constructor.prototype = UNIT;
var MU_BACKTRACKCAR = new Constructor();

// Ensure persistent wrappers are installed.
// Unit scripts load after general/unit.js, so UNIT is guaranteed to exist.
if (typeof MU_SYSTEM !== "undefined" && MU_SYSTEM !== null)
{
    MU_SYSTEM.installWrappers();
    MU_SYSTEM.registerTransportUnits();
}
