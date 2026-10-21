var Constructor = function()
{
    this.getUnitDamageID = function(unit)
    {
        return "THE_GREAT_OWL";
    };

    this.init = function(unit)
    {
        unit.setAmmo1(9);
        unit.setMaxAmmo1(9);
        unit.setWeapon1ID("");

        unit.setAmmo2(0);
        unit.setMaxAmmo2(0);
        unit.setWeapon2ID("");

        unit.setVisionHigh(999);
        unit.setFuel(99);
        unit.setMaxFuel(99);

        unit.setBaseMovementPoints(5);
        unit.setMinRange(1);
        unit.setMaxRange(1);
        unit.setVision(3);
    };

    this.loadSprites = function(unit)
    {
        unit.loadSpriteV2("THE_GREAT_OWL+mask", GameEnums.Recoloring_Matrix);
    };

    this.doWalkingAnimation = function(action, map)
    {
        var unit = action.getTargetUnit();
        var animation = GameAnimationFactory.createWalkingAnimation(map, unit, action);
        animation.loadSpriteV2("THE_GREAT_OWL+walk+mask", GameEnums.Recoloring_Matrix, 1);
        animation.setSound("moveair.wav", -2);
        return animation;
    };

    this.getMovementType = function()
    {
        return "MOVE_AIR";
    };

    this.getBaseCost = function()
    {
        return 50000;
    };

    this.getName = function()
    {
        return qsTr("The Great Owl");
    };

    this.getDescription = function()
    {
        return qsTr("<r>IDS ultimate strategic bomber - The Great Owl. Cannot attack directly. Each turn can choose </r><div c='#00ff00'>Fly Up</div><r> to enter high-altitude stealth invulnerable state (fuel 4/turn), or execute </r><div c='#ff8800'>Bombing</div><r> (self-centered range 1-3, 3 HP fixed damage to ALL units except self), or spend 20000G for </r><div c='#ff0000'>Air Raid</div><r> (any tile on map as center, range 1-2, 5 HP fixed damage). Before flying up, anti-air damage is slightly lower than against normal bombers.</r>");
    };

    this.startOfTurn = function(unit, map)
    {
        if (unit.getTerrain() !== null)
        {
            var fuelCosts = 2;
            if (unit.getHidden())
            {
                fuelCosts = 4;
            }
            fuelCosts = fuelCosts + unit.getFuelCostModifier(Qt.point(unit.getX(), unit.getY()), fuelCosts);
            if (fuelCosts < 0)
            {
                fuelCosts = 0;
            }
            unit.setFuel(unit.getFuel() - fuelCosts);
        }

        var unitVars = unit.getVariables();
        var flewVar = unitVars.getVariable("TGO_FLEW_UP_THIS_TURN");
        if (flewVar !== null)
        {
            unitVars.deleteVariable("TGO_FLEW_UP_THIS_TURN");
        }
    };

    this.createExplosionAnimation = function(x, y, unit, map)
    {
        var animation = GameAnimationFactory.createAnimation(map, x, y);
        animation.addSprite("explosion+air", -map.getImageSize() / 2, -map.getImageSize(), 0, 2);
        animation.setSound("explosion+air.wav");
        return animation;
    };

    this.canMoveAndFire = function()
    {
        return false;
    };

    this.useTerrainDefense = function()
    {
        return false;
    };

    this.useTerrainHide = function()
    {
        return false;
    };

    this.getTerrainAnimationBase = function(unit, terrain, defender, map)
    {
        var weatherModifier = TERRAIN.getWeatherModifier(map);
        return "base_" + weatherModifier + "air";
    };

    this.getTerrainAnimationForeground = function(unit, terrain, defender, map)
    {
        return "";
    };

    this.getTerrainAnimationBackground = function(unit, terrain, defender, map)
    {
        return "";
    };

    this.getTerrainAnimationMoveSpeed = function()
    {
        return 1;
    };

    this.getUnitType = function()
    {
        return GameEnums.UnitType_Air;
    };

    this.getEditorPlacementSound = function()
    {
        return "moveair.wav";
    };

    this.actionList = ["ACTION_TGO_FLY_UP", "ACTION_TGO_FLY_DOWN", "ACTION_TGO_BOMBING", "ACTION_TGO_AIR_RAID", "ACTION_WAIT", "ACTION_CO_UNIT_0", "ACTION_CO_UNIT_1"];

    this.getBonusDefensive = function(unit, position, attacker, atkPosition, isAttacker, luckMode)
    {
        if (unit.getHidden())
        {
            return 999;
        }
        return 15;
    };
};

Constructor.prototype = UNIT;
var THE_GREAT_OWL = new Constructor();

if (typeof MU_SYSTEM !== "undefined" && MU_SYSTEM !== null)
{
    MU_SYSTEM.installWrappers();
    MU_SYSTEM.registerTransportUnits();
}
