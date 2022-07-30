// @ts-check

/** @typedef {import('../item.js').ItemPartial} ItemPartial */

/** @type {Omit<ItemPartial, "name">} */
const defaults = {
    rarity: 'uncommon',
    type  : 'tack',
};

/** @type {{ [name: string]: Partial<ItemPartial>?}} */
const tack = {
    'Barding'       : { variants: [ 'chain', 'plage', 'scabb' ] },
    'Bit and bridle': null,
    'Carriage'      : null,
    'Cart'          : null,
    'Chariot'       : null,
    'Feed'          : null,
    'Saddle'        : { variants: [ 'Exotic', 'Military', 'Pack', 'Riding' ] },
    'Saddlebags'    : null,
};

/** @type {ItemPartial[]} */
export default Object.entries(tack).map(([ name, config ]) => ({
    name,
    ...defaults,
    ...config,
}));
