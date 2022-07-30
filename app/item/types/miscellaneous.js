// @ts-check

/** @typedef {import('../item.js').ItemPartial} ItemPartial */

/** @type {Omit<ItemPartial, "name">} */
const defaults = {
    rarity: 'common',
};

/** @type {{ [name: string]: Partial<ItemPartial>?}} */
const miscellaneousItems = {
    'Bell'       : null,
    'Bone'       : { variants: [ 'rib', 'pelvis', 'femur', 'leg', 'arm' ] },
    'Bones'      : { maxCount: 10, size: 'tiny', variants: [ 'finger', 'foot', 'vertebrae' ]  },
    'Bones, pile': { size: 'medium' },
    'Candle'     : { rarity: 'abundant', maxCount: 5 },
    'Canvas'     : { variants: [ '1 foot', '5 feet', '10 feet', '20 foot' ] },
    'Cloth, bolt': { maxCount: 10, variants: [ 'common', 'fine' ] },
    'Cotton'     : { variants: [ '1 foot', '5 feet', '10 feet', '20 foot' ] },
    'Hide'       : { variants: [ 'wolf', 'bear', 'deer', 'rabbit', 'raccoon', 'beaver' ] },
    'Incense'    : { rarity: 'rare' },
    'Instrument' : { rarity: 'exotic', variants: [ 'Bagpipes', 'Drum', 'Dulcimer', 'Flute', 'Lute', 'Lyre', 'Horn', 'Pan flute', 'Shawm', 'Viol' ] }, // eslint-disable-line max-len
    'Iron, bar'  : { rarity: 'uncommon' },
    'Linen'      : { variants: [ '1 foot', '5 feet', '10 feet', '20 foot' ] },
    'Manacles'   : null,
    'Perfume'    : { variants: [ 'vial', 'bottle' ] },
    'Boulder'    : { size: 'large' },
    'Rock'       : { size: 'medium' },
    'Silk'       : { rarity: 'rare', variants: [ '1 foot', '5 feet', '10 feet', '20 foot' ] },
    'Skull'      : null,
    'Stone'      : { size: 'tiny' },
    'String'     : { variants: [ '1 foot', '5 feet', '10 feet', '20 foot' ] },
    'Torch'      : null,
    'Totem'      : null,
};

/** @type {ItemPartial[]} */
export default Object.entries(miscellaneousItems).map(([ name, config ]) => ({
    name,
    ...defaults,
    ...config,
}));
