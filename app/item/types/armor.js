// @ts-check

/** @typedef {import('../item.js').ItemBase} ItemBase */

/** @type {Omit<ItemBase, "name">} */
const defaults = {
    rarity: 'uncommon',
    type  : 'armor',
    size  : 'medium',
};

/** @type {{ [name: string]: Partial<ItemBase>}} */
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

/** @type {ItemBase[]} */
export default Object.entries(armor).map(([ name, config ]) => ({
    name,
    ...defaults,
    ...config,
}));
