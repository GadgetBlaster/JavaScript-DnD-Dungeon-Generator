// @ts-check

/** @typedef {import('../item.js').ItemConfig} ItemConfig */

/** @type {Omit<ItemConfig, "name">} */
const defaults = {
    rarity: 'legendary',
    type  : 'treasure',
};

const treasure = [
    'Treasure', // TODO more treasure types
];

/** @type {ItemConfig[]} */
export default treasure.map((name) => ({ ...defaults, name }));
