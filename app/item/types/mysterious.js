// @ts-check

/** @typedef {import('../item.js').ItemPartial} ItemPartial */

/** @type {Omit<ItemPartial, "name">} */
const defaults = {
    rarity: 'rare',
    type  : 'mysterious',
};

const mysteriousItems = [
    'Mysterious object',
];

/** @type {ItemPartial[]} */
export default mysteriousItems.map((name) => ({ ...defaults, name }));
