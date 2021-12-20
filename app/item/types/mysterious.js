// @ts-check

/** @typedef {import('../item.js').ItemConfig} ItemConfig */

/** @type {Omit<ItemConfig, "name">} */
const defaults = {
    rarity: 'rare',
    type  : 'mysterious',
};

const mysteriousItems = [
    'Mysterious object',
];

/** @type {ItemConfig[]} */
export default mysteriousItems.map((name) => ({ ...defaults, name }));
