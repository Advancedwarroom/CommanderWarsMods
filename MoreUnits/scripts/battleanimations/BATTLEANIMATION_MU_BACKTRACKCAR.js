var Constructor = function()
{
    this.getMaxUnitCount = function()
    {
        return 1;
    };

    this.loadStandingAnimation = function(sprite, unit, defender, weapon)
    {
        sprite.loadSpriteV2("MU_BACKTRACKCAR+mask", GameEnums.Recoloring_Matrix, 1, Qt.point(0, 0));
        sprite.loadSpriteV2("MU_BACKTRACKCAR", GameEnums.Recoloring_None, 1, Qt.point(0, 0));
        BATTLEANIMATION.loadSpotterOrCoMini(sprite, unit, true);
    };

    this.loadStandingFiredAnimation = function(sprite, unit, defender, weapon)
    {
        sprite.loadSpriteV2("MU_BACKTRACKCAR+mask", GameEnums.Recoloring_Matrix, 1, Qt.point(0, 0));
        sprite.loadSpriteV2("MU_BACKTRACKCAR", GameEnums.Recoloring_None, 1, Qt.point(0, 0));
        BATTLEANIMATION.loadSpotterOrCoMini(sprite, unit, true);
    };

    this.loadFireAnimation = function(sprite, unit, defender, weapon)
    {
        sprite.loadSpriteV2("MU_BACKTRACKCAR+mask", GameEnums.Recoloring_Matrix, 1, Qt.point(0, 0));
        sprite.loadSpriteV2("MU_BACKTRACKCAR", GameEnums.Recoloring_None, 1, Qt.point(0, 0));
        BATTLEANIMATION.loadSpotterOrCoMini(sprite, unit, true);
    };

    this.getFireDurationMS = function(sprite, unit, defender, weapon)
    {
        return 800;
    };

    this.loadImpactUnitOverlayAnimation = function(sprite, unit, defender, weapon)
    {
        sprite.loadColorOverlayForLastLoadedFrame("#969696", 1000, 1, 300);
    };

    this.loadImpactAnimation = function(sprite, unit, defender, weapon)
    {
        sprite.loadSprite("rocket_hit", false, 1, Qt.point(0, 20), 1, 1.0, 0, 400, true);
        sprite.addSpriteScreenshake(8, 0.95, 800, 500);
        sprite.loadSound("rockets_explode.wav", 1, 200);
    };

    this.getImpactDurationMS = function(sprite, unit, defender, weapon)
    {
        return 800;
    };
};

Constructor.prototype = BATTLEANIMATION;
var BATTLEANIMATION_MU_BACKTRACKCAR = new Constructor();
