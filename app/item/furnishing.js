// @ts-check

import { capacity } from './types/container.js';
import { rollArrayItem, createProbability } from '../utility/roll.js';

// -- Type Imports -------------------------------------------------------------

/** @typedef {import('../room/room.js').RoomType} RoomType */
/** @typedef {import('./generate.js').Item} Item */
/** @typedef {import('./item.js').ItemPartial} ItemPartial */

// -- Types --------------------------------------------------------------------

/** @typedef {keyof furnishing} FurnishingType */
/** @typedef {typeof furnitureQuantities[number]} FurnitureQuantity */

// -- Config -------------------------------------------------------------------

/** @type {Omit<ItemPartial, "name">} */
const defaults = {
    maxCount: 1,
    rarity  : 'average',
    size    : 'medium',
    type    : 'furnishing',
};

/** @type {{ [furnishing: string]: ItemPartial }} */
const furnishing = {
    alchemy  : { name: 'Alchemy equipment' },
    anvil    : { name: 'Anvil' },
    bed      : { name: 'Bed', variants: [ 'single', 'double', 'queen', 'king', 'bedroll', 'cot', 'rag pile' ] },
    bench    : { name: 'Bench', variants: [ 'wood', 'cushioned', 'stone' ] },
    bookcase : { name: 'Bookcase', capacity: capacity.medium, variants: [ 'wood', 'metal' ] },
    cabinet  : { name: 'Cabinet', capacity: capacity.medium },
    carpet   : { name: 'Carpet' },
    chair    : { name: 'Chair', variants: [ 'armchair', 'wood', 'cushioned', 'stone', 'stool' ] },
    cupboard : { name: 'Cupboard', capacity: capacity.medium },
    desk     : { name: 'Desk', capacity: capacity.medium, variants: [ 'wood', 'stone', 'metal' ] },
    dresser  : { name: 'Dresser', capacity: capacity.medium },
    firePit  : { name: 'Fire pit' },
    fireplace: { name: 'Fireplace' },
    forge    : { name: 'Forge' },
    lamp     : { name: 'Oil lamp' },
    mirror   : { name: 'Mirror, large' },
    painting : { name: 'Painting' },
    pillar   : { name: 'Pillar' },
    rack     : { name: 'Rack', capacity: capacity.medium, variants: [ 'wood', 'metal' ] },
    shelf    : { name: 'Table, small', capacity: capacity.small },
    shrine   : { name: 'Shrine' },
    spit     : { name: 'Cooking spit' },
    tableLg  : { name: 'Table, large', capacity: capacity.medium, variants: [ 'wood', 'stone', 'metal' ] },
    tableSm  : { name: 'Table, small', capacity: capacity.small, variants: [ 'wood', 'stone', 'metal' ] },
    tapestry : { name: 'Tapestry' },
    throne   : { name: 'Throne' },
    torch    : { name: 'Torch' },
    wardrobe : { name: 'Wardrobe', capacity: capacity.medium },
    workbench: { name: 'Workbench', capacity: capacity.medium, variants: [ 'wood', 'stone', 'metal' ] },
};

Object.keys(furnishing).forEach((key) => {
    let item = furnishing[key];

    let label = item.name;

    if (item.variants) {
        // TODO this should be randomized for each instance when fetched...
        let variant = rollArrayItem(item.variants);
        label += `, ${variant}`;
    }

    furnishing[key] = /** @type {ItemPartial} */ ({
        ...defaults,
        ...item,
        label,
    });
});

export { furnishing };

let {
    alchemy,
    anvil,
    bed,
    bench,
    bookcase,
    cabinet,
    carpet,
    chair,
    cupboard,
    desk,
    dresser,
    firePit,
    fireplace,
    forge,
    lamp,
    mirror,
    painting,
    pillar,
    rack,
    shelf,
    shrine,
    spit,
    tableLg,
    tableSm,
    tapestry,
    throne,
    torch,
    wardrobe,
    workbench,
} = furnishing;

