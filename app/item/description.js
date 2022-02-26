// @ts-check

// -- Type Imports -------------------------------------------------------------

/** @typedef {import('../attribute/condition').Condition} Condition */
/** @typedef {import('../attribute/rarity').Rarity} Rarity */
/** @typedef {import('./item.js').Item} Item */

// -- Config -------------------------------------------------------------------

/**
 * Rarities that should be indicated for a group of items.
 *
 * @type {Set<Rarity>}
 */
const indicateRarity = new Set([
    'uncommon',
    'rare',
    'exotic',
    'legendary',
]);

// -- Public Functions ---------------------------------------------------------

/**
 * Get condition description for a group of items.
 *
 * @param {Condition} condition
 *
 * @returns {string|false}
 */
 export function getConditionDescription(condition) {
    let showCondition = condition !== 'average';
    return showCondition && `Item Condition: ${condition}`;
}

/**
 * Get item description
 *
 * @param {Item} item
 *
 * @returns {string}
 */
export function getItemDescription(item) {
    let { label, count } = item;

    return count === 1 ? label : `${label} (${count})`;
}

/**
 * Get rarity description for a group of items.
 *
 * @param {Rarity} rarity
 *
 * @returns {string|false}
 */
export function getRarityDescription(rarity) {
    let showRarity = indicateRarity.has(rarity);
    return showRarity && `Item Rarity: ${rarity}`;
}
