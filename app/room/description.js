// @ts-check

import { capitalize, indefiniteArticle, isRequired, toss, toWords } from '../utility/tools.js';
import { cellFeet } from '../dungeon/grid.js';
import { directions, outside } from '../dungeon/map.js';
import { subtitle } from '../ui/typography.js';
import { getEnvironmentDescription } from './environment.js';
import { indicateRarity } from '../attribute/rarity.js';
import { list } from '../ui/list.js';
import { rollArrayItem } from '../utility/roll.js';
import { appendDoorway, appendPassage, lockable } from './door.js';
import { appendRoomTypes, customRoomLabels } from './room.js';

// -- Type Imports -------------------------------------------------------------

/** @typedef {import('../attribute/rarity.js').Rarity} Rarity */
/** @typedef {import('../attribute/size.js').Size} Size */
/** @typedef {import('../controller/knobs.js').DungeonConfig} DungeonConfig */
/** @typedef {import('../controller/knobs.js').RoomConfig} RoomConfig */
/** @typedef {import('../dungeon/grid.js').Dimensions} Dimensions */
/** @typedef {import('../dungeon/map.js').Direction} Direction */
/** @typedef {import('../dungeon/map.js').Door} Door */
/** @typedef {import('../item/furnishing.js').FurnitureQuantity} FurnitureQuantity */
/** @typedef {import('./door.js').DoorKey} DoorKey */
/** @typedef {import('./door.js').DoorType} DoorType */
/** @typedef {import('./generate').RandomizedRoomConfig} RandomizedRoomConfig */
/** @typedef {import('./generate').Room} Room */
/** @typedef {import('./room.js').RoomType} RoomType */

// -- Types --------------------------------------------------------------------

/**
 * @typedef {object} RoomDescription
 *
 * @prop {string} description
 * @prop {string} environment
 * @prop {string} [contents]
 * @prop {string} [items]
 * @prop {string} [doorways]
 */

// -- Config -------------------------------------------------------------------

const mapDescriptions = [
    'Searching the room reveals a map that appears to be of the dungeon.',
    'A large map of the dungeon is hanging on the wall.',
    'A map of the dungeon has crudely been carved in to the wall.',
    'Searching the room reveals a loose stone (or board) with a map hidden underneath it.',
    'The floor of the room is etched with an intricate map of the dungeon.',
];

// -- Private Functions --------------------------------------------------------

/**
 * Returns a description of the items in the room.
 *
 * @private
 * @throws
 *
 * @param {RandomizedRoomConfig} config
 *
 * @returns {string | undefined}
 */
function getContentDescription(config) {
    let {
        itemQuantity,
        roomFurnitureQuantity,
        roomType,
        uniformItemRarity,
    } = config;

    isRequired(roomType, 'roomType is required in getRoomContentDescription()');

    if (itemQuantity === 'zero') {
        return;
    }

    let furniture = getFurnitureDetail(roomFurnitureQuantity);
    let rarity    = getContentRarityDetail(uniformItemRarity);
    let type      = getRoomLabel(roomType).toLowerCase();

    let furnitureText;

    switch (itemQuantity) {
        case 'one':
            furnitureText = furniture ? (furniture + ' and') : '';
            return `The ${type} is entirely empty except for ${furnitureText} a single ${rarity} item`;

        case 'couple':
            furnitureText = furniture ? ('amongst ' + furniture ) : '';
            return `There are a couple of ${rarity} things in the ${type} ${furnitureText}`;

        case 'few':
            furnitureText = furniture ? ('amongst ' + furniture ) : '';
            return `There are a few ${rarity} things in the ${type} ${furnitureText}`;

        case 'some':
        case 'several':
            furnitureText = furniture ? (furniture + ' and' ) : '';
            return `You can see ${furnitureText} ${itemQuantity} ${rarity} items as you search around the ${type}`;

        case 'many':
            furnitureText = furniture ? ('and ' + furniture) : '';
            return `The ${type} is cluttered with ${rarity} items ${furnitureText}`;

        case 'numerous':
            furnitureText = furniture ? ('amongst ' + furniture ) : '';
            return `There are numerous ${rarity} objects littering the ${type} ${furnitureText}`;

        default:
            toss('Invalid itemQuantity in getRoomContentDescription()');
    }
}

/**
 * Get content rarity detail
 *
 * @private
 * @throws
 *
 * @param {Rarity} [rarity]
 *
 * @returns {string}
 */
function getContentRarityDetail(rarity) {
    // @ts-expect-error
    if (rarity === 'random') {
        toss('rarity cannot be "random" in getContentRarityDetail()');
    }

    if (!rarity) {
        return '';
    }

    return indicateRarity.has(rarity) ? rarity : 'ordinary';
}

/**
 * Returns a room description for the given config.
 *
 * @private
 *
 * @param {RandomizedRoomConfig} config
 *
 * @returns {string}
 */
