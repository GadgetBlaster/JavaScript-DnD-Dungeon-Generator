// @ts-check

/** @typedef {import('../item.js').ItemBase} ItemBase */

/** @type {Omit<ItemBase, "name">} */
const defaults = {
    rarity: 'legendary',
    type  : 'treasure',
};

const treasure = [
    'Treasure', // TODO more treasure types
];

/** @type {ItemBase[]} */
export default treasure.map((name) => ({ ...defaults, name }));
