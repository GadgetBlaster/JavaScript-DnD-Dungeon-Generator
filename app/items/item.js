
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

/**
 * Item
 * TODO duplicate
 * @typedef {Item}
 *
 * @property {string} name
 * @property {string} type
 * @property {string} rarity
 * @property {number} quantity - Max number of item found
 * @property {number} [capacity] - Max number of small items found inside
 * @property {string[]} [variants] - Array of variations
 */

// -- Config -------------------------------------------------------------------

const defaults = {
    quantity: 1,
    rarity: rarity.average,
    size: size.small,
    type: type.miscellaneous,
};

const rarityIndicated = new Set([
    rarity.rare,
    rarity.exotic,
    rarity.legendary,
]);

const detailsHidden = new Set([
    type.coin,
    type.treasure,
]);

const makeGroup = (groups) => groups.reduce((obj, group) => {
    obj[group] = [];
    return obj;
}, {});

const items = set.map((item) => ({ ...defaults, ...item }));

const groupByRarity = makeGroup(rarities);
const groupByType   = makeGroup(itemTypes);

Object.keys(groupByType).forEach((type) => {
    groupByType[type] = makeGroup(rarities);
});

items.forEach((item) => {
    groupByRarity[item.rarity].push(item);
    groupByType[item.type][item.rarity].push(item);
});

export const _private = {
    groupByRarity,
    groupByType,
};

// -- Public Functions ---------------------------------------------------------

export const generateItem = (settings) => {
    let {
        [knobs.itemCondition]: conditionSetting,
        [knobs.itemQuantity] : quantitySetting,
        [knobs.itemRarity]   : raritySetting,
        [knobs.itemType]     : itemType,
    } = settings;

    // TODO collapse
    if (!conditionSetting) {
        throw new TypeError('Item condition is required in generateItem()');
    }

    if (!quantitySetting) {
        throw new TypeError('Item quantity is required in generateItem()');
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

    let item = randomItem || { name: 'Mysterious object' }; // TODO use mysterious type

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