/**
 * Furniture that typically exists in a specific room type.
 */
export const furnishingByRoomType = {
    /* eslint-disable max-len */
    armory    : [ anvil, bench, cabinet, forge, lamp, rack, tableLg, shelf, torch, workbench ],
    atrium    : [ bench, carpet, pillar ],
    ballroom  : [ bench, carpet, chair, fireplace, lamp, tableLg, tableSm ],
    bathhouse : [ bench, rack, shelf ],
    bedroom   : [ bed, bench, bookcase, carpet, chair, desk, dresser, fireplace, lamp, mirror, tableSm, shelf, shrine, wardrobe ],
    chamber   : [ bookcase, cabinet, carpet, chair, desk, fireplace, lamp, tableSm, shelf, torch ],
    dining    : [ bench, cabinet, carpet, chair, cupboard, fireplace, lamp, tableLg, tableSm, spit, torch ],
    dormitory : [ bed, carpet, bench, bookcase, chair, cupboard, desk, dresser, fireplace, pillar, rack, tableSm, shelf, torch ],
    greatHall : [ bench, carpet, bookcase, fireplace, forge, lamp, pillar, rack, tableLg, throne, shrine, torch ],
    hallway   : [ carpet, shelf, torch ],
    kitchen   : [ firePit, fireplace, lamp, rack, tableLg, tableSm, shelf, spit, workbench ],
    laboratory: [ alchemy, bench, bookcase, cabinet, carpet, chair, desk, fireplace, lamp, mirror, rack, tableSm, tableLg, shelf, torch, workbench ],
    library   : [ bench, bookcase, cabinet, carpet, chair, desk, fireplace, lamp, tableLg, tableSm, shelf ],
    pantry    : [ cabinet, cupboard, rack, shelf ],
    parlour   : [ bench, bookcase, cabinet, carpet, chair, desk, tableSm ],
    room      : [ carpet, firePit, tableSm, torch ],
    shrine    : [ carpet, lamp, shrine, torch ],
    smithy    : [ anvil, forge, workbench ],
    storage   : [ cabinet, cupboard, rack, tableSm, shelf ],
    study     : [ bookcase, cabinet, carpet, chair, desk, lamp, tableSm, shelf ],
    throne    : [ bench, carpet, lamp, pillar, tableLg, throne, torch ],
    torture   : [ fireplace, torch, workbench ],
    treasury  : [ carpet, desk, lamp, mirror, rack, tableLg, tableSm ],
    /* eslint-enable max-len */
};

/**
 * Furniture that must be included in a specific room type.
 */
export const requiredRoomFurniture = {
    armory    : [ rack ],
    bedroom   : [ bed ],
    dining    : [ tableLg ],
    dormitory : [ bed ],
    kitchen   : [ tableSm, spit ],
    laboratory: [ alchemy, workbench ],
    library   : [ bookcase ],
    pantry    : [ shelf ],
    shrine    : [ shrine ],
    smithy    : [ anvil, forge, workbench ],
    storage   : [ rack ],
    study     : [ chair, desk ],
    throne    : [ throne ],
};

/**
 * Furniture that can exist in any room type.
 */
export const anyRoomFurniture = [ painting, tapestry ];

export const furnitureQuantities = Object.freeze(/** @type {const} */ ([
    'none',
    'minimum',
    'sparse',
    'average',
    'furnished',
]));

/**
 * Furnishing quantity probability.
 *
 * @type {Readonly<{
 *   description: string;
 *   roll: () => FurnitureQuantity;
 * }>}
 */
export const probability = createProbability(new Map([
    [ 25,  'none'      ],
    [ 75,  'minimum'   ],
    [ 92,  'sparse'    ],
    [ 98,  'average'   ],
    [ 100, 'furnished' ],
]));

export const furnishingQuantityRanges = {
    minimum  : 1,
    sparse   : 2,
    average  : 4,
    furnished: 6,
};
