// @ts-check

/** @typedef {import('../item.js').ItemBase} ItemBase */

/** @type {Omit<ItemBase, "name">} */
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

/** @type {ItemBase[]} */
export default ammunition.map((name) => ({ ...defaults, name }));
