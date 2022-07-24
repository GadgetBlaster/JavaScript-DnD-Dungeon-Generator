// @ts-check

import set from './set.js';

// -- Type Imports -------------------------------------------------------------

/** @typedef {import('../attribute/condition').Condition} Condition */
/** @typedef {import('../attribute/rarity.js').Rarity} Rarity */
/** @typedef {import('../attribute/size.js').Size} Size */

// -- Types --------------------------------------------------------------------

/** @typedef {typeof itemTypes[number]} ItemType */

/**
 * @typedef {object} ItemPartial
 *
 * @prop {string} name
 * @prop {Rarity} [rarity]
 * @prop {Size} [size]
 * @prop {ItemType} [type]
 * @prop {number} [maxCount]
 * @prop {number} [capacity] - Max number of small items found inside
 * @prop {string[]} [variants] - Array of variations
 */

/**
 * @typedef {object} ItemBase
 *
 * @prop {string} name
 * @prop {Rarity} rarity
 * @prop {Size} size
 * @prop {ItemType} type
 * @prop {number} maxCount
 * @prop {number} [capacity] - Max number of small items found inside
 * @prop {string[]} [variants] - Array of variations
 */

// -- Config -------------------------------------------------------------------

export const itemTypes = Object.freeze(/** @type {const} */ ([
    'ammo',
    'armor',
    'chancery',
    'clothing',
    'coin',
    'container',
    'food',
    'furnishing',
    'kitchen',
    'liquid',
    'miscellaneous',
    'mysterious',
    'mystic',
    'potion',
    'survival',
    'tack',
    'tool',
    'treasure',
    'trinket',
    'weapon',
]));

/**
 * Item defaults.
 *
 * @type {Omit<ItemBase, "name">}
 */
const defaults = {
    maxCount: 1,
    rarity  : 'average',
    size    : 'small',
    type    : 'miscellaneous',
};

/**
 * Item rarities that should be indicated in item descriptions.
 *
 * @type {Set<Rarity>}
 */
export const indicateItemRarity = new Set([
    'rare',
    'exotic',
    'legendary',
]);

/**
 * Rarities that should be indicated for a set of items.
 *
 * @type {Set<Rarity>}
 */
export const indicateItemSetRarity = new Set([
    'uncommon',
    'rare',
    'exotic',
    'legendary',
]);

/**
 * Item types that should have their details hidden.
 *
 * @type {Set<ItemType>}
 */
export const hideItemDetails = new Set([
    'coin',
    'treasure',
]);

/**
 * Rarities that should be indicated for a set of items.
 *
 * @type {Set<Condition>}
 */
export const hideItemSetCondition = new Set([
    'average',
]);

/** @type {ItemBase} */
export const mysteriousObject = {
    ...defaults,
    name: 'Mysterious object',
};

/**
 * Item configs.
 *
 * @type {ItemBase[]}
 */
const items = set.map((item) => ({ ...defaults, ...item }));

/**
 * Items grouped by rarity and items grouped by type and rarity.
 */
const {
    itemsByRarity,
    itemsByType,
} = (() => {
    let byRarity = {};
    let byType   = {};

    items.forEach((item) => {
        let { rarity, type } = item;

        if (!byRarity[rarity]) {
            byRarity[rarity] = [];
        }

        if (!byType[type]) {
            byType[type] = {};
        }

        if (!byType[type][rarity]) {
            byType[type][rarity] = [];
        }

        byRarity[rarity].push(item);
        byType[type][rarity].push(item);
    });

    return {
        itemsByRarity: /** @type {{ [key in Rarity]: ItemPartial[] }} */ (byRarity),
        itemsByType: /** @type {{ [key in ItemType]: { [key in Rarity]: ItemPartial[] }}} */ (byType),
    };
})();

export {
    itemsByRarity,
    itemsByType,
};
