var Constructor = function()
{
    this.init = function(unit)
    {
        unit.setFuel(70);
        unit.setMaxFuel(70);
        unit.setBaseMovementPoints(5);
        unit.setMinRange(1);
        unit.setMaxRange(1);
        unit.setVision(2);
        unit.setAmmo1(5);
        unit.setMaxAmmo1(5);
        unit.setWeapon1ID("WEAPON_MU_MICROWAVE");
    };

    this.loadSprites = function(unit)
    {
        unit.loadSpriteV2("MICROWAVE_VEHICLE+mask", GameEnums.Recoloring_Matrix);
    };
    this.doWalkingAnimation = function(action, map)
    {
        var unit = action.getTargetUnit();
        var animation = GameAnimationFactory.createWalkingAnimation(map, unit, action);
        animation.loadSpriteV2("MICROWAVE_VEHICLE+walk+mask", GameEnums.Recoloring_Matrix, 1);
        animation.setSound("movetank.wav", -2);
        return animation;
    };
    this.getMovementType = function()
    {
        return "MOVE_TANK";
    };
    this.getBaseCost = function()
    {
        return 14000;
    };
    this.actionList = ["ACTION_MU_ENERGIZE", "ACTION_WAIT"];
    this.getName = function()
    {
        return qsTr("Microwave Vehicle");
    };
    this.getUnitDamageID = function(unit)
    {
        try
        {
            // SUNNY: light-tank armour; any other weather: paper recon armour
            var map = unit.getMap();
            if (map.getGameRules().getCurrentWeather().getWeatherId() === "WEATHER_1SUN")
            {
                return "LIGHT_TANK";
            }
        }
        catch (e)
        {
            // fall through to the weak table
        }
        return "RECON";
    };
    this.canMoveAndFire = function()
    {
        return true;
    };
    this.getDescription = function()
    {
        return qsTr("An allied decisive-battle support unit that channels solar energy. In sunny weather its beam hits with heavy-tank attack power and its armour is light-tank class; in any other weather it only has light-tank attack and paper-thin recon armour. In sunny weather its Energize action can also restore 1 HP to a damaged allied unit within range 1-2 (no healing under other skies). Five shots per sortie.");
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
            var v = vars.getVariable("MU_ENERGIZED");
            if (v !== null && v !== undefined)
            {
                vars.deleteVariable("MU_ENERGIZED");
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
var MICROWAVE_VEHICLE = new Constructor();
