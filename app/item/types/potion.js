// @ts-check

/** @typedef {import('../item.js').ItemConfig} ItemConfig */

/** @type {Omit<ItemConfig, "name">} */
const defaults = {
    rarity: 'rare',
    type  : 'potion',
};

// TODO more potions!
const potions = [
    'Potion of healing',
];

/** @type {ItemConfig[]} */
export default potions.map((name) => ({ ...defaults, name }));
