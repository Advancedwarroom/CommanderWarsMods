// MoreUnits general/unit.js -- Biological Weapon category support (Turtle Mod compatible) + PipeBin repair fix
//
// 1. Ensures GameEnums.BIOLOGICAL_WEAPON exists (value 306, compatible with Turtle Mod).
// 2. Overrides UNIT.getUnitTypeText to display "Biological Weapon" for that type.
// 3. Overrides UNIT.getUnitTypeSort to include Biological Weapon in editor tabs.
// 4. Appends to UNIT.unitBiologicalWeaponSortList (creates if missing) for editor listing.
//    Does NOT overwrite existing lists from other mods (e.g. Turtle Mod).
// 5. Keeps the existing PipeBin debuff-clear repairUnit override.

// ============================================================
// 1. Ensure BIOLOGICAL_WEAPON enum exists (306 = Turtle Mod compatible)
// ============================================================
if (typeof GameEnums.BIOLOGICAL_WEAPON === 'undefined')
{
    GameEnums.BIOLOGICAL_WEAPON = 306;
}

// ============================================================
// 2. Override getUnitTypeText for Biological Weapon
// ============================================================
var MU_ORIGINAL_GET_UNIT_TYPE_TEXT = UNIT.getUnitTypeText;

UNIT.getUnitTypeText = function(unitType, map)
{
    if (unitType === GameEnums.BIOLOGICAL_WEAPON)
    {
        return qsTr("Biological Weapon");
    }
    return MU_ORIGINAL_GET_UNIT_TYPE_TEXT.call(this, unitType, map);
};

// ============================================================
// 3. Override getUnitTypeSort to include Biological Weapon tab
// ============================================================
var MU_ORIGINAL_GET_UNIT_TYPE_SORT = UNIT.getUnitTypeSort;

UNIT.getUnitTypeSort = function()
{
    var list = MU_ORIGINAL_GET_UNIT_TYPE_SORT.call(this);
    if (list.indexOf(GameEnums.BIOLOGICAL_WEAPON) < 0)
    {
        list = list.slice();
        list.push(GameEnums.BIOLOGICAL_WEAPON);
    }
    return list;
};

// ============================================================
// 4. Biological Weapon unit list for editor
//    Append to existing list (do NOT overwrite Turtle Mod's list)
// ============================================================
if (typeof UNIT.unitBiologicalWeaponSortList === 'undefined' || UNIT.unitBiologicalWeaponSortList === null)
{
    UNIT.unitBiologicalWeaponSortList = [];
}

var MU_BIO_UNITS = ["HOELLIUM", "MU_SPITOR"];
for (var i = 0; i < MU_BIO_UNITS.length; i++)
{
    if (UNIT.unitBiologicalWeaponSortList.indexOf(MU_BIO_UNITS[i]) < 0)
    {
        UNIT.unitBiologicalWeaponSortList.push(MU_BIO_UNITS[i]);
    }
}

// Only define getUnitTypeSort306 if it does not already exist (Turtle Mod provides it)
if (typeof UNIT.getUnitTypeSort306 !== 'function')
{
    UNIT.getUnitTypeSort306 = function()
    {
        return UNIT.unitBiologicalWeaponSortList;
    };
}

// ============================================================
// 5. Existing PipeBin repairUnit override (keep from before)
// ============================================================
var MU_ORIGINAL_REPAIR_UNIT = (typeof UNIT !== "undefined" &&
                              typeof UNIT.repairUnit === "function")
    ? UNIT.repairUnit
    : null;

UNIT.repairUnit = function(unit, repairAmount, map)
{
    var hpBefore = unit.getHp();

    if (MU_ORIGINAL_REPAIR_UNIT !== null)
    {
        MU_ORIGINAL_REPAIR_UNIT.call(this, unit, repairAmount, map);
    }
    else
    {
        var costs = unit.getUnitCosts();
        var hp = unit.getHpRounded();
        var healingDone = 0;
        if (hp + repairAmount <= 10)
        {
            healingDone = repairAmount;
        }
        else
        {
            healingDone = 10 - hp;
        }
        var funds = unit.getOwner().getFunds();
        var modifier = unit.getRepairCostModifier();
        for (var i = healingDone; i >= 0; i--)
        {
            if (i * costs / 10 * modifier <= funds)
            {
                healingDone = i;
                break;
            }
            else if (i === 0)
            {
                healingDone = 0;
                break;
            }
        }
        unit.setHp(hp + healingDone);
        unit.getOwner().addFunds(-healingDone * costs / 10 * modifier);
    }

    if (unit.getHp() > hpBefore)
    {
        try
        {
            if (typeof MU_PIPEBIN !== "undefined" && MU_PIPEBIN !== null)
            {
                MU_PIPEBIN.clearDebuffs(unit, map);
            }
        }
        catch (e) {}
    }
};
