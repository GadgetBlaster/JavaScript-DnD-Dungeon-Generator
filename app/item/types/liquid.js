// @ts-check

/** @typedef {import('../item.js').ItemBase} ItemBase */

const variants = [
    'barrel',
    'beaker',
    'bottle',
    'flask',
    'jar',
    'jug',
    'tankard',
    'vat',
    'vial',
    'waterskin',
];

/** @type {Omit<ItemBase, "name">} */
const defaults = {
    rarity  : 'uncommon',
    type    : 'liquid',
    variants: variants,
};

/** @type {{ [name: string]: Partial<ItemBase>}} */
const liquids = {
    'Acid'            : null,
    'Alchemist’s fire': null,
    'Ale'             : null,
    'Antitoxin'       : null,
    'Cider, apple'    : null,
    'Cider, hard'     : null,
    'Grog'            : null,
    'Holy water'      : null,
    'Oil, lamp'       : null,
    'Poison, basic'   : null,
    'Poison, deadly'  : { rarity: 'rare' },
    'Water, clean'    : { rarity: 'common' },
    'Water, dirty'    : { rarity: 'common' },
    'Whisky'          : null,
    'Wine, common'    : null,
    'Wine, fine'      : { rarity: 'rare' },
};

/** @type {ItemBase[]} */
export default Object.entries(liquids).map(([ name, config ]) => ({
    name,
    ...defaults,
    ...config,
}));
