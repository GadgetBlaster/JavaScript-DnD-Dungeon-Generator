// @ts-check

/** @typedef {import('../item.js').ItemBase} ItemBase */

/** @type {Omit<ItemBase, "name">} */
const defaults = {
    rarity: 'abundant',
    type  : 'clothing',
};

/** @type {{ [name: string]: Partial<ItemBase>}} */
const clothing = {
    'Belt'        : null,
    'Boots'       : { variants: [ 'riding', 'soft', 'combat' ] },
    'Breaches'    : null,
    'Brooch'      : null,
    'Cap'         : null,
    'Cape'        : { variants: [ 'cotton', 'canvas', 'fur', 'silk' ] },
    'Cloak'       : { variants: [ 'cotton', 'canvas', 'fur', 'silk' ] },
    'Clothes, set': { variants: [ 'common', 'costume', 'fine', 'traveler’s' ] },
    'Gloves'      : null,
    'Gown'        : null,
    'Hat'         : null,
    'Hose'        : null,
    'Jacket'      : { variants: [ 'leather', 'fur', 'silk' ] },
    'Mittens'     : null,
    'Robes'       : { variants: [ 'common', 'embroidered' ] },
    'Sandals'     : null,
    'Sash'        : null,
    'Shoes'       : null,
    'Surcoat'     : null,
    'Tunic'       : null,
    'Vest'        : { variants: [ 'leather', 'fur', 'silk' ]  },
};

/** @type {ItemBase[]} */
export default Object.entries(clothing).map(([ name, config ]) => ({
    name,
    ...defaults,
    ...config,
}));
