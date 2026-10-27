var Constructor = function()
{
    this.init = function(unit)
    {
        unit.setFuel(70);
        unit.setMaxFuel(70);
        // same mobility as the Neo Tank
        unit.setBaseMovementPoints(6);
        unit.setMinRange(1);
        unit.setMaxRange(1);
        unit.setVision(2);
        // EMP charges, not a weapon: 7 uses in total
        unit.setAmmo1(7);
        unit.setMaxAmmo1(7);
    };

    this.loadSprites = function(unit)
    {
        unit.loadSpriteV2("MATRIX_CAR+mask", GameEnums.Recoloring_Matrix);
    };
    this.doWalkingAnimation = function(action, map)
    {
        var unit = action.getTargetUnit();
        var animation = GameAnimationFactory.createWalkingAnimation(map, unit, action);
        animation.loadSpriteV2("MATRIX_CAR+walk+mask", GameEnums.Recoloring_Matrix, 1);
        animation.setSound("movetank.wav", -2);
        return animation;
    };
    this.getMovementType = function()
    {
        return "MOVE_TANK";
    };
    this.getBaseCost = function()
    {
        return 16000;
    };
    this.actionList = ["ACTION_MU_EMP", "ACTION_WAIT"];
    this.getName = function()
    {
        return qsTr("Matrix Car");
    };
    this.getUnitDamageID = function(unit)
    {
        // alias to the light tank so every existing weapon table resolves
        // damage against us (otherwise no weapon can attack this unit)
        return "LIGHT_TANK";
    };
    this.canMoveAndFire = function()
    {
        return true;
    };
    this.getDescription = function()
    {
        return qsTr("A Black Hole support vehicle. Cannot attack. Its EMP action targets an adjacent enemy unit (range 1): the victim deals no damage but is locked down exactly like Von Bolt's lightning - treated as already moved - and misses its next turn. One EMP per turn, seven charges in total. Friendly units are never affected.");
    };
    this.getUnitType = function()
    {
        return GameEnums.UnitType_Ground;
    };
    this.startOfTurn = function(unit, map)
    {
        try
        {
            // reset the once-per-turn EMP flag
            var vars = unit.getVariables();
            var v = vars.getVariable("MU_EMP_USED");
            if (v !== null && v !== undefined)
            {
                vars.deleteVariable("MU_EMP_USED");
            }
        }
        catch (e)
        {
            // never let bookkeeping break the turn start
        }
    };
    this.getEditorPlacementSound = function()
    {
        return "movetank.wav";
    };
};

Constructor.prototype = UNIT;
var MATRIX_CAR = new Constructor();
