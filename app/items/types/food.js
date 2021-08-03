// @ts-check

import type from '../type.js';
import rarity from '../../attributes/rarity.js';
import size from '../../attributes/size.js';

let { tiny } = size;
let { uncommon, rare } = rarity;

const defaults = {
    type: type.food,
};

const config = [
    { name: 'Bread, loaf', quantity: 3 },
    { name: 'Butter', variants: [ 'bucket', 'bowl', 'block' ] },
    { name: 'Cheese, round', quantity: 4 },
    { name: 'Cheese, round', quantity: 4 },
    { name: 'Cheese, wedge', quantity: 4 },
    { name: 'Cinnamon, pouch', size: tiny, rarity: rare },
    { name: 'Cloves, pouch', size: tiny, rarity: rare },
    { name: 'Egg', size: tiny, quantity: 24 },
    { name: 'Figs', size: tiny },
    { name: 'Fish', variants: [ 'salmon', 'trout', 'carp', 'herring' ] },
    { name: 'Flour', variants: [ 'pouch', 'bag', 'sack' ]  },
    { name: 'Ginger, pouch', size: tiny, rarity: rare },
    { name: 'Grain', quantity: 10 },
    { name: 'Honey', rarity: uncommon, quantity: 10 },
    { name: 'Lentils', variants: [ 'pouch', 'bag', 'sack' ] },
    { name: 'Meat', variants: [ 'chicken', 'dog', 'horse', 'pig', 'deer', 'sheep', 'goat', 'duck' ] },
    { name: 'Nuts', size: tiny, quantity: 50 },
    { name: 'Pepper, pouch', size: tiny, rarity: rare },
    { name: 'Raisins', size: tiny, quantity: 50 },
    { name: 'Rations, dried', quantity: 50 },
    { name: 'Rice', variants: [ 'pouch', 'bag', 'sack' ] },
    { name: 'Saffron, pouch', size: tiny, rarity: rare },
    { name: 'Salt, pouch', size: tiny, rarity: rare },
    { name: 'Soup', variants: [ 'meat', 'vegetables', 'potato' ] },
    { name: 'Spice, pouch', size: tiny, rarity: rare, variants: [ 'exotic', 'rare', 'uncommon' ] },
    { name: 'Sugar, pouch', size: tiny, rarity: rare },
    { name: 'Vegetables', quantity: 20 },
    { name: 'Wheat', variants: [ 'pouch', 'bag', 'sack' ]  },
];

export default config.map((item) => ({ ...defaults, ...item }));


