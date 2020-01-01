
import { knobs } from '../knobs';
import { random } from '../utility/random';
import { rollArrayItem, roll } from '../utility/roll';
import { strong, em } from '../ui/typography';
import condition, { probability as conditionProbability } from '../attributes/condition';
import quantity from '../attributes/quantity';
import rarity, { list as rarities, probability as rarityProbability } from '../attributes/rarity';
import set from './set';
import size from '../attributes/size';
import type, { list as itemTypes } from './type';

/**
 * Item
 *
 * @typedef {Item}
 *  @property {string} name
 *  @property {string} type
 *  @property {string} rarity
 *  @property {number} quantity - Max number of item found
 *  @property {number} [capacity] - Max number of small items found inside
 *  @property {string[]} [variants] - Array of variations
 */

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
]);

const items = set.map((item) => ({ ...defaults, ...item }));

const makeGroup = (groups) => groups.reduce((obj, group) => {
    obj[group] = [];
    return obj;
}, {});

const groupByRarity = makeGroup(rarities);
const groupByType   = makeGroup(itemTypes);

Object.keys(groupByType).forEach((type) => {
    groupByType[type] = makeGroup(rarities);
});

items.forEach((item) => {
    groupByRarity[item.rarity].push(item);
    groupByType[item.type][item.rarity].push(item);
});

export const generateItem = (settings) => {
    let {
        [knobs.itemCondition]: conditionSetting,
        [knobs.itemQuantity] : quantitySetting,
        [knobs.itemRarity]   : raritySetting,
        [knobs.itemType]     : itemType,
    } = settings;

    let itemRarity    = raritySetting;
    let itemCondition = conditionSetting;

    if (raritySetting === random) {
        itemRarity = rarityProbability.roll();
    }

    let randomItem;

    if (itemType === random) {
        randomItem = rollArrayItem(groupByRarity[itemRarity]);
    } else {
        randomItem = rollArrayItem(groupByType[itemType][itemRarity]);
    }

    let item = randomItem || { name: 'Mysterious object' };

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
        quantity: itemQuantity,
        rarity: itemRarity,
        size: item.size,
        type: item.type,
    };
};
