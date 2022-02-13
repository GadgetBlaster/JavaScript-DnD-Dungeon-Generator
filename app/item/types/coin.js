// @ts-check

/** @typedef {import('../item.js').ItemBase} ItemBase */

/** @type {Omit<ItemBase, "name">} */
const defaults = {
    maxCount: 100,
    type    : 'coin',
    rarity  : 'uncommon',
};

/** @type {{ [name: string]: Partial<ItemBase>}} */
const coins = {
    'Copper piece'  : { rarity: 'common' },
    'Silver piece'  : null,
    'Electrum piece': { rarity: 'exotic' },
    'Gold piece'    : { rarity: 'rare' },
    'Platinum piece': { rarity: 'exotic' },
};

/** @type {ItemBase[]} */
export default Object.entries(coins).map(([ name, config ]) => ({
    name,
    ...defaults,
    ...config,
}));
