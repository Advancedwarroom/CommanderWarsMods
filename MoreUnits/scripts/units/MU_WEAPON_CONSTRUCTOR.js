var Constructor = function()
{
    this.getUnitDamageID = function(unit)
    {
        return "MU_WEAPON_CONSTRUCTOR";
    };

    this.init = function(unit)
    {
        // Weapon 1: direct-fire cannon (slightly stronger than recon, weaker than AA)
        unit.setAmmo1(6);
        unit.setMaxAmmo1(6);
        unit.setWeapon1ID("WEAPON_MU_WC_CANNON");

        // Ammo 2: construction charges (used by Set and Fix actions)
        unit.setAmmo2(2);
        unit.setMaxAmmo2(2);

        unit.setWeapon2ID("");

        // Fuel: 70/70
        unit.setFuel(70);
        unit.setMaxFuel(70);

        // Movement: 5 tiles (MOVE_TANK / Treads)
        unit.setBaseMovementPoints(5);

        // Direct attack only (range 1)
        unit.setMinRange(1);
        unit.setMaxRange(1);

        // Fog of war vision: 2
        unit.setVision(2);
    };

    this.loadSprites = function(unit)
    {
        unit.loadSpriteV2("MU_WEAPON_CONSTRUCTOR+mask", GameEnums.Recoloring_Matrix);
    };

    this.doWalkingAnimation = function(action, map)
    {
        var unit = action.getTargetUnit();
        var animation = GameAnimationFactory.createWalkingAnimation(map, unit, action);
        animation.loadSpriteV2("MU_WEAPON_CONSTRUCTOR+walk+mask", GameEnums.Recoloring_Matrix, 1);
        animation.setSound("movetank.wav", -2);
        return animation;
    };

    this.getMovementType = function()
    {
        return "MOVE_TANK";
    };

    this.getBaseCost = function()
    {
        return 28000;
    };

    this.getName = function()
    {
        return qsTr("Weapon Constructor");
    };

    this.getDescription = function()
    {
        return qsTr("A tread-based vehicle that can construct stationary weapons. Set: builds Crystal (15000G), MiniCannon (20000G), or LaserCannon (20000G) on adjacent Plains/Forest/Road/Hill. Construction takes 3 turns. Fix: synthesizes 4 same-type same-faction weapons in a 2x2 pattern into a larger weapon (4 MiniCannon->Black Cannon 8000G, 4 LaserCannon->Death Ray 25000G, 4 Crystal->Black Obelisk 5000G). Synthesis takes 4 turns. Each Set or Fix consumes 1 construction ammo. Large weapons turn tiles to Plains when destroyed. Fuel 70/70, Cannon Ammo 6/6, Construction Ammo 2/2, Movement 5, Vision 2, Treads.");
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

    this.actionList = ["ACTION_FIRE", "ACTION_MU_SET_WEAPON", "ACTION_MU_FIX_WEAPON", "ACTION_JOIN", "ACTION_LOAD", "ACTION_WAIT", "ACTION_CO_UNIT_0", "ACTION_CO_UNIT_1"];

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
        if (typeof UNIT.startOfTurn === "function")
        {
            UNIT.startOfTurn.call(this, unit, map);
        }
    };

    this.getEditorPlacementSound = function()
    {
        return "movetank.wav";
    };
}

Constructor.prototype = UNIT;
var MU_WEAPON_CONSTRUCTOR = new Constructor();

if (typeof MU_SYSTEM !== "undefined" && MU_SYSTEM !== null)
{
    MU_SYSTEM.installWrappers();
    MU_SYSTEM.registerTransportUnits();
}
