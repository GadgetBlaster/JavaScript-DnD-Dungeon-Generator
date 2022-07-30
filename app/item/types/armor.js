// @ts-check

/** @typedef {import('../item.js').ItemPartial} ItemPartial */

/** @type {Omit<ItemPartial, "name">} */
const defaults = {
    rarity: 'uncommon',
    type  : 'armor',
    size  : 'medium',
};

/** @type {{ [name: string]: Partial<ItemPartial>?}} */
const armor = {
    'Breastplate'          : { rarity: 'rare' },
    'Chain mail'           : { rarity: 'rare' },
    'Chain shirt'          : null,
    'Half plate armor'     : { rarity: 'rare' },
    'Hide armor'           : null,
    'Leather armor'        : null,
    'Padded armor'         : null,
    'Plate armor'          : { rarity: 'rare' },
    'Ring mail armor'      : null,
    'Scale mail armor'     : null,
    'Shield'               : null,
    'Splint armor'         : { rarity: 'rare' },
    'Studded leather armor': null,
};

/** @type {ItemPartial[]} */
export default Object.entries(armor).map(([ name, config ]) => ({
    name,
    ...defaults,
    ...config,
}));
