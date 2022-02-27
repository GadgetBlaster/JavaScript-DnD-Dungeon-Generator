// @ts-check

import { toss } from '../utility/tools.js';
import { rollArrayItem, roll } from '../utility/roll.js';
import { strong, em } from '../ui/typography.js';
import { probability as conditionProbability } from '../attribute/condition.js';
import { probability as rarityProbability } from '../attribute/rarity.js';
import set from './set.js';

// -- Type Imports -------------------------------------------------------------

/** @typedef {import('../attribute/rarity.js').Rarity} Rarity */
/** @typedef {import('../attribute/size.js').Size} Size */
/** @typedef {import('../attribute/condition.js').Condition} Condition */
/** @typedef {import('../controller/knobs.js').Config} Config */

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

/**
 * @TODO duplicate typedef. Consolidate and standardize. Use this type.
 *
 * @typedef {object} Item
 *
 * @prop {string} name
 * @prop {string} label
 * @prop {Condition} condition
 * @prop {Rarity} rarity
 * @prop {Size} size
 * @prop {ItemType} type
 * @prop {number} count
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
const rarityIndicated = new Set([
    'rare',
    'exotic',
    'legendary',
]);

/**
 * Item types that should have their details hidden.
 *
 * @type {Set<ItemType>}
 */
const detailsHidden = new Set([
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
    groupByRarity,
    groupByType,
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
        groupByRarity: /** @type {{ [key in Rarity]: ItemBase[] }} */ (byRarity),
        groupByType: /** @type {{ [key in ItemType]: { [key in Rarity]: ItemBase[] }}} */ (byType),
    };
})();

export {
    groupByRarity as testGroupByRarity,
    groupByType   as testGroupByType,
};

// -- Public Functions ---------------------------------------------------------

/**
 * Generates an item config based on room settings.
 *
 * @TODO break out or inject randomization logic for testing.
 * @TODO move to generate.js
 *
 * @param {Config} config
 *
 * @returns {Item}
 */
export const generateItem = (config) => {
    let {
        itemCondition: conditionSetting,
        itemQuantity : quantitySetting,
        itemRarity   : raritySetting,
        itemType     : itemType,
    } = config;

    !conditionSetting && toss('Item condition is required in generateItem()');
    !itemType         && toss('Item type is required in generateItem()');
    !quantitySetting  && toss('Item quantity is required in generateItem()');
    !raritySetting    && toss('Item rarity is required in generateItem()');
    quantitySetting === 'zero' && toss('Item quantity cannot be zero');

    let itemRarity    = raritySetting;
    let itemCondition = conditionSetting;

    if (raritySetting === 'random') {
        itemRarity = rarityProbability.roll();
    }

    let randomItem;

    // TODO break out into function, add early returns for undefined groups.
    if (itemType === 'random') {
        randomItem = groupByRarity[itemRarity] && rollArrayItem(groupByRarity[itemRarity]);
    } else {
        let itemsByTypeAndRarity = groupByType[itemType] && groupByType[itemType][itemRarity];
        randomItem = itemsByTypeAndRarity && itemsByTypeAndRarity.length && rollArrayItem(itemsByTypeAndRarity);
    }

    // TODO add type
    let item = randomItem || {
        name: 'Mysterious object',
        type: 'mysterious',
    };

    if (detailsHidden.has(item.type)) {
        itemCondition = 'average';
        itemRarity    = 'average';
    }

    if (itemCondition === 'random') {
        itemCondition = conditionProbability.roll();
    }

    let isSingle          = quantitySetting === 'one';
    let indicateRare      = (isSingle || raritySetting === 'random')    && rarityIndicated.has(itemRarity);
    let indicateCondition = (isSingle || conditionSetting === 'random') && itemCondition !== 'average';

    let name = indicateRare ? strong(item.name) : item.name;

    let notes = [];

    if (indicateRare) {
        notes.push(itemRarity);
    }

    if (indicateCondition) {
        notes.push(itemCondition);
    }

    let noteText = notes.length ? ` (${em(notes.join(', '))})` : '';

    let maxCount = 1;

    if (item.quantity > 1) {
        maxCount = roll(1, item.quantity);

        // TODO breakout into function
        if (maxCount > 1) {
            if (item.type === 'coin') {
                // TODO pluralize()
                name = `${maxCount} ${name}${maxCount > 1 ? 's' : ''}`;
            } else {
                name += `, set of ${maxCount}`;
            }
        }
    }

    if (item.variants) {
        let variant = rollArrayItem(item.variants);
        name += `, ${variant}`;
    }

    return {
        label: name + noteText,
        name,
        quantity: maxCount, // TODO count?
        rarity: itemRarity,
        size: item.size,
        type: item.type,
    };
};