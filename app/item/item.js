// @ts-check

import set from './set.js';

// -- Type Imports -------------------------------------------------------------

/** @typedef {import('../attribute/rarity.js').Rarity} Rarity */
/** @typedef {import('../attribute/size.js').Size} Size */

// -- Types --------------------------------------------------------------------

/** @typedef {typeof itemTypes[number]} ItemType */

/**
 * @typedef {object} ItemBase
 *
 * @prop {string} name
 * @prop {Rarity} [rarity]
 * @prop {Size} [size]
 * @prop {ItemType} [type]
 * @prop {number} [maxCount]
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
 * Item types that should have their details hidden.
 *
 * @type {Set<ItemType>}
 */
export const hideItemDetails = new Set([
    'coin',
    'treasure',
]);

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
            byType[type] = [];
        }

        if (!byType[type][rarity]) {
            byType[type][rarity] = [];
        }

        byRarity[rarity].push(item);
        byType[type][rarity].push(item);
    });

    return {
        itemsByRarity: /** @type {{ [key in Rarity]: ItemBase[] }} */ (byRarity),
        itemsByType: /** @type {{ [key in ItemType]: { [key in Rarity]: ItemBase[] }}} */ (byType),
    };
})();

export {
    itemsByRarity,
    itemsByType,
};
