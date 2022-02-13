// @ts-check

/** @typedef {import('../item.js').ItemBase} ItemBase */

/** @type {Omit<ItemBase, "name">} */
const defaults = {
    rarity: 'rare',
    type  : 'mystic',
};

/** @type {{ [name: string]: Partial<ItemBase>}} */
const mysticItems = {
    'Arcane focus' : { variants: [ 'crystal', 'orb', 'rod', 'staff', 'wand' ] },
    'Druidic focus': null,
    'Holy symbol'  : { variants: [ 'amulet', 'emblem', 'reliquary' ] },
    'Yew wand'     : null,
    'Spellbook'    : null,
};

/** @type {ItemBase[]} */
export default Object.entries(mysticItems).map(([ name, config ]) => ({
    name,
    ...defaults,
    ...config,
}));
