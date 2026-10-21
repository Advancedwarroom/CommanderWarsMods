var Constructor = function()
{
    this.canBePerformed = function(action, map)
    {
        var unit = action.getTargetUnit();
        var actionTargetField = action.getActionTarget();
        var targetField = action.getTarget();
        if (ACTION.isEmptyFieldAndHasNotMoved(action, unit, actionTargetField, targetField, map))
        {
            if (unit.getHidden() === false)
            {
                return true;
            }
        }
        return false;
    };

    this.getActionText = function(map)
    {
        return qsTr("Fly Up");
    };

    this.getIcon = function(map)
    {
        return "dive";
    };

    this.isFinalStep = function(action, map)
    {
        return true;
    };

    this.perform = function(action, map)
    {
        var unit = action.getTargetUnit();
        var animation = Global[unit.getUnitID()].doWalkingAnimation(action, map);
        animation.setEndOfAnimationCall("ACTION_TGO_FLY_UP", "performPostAnimation");
        Global[unit.getUnitID()].moveUnit(unit, action, map);
        ACTION_TGO_FLY_UP.postAnimationUnit = unit;
    };

    this.postAnimationUnit = null;

    this.performPostAnimation = function(action, map)
    {
        var unit = ACTION_TGO_FLY_UP.postAnimationUnit;
        if (unit !== null)
        {
            var anim = GameAnimationFactory.createAnimation(map, unit.getX(), unit.getY());
            anim.addSprite("stealth", -map.getImageSize() / 2, -map.getImageSize() / 2, 0, 2);
            anim.setSound("stealth.wav", 1);

            unit.setHidden(true);
            unit.setHasMoved(true);

            var unitVars = unit.getVariables();
            unitVars.createVariable("TGO_FLEW_UP_THIS_TURN").writeDataBool(true);
        }
        ACTION_TGO_FLY_UP.postAnimationUnit = null;
    };

    this.getName = function()
    {
        return qsTr("Fly Up");
    };

    this.getDescription = function()
    {
        return qsTr("Fly to ultra-high altitude. The unit becomes stealthed and invulnerable to all attacks. Consumes 4 fuel per turn while elevated. Ends the turn.");
    };
};

Constructor.prototype = ACTION;
var ACTION_TGO_FLY_UP = new Constructor();
