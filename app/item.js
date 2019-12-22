
import { knobs } from './rooms/knobs';
import { random } from './utility/random';
import { rollArrayItem, roll } from './utility/roll';
import { strong } from './ui/typography';
import set from './items/set';
import size from './attributes/size';
import type from './items/type';

import rarity, {
    list as rarities,
    probability as rarityProbability,
} from './attributes/rarity';

import condition, {
    probability as conditionProbability,
} from './attributes/condition';
import quantity from './attributes/quantity';

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

const items = set.map((item) => ({ ...defaults, ...item }));

const groupByRarity = rarities.reduce((obj, rarity) => {
    obj[rarity] = [];
    return obj;
}, {});

items.forEach((item) => {
    groupByRarity[item.rarity].push(item);
});

export const generateItem = (settings) => {
    let {
        [knobs.itemCondition]: conditionSetting,
        [knobs.itemQuantity]: quantitySetting,
        [knobs.itemRarity]: raritySetting,
    } = settings;

    let itemRarity    = raritySetting;
    let itemCondition = conditionSetting;

    if (raritySetting === random) {
        itemRarity = rarityProbability.roll();
    }

    if (conditionSetting === random) {
        itemCondition = conditionProbability.roll();
    }

    let isSingle          = quantitySetting === quantity.one;
    let indicateRare      = (isSingle || raritySetting === random)    && rarityIndicated.has(itemRarity);
    let indicateCondition = (isSingle || conditionSetting === random) && itemCondition !== condition.average;

    let item  = rollArrayItem(groupByRarity[itemRarity]) || { name: 'Mysterious object' };
    let name  = indicateRare ? strong(item.name) : item.name;
    let notes = [];

    if (indicateRare) {
        notes.push(itemRarity);
    }

    if (indicateCondition) {
        notes.push(itemCondition);
    }

    let noteText = notes.length ? ` (${notes.join(', ')})` : '';

    if (item.quantity > 1) {
        let quantity = roll(1, item.quantity);

        if (quantity > 1) {
            name += `, set of ${quantity}`;
        }
    }

    if (item.variants) {
        let variant = rollArrayItem(item.variants);
        name += `, ${variant}`;
    }

    return name + noteText;
};
