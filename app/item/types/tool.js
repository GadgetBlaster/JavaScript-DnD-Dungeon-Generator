// @ts-check

/** @typedef {import('../item.js').ItemPartial} ItemPartial */

/** @type {Omit<ItemPartial, "name">} */
const defaults = {
    type: 'tool',
};

/** @type {{ [name: string]: Partial<ItemPartial>?}} */
const tools = {
    'Alchemist’s supplies'   : { rarity: 'rare' },
    'Ball bearings'          : { maxCount: 100 },
    'Block and tackle'       : { size: 'medium'  },
    'Brewer’s supplies'      : { rarity: 'uncommon'  },
    'Calligrapher’s supplies': { rarity: 'rare' },
    'Carpenter’s tools'      : { rarity: 'common' },
    'Cartographer’s tools'   : { rarity: 'rare' },
    'Chain'                  : { variants: [ 'heavy', 'light' ] },
    'Cobbler’s tools'        : null,
    'Compass'                : {  rarity: 'rare', size: 'tiny' },
    'Cook’s utensils'        : null,
    'Crowbar'                : {  size: 'medium'  },
    'Dice set'               : null, // TODO variations
    'Disguise kit'           : { rarity: 'rare' },
    'Dragonchess set'        : { rarity: 'rare' },
    'Forgery kit'            : { rarity: 'rare' },
    'Glassblower’s tools'    : {  rarity: 'rare' },
    'Grappling hook'         : {  rarity: 'uncommon'  },
    'Hammer, sledge'         : { size: 'large'  },
    'Hammer'                 : null,
    'Healer’s kit'           : { rarity: 'rare' },
    'Herbalism kit'          : { rarity: 'rare' },
    'Jeweler’s tools'        : { rarity: 'rare' },
    'Ladder'                 : { size: 'large' , variants: [ 'stepping', '5 foot', '10 foot', '20 foot' ] },
    'Lantern, bullseye'      : null,
    'Lantern, hooded'        : null,
    'Leatherworker’s tools'  : null,
    'Lock'                   : { variants: [ 'door', 'bolt', 'combination' ] },
    'Magnifying glass'       : { rarity: 'rare' },
    'Mason’s tools'          : null,
    'Mirror, steel'          : { rarity: 'uncommon'  },
    'Navigator’s tools'      : { rarity: 'uncommon'  },
    'Painter’s supplies'     : null,
    'Pick, miner’s'          : { size: 'medium'  },
    'Playing card set'       : null,
    'Poisoner’s kit'         : { rarity: 'rare' },
    'Pole, 1 foot'           : null,
    'Pole'                   : { size: 'large' , variants: [ '5 foot', '10 foot', '20 foot' ] },
    'Potter’s tools'         : null,
    'Ram, portable'          : { size: 'large'  },
    'Rope, hempen'           : { size: 'medium' , variants: [ '10 feet', '25 feet', '50 feet', '100 feet' ] },
    'Rope, silk'             : { size: 'medium' , variants: [ '10 feet', '25 feet', '50 feet', '100 feet' ] },
    'Sewing kit'             : { size: 'tiny' },
    'Shovel'                 : { size: 'medium'  },
    'Smith’s tools'          : { rarity: 'uncommon'  },
    'Spikes, iron'           : { maxCount: 100 },
    'Spyglass'               : { rarity: 'rare' },
    'Thieves’ tools'         : { rarity: 'rare' },
    'Three-Dragon Antet set' : { rarity: 'rare' },
    'Tinker’s tools'         : { rarity: 'rare' },
    'Weaver’s tools'         : null,
    'Whetstone'              : { rarity: 'uncommon'  },
    'Woodcarver’s tools'     : null,
    'Wooden staff'           : { size: 'medium'  },
};

/** @type {ItemPartial[]} */
export default Object.entries(tools).map(([ name, config ]) => ({
    name,
    ...defaults,
    ...config,
}));