function getDescriptionIntro(config) {
    let {
        itemQuantity,
        roomCondition,
        roomSize,
        roomType,
    } = config;

    let typeString = getRoomLabel(roomType);

    let sizeDescription = roomSize === 'medium'
        ? 'medium sized'
        : roomSize;

    let empty    = itemQuantity === 'zero' ? 'empty' : '';
    let desc     = [ sizeDescription, empty, typeString ].filter(Boolean).join(' ');
    let sentence = `You enter ${indefiniteArticle(desc)} ${desc}`;

    if (roomCondition && roomCondition !== 'average') {
        sentence += ` in ${roomCondition} condition`;
    }

    return sentence;
}

/**
 * Returns a description for the given door.
 *
 * @private
 * @throws
 *
 * @param {Door} door
 *
 * @returns {string}
 */
function getDoorwayDescription({ direction, locked, rectangle, type }) {
    if (locked && !lockable.has(type)) {
        toss(`Invalid locked setting for non-lockable door type "${type}" in getDoorwayDescription()`);
    }

    let append;

    if (appendDoorway.has(type)) {
        append = 'doorway';
    } else if (appendPassage.has(type)) {
        append = 'passage';
    }

    let sizeDesc;
    let size = direction == 'east' || direction == 'west'
        ? rectangle.height
        : rectangle.width;

    if (size === 2) {
        sizeDesc = append === 'doorway' ? 'double wide' : 'wide';
    } else if (size === 3) {
        sizeDesc = 'large';
    } else if (size > 3) {
        sizeDesc = 'massive';
    }

    let lockedDesc = locked ? 'locked' : '';

    return [ sizeDesc, lockedDesc, type, append ].filter(Boolean).join(' ');
}

/**
 * Get furniture detail
 *
 * @private
 *
 * @param {FurnitureQuantity} furnitureQuantity
 *
 * @returns {string}
 */
function getFurnitureDetail(furnitureQuantity) {
    switch (furnitureQuantity) {
        case 'minimum':
            return 'minimal furnishings';

        case 'sparse':
            return 'sparse furnishings';

        case 'average':
        case 'furnished':
            return 'some furniture';

        default:
            return '';
    }
}

/**
 * Get item condition description
 *
 * @private
 *
 * @param {RandomizedRoomConfig} config
 *
 * @returns {string | undefined}
 */
function getItemConditionDescription(config) {
    let {
        itemQuantity,
        uniformItemCondition,
    } = config;

    isRequired(itemQuantity, 'itemQuantity is required in getItemConditionDescription()');

    if (itemQuantity === 'zero' || !uniformItemCondition) {
        return;
    }

    switch (uniformItemCondition) {
        case 'busted':
        case 'decaying':
            return `Everything in the room is ${uniformItemCondition}`;

        case 'good':
        case 'poor':
            return `All of the items in the room are in ${uniformItemCondition} condition`;

        case 'exquisite':
            return 'The room\'s contents are in exquisite condition';
    }
}

/**
 * Get key detail
 *
 * @private
 *
 * @param {DoorType} type
 *
 * @returns {string}
 */
function getKeyDetail(type) {
    switch (type) {
        case 'brass':
        case 'iron':
        case 'steel':
        case 'stone':
            return capitalize(type) + ' key';

        case 'wooden':
            return 'Wooden handled key';

        case 'portcullis':
            return 'Large rusty key';

        case 'mechanical':
            return 'A mechanical leaver';

        default:
            // TODO toss()
            console.warn(`Undefined key description for lockable door type ${type}`);
            return 'Key';
    }
}

/**
 * Returns a description of the room's dimensions.
 *
 * @private
 *
 * @param {Dimensions} roomSize
 *
 * @returns {string}
 */
function getRoomDimensionsDescription({ width, height }) {
    return `${width * cellFeet} x ${height * cellFeet} feet`;
}

/**
 * Get room doorway description
 *
 * @private
 *
 * @param {Door[]} roomDoors
 * @param {number} roomNumber
 *
 * @returns {string | undefined}
 */
function getRoomDoorwayDescription(roomDoors, roomNumber) {
    isRequired(roomNumber, 'roomNumber is required in getRoomDoorwayDescription()');

    let descParts = roomDoors.map((door) => {
        let { type, connect } = door;

        if (type === 'concealed' || type === 'secret') {
            return;
        }

        let connection = connect[roomNumber];

        if (!connection) {
            toss('Invalid door connection for roomNumber in getRoomDoorwayDescription()');
        }

        let { direction, to } = connection;

        let desc = getDoorwayDescription(door);
        let out  = to === outside ? ' out of the dungeon' : '';

        if (roomDoors.length === 1) {
            desc = `single ${desc}`;
        }

        return `${indefiniteArticle(desc)} ${desc} leads ${direction}${out}`;
    }).filter(Boolean);

    let last = descParts.pop();

    if (!last) {
        return;
    }

    if (descParts.length === 0) {
        return capitalize(last);
    }

    let comma = descParts.length > 1 ? ',' : '';

    return `${capitalize(descParts.join(', '))}${comma} and ${last}`;
}

