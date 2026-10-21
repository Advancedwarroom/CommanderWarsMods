var Constructor = function()
{
    this.getUnitDamageID = function(unit)
    {
        return "THE_BLACK_ONYX";
    };

    this.init = function(unit)
    {
        unit.setAmmo1(0);
        unit.setMaxAmmo1(0);
        unit.setWeapon1ID("");

        unit.setAmmo2(0);
        unit.setMaxAmmo2(0);
        unit.setWeapon2ID("");

        unit.setFuel(90);
        unit.setMaxFuel(90);

        unit.setBaseMovementPoints(9);
        unit.setMinRange(1);
        unit.setMaxRange(1);
        unit.setVision(4);
    };

    this.loadSprites = function(unit)
    {
        unit.loadSpriteV2("THE_BLACK_ONYX+mask", GameEnums.Recoloring_Matrix);
    };

    this.doWalkingAnimation = function(action, map)
    {
        var unit = action.getTargetUnit();
        var animation = GameAnimationFactory.createWalkingAnimation(map, unit, action);
        animation.loadSpriteV2("THE_BLACK_ONYX+walk+mask", GameEnums.Recoloring_Matrix, 1);
        animation.setSound("moveair.wav", -2);
        return animation;
    };

    this.getMovementType = function()
    {
        return "MOVE_HOELLIUM";
    };

    this.getBaseCost = function()
    {
        return 70000;
    };

    this.getName = function()
    {
        return qsTr("The Black Onyx");
    };

    this.getDescription = function()
    {
        return qsTr("<r>IDS ultimate orbital battle satellite - The Black Onyx. Located 22,000 miles above Earth, no conventional anti-air unit can reach it. Cannot attack directly and cannot be damaged by any conventional unit (all weapons deal 0 damage). Visible on radar at all times (not stealthed). Can </r><div c='#00ff00'>Forcefield</div><r> any tile within range 2-4: all units/weapons on that tile take only 30% damage from conventional attacks (including counterattacks) for the turn. Sustaining the SAME tile for 10 consecutive turns grants </r><div c='#ff0000'>Unbreakable</div><r> (permanent forcefield, 0 damage). If a tile is NOT renewed for more than 1 turn, the streak resets. Can </r><div c='#ff8800'>BreakField</div><r> to cancel any forcefield within range 2-4. Fuel 90/90, consumes 5/turn. Movement 9 (Oozium - 1 on all terrains). Vision 4. Built at Airport. Cost 70000.");
    };

    this.canMoveAndFire = function()
    {
        return false;
    };

    this.getUnitType = function()
    {
        return GameEnums.UnitType_Air;
    };

    this.getTypeOfWeapon1 = function(unit)
    {
        return GameEnums.WeaponType_None;
    };

    this.getTypeOfWeapon2 = function(unit)
    {
        return GameEnums.WeaponType_None;
    };

    this.actionList = ["ACTION_BOS_FORCEFIELD", "ACTION_BOS_BREAKFIELD", "ACTION_WAIT", "ACTION_CO_UNIT_0", "ACTION_CO_UNIT_1"];

    this.buildingList = ["AIRPORT"];

    this.useTerrainDefense = function()
    {
        return false;
    };

    this.useTerrainHide = function()
    {
        return false;
    };

    this.getWeatherImmune = function(unit, map)
    {
        return true;
    };

    this.startOfTurn = function(unit, map)
    {
        if (unit.getTerrain() !== null)
        {
            var fuelCosts = 5 + unit.getFuelCostModifier(Qt.point(unit.getX(), unit.getY()), 5);
            if (fuelCosts < 0)
            {
                fuelCosts = 0;
            }
            unit.setFuel(unit.getFuel() - fuelCosts);
        }

        // ============================================================
        // Clear temporary forcefields placed by this Black Onyx last turn.
        // Unbreakable fields are NOT cleared.
        // ============================================================
        var unitVars = unit.getVariables();
        var myFieldsVar = unitVars.getVariable("BOS_MY_FIELDS");
        if (myFieldsVar !== null)
        {
            var fieldsStr = myFieldsVar.readDataString();
            if (fieldsStr !== null && fieldsStr !== "")
            {
                var fields = fieldsStr.split(";");
                for (var i = 0; i < fields.length; i++)
                {
                    var parts = fields[i].split(",");
                    if (parts.length === 2)
                    {
                        var fx = parseInt(parts[0]);
                        var fy = parseInt(parts[1]);
                        if (map.onMap(fx, fy))
                        {
                            var fterrain = map.getTerrain(fx, fy);
                            var fVars = fterrain.getVariables();
                            var unbVar = fVars.getVariable("BOS_UNBREAKABLE");
                            if (unbVar === null || unbVar.readDataBool() !== true)
                            {
                                // Only clear the temporary active flag.
                                // BOS_FORCEFIELD_COUNT and BOS_FORCEFIELD_LAST_TURN
                                // are preserved so the streak survives across turns.
                                fVars.deleteVariable("BOS_FORCEFIELD");
                                fVars.deleteVariable("BOS_FORCEFIELD_TURNS");
                            }
                        }
                    }
                }
            }
            unitVars.deleteVariable("BOS_MY_FIELDS");
        }
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

    this.getEditorPlacementSound = function()
    {
        return "moveair.wav";
    };

    this.createExplosionAnimation = function(x, y, unit, map)
    {
        var animation = GameAnimationFactory.createAnimation(map, x, y);
        animation.addSprite("explosion+air", -map.getImageSize() / 2, -map.getImageSize(), 0, 2);
        animation.setSound("explosion+air.wav");
        return animation;
    };
};

Constructor.prototype = UNIT;
var THE_BLACK_ONYX = new Constructor();

if (typeof MU_SYSTEM !== "undefined" && MU_SYSTEM !== null)
{
    MU_SYSTEM.installWrappers();
    MU_SYSTEM.registerTransportUnits();
}
