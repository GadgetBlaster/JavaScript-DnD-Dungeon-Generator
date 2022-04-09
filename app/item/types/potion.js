// @ts-check

/** @typedef {import('../item.js').ItemPartial} ItemPartial */

/** @type {Omit<ItemPartial, "name">} */
const defaults = {
    rarity: 'rare',
    type  : 'potion',
};

// TODO more potions!
const potions = [
    'Potion of healing',
];

/** @type {ItemPartial[]} */
export default potions.map((name) => ({ ...defaults, name }));
