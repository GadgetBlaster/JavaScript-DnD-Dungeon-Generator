// @ts-check

/** @typedef {import('../item.js').ItemPartial} ItemPartial */

/** @type {Omit<ItemPartial, "name">} */
const defaults = {
    rarity: 'legendary',
    type  : 'treasure',
};

const treasure = [
    'Treasure', // TODO more treasure types
];

/** @type {ItemPartial[]} */
export default treasure.map((name) => ({ ...defaults, name }));
