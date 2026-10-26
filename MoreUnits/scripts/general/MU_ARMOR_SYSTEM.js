// MU_ARMOR_SYSTEM - global armor-funds tracker for the Armored Truck
// Installed exactly like mu_damage_patch.js: an IIFE wrapping the shared
// UNIT prototype at script load time. Any unit whose script defines its own
// postBattleActions (MU_PIPEBIN, SHOTGUN_TANK, LASER_TANK) chains this base
// hook explicitly so no battle escapes tracking.
var MU_ARMOR_INSTALLED = false;

var MU_ARMOR_SYSTEM =
{
    // called after every battle a unit participates in; if the unit carries
    // the MU_ARMORED flag, any HP loss is converted to funds for its owner:
    // lostHP * (unitCost / 10) * 75%
    track: function(unit)
    {
        try
        {
            if (unit === null || unit === undefined) { return; }
            var vars = unit.getVariables();
            var armored = vars.getVariable("MU_ARMORED");
            if (armored === null || armored === undefined) { return; }
            if (armored.readInt32() !== 1) { return; }

            // HP is stored x10 to stay integer-exact
            var curX10 = Math.round(unit.getHp() * 10);
            var lastV = vars.getVariable("MU_LAST_HP");
            var lastX10 = curX10;
            if (lastV !== null && lastV !== undefined)
            {
                lastX10 = lastV.readInt32();
            }
            if (curX10 < lastX10)
            {
                var lost = (lastX10 - curX10) / 10.0;
                var cost = 0;
                var uscript = Global[unit.getUnitID()];
                if (uscript !== null && uscript !== undefined && typeof uscript.getBaseCost === "function")
                {
                    cost = uscript.getBaseCost();
                }
                var funds = Math.round(lost * (cost / 10.0) * 0.75);
                if (funds > 0)
                {
                    unit.getOwner().addFunds(funds);
                }
            }
            if (lastV === null || lastV === undefined)
            {
                lastV = vars.createVariable("MU_LAST_HP");
            }
            lastV.writeInt32(curX10);
        }
        catch (e)
        {
            // tracking must never break a battle
        }
    },
};

(function()
{
    try
    {
        if (typeof UNIT === "undefined") { return; }
        if (MU_ARMOR_INSTALLED) { return; }
        var originalPostBattle = UNIT.postBattleActions;
        UNIT.postBattleActions = function(unit, damage, otherUnit, gotAttacked, weapon, action, map)
        {
            try
            {
                MU_ARMOR_SYSTEM.track(unit);
            }
            catch (trackError)
            {
                // tracking must never break a battle
            }
            if (typeof originalPostBattle === "function")
            {
                return originalPostBattle.apply(this, arguments);
            }
        };
        MU_ARMOR_INSTALLED = true;
    }
    catch (e)
    {
        // never break script loading
    }
})();
