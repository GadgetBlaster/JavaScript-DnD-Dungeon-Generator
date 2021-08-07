// @ts-check

import { knobs } from '../knobs.js';
import { random } from '../utility/random.js';
import { rollArrayItem, roll } from '../utility/roll.js';
import { strong, em } from '../ui/typography.js';
import condition, { probability as conditionProbability } from '../attributes/condition.js';
import quantity from '../attributes/quantity.js';
import rarity, { list as rarities, probability as rarityProbability } from '../attributes/rarity.js';
import set from './set.js';
import size from '../attributes/size.js';
import type, { list as itemTypes } from './type.js';

// -- Types --------------------------------------------------------------------

/** @typedef {import('../knobs.js').Config} Config */

/**
 * @TODO duplicate typedef. Consolidate and standardize
 *
 * @typedef {object} Item
 *
 * @property {string} name
 * @property {string} label
 * @property {string} type
 * @property {string} rarity
 * @property {number} count
 * @property {number} quantity - Max number of item found // TODO rename to `maxCount`
 * @property {number} [capacity] - Max number of small items found inside
 * @property {string[]} [variants] - Array of variations
 */

// -- Config -------------------------------------------------------------------

/**
 * Item defaults.
 */
const defaults = {
    quantity: 1,
    rarity  : rarity.average,
    size    : size.small,
    type    : type.miscellaneous,
};

/**
 * Item rarities that should be indicated in item descriptions.
 */
const rarityIndicated = new Set([
    rarity.rare,
    rarity.exotic,
    rarity.legendary,
]);

/**
 * Item types that should have their details hidden.
 */
const detailsHidden = new Set([
    type.coin,
    type.treasure,
]);

/**
 * Items
 *
 * @type {Item[]}
 */
const items = set.map((item) => ({ ...defaults, ...item }));

/**
 * Items grouped by rarity
 *
 * @type {{ [rarity: string]: Item[] }}
 */
const groupByRarity = makeGroup(rarities);

/**
 * Items grouped by rarity
 *
 * @type {{ [itemType: string]: Item[] }}
 */
const groupByType = makeGroup(itemTypes);

Object.keys(groupByType).forEach((type) => {
    // TODO
    groupByType[type] = makeGroup(rarities);
});

items.forEach((item) => {
    groupByRarity[item.rarity].push(item);
    groupByType[item.type][item.rarity].push(item);
});

export {
    groupByRarity as testGroupByRarity,
    groupByType   as testGroupByType,
};

// -- Private Functions --------------------------------------------------------

/**
 * Returns a group of items.
 *
 * @private
 *
 * @param {string[]} groups
 *
 * @returns {{ [group: string]: Item[] }}
 */
function makeGroup(groups) {
    return groups.reduce((obj, group) => {
        obj[group] = [];
        return obj;
    }, {});
}

// -- Public Functions ---------------------------------------------------------

/**
 * Generates an item config based on room settings.
 *
 * @TODO break out or inject randomization logic for testing.
 *
 * @param {Config} config
 *
 * @returns {Item}
 */
export const generateItem = (config) => {
    let {
        // TODO
        [knobs.itemCondition]: conditionSetting,
        [knobs.itemQuantity] : quantitySetting,
        [knobs.itemRarity]   : raritySetting,
        [knobs.itemType]     : itemType,
    } = config;

    // TODO collapse
    if (!conditionSetting) {
        throw new TypeError('Item condition is required in generateItem()');
    }

    if (!quantitySetting) {
        throw new TypeError('Item quantity is required in generateItem()');
    }

    if (quantitySetting === quantity.zero) {
        throw new TypeError('Item quantity cannot be zero');
    }

    if (!raritySetting) {
        throw new TypeError('Item rarity is required in generateItem()');
    }

    if (!itemType) {
        throw new TypeError('Item type is required in generateItem()');
    }

    let itemRarity    = raritySetting;
    let itemCondition = conditionSetting;

    if (raritySetting === random) {
        itemRarity = rarityProbability.roll();
    }

    let randomItem;

    if (itemType === random) {
        randomItem = rollArrayItem(groupByRarity[itemRarity]);
    } else {
        let itemsByTypeAndRarity = groupByType[itemType][itemRarity];
        randomItem = itemsByTypeAndRarity.length && rollArrayItem(itemsByTypeAndRarity);
    }

    let item = randomItem || {
        name: 'Mysterious object',
        type: type.mysterious,
    };

    if (detailsHidden.has(item.type)) {
        itemCondition = condition.average;
        itemRarity    = rarity.average;
    }

    if (itemCondition === random) {
        itemCondition = conditionProbability.roll();
    }

    let isSingle          = quantitySetting === quantity.one;
    let indicateRare      = (isSingle || raritySetting === random)    && rarityIndicated.has(itemRarity);
    let indicateCondition = (isSingle || conditionSetting === random) && itemCondition !== condition.average;

    let name = indicateRare ? strong(item.name) : item.name;

    let notes = [];

    if (indicateRare) {
        notes.push(itemRarity);
    }

    if (indicateCondition) {
        notes.push(itemCondition);
    }

    let noteText = notes.length ? ` (${em(notes.join(', '))})` : '';

    let itemQuantity = 1;

    if (item.quantity > 1) {
        itemQuantity = roll(1, item.quantity);

        if (itemQuantity > 1) {
            if (item.type === type.coin) {
                name = `${itemQuantity} ${name}${itemQuantity > 1 ? 's' : ''}`;
            } else {
                name += `, set of ${itemQuantity}`;
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
        quantity: itemQuantity,
        rarity: itemRarity,
        size: item.size,
        type: item.type,
    };
};
