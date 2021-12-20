// @ts-check

/** @typedef {import('../item.js').ItemConfig} ItemConfig */

/** @type {Omit<ItemConfig, "name">} */
const defaults = {
    maxCount: 100,
    type    : 'coin',
    rarity  : 'uncommon',
};

/** @type {{ [name: string]: Partial<ItemConfig>}} */
const coins = {
    'Copper piece'  : { rarity: 'common' },
    'Silver piece'  : null,
    'Electrum piece': { rarity: 'exotic' },
    'Gold piece'    : { rarity: 'rare' },
    'Platinum piece': { rarity: 'exotic' },
};

/** @type {ItemConfig[]} */
export default Object.entries(coins).map(([ name, config ]) => ({
    name,
    ...defaults,
    ...config,
}));
