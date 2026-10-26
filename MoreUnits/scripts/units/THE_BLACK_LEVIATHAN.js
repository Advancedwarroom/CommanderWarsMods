var Constructor = function()
{
    this.init = function(unit)
    {
        unit.setFuel(60);
        unit.setMaxFuel(60);
        unit.setBaseMovementPoints(1);
        unit.setMinRange(1);
        unit.setMaxRange(1);
        unit.setVision(2);
        unit.setAmmo1(6);
        unit.setMaxAmmo1(6);
    };

    this.loadSprites = function(unit)
    {
        unit.loadSpriteV2("THE_BLACK_LEVIATHAN+mask", GameEnums.Recoloring_Matrix);
    };
    this.doWalkingAnimation = function(action, map)
    {
        var unit = action.getTargetUnit();
        var animation = GameAnimationFactory.createWalkingAnimation(map, unit, action);
        animation.loadSpriteV2("THE_BLACK_LEVIATHAN+walk+mask", GameEnums.Recoloring_Matrix, 1);
        animation.setSound("moveship.wav", -2);
        return animation;
    };
    this.getMovementType = function()
    {
        // MOVE_SHIP is used because the engine does not load custom
        // movement tables from mods (see MovementTableManager): sea,
        // lake, beach, harbour and fog cost 1 (1 MP -> one tile per turn),
        // rough sea and reefs stay out of reach at cost 2
        return "MOVE_SHIP";
    };
    this.getBaseCost = function()
    {
        return 20000;
    };
    this.getName = function()
    {
        return qsTr("The Black Leviathan");
    };
    this.getUnitDamageID = function(unit)
    {
        // naval defensive table so every weapon resolves damage against us
        return "CRUISER";
    };
    this.canMoveAndFire = function()
    {
        return true;
    };
    this.getDescription = function()
    {
        return qsTr("A Black Hole super weapon built to annihilate the allied forces. Creeps one tile per turn through sea, rivers and beaches. Its Devour action instantly destroys a single enemy unit within range 1-2; after devouring it stays in place and may not act again this turn. Can devour once per turn, six times in total.");
    };
    this.getUnitType = function()
    {
        return GameEnums.UnitType_Naval;
    };
    this.startOfTurn = function(unit, map)
    {
        try
        {
            // reset the once-per-turn devour flag
            var vars = unit.getVariables();
            var v = vars.getVariable("MU_LEVIATHAN_DEVOURED");
            if (v !== null && v !== undefined)
            {
                vars.deleteVariable("MU_LEVIATHAN_DEVOURED");
            }
        }
        catch (e)
        {
            // never let bookkeeping break the turn start
        }
    };
    this.getEditorPlacementSound = function()
    {
        return "moveship.wav";
    };
};

Constructor.prototype = UNIT;
var THE_BLACK_LEVIATHAN = new Constructor();
