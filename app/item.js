
import rarity, { list as rarities, rollRarity } from './attributes/rarity';
import size from './attributes/size';
import type from './items/type';

import { roll, rollArrayItem } from './utility/roll';

import ammo from './items/types/ammo';
import chancery from './items/types/chancery';
import clothing from './items/types/clothing';
import component from './items/types/component';
import container from './items/types/container';
import food from './items/types/food';
import furnishing from './items/types/furnishing';
import kitchen from './items/types/kitchen';
import liquid from './items/types/liquid';
import miscellaneous from './items/types/miscellaneous';
import mythic from './items/types/mythic';
import potion from './items/types/potion';
import survival from './items/types/survival';
import tool from './items/types/tool';
import weapon from './items/types/weapon';

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

const items = [
    ...ammo,
    ...chancery,
].map((item) => ({ ...defaults, ...item }));

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
