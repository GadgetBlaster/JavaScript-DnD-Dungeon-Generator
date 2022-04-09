// @ts-check

/** @typedef {import('../item.js').ItemPartial} ItemPartial */

/** @type {Omit<ItemPartial, "name">} */
const defaults = {
    rarity: 'uncommon',
    type  : 'chancery',
};

/** @type {{ [name: string]: Partial<ItemPartial>}} */
const chanceryItems = {
    'Abacus'           : { rarity: 'rare' },
    'Book'             : { rarity: 'common' },
    'Chalk'            : { size: 'tiny' },
    'Hourglass'        : { rarity: 'rare' },
    'Ink pen'          : { size: 'tiny' },
    'Ink'              : { size: 'tiny', variants: [ 'vial', 'bottle' ] },
    'Journal'          : { variants: [ 'blank', 'adventurer’s', 'noble person’s', 'hermit’s', 'wizard’s', 'merchant’s' ] }, // eslint-disable-line max-len
    'Letter opener'    : { size: 'tiny' },
    'Paper'            : { maxCount: 100 },
    'Paperweight'      : { size: 'tiny' },
    'Parchment'        : { maxCount: 100 },
    'Pencil'           : { size: 'tiny' },
    'Scale, merchant’s': { rarity: 'rare' },
    'Scroll'           : { size: 'tiny', rarity: 'common' },
    'Sealing wax'      : { size: 'tiny' },
    'Signet ring'      : { size: 'tiny' },
    'Wax seal'         : { size: 'tiny' },
};

/** @type {ItemPartial[]} */
export default Object.entries(chanceryItems).map(([ name, config ]) => ({
    name,
    ...defaults,
    ...config,
}));
