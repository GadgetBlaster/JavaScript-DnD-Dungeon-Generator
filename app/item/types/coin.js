// @ts-check

/** @typedef {import('../item.js').ItemPartial} ItemPartial */

/** @type {Omit<ItemPartial, "name">} */
const defaults = {
    maxCount: 100,
    type    : 'coin',
    rarity  : 'uncommon',
};

/** @type {{ [name: string]: Partial<ItemPartial>?}} */
const coins = {
    'Copper piece'  : { rarity: 'common' },
    'Silver piece'  : null,
    'Electrum piece': { rarity: 'exotic' },
    'Gold piece'    : { rarity: 'rare' },
    'Platinum piece': { rarity: 'exotic' },
};

/** @type {ItemPartial[]} */
export default Object.entries(coins).map(([ name, config ]) => ({
    name,
    ...defaults,
    ...config,
}));
