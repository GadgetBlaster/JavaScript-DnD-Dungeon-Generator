
import condition from '../attributes/condition.js';
import rarity from '../attributes/rarity.js';

// -- Config -------------------------------------------------------------------

/**
 * Rarities that should be indicated for a group of items.
 *
 * @type {Set<string>}
 */
const indicateRarity = new Set([
    rarity.uncommon,
    rarity.rare,
    rarity.exotic,
    rarity.legendary,
]);

// -- Public Functions ---------------------------------------------------------

/**
 * Get item description
 *
 * @param {import('../typedefs.js').Item}
 *
 * @returns {string}
 */
export const getItemDescription = (item) => {
    let { label, count } = item;

    return count === 1 ? label : `${label} (${count})`;
};

/**
 * Get condition description for a group of items.
 *
 * @param {string} itemCondition
 *
 * @returns {string|false}
 */
export const getConditionDescription = (itemCondition) => {
    let showCondition = itemCondition !== condition.average;
    return showCondition && `Item Condition: ${itemCondition}`;
};

/**
 * Get rarity description for a group of items.
 *
 * @param {string} itemRarity
 *
 * @returns {string|false}
 */
export const getRarityDescription = (itemRarity) => {
    let showRarity = indicateRarity.has(itemRarity);
    return showRarity && `Item Rarity: ${itemRarity}`;
};
