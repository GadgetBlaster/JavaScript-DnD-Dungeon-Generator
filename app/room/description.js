// @ts-check

import { capitalize, indefiniteArticle, isRequired, toss, toWords } from '../utility/tools.js';
import { cellFeet } from '../dungeon/grid.js';
import { outside } from '../dungeon/map.js';
import { em, strong, subtitle } from '../ui/typography.js';
import { getEnvironmentDescription } from './environment.js';
import { indicateRarity } from '../attribute/rarity.js';
import { list } from '../ui/list.js';
import { rollArrayItem } from '../utility/roll.js';
import { appendDoorway, lockable } from './door.js';
import { appendRoomTypes } from './room.js';

// -- Type Imports -------------------------------------------------------------

/** @typedef {import('../attribute/rarity.js').Rarity} Rarity */
/** @typedef {import('../attribute/size.js').Size} Size */
/** @typedef {import('../controller/knobs.js').DungeonConfig} DungeonConfig */
/** @typedef {import('../controller/knobs.js').RoomConfig} RoomConfig */
/** @typedef {import('../dungeon/grid.js').Dimensions} Dimensions */
/** @typedef {import('../dungeon/map.js').Connection} Connection */
/** @typedef {import('../dungeon/map.js').Door} Door */
/** @typedef {import('../item/furnishing.js').FurnitureQuantity} FurnitureQuantity */
/** @typedef {import('./door.js').DoorKey} DoorKey */
/** @typedef {import('./door.js').DoorType} DoorType */
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
 * @param {RoomConfig | DungeonConfig} config
 *
 * @returns {string}
 */
function getContentDescription(config) {
    let {
        itemQuantity,
        itemRarity,
        roomFurnitureQuantity,
        roomType,
    } = config;

    isRequired(roomType, 'roomType is required in `getRoomContentDescription()`');

    if (itemQuantity === 'zero') {
        return;
    }

    let furniture = getFurnitureDetail(roomFurnitureQuantity);
    let rarity    = getContentRarityDetail(itemRarity);
    let type      = getRoomTypeLabel(roomType).toLowerCase();

    let furnitureText;

    switch (itemQuantity) {
        case 'one':
            furnitureText = furniture ? (furniture + ' and') : '';
            return `The ${type} is entirely empty except for ${furnitureText} a single ${rarity} item`;

        case 'couple':
            furnitureText = furniture ? (' amongst ' + furniture ) : '';
            return `There are a couple of ${rarity} things in the ${type}${furnitureText}`;

        case 'few':
            furnitureText = furniture ? (' amongst ' + furniture ) : '';
            return `There are a few ${rarity} things in the ${type}${furnitureText}`;

        case 'some':
        case 'several':
            furnitureText = furniture ? (furniture + ' and ' ) : '';
            return `You can see ${furnitureText}${itemQuantity} ${rarity} items as you search around the ${type}`;

        case 'many':
            furnitureText = furniture ? (' and ' + furniture) : '';
            return `The ${type} is cluttered with ${rarity} items${furnitureText}`;

        case 'numerous':
            furnitureText = furniture ? (' amongst ' + furniture ) : '';
            return `There are numerous ${rarity} objects littering the ${type}${furnitureText}`;

        default:
            toss('Invalid itemQuantity in `getRoomContentDescription()`');
    }
}

/**
 * Get content rarity detail
 *
 * @private
 *
 * @param {Rarity | "random"} rarity
 *
 * @returns {string}
 */
function getContentRarityDetail(rarity) {
    if (rarity === 'random') {
        return '';
    }

    return indicateRarity.has(rarity) ? rarity : 'ordinary';
}

/**
 * Get description
 *
 * @private
 *
 * @param {RoomConfig | DungeonConfig} config
 *
 * @returns {string}
 */
