
import { capacity } from './container';
import rarity from '../../attributes/rarity';
import roomType from '../../rooms/type';
import size from '../../attributes/size';
import itemType from '../type';
import { roll, rollArrayItem } from '../../utility/roll';

const defaults = {
    rarity: rarity.abundant,
    size  : size.medium,
    type  : itemType.furnishing,
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
    chair    : { name: 'Chair', variants: [ 'wood', 'cushioned', 'stone', 'stool' ] },
    cupboard : { name: 'Cupboard', capacity: defaultCapacity },
    desk     : { name: 'Desk', capacity: defaultCapacity, variants: [ 'wood', 'stone', 'metal' ] },
    dresser  : { name: 'Dresser', capacity: defaultCapacity },
    firePit  : { name: 'Fire pit' },
    fireplace: { name: 'Fireplace' },
    forge    : { name: 'Forge' },
    lamp     : { name: 'Oil lamp' },
    mirror   : { name: 'Mirror' },
    painting : { name: 'Painting' },
    pillar   : { name: 'Pillar' },
    rack     : { name: 'Rack', capacity: defaultCapacity, variants: [ 'wood', 'metal' ] },
    shackles : { name: 'Shackles' },
    shelf    : { name: 'Table, small', capacity: capacity[size.small] },
    shrine   : { name: 'Shrine' },
    spit     : { name: 'Cooking spit' },
    tableLg  : { name: 'Table, large', capacity: defaultCapacity, variants: [ 'wood', 'stone', 'metal' ] },
    tableSm  : { name: 'Table, small', capacity: capacity[size.small], variants: [ 'wood', 'stone', 'metal' ] },
    tapestry : { name: 'Tapestry' },
    throne   : { name: 'Throne' },
    torch    : { name: 'Torch' },
    torture  : { name: 'Torture equipment' },
    wardrobe : { name: 'Wardrobe', capacity: defaultCapacity },
    workbench: { name: 'Workbench', capacity: defaultCapacity, variants: [ 'wood', 'stone', 'metal' ] },
};

Object.keys(furnishing).forEach((key) => {
    let config = furnishing[key];

    furnishing[key] = {
        ...defaults,
        ...config,
    };
});

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
    shackles,
    shelf,
    shrine,
    spit,
    tableLg, tableSm,
    tapestry,
    throne,
    torch,
    torture,
    wardrobe,
    workbench,
} = furnishing;

const byRoomType = {
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
    [roomType.prison]    : [ shackles, torture ],
    [roomType.room]      : [ carpet, firePit, tableSm, torch ],
    [roomType.shrine]    : [ carpet, lamp, shrine, torch ],
    [roomType.smithy]    : [ anvil, forge, workbench ],
    [roomType.storage]   : [ cabinet, cupboard, rack, tableSm, shelf ],
    [roomType.study]     : [ bookcase, cabinet, carpet, chair, desk, lamp, tableSm, shelf ],
    [roomType.throne]    : [ bench, carpet, lamp, pillar, tableLg, throne, torch ],
    [roomType.torture]   : [ fireplace, shackles, torch, torture, workbench ],
    [roomType.treasury]  : [ carpet, desk, lamp, mirror, rack, tableLg, tableSm ],
};

const required = {
    [roomType.armory]    : [ rack ],
    [roomType.bedroom]   : [ bed ],
    [roomType.dining]    : [ tableLg ],
    [roomType.dormitory] : [ bed ],
    [roomType.kitchen]   : [ tableSm, spit ],
    [roomType.laboratory]: [ alchemy, workbench ],
    [roomType.library]   : [ bookcase ],
    [roomType.pantry]    : [ shelf ],
    [roomType.prison]    : [ shackles ],
    [roomType.shrine]    : [ shrine ],
    [roomType.smithy]    : [ anvil, forge, workbench ],
    [roomType.storage]   : [ rack ],
    [roomType.study]     : [ chair, desk ],
    [roomType.throne]    : [ throne ],
    [roomType.torture]   : [ shackles, torture ],
};

const any = [ painting, tapestry ];

export const furnitureQuantity = {
    none     : 'none',
    minimum  : 'minimum',
    sparse   : 'sparse',
    average  : 'average',
    furnished: 'furnished',
};

export const furnitureQuantityList = Object.keys(furnitureQuantity);

const quantityRanges = {
    [furnitureQuantity.minimum]  : 0,
    [furnitureQuantity.sparse]   : 2,
    [furnitureQuantity.average]  : 4,
    [furnitureQuantity.furnished]: 6,
};

export const getFurnishing = (type, quantity) => {
    let furniture = [];

    if (quantity === furnitureQuantity.none) {
        return furniture;
    }

    if (required[type]) {
        required.forEach((item) => {
            furniture.push(item);
        });
    }

    if (quantity === furnitureQuantity.minimum) {
        return furniture;
    }

    if (!byRoomType[type]) {
        return furniture;
    }

    let extraItems = roll(0, quantityRanges[quantity])

    if (!extraItems) {
        return furniture;
    }

    for (let i = 0; i < extraItems; i++) {
        let options = any.concat(byRoomType[type]);

        furniture.push(rollArrayItem(options));
    }

    return furniture;
};
