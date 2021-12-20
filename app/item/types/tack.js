// @ts-check

/** @typedef {import('../item.js').ItemConfig} ItemConfig */

/** @type {Omit<ItemConfig, "name">} */
const defaults = {
    rarity: 'uncommon',
    type  : 'tack',
};

/** @type {{ [name: string]: Partial<ItemConfig>}} */
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

/** @type {ItemConfig[]} */
export default Object.entries(tack).map(([ name, config ]) => ({
    name,
    ...defaults,
    ...config,
}));
