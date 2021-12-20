// @ts-check

/** @typedef {import('../item.js').ItemConfig} ItemConfig */

/** @type {Omit<ItemConfig, "name">} */
const defaults = {
    rarity: 'abundant',
    type  : 'kitchen',
};

/** @type {{ [name: string]: Partial<ItemConfig>}} */
const kitchenSupplies = {
    'Basin'        : null,
    'Cauldron'     : { rarity: 'average' },
    'Cutting board': null,
    'Fork'         : null,
    'Kitchen knife': null,
    'Ladle'        : { rarity: 'common' },
    'Mess kit'     : null,
    'Pan, iron'    : null,
    'Pot, iron'    : null,
    'Soap'         : { rarity: 'uncommon' },
    'Spoon'        : null,
    'Steak knife'  : null,
    'Tub'          : null,
};

/** @type {ItemConfig[]} */
export default Object.entries(kitchenSupplies).map(([ name, config ]) => ({
    name,
    ...defaults,
    ...config,
}));
