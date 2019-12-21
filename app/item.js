
import { rollArrayItem } from './utility/roll';
import rarity, { list as rarities, rollRarity } from './attributes/rarity';
import set from './items/set';
import size from './attributes/size';
import type from './items/type';

/**
 * Item
 * 
 * @typedef {Item}
 *  @property {string} name
 *  @property {number} count
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

const items = set.map((item) => ({ ...defaults, ...item }));

const groupByRarity = rarities.reduce((obj, rarity) => {
    obj[rarity] = [];
    return obj;
}, {});

items.forEach((item) => {
    groupByRarity[item.rarity].push(item);
});

export const getItem = () => {
    let rarity = rollRarity();
    let item = rollArrayItem(groupByRarity[rarity]) || { name: 'Mysterious object' };

    return item.name;
};
