// @ts-check

/** @typedef {import('../item.js').ItemBase} ItemBase */

/** @type {Omit<ItemBase, "name">} */
const defaults = {
    rarity: 'uncommon',
    type  : 'survival',
};

/** @type {{ [name: string]: Partial<ItemBase>}} */
const survivalEquipment = {
    'Bedroll'           : { rarity: 'common' },
    'Blanket'           : { rarity: 'common' },
    'Climber’s kit'     : null,
    'Crampons'          : null,
    'Firewood'          : { rarity: 'abundant' },
    'Fishhook'          : null,
    'Fishing net, large': { size: 'large' },
    'Fishing net'       : { variants: [ 'small', 'medium' ] },
    'Fishing tackle'    : null,
    'Flint and steel'   : null,
    'Hunting trap'      : null,
    'Piton'             : null,
    'Signal whistle'    : null,
    'Tent'              : { variants: [ 'one-person', 'two-person', 'pavilion' ] },
    'Tinderbox'         : null,
};

/** @type {ItemBase[]} */
export default Object.entries(survivalEquipment).map(([ name, config ]) => ({
    name,
    ...defaults,
    ...config,
}));
