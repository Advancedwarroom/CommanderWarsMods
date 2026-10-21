var Constructor = function()
{
    this.getMaxUnitCount = function()
    {
        return 1;
    };

    this.loadStandingAnimation = function(sprite, unit, defender, weapon)
    {
        sprite.loadSpriteV2("THE_GREAT_OWL+mask", GameEnums.Recoloring_Matrix, 1, Qt.point(25, 30), 1, 2.0, 0, 0, false, false, 30);
        sprite.loadSpriteV2("THE_GREAT_OWL", GameEnums.Recoloring_None, 1, Qt.point(25, 30), 1, 2.0, 0, 0, false, false, 30);
    };

    this.loadStandingFiredAnimation = function(sprite, unit, defender, weapon)
    {
        sprite.loadSpriteV2("THE_GREAT_OWL+mask", GameEnums.Recoloring_Matrix, 1, Qt.point(25, 30), 1, 2.0, 0, 0, false, false, 30);
        sprite.loadSpriteV2("THE_GREAT_OWL", GameEnums.Recoloring_None, 1, Qt.point(25, 30), 1, 2.0, 0, 0, false, false, 30);
    };

    this.loadFireAnimation = function(sprite, unit, defender, weapon)
    {
        sprite.loadSpriteV2("THE_GREAT_OWL+mask", GameEnums.Recoloring_Matrix, 1, Qt.point(25, 30), 1, 2.0, 0, 0, false, false, 30);
        sprite.loadSpriteV2("THE_GREAT_OWL", GameEnums.Recoloring_None, 1, Qt.point(25, 30), 1, 2.0, 0, 0, false, false, 30);
        sprite.addSpriteShakeY(4, 0.5, 0.0, 75, 0, 1);
        sprite.loadSound("falling_bomb.wav", 1, 0);
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
var BATTLEANIMATION_THE_GREAT_OWL = new Constructor();