/**
 * Returns an array of door configs sorted by direction relative to the given
 * room number.
 *
 * @private
  *
 * @param {Door[]} roomDoors
 * @param {number} roomNumber
 *
 * @returns {Door[]}
 */
function sortDoorways(roomDoors, roomNumber) {
    if (roomDoors.length === 1) {
        return roomDoors;
    }

    return roomDoors.sort((doorA, doorB) => {
        let { connect: connectionA } = doorA;
        let { connect: connectionB } = doorB;

        let a = connectionA[roomNumber];
        let b = connectionB[roomNumber];

        if (!a || !b) {
            toss(`Invalid roomNumber "${roomNumber}" for door connection in sortDoorways()`);
        }

        let { direction: directionA, to: toA } = a;
        let { direction: directionB, to: toB } = b;

        if (directionA === directionB) {
            return toA - toB;
        }

        return directions.indexOf(directionA) - directions.indexOf(directionB);
    });
}

export {
    getContentDescription        as testGetContentDescription,
    getContentRarityDetail       as testGetContentRarityDetail,
    getDescriptionIntro          as testGetDescriptionIntro,
    getDoorwayDescription        as testGetDoorwayDescription,
    getFurnitureDetail           as testGetFurnitureDetail,
    getItemConditionDescription  as testGetItemConditionDescription,
    getKeyDetail                 as testGetKeyDetail,
    getRoomDimensionsDescription as testGetRoomDimensionsDescription,
    getRoomDoorwayDescription    as testGetRoomDoorwayDescription,
    sortDoorways                 as testSortDoorways,
};

// -- Public Functions ---------------------------------------------------------

/**
 * Returns a list of doorway descriptions objects.
 *
 * @param {Door[]} roomDoors
 * @param {number} roomNumber
 *
 * @returns {{
 *   connection: string;
 *   desc: string;
 *   direction: Direction;
 * }[]}
 */
export const getDoorwayDescriptionList = (roomDoors, roomNumber) => {
    isRequired(roomNumber, 'roomNumber is required in getDoorwayDescriptionList()');

    return sortDoorways(roomDoors, roomNumber).map((door) => {
        let { connect } = door;

        let connection = connect[roomNumber];

        if (!connection) {
            toss('Invalid roomNumber for door connection in getDoorwayDescriptionList()');
        }

        let { direction, to } = connection;

        return {
            connection: to === outside ? 'leading out of the dungeon' : `to room ${to}`,
            desc: getDoorwayDescription(door),
            direction,
        };
    });
};

/**
 * Get key description
 *
 * TODO move to formatter.js
 *
 * @param {DoorKey[]} keys
 *
 * @returns {string}
 */
export const getKeyDescription = (keys) => {
    return subtitle(`Keys (${keys.length})`) + list(keys.map((key) => {
        let { connect, type } = key;
        let [ from, to ] = Object.keys(connect);

        return `${getKeyDetail(type)} to room ${from} / ${to}`;
    }));
};

/**
 * Get map description
 *
 * TODO move to formatter.js
 *
 * @returns {string}
 */
export const getMapDescription = () => {
    return subtitle('Map') + list([ rollArrayItem(mapDescriptions) ]);
};

/**
 * Get room description
 *
 * @param {Room} room
 * @param {Door[]} [roomDoors]
 *
 * @returns {{
 *   description: string;
 *   dimensions?: string;
 *   title: string;
 *   type?: string;
 *}}
 */
export function getRoomDescription(room, roomDoors) {
    let {
        config,
        roomNumber,
        size: roomDimensions,
    } = room;

    let {
        roomType,
    } = config;

    let title = `Room ${roomNumber}`;
    let type;

    if (roomType !== 'room') {
        type = capitalize(getRoomLabel(roomType));
    }

    let dimensions;

    if (roomDimensions) {
        dimensions = getRoomDimensionsDescription({
            width: roomDimensions[0],
            height: roomDimensions[1],
        });
    }

    let description = [
        getDescriptionIntro(config),
        ...getEnvironmentDescription(config),
        getContentDescription(config),
        getItemConditionDescription(config),
        ...(roomDoors ? [ getRoomDoorwayDescription(roomDoors, roomNumber) ] : []),
    ].filter(Boolean).join('. ') + '.';

    return {
        description,
        dimensions,
        title,
        type,
    };
}

/**
 * Get room type label
 *
 * @param {RoomType} type
 *
 * @returns {string}
 */
export function getRoomLabel(type) {
    let customLabel = customRoomLabels[type];

    if (customLabel) {
        return customLabel;
    }

    return toWords(type) + (appendRoomTypes.has(type) ? ' room' : '');
}
