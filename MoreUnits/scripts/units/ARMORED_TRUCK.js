var Constructor = function()
{
    this.init = function(unit)
    {
        unit.setFuel(70);
        unit.setMaxFuel(70);
        unit.setBaseMovementPoints(6);
        unit.setMinRange(1);
        unit.setMaxRange(1);
        unit.setVision(2);
        // no weapons: the truck earns by arming others
    };

    this.loadSprites = function(unit)
    {
        unit.loadSpriteV2("ARMORED_TRUCK+mask", GameEnums.Recoloring_Matrix);
    };
    this.doWalkingAnimation = function(action, map)
    {
        var unit = action.getTargetUnit();
        var animation = GameAnimationFactory.createWalkingAnimation(map, unit, action);
        animation.loadSpriteV2("ARMORED_TRUCK+walk+mask", GameEnums.Recoloring_Matrix, 1);
        animation.setSound("movetank.wav", -2);
        return animation;
    };
    this.getMovementType = function()
    {
        return "MOVE_TIRE_A";
    };
    this.getBaseCost = function()
    {
        return 12000;
    };
    this.getName = function()
    {
        return qsTr("Armored Truck");
    };
    this.getUnitDamageID = function(unit)
    {
        return "LIGHT_TANK";
    };
    this.canMoveAndFire = function()
    {
        return true;
    };
    this.getDescription = function()
    {
        return qsTr("An allied bank on wheels. Cannot attack. Its Armor action arms a friendly unit within range 1-2 (never itself): whenever the armored unit loses HP - attacking, being attacked or trading fire with weapon buildings like Black Cannons - 75% of the lost HP's value is paid into your funds. The truck itself earns nothing unless two trucks armor each other. One Armor per turn, unlimited charges.");
    };
    this.getUnitType = function()
    {
        return GameEnums.UnitType_Ground;
    };
    this.startOfTurn = function(unit, map)
    {
        try
        {
            var vars = unit.getVariables();
            var v = vars.getVariable("MU_ARMOR_USED");
            if (v !== null && v !== undefined)
            {
                vars.deleteVariable("MU_ARMOR_USED");
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
var ARMORED_TRUCK = new Constructor();
