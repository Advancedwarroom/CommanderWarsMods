var Constructor = function()
{
    this.getName = function()
    {
        return qsTr("Microwave Beam");
    };

    this.getBaseDamage = function(unit)
    {
        try
        {
            // SUNNY (WEATHER_1SUN): heavy tank attack power
            var map = unit.getMap();
            if (map.getGameRules().getCurrentWeather().getWeatherId() === "WEATHER_1SUN")
            {
                return Global["WEAPON_HEAVY_TANK_GUN"].getBaseDamage(unit);
            }
        }
        catch (e)
        {
            // fall through to the weak table
        }
        // any other weather: light tank attack power
        return Global["WEAPON_LIGHT_TANK_GUN"].getBaseDamage(unit);
    };

    this.getEnviromentDamage = function(enviromentId)
    {
        // buildings always take light-gun env damage (no map access here)
        return 15;
    };

    this.damageTable = [];
};

Constructor.prototype = WEAPON;
var WEAPON_MU_MICROWAVE = new Constructor();
