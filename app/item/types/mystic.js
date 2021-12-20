// @ts-check

/** @typedef {import('../item.js').ItemConfig} ItemConfig */

/** @type {Omit<ItemConfig, "name">} */
const defaults = {
    rarity: 'rare',
    type  : 'mystic',
};

/** @type {{ [name: string]: Partial<ItemConfig>}} */
const mysticItems = {
    'Arcane focus' : { variants: [ 'crystal', 'orb', 'rod', 'staff', 'wand' ] },
    'Druidic focus': null,
    'Holy symbol'  : { variants: [ 'amulet', 'emblem', 'reliquary' ] },
    'Yew wand'     : null,
    'Spellbook'    : null,
};

/** @type {ItemConfig[]} */
export default Object.entries(mysticItems).map(([ name, config ]) => ({
    name,
    ...defaults,
    ...config,
}));
