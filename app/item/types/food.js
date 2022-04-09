// @ts-check

/** @typedef {import('../item.js').ItemPartial} ItemPartial */

/** @type {Omit<ItemPartial, "name">} */
const defaults = {
    type: 'food',
};

/** @type {{ [name: string]: Partial<ItemPartial>}} */
const food = {
    'Bread, loaf'    : { maxCount: 3 },
    'Butter'         : { variants: [ 'bucket', 'bowl', 'block' ] },
    'Cheese, round'  : { maxCount: 4 },
    'Cheese, wedge'  : { maxCount: 4 },
    'Cinnamon, pouch': { size: 'tiny', rarity: 'rare' },
    'Cloves, pouch'  : { size: 'tiny', rarity: 'rare' },
    'Egg'            : { size: 'tiny', maxCount: 24 },
    'Figs'           : { size: 'tiny' },
    'Fish'           : { variants: [ 'salmon', 'trout', 'carp', 'herring' ] },
    'Flour'          : { variants: [ 'pouch', 'bag', 'sack' ]  },
    'Ginger, pouch'  : { size: 'tiny', rarity: 'rare' },
    'Grain'          : { maxCount: 10 },
    'Honey'          : { rarity: 'uncommon', maxCount: 10 },
    'Lentils'        : { variants: [ 'pouch', 'bag', 'sack' ] },
    'Meat'           : { variants: [ 'chicken', 'dog', 'horse', 'pig', 'deer', 'sheep', 'goat', 'duck' ] },
    'Nuts'           : { size: 'tiny', maxCount: 50 },
    'Pepper, pouch'  : { size: 'tiny', rarity: 'rare' },
    'Raisins'        : { size: 'tiny', maxCount: 50 },
    'Rations, dried' : { maxCount: 50 },
    'Rice'           : { variants: [ 'pouch', 'bag', 'sack' ] },
    'Saffron, pouch' : { size: 'tiny', rarity: 'rare' },
    'Salt, pouch'    : { size: 'tiny', rarity: 'rare' },
    'Soup'           : { variants: [ 'meat', 'vegetables', 'potato' ] },
    'Spice, pouch'   : { size: 'tiny', rarity: 'rare', variants: [ 'exotic', 'rare', 'uncommon' ] },
    'Sugar, pouch'   : { size: 'tiny', rarity: 'rare' },
    'Vegetables'     : { maxCount: 20 },
    'Wheat'          : { variants: [ 'pouch', 'bag', 'sack' ]  },
};

/** @type {ItemPartial[]} */
export default Object.entries(food).map(([ name, config ]) => ({
    name,
    ...defaults,
    ...config,
}));
