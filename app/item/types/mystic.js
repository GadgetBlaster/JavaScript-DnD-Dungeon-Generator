// @ts-check

/** @typedef {import('../item.js').ItemPartial} ItemPartial */

/** @type {Omit<ItemPartial, "name">} */
const defaults = {
    rarity: 'rare',
    type  : 'mystic',
};

/** @type {{ [name: string]: Partial<ItemPartial>?}} */
const mysticItems = {
    'Arcane focus' : { variants: [ 'crystal', 'orb', 'rod', 'staff', 'wand' ] },
    'Druidic focus': null,
    'Holy symbol'  : { variants: [ 'amulet', 'emblem', 'reliquary' ] },
    'Yew wand'     : null,
    'Spellbook'    : null,
};

/** @type {ItemPartial[]} */
export default Object.entries(mysticItems).map(([ name, config ]) => ({
    name,
    ...defaults,
    ...config,
}));
