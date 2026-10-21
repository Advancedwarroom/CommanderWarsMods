var Constructor = function()
{
    this.getMaxUnitCount = function()
    {
        return 5;
    };

    this.loadStandingAnimation = function(sprite, unit, defender, weapon)
    {
        sprite.loadSpriteV2("MU_WEAPON_CONSTRUCTOR+mask", GameEnums.Recoloring_Matrix, 5, Qt.point(0, 0));
    };

    this.loadStandingFiredAnimation = function(sprite, unit, defender, weapon)
    {
        sprite.loadSpriteV2("MU_WEAPON_CONSTRUCTOR+mask", GameEnums.Recoloring_Matrix, 5, Qt.point(0, 0));
    };

    this.loadFireAnimation = function(sprite, unit, defender, weapon)
    {
        sprite.loadSpriteV2("MU_WEAPON_CONSTRUCTOR+mask", GameEnums.Recoloring_Matrix, 5, Qt.point(0, 0));
        sprite.loadSound("cannon_weapon_fire.wav", 1, 0);
    };

    this.getFireDurationMS = function(sprite, unit, defender, weapon)
    {
        return 600;
    };

    this.loadImpactUnitOverlayAnimation = function(sprite, unit, defender, weapon)
    {
        sprite.loadColorOverlayForLastLoadedFrame("#969696", 1000, 1, 300);
    };

    this.loadImpactAnimation = function(sprite, unit, defender, weapon)
    {
        sprite.loadSprite("mg_hit", false, 1, Qt.point(0, 15), 2, 1.0, 0, 400, true);
        sprite.loadSound("mg_impact.wav", 1, 200);
    };

    this.getImpactDurationMS = function(sprite, unit, defender, weapon)
    {
        return 600;
    };
};

Constructor.prototype = BATTLEANIMATION;
var BATTLEANIMATION_MU_WEAPON_CONSTRUCTOR = new Constructor();
