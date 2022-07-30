// @ts-check

/** @typedef {import('../item.js').ItemPartial} ItemPartial */
/** @typedef {import('../../attribute/size.js').Size} Size */

/**
 * Item size lookup defining the number of small items which can fit into a
 * container or furnishing. 1 is equal to a single small item.
 *
 * @type {{ [key in Size]?: number }}
 */
export const capacity = {
    tiny  : 0.5,
    small : 1,
    medium: 5,
    large : 10,
};

/**
 * Item size lookup defining the amount of space required. 1 is equal to a
 * single small item.
 *
 * @type {{ [key in Size]?: number }}
 */
export const itemSizeSpace = {
    tiny  : 0.5,
    small : 1,
};

// TODO figure out what exactly this does.
export const maxItemQuantitySmall = 10;

/** @type {Omit<ItemPartial, "name">} */
const defaults = {
    rarity: 'common',
    size  : 'small',
    type  : 'container',
};

/** @type {{ [name: string]: Partial<ItemPartial>}} */
const containers = {
    'Backpack'           : { size: 'medium' },
    'Barrel, large'      : { size: 'large' },
    'Barrel, medium'     : { size: 'medium' },
    'Barrel, small'      : { },
    'Basket, large'      : { size: 'medium' },
    'Basket, small'      : { size: 'small' },
    'Belt pouch, large'  : { },
    'Belt pouch, small'  : { size: 'tiny' },
    'Bottle, glass'      : { size: 'tiny' },
    'Bowl'               : { variants: [ 'wood', 'stone', 'glass' ] },
    'Box, large'         : { size: 'large', variants: [ 'wood', 'stone', 'metal' ] },
    'Box, medium'        : { size: 'medium', variants: [ 'wood', 'stone', 'metal' ] },
    'Box, small'         : { variants: [ 'wood', 'stone', 'metal' ] },
    'Bucket'             : { },
    'Case, crossbow bolt': { },
    'Case, map or scroll': { },
    'Chest, large'       : { size: 'large' },
    'Chest, medium'      : { size: 'medium' },
    'Chest, small'       : { },
    'Component pouch'    : { size: 'tiny', rarity: 'rare' },
    'Crate'              : { },
    'Flask'              : { size: 'tiny' },
    'Glass case'         : { size: 'medium' },
    'Jug'                : { },
    'Pitcher'            : { },
    'Pouch'              : { size: 'tiny' },
    'Quiver'             : { },
    'Sack'               : { },
    'Tankard'            : { size: 'tiny', rarity: 'abundant' },
    'Vial'               : { size: 'tiny', rarity: 'uncommon' },
    'Wagon'              : { size: 'large' },
    'Waterskin'          : { },
};

// TODO tests

/** @type {ItemPartial[]} */
export default Object.entries(containers).map(([ name, config ]) => ({
    name,
    capacity: config.size ? capacity[config.size] : capacity.small,
    ...defaults,
    ...config,
}));
