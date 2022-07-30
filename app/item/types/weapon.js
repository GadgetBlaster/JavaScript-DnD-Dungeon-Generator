// @ts-check

/** @typedef {import('../item.js').ItemPartial} ItemPartial */

/** @type {Omit<ItemPartial, "name">} */
const defaults = {
    type  : 'weapon',
    rarity: 'uncommon',
    size  : 'medium',
};

/** @type {{ [name: string]: Partial<ItemPartial>?}} */
const weapons = {
    'Battleaxe'      : { rarity: 'average' },
    'Blowgun'        : null,
    'Caltrops'       : { size: 'tiny', maxCount: 20 },
    'Club'           : { rarity: 'abundant' },
    'Crossbow, hand' : { rarity: 'rare' },
    'Crossbow, heavy': { rarity: 'rare' },
    'Crossbow, light': { rarity: 'rare' },
    'Dagger'         : { size: 'small', rarity: 'common' },
    'Dart'           : { size: 'tiny' },
    'Flail'          : null,
    'Glaive'         : { size: 'large' },
    'Greataxe'       : { size: 'large' },
    'Greatclub'      : { size: 'large' },
    'Greatsword'     : { size: 'large' },
    'Halberd'        : { size: 'large' },
    'Handaxe'        : null,
    'Javelin'        : null,
    'Lance'          : null,
    'Light hammer'   : null,
    'Longbow'        : { size: 'large' },
    'Longsword'      : { size: 'large' },
    'Mace'           : null,
    'Maul'           : null,
    'Morningstar'    : null,
    'Net'            : null,
    'Pike'           : null,
    'Quarterstaff'   : { size: 'large', rarity: 'common' },
    'Rapier'         : null,
    'Scimitar'       : null,
    'Shortbow'       : null,
    'Shortsword'     : { rarity: 'average' },
    'Sickle'         : null,
    'Sling'          : null,
    'Spear'          : { size: 'large' },
    'Trident'        : { size: 'large' },
    'War pick'       : null,
    'Warhammer'      : { size: 'large' },
    'Whip'           : null,
};

/** @type {ItemPartial[]} */
export default Object.entries(weapons).map(([ name, config ]) => ({
    name,
    ...defaults,
    ...config,
}));
