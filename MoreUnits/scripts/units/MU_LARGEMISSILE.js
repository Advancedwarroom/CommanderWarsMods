var Constructor = function()
{
    this.getUnitDamageID = function(unit)
    {
        return "ROCKETTHROWER";
    };

    this.init = function(unit)
    {
        unit.setAmmo1(3);
        unit.setMaxAmmo1(3);
        unit.setWeapon1ID("WEAPON_MU_LARGE_MISSILE");

        unit.setAmmo2(0);
        unit.setMaxAmmo2(0);
        unit.setWeapon2ID("");

        unit.setFuel(60);
        unit.setMaxFuel(60);
        unit.setBaseMovementPoints(6);
        unit.setMinRange(2);
        unit.setMaxRange(5);
        unit.setVision(3);
    };

    this.loadSprites = function(unit)
    {
        unit.loadSpriteV2("MU_LARGEMISSILE+mask", GameEnums.Recoloring_Matrix);
    };

    this.doWalkingAnimation = function(action, map)
    {
        var unit = action.getTargetUnit();
        var animation = GameAnimationFactory.createWalkingAnimation(map, unit, action);
        animation.loadSpriteV2("MU_LARGEMISSILE+walk+mask", GameEnums.Recoloring_Matrix, 1);
        animation.setSound("movetire.wav", -2);
        return animation;
    };

    this.getMovementType = function()
    {
        return "MOVE_TIRE_A";
    };

    this.getBaseCost = function()
    {
        return 25000;
    };

    this.getName = function()
    {
        return qsTr("Large Missile");
    };

    this.getDescription = function()
    {
        return qsTr("A heavy mobile missile launcher. Launches devastating AOE strikes at range 2-5. Deals fixed damage in a 0-3 tile radius: Enemies 5 HP, Allies 4 HP, Same-player 3 HP. Enemy special weapons 1 HP. Enemy buildings 1 HP, special weapon buildings 10 HP. Friendly units and buildings unaffected.");
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
        return GameEnums.WeaponType_Indirect;
    };

    this.getTypeOfWeapon2 = function(unit)
    {
        return GameEnums.WeaponType_Direct;
    };

    this.actionList = ["ACTION_MU_LAUNCH_MISSILE", "ACTION_JOIN", "ACTION_LOAD", "ACTION_WAIT"];

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
        if (typeof UNIT.startOfTurn === "function")
        {
            UNIT.startOfTurn.call(this, unit, map);
        }
        // Ground units do NOT consume fuel in vanilla Commander Wars.
        // MU_LARGEMISSILE is UnitType_Ground, so no fuel is deducted here.
    };

    this.getEditorPlacementSound = function()
    {
        return "movetire.wav";
    };
}

Constructor.prototype = UNIT;
var MU_LARGEMISSILE = new Constructor();

// Ensure persistent wrappers are installed.
// Unit scripts load after general/unit.js, so UNIT is guaranteed to exist.
if (typeof MU_SYSTEM !== "undefined" && MU_SYSTEM !== null)
{
    MU_SYSTEM.installWrappers();
    MU_SYSTEM.registerTransportUnits();
}
