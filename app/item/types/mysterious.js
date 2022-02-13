// @ts-check

/** @typedef {import('../item.js').ItemBase} ItemBase */

/** @type {Omit<ItemBase, "name">} */
const defaults = {
    rarity: 'rare',
    type  : 'mysterious',
};

const mysteriousItems = [
    'Mysterious object',
];

/** @type {ItemBase[]} */
export default mysteriousItems.map((name) => ({ ...defaults, name }));
