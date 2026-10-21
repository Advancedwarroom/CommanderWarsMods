var Constructor = function()
{
    // Use own damage ID so weapons can have custom damage values
    this.getUnitDamageID = function(unit)
    {
        return "MU_PIPETHINKER";
    };

    this.init = function(unit)
    {
        // No weapons — PipeThinker cannot attack or counterattack.
        // Ammo1 is consumed by the Talk action (4 uses).
        unit.setAmmo1(4);
        unit.setMaxAmmo1(4);
        unit.setWeapon1ID("");

        unit.setAmmo2(0);
        unit.setMaxAmmo2(0);
        unit.setWeapon2ID("");

        // Fuel: 60/60 (ground units do not consume fuel in vanilla)
        unit.setFuel(60);
        unit.setMaxFuel(60);

        // Movement: 7 tiles (MOVE_PIPERUNNER)
        unit.setBaseMovementPoints(7);

        // Talk range: 1-3 (used by ACTION_MU_TALK, not for combat)
        unit.setMinRange(1);
        unit.setMaxRange(3);

        // Fog of war vision: 2
        unit.setVision(2);
    };

    this.initForMods = function(unit, map)
    {
    };

    this.loadSprites = function(unit)
    {
        unit.loadSpriteV2("MU_PIPETHINKER+mask", GameEnums.Recoloring_Matrix);
    };

    this.doWalkingAnimation = function(action, map)
    {
        var unit = action.getTargetUnit();
        var animation = GameAnimationFactory.createWalkingAnimation(map, unit, action);
        animation.loadSpriteV2("MU_PIPETHINKER+mask", GameEnums.Recoloring_Matrix, 1);
        animation.setSound("move pipe.wav", -2);
        return animation;
    };

    this.getMovementType = function()
    {
        return "MOVE_PIPERUNNER";
    };

    this.getBaseCost = function()
    {
        return 35000;
    };

    this.getName = function()
    {
        return qsTr("PipeThinker");
    };

    this.getDescription = function()
    {
        return qsTr("A pipe-mounted thinking unit. Select an enemy unit within range 1-3 and Talk to convert it. Requires 2 consecutive turns (10 progress per turn, 20 to complete). If you miss a turn, progress is lost. Target movement does not break the link. Converted unit changes ownership (HP unchanged) and can act next turn. Each PipeThinker can only talk to 1 target at a time. Talk consumes 1 ammo per use. Cannot attack or counterattack. Cost 35000, Fuel 60/60, Ammo 4/4, Movement 7, Vision 2, Piperunner.");
    };

    this.canMoveAndFire = function()
    {
        return true;
    };

    this.getUnitType = function()
    {
        // GameEnums.PIPE_WEAPON places this unit in the "Pipe Weapon"
        // editor category alongside PIPERUNNER and PipeBin.
        return GameEnums.PIPE_WEAPON;
    };

    this.getTypeOfWeapon1 = function(unit)
    {
        // No weapon — return Indirect as a safety measure to prevent
        // any counterattack if the engine somehow queries this.
        return GameEnums.WeaponType_Indirect;
    };

    this.getTypeOfWeapon2 = function(unit)
    {
        return GameEnums.WeaponType_Indirect;
    };

    // Action list: Talk (convert), Join, Load, Wait
    this.actionList = ["ACTION_MU_TALK", "ACTION_JOIN", "ACTION_LOAD", "ACTION_WAIT"];

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
        // Call UNIT.startOfTurn (wrapped by mu_system.js for flag clearing,
        // healing detection, and bad debuff processing).
        if (typeof UNIT.startOfTurn === "function")
        {
            UNIT.startOfTurn.call(this, unit, map);
        }

        // Ground units do NOT consume fuel in vanilla Commander Wars.

        // ============================================================
        // PipeThinker talk progress gap detection:
        // If the unit has talk progress but did NOT talk last turn
        // (MU_TALK_ACTIVE is false), the progress is lost.
        //
        // How it works:
        //   - When Talk is performed: MU_TALK_ACTIVE = true
        //   - At startOfTurn: if MU_TALK_ACTIVE is true, set it to false
        //     (progress survives — talk was done last turn)
        //   - At next startOfTurn: if MU_TALK_ACTIVE is still false
        //     (talk was NOT done this turn), clear all progress
        // ============================================================
        try
        {
            var unitVars = unit.getVariables();
            var progressVar = unitVars.getVariable("MU_TALK_PROGRESS");
            if (progressVar !== null && progressVar.readDataInt32() > 0)
            {
                var activeVar = unitVars.getVariable("MU_TALK_ACTIVE");
                if (activeVar !== null && activeVar.readDataBool() === true)
                {
                    // Talk was performed last turn — keep progress
                    activeVar.writeDataBool(false);
                }
                else
                {
                    // Talk was NOT performed last turn — clear progress
                    unitVars.deleteVariable("MU_TALK_PROGRESS");
                    unitVars.deleteVariable("MU_TALK_TARGET_TYPE");
                    unitVars.deleteVariable("MU_TALK_TARGET_OWNER");
                    unitVars.deleteVariable("MU_TALK_ACTIVE");
                }
            }
        }
        catch (e) {}
    };

    this.getEditorPlacementSound = function()
    {
        return "move pipe.wav";
    };
};

Constructor.prototype = UNIT;
var MU_PIPETHINKER = new Constructor();

// Ensure persistent wrappers are installed.
// Unit scripts load after general/unit.js, so UNIT is guaranteed to exist.
if (typeof MU_SYSTEM !== "undefined" && MU_SYSTEM !== null)
{
    MU_SYSTEM.installWrappers();
    MU_SYSTEM.registerTransportUnits();
}
