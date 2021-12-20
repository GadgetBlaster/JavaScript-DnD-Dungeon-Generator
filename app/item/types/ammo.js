// @ts-check

/** @typedef {import('../item.js').ItemConfig} ItemConfig */

/** @type {Omit<ItemConfig, "name">} */
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

/** @type {ItemConfig[]} */
export default ammunition.map((name) => ({ ...defaults, name }));
