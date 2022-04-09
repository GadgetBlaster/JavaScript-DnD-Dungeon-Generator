// @ts-check

/** @typedef {import('../item.js').ItemPartial} ItemPartial */

/** @type {Omit<ItemPartial, "name">} */
const defaults = {
    maxCount: 50,
    rarity  : 'common',
    type    : 'ammo',
};

const ammunition = [
    'Arrow',
    'Blowgun needle',
    'Crossbow bolt',
    'Sling bullet',
];

/** @type {ItemPartial[]} */
export default ammunition.map((name) => ({ ...defaults, name }));
