// @ts-check

import { capacity } from './container.js';
import { rollArrayItem, createProbability } from '../../utility/roll.js';
import itemType from '../type.js';
import rarity from '../../attributes/rarity.js';
import roomType from '../../rooms/type.js';
import size from '../../attributes/size.js';

const defaults = {
    quantity: 1,
    rarity  : rarity.average,
    size    : size.medium,
    type    : itemType.furnishing,
};

const defaultCapacity = capacity[size.medium];

const furnishing = {
    alchemy  : { name: 'Alchemy equipment' },
    anvil    : { name: 'Anvil' },
    bed      : { name: 'Bed', variants: [ 'single', 'double', 'queen', 'king', 'bedroll', 'cot', 'rag pile' ] },
    bench    : { name: 'Bench', variants: [ 'wood', 'cushioned', 'stone' ] },
    bookcase : { name: 'Bookcase', capacity: defaultCapacity, variants: [ 'wood', 'metal' ] },
    cabinet  : { name: 'Cabinet', capacity: defaultCapacity },
    carpet   : { name: 'Carpet' },
    chair    : { name: 'Chair', variants: [ 'armchair', 'wood', 'cushioned', 'stone', 'stool' ] },
    cupboard : { name: 'Cupboard', capacity: defaultCapacity },
    desk     : { name: 'Desk', capacity: defaultCapacity, variants: [ 'wood', 'stone', 'metal' ] },
    dresser  : { name: 'Dresser', capacity: defaultCapacity },
    firePit  : { name: 'Fire pit' },
    fireplace: { name: 'Fireplace' },
    forge    : { name: 'Forge' },
    lamp     : { name: 'Oil lamp' },
    mirror   : { name: 'Mirror, large' },
    painting : { name: 'Painting' },
    pillar   : { name: 'Pillar' },
    rack     : { name: 'Rack', capacity: defaultCapacity, variants: [ 'wood', 'metal' ] },
    shelf    : { name: 'Table, small', capacity: capacity[size.small] },
    shrine   : { name: 'Shrine' },
    spit     : { name: 'Cooking spit' },
    tableLg  : { name: 'Table, large', capacity: defaultCapacity, variants: [ 'wood', 'stone', 'metal' ] },
    tableSm  : { name: 'Table, small', capacity: capacity[size.small], variants: [ 'wood', 'stone', 'metal' ] },
    tapestry : { name: 'Tapestry' },
    throne   : { name: 'Throne' },
    torch    : { name: 'Torch' },
    wardrobe : { name: 'Wardrobe', capacity: defaultCapacity },
    workbench: { name: 'Workbench', capacity: defaultCapacity, variants: [ 'wood', 'stone', 'metal' ] },
};

Object.keys(furnishing).forEach((key) => {
    let item = furnishing[key];

    let label = item.name;

    if (item.variants) {
        // TODO this should but randomized for each instance when fetched...
        let variant = rollArrayItem(item.variants);
        label += `, ${variant}`;
    }

    furnishing[key] = {
        ...defaults,
        ...item,
        label,
    };
});

export default furnishing;

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

export const furnishingByRoomType = {
    [roomType.armory]    : [ anvil, bench, cabinet, forge, lamp, rack, tableLg, shelf, torch, workbench ],
    [roomType.atrium]    : [ bench, carpet, pillar ],
    [roomType.ballroom]  : [ bench, carpet, chair, fireplace, lamp, tableLg, tableSm ],
    [roomType.bathhouse] : [ bench, rack, shelf ],
    [roomType.bedroom]   : [ bed, bench, bookcase, carpet, chair, desk, dresser, fireplace, lamp, mirror, tableSm, shelf, shrine, wardrobe ],
    [roomType.chamber]   : [ bookcase, cabinet, carpet, chair, desk, fireplace, lamp, tableSm, shelf, torch ],
    [roomType.dining]    : [ bench, cabinet, carpet, chair, cupboard, fireplace, lamp, tableLg, tableSm, spit, torch ],
    [roomType.dormitory] : [ bed, carpet, bench, bookcase, chair, cupboard, desk, dresser, fireplace, pillar, rack, tableSm, shelf, torch ],
    [roomType.greatHall] : [ bench, carpet, bookcase, fireplace, forge, lamp, pillar, rack, tableLg, throne, shrine, torch ],
    [roomType.hallway]   : [ carpet, shelf, torch ],
    [roomType.kitchen]   : [ firePit, fireplace, lamp, rack, tableLg, tableSm, shelf, spit, workbench ],
    [roomType.laboratory]: [ alchemy, bench, bookcase, cabinet, carpet, chair, desk, fireplace, lamp, mirror, rack, tableSm, tableLg, shelf, torch, workbench ],
    [roomType.library]   : [ bench, bookcase, cabinet, carpet, chair, desk, fireplace, lamp, tableLg, tableSm, shelf ],
    [roomType.pantry]    : [ cabinet, cupboard, rack, shelf ],
    [roomType.parlour]   : [ bench, bookcase, cabinet, carpet, chair, desk, tableSm ],
    [roomType.room]      : [ carpet, firePit, tableSm, torch ],
    [roomType.shrine]    : [ carpet, lamp, shrine, torch ],
    [roomType.smithy]    : [ anvil, forge, workbench ],
    [roomType.storage]   : [ cabinet, cupboard, rack, tableSm, shelf ],
    [roomType.study]     : [ bookcase, cabinet, carpet, chair, desk, lamp, tableSm, shelf ],
    [roomType.throne]    : [ bench, carpet, lamp, pillar, tableLg, throne, torch ],
    [roomType.torture]   : [ fireplace, torch, workbench ],
    [roomType.treasury]  : [ carpet, desk, lamp, mirror, rack, tableLg, tableSm ],
};

/**
 * Furniture that must be included in a specific room type.
 */
export const requiredRoomFurniture = {
    [roomType.armory]    : [ rack ],
    [roomType.bedroom]   : [ bed ],
    [roomType.dining]    : [ tableLg ],
    [roomType.dormitory] : [ bed ],
    [roomType.kitchen]   : [ tableSm, spit ],
    [roomType.laboratory]: [ alchemy, workbench ],
    [roomType.library]   : [ bookcase ],
    [roomType.pantry]    : [ shelf ],
    [roomType.shrine]    : [ shrine ],
    [roomType.smithy]    : [ anvil, forge, workbench ],
    [roomType.storage]   : [ rack ],
    [roomType.study]     : [ chair, desk ],
    [roomType.throne]    : [ throne ],
};

export const anyRoomFurniture = [ painting, tapestry ];

// TODO use standard quantity values
export const furnitureQuantity = {
    none     : 'none',
    minimum  : 'minimum',
    sparse   : 'sparse',
    average  : 'average',
    furnished: 'furnished',
};

export const furnitureQuantityList = Object.keys(furnitureQuantity);

export const probability = createProbability([
    [ 25,  furnitureQuantity.none      ],
    [ 75,  furnitureQuantity.minimum   ],
    [ 92,  furnitureQuantity.sparse    ],
    [ 98,  furnitureQuantity.average   ],
    [ 100, furnitureQuantity.furnished ],
]);

export const furnishingQuantityRanges = {
    [furnitureQuantity.minimum]  : 1,
    [furnitureQuantity.sparse]   : 2,
    [furnitureQuantity.average]  : 4,
    [furnitureQuantity.furnished]: 6,
};
