
import rarity from '../attributes/rarity';
import size from '../attributes/size';
import type from './type';

import ammo from './types/ammo';
import chancery from './types/chancery';
import clothing from './types/clothing';
import component from './types/component';
import container from './types/container';
import food from './types/food';
import furnishing from './types/furnishing';
import kitchen from './types/kitchen';
import liquid from './types/liquid';
import miscellaneous from './types/miscellaneous';
import mythic from './types/mythic';
import potion from './types/potion';
import survival from './types/survival';
import tool from './types/tool';
import weapon from './types/weapon';

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

const config = [
    ...ammo,
];

const items = config.map((item) => {
    console.log('hi');
    return { ...defaults, ...item };
});

export default items;
