var Constructor = function()
{
    this.canBePerformed = function(action, map)
    {
        var unit = action.getTargetUnit();
        var actionTargetField = action.getActionTarget();
        var targetField = action.getTarget();
        if (ACTION.isEmptyFieldAndHasNotMoved(action, unit, actionTargetField, targetField, map))
        {
            if (unit.getHidden() === true)
            {
                return true;
            }
        }
        return false;
    };

    this.getActionText = function(map)
    {
        return qsTr("Fly Down");
    };

    this.getIcon = function(map)
    {
        return "unhide";
    };

    this.isFinalStep = function(action, map)
    {
        return true;
    };

    this.perform = function(action, map)
    {
        var unit = action.getTargetUnit();
        var animation = Global[unit.getUnitID()].doWalkingAnimation(action, map);
        animation.setEndOfAnimationCall("ACTION_TGO_FLY_DOWN", "performPostAnimation");
        Global[unit.getUnitID()].moveUnit(unit, action, map);
        ACTION_TGO_FLY_DOWN.postAnimationUnit = unit;
    };

    this.postAnimationUnit = null;

    this.performPostAnimation = function(action, map)
    {
        var unit = ACTION_TGO_FLY_DOWN.postAnimationUnit;
        if (unit !== null)
        {
            var anim = GameAnimationFactory.createAnimation(map, unit.getX(), unit.getY());
            anim.addSprite("stealth", -map.getImageSize() / 2, -map.getImageSize() / 2, 0, 2);
            anim.setSound("unstealth.wav", 1);

            unit.setHidden(false);
            unit.setHasMoved(true);
        }
        ACTION_TGO_FLY_DOWN.postAnimationUnit = null;
    };

    this.getName = function()
    {
        return qsTr("Fly Down");
    };

    this.getDescription = function()
    {
        return qsTr("Descend from ultra-high altitude. The unit becomes visible and vulnerable again. Ends the turn.");
    };
};

Constructor.prototype = ACTION;
var ACTION_TGO_FLY_DOWN = new Constructor();
