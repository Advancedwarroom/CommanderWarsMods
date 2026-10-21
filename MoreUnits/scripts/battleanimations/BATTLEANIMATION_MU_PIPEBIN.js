var Constructor = function()
{
    this.getMaxUnitCount = function()
    {
        return 1;
    };

    this.loadStandingAnimation = function(sprite, unit, defender, weapon)
    {
        sprite.loadSpriteV2("MU_PIPEBIN+mask", GameEnums.Recoloring_Matrix, 1, Qt.point(40, 20),1,2);
        sprite.loadSpriteV2("MU_PIPEBIN", GameEnums.Recoloring_None, 1, Qt.point(40, 20),1,2);
        
    };

    this.loadStandingFiredAnimation = function(sprite, unit, defender, weapon)
    {
        sprite.loadSpriteV2("MU_PIPEBIN+mask", GameEnums.Recoloring_Matrix, 1,  Qt.point(40, 20),1,2);
        sprite.loadSpriteV2("MU_PIPEBIN", GameEnums.Recoloring_None, 1, Qt.point(40, 20),1,2);
       
    };

    this.loadFireAnimation = function(sprite, unit, defender, weapon)
    {
        sprite.loadSpriteV2("MU_PIPEBIN+mask", GameEnums.Recoloring_Matrix, 1,   Qt.point(40, 20),1,2);
        sprite.loadSpriteV2("MU_PIPEBIN", GameEnums.Recoloring_None, 1, Qt.point(40, 20),1,2);
        
        sprite.addSpriteShakeY(4, 0.5, 0.0, 75, 0, 1);
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
var BATTLEANIMATION_MU_PIPEBIN = new Constructor();
