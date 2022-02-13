// @ts-check

/** @typedef {import('../item.js').ItemBase} ItemBase */

/** @type {Omit<ItemBase, "name">} */
const defaults = {
    rarity: 'rare',
    type  : 'potion',
};

// TODO more potions!
const potions = [
    'Potion of healing',
];

/** @type {ItemBase[]} */
export default potions.map((name) => ({ ...defaults, name }));