function getDescription(config) {
    let {
        itemQuantity:  itemQuantity,
        roomCondition: roomCondition,
        roomSize:      roomSize,
        roomType:      roomType = 'room',
    } = config;

    let typeString = getRoomTypeLabel(roomType);

    if (roomSize && roomSize === 'medium') {
        roomSize = 'medium sized';
    }

    let empty    = itemQuantity === 'zero' ? 'empty' : '';
    let desc     = [ roomSize, empty, typeString ].filter(Boolean).join(' ');
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
 * @param {Pick<Door, "type" | "size" | "locked">} door
 *
 * @returns {string}
 */
function getDoorwayDescription({ type, size, locked }) {
    if (locked && !lockable.has(type)) {
        toss(`invalid locked setting for non-lockable door type "${type}" in getDoorwayDescription()`);
    }

    let append = appendDoorway.has(type) && 'doorway';

    let sizeDesc;

    if (size === 2) {
        sizeDesc = append ? 'double wide' : 'wide';
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
 * @param {RoomConfig | DungeonConfig} config
 *
 * @returns {string|undefined}
 */
function getItemConditionDescription(config) {
    let {
        itemQuantity : itemQuantity,
        itemCondition: itemCondition,
    } = config;

    if (itemQuantity === 'zero') {
        return;
    }

    switch (itemCondition) {
        case 'busted':
        case 'decaying':
            return `Everything in the room is ${itemCondition}`;

        case 'good':
        case 'poor':
            return `All of the items in the room are in ${itemCondition} condition`;

        case 'exquisite':
            return 'The room’s contents are in exquisite condition';

        case 'average':
        default:
            return;
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
 * @returns {?string}
 */
function getRoomDoorwayDescription(roomDoors, roomNumber) {
    isRequired(roomNumber, 'roomNumber is required in getRoomDoorwayDescription()');

    let descParts = roomDoors.map(({ type, connections, size, locked }) => {
        if (type === 'concealed' || type === 'secret') {
            return;
        }

        if (!connections[roomNumber]) {
            toss('Invalid door connections for roomNumber in getRoomDoorwayDescription()');
        }

        let { direction, to } = connections[roomNumber];

        let desc = getDoorwayDescription({ type, size, locked });
        let out  = to === outside ? ' out of the dungeon' : '';

        if (roomDoors.length === 1) {
            desc = `single ${desc}`;
        }

        return `${indefiniteArticle(desc)} ${desc} leads ${direction}${out}`;
    }).filter(Boolean);

    if (descParts.length === 0) {
        return;
    }

    let last = descParts.pop();

    if (descParts.length === 0) {
        return capitalize(last);
    }

    let comma = descParts.length > 1 ? ',' : '';

    return `${capitalize(descParts.join(', '))}${comma} and ${last}`;
}

export {
    getContentDescription        as testGetContentDescription,
    getContentRarityDetail       as testGetContentRarityDetail,
    getDescription               as testGetDescription,
    getDoorwayDescription        as testGetDoorwayDescription,
    getFurnitureDetail           as testGetFurnitureDetail,
    getItemConditionDescription  as testGetItemConditionDescription,
    getKeyDetail                 as testGetKeyDetail,
    getRoomDimensionsDescription as testGetRoomDimensionsDescription,
    getRoomDoorwayDescription    as testGetRoomDoorwayDescription,
};

// -- Public Functions ---------------------------------------------------------

/**
 * Returns a list of doorways.
 *
 * TODO return an object an handle formatting in formatter.js
 *
 * @param {Door[]} roomDoors
 * @param {number} roomNumber
 *
 * @returns {?string}
 */
export const getDoorwayList = (roomDoors, roomNumber) => {
    isRequired(roomNumber, 'roomNumber is required in getDoorwayList()');

    let doorList = roomDoors.map(({ type, connections, size, locked }) => {
        if (!connections[roomNumber]) {
            toss('Invalid roomNumber for door connections in getDoorwayList()');
        }

        let { direction, to } = connections[roomNumber];

        let desc    = getDoorwayDescription({ type, size, locked });
        let connect = to === outside ? 'leading out of the dungeon' : `to Room ${to}`;
        let text    = `${capitalize(direction)} ${connect} (${em(desc)})`;
        let secret  = type === 'concealed' || type === 'secret';

        return secret ? strong(text) : text;
    });

    return subtitle(`Doorways (${roomDoors.length})`) + list(doorList);
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
        let { connections, type } = key;
        let [ from, to ] = Object.keys(connections);

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
        settings,
        roomNumber,
        size: roomDimensions,
    } = room;

    let {
        roomCount: roomCount,
        roomType,
    } = settings;

    let number = roomCount > 1 ? ` ${roomNumber}` : '';
    let title  = `Room${number}`;
    let type;

    if (roomType !== 'room') {
        // TODO can be random?
        type = capitalize(getRoomTypeLabel(roomType));
    }

    let dimensions;

    if (roomDimensions) {
        dimensions = getRoomDimensionsDescription({
            width: roomDimensions[0],
            height: roomDimensions[1],
        });
    }

    let description = [
        getDescription(settings),
        ...getEnvironmentDescription(settings),
        getContentDescription(settings),
        getItemConditionDescription(settings),
        ...(roomDoors ? [ getRoomDoorwayDescription(roomDoors, roomNumber) ] : []),
    ].filter(Boolean).join('. ')+'.';

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
export const getRoomTypeLabel = (type) => toWords(type) + (appendRoomTypes.has(type) ? ' room' : '');
