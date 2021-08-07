// @ts-check

import { capitalize, indefiniteArticle, toWords } from '../utility/tools.js';
import { cellFeet } from '../dungeons/grid.js';
import { element } from '../utility/element.js';
import { em, paragraph, strong, subtitle, title } from '../ui/typography.js';
import { furnitureQuantity } from '../items/types/furnishing.js';
import { getEnvironmentDescription } from './environment.js';
import { indicateRarity } from '../attributes/rarity.js';
import { knobs } from '../knobs.js';
import { list } from '../ui/list.js';
import { random } from '../utility/random.js';
import { rollArrayItem } from '../utility/roll.js';
import condition from '../attributes/condition.js';
import doorType, { appendDoorway, outside } from './door.js';
import quantity from '../attributes/quantity.js';
import roomTypes, { appendRoomTypes } from '../rooms/type.js';
import size from '../attributes/size.js';

// -- Types --------------------------------------------------------------------

/** @typedef {import('../dungeons/map.js').Connection} Connection */
/** @typedef {import('./door.js').RoomDoor} RoomDoor */
/** @typedef {import('./door.js').DoorKey} DoorKey */
/** @typedef {import('../knobs.js').RoomConfig} RoomConfig */
/** @typedef {import('../knobs.js').DungeonConfig} DungeonConfig */

// -- Config -------------------------------------------------------------------

/**
 * Map descriptions
 *
 * @type {string[]}
 */
const mapDescriptions = [
    'Searching the room reveals a map that appears to be of the dungeon.',
    'A large map of the dungeon is hanging on the wall.',
    'A map of the dungeon has crudely been carved in to the wall.',
    'Searching the room reveals a loose stone (or board) with a map hidden underneath it.',
    'The floor of the room is etched with an intricate map of the dungeon.',
];

// -- Private Functions --------------------------------------------------------

/**
 * Get contents description
 *
 * @private
 * @throws // TODO
 *
 * @param {RoomConfig | DungeonConfig} config
 *
 * @returns {string|undefined}
 */
function getContentDescription(config) {
    let {
        // TODO
        [knobs.itemQuantity]  : itemQuantity,
        [knobs.itemRarity]    : itemRarity,
        [knobs.roomFurnishing]: roomFurnishing,
        [knobs.roomType]      : roomType = roomTypes.room,
    } = config;

    if (!itemQuantity || itemQuantity === quantity.zero) {
        return;
    }

    let furniture = getFurnitureDetail(roomFurnishing);
    let rarity    = getContentRarityDetail(itemRarity);
    let type      = getRoomTypeLabel(roomType).toLowerCase();

    let furnitureText;

    switch (itemQuantity) {
        case quantity.one:
            furnitureText = furniture ? (furniture + ' and') : '';
            return `The ${type} is entirely empty except for ${furnitureText} a single ${rarity} item`;

        case quantity.couple:
            furnitureText = furniture ? (' amongst ' + furniture ) : '';
            return `There are a couple of ${rarity} things in the ${type}${furnitureText}`;

        case quantity.few:
            furnitureText = furniture ? (' amongst ' + furniture ) : '';
            return `There are a few ${rarity} things in the ${type}${furnitureText}`;

        case quantity.some:
        case quantity.several:
            furnitureText = furniture ? (furniture + ' and ' ) : '';
            return `You can see ${furnitureText}${itemQuantity} ${rarity} items as you search around the ${type}`;

        case quantity.many:
            furnitureText = furniture ? (' and ' + furniture) : '';
            return `The ${type} is cluttered with ${rarity} items${furnitureText}`;

        case quantity.numerous:
            furnitureText = furniture ? (' amongst ' + furniture ) : '';
            return `There are numerous ${rarity} objects littering the ${type}${furnitureText}`;

        // TODO default throw
    }
}

/**
 * Get content rarity detail
 *
 * @private
 *
 * @param {string} rarity
 *
 * @returns {string}
 */
function getContentRarityDetail(rarity) {
    let defaultRarity = rarity === random ? '' : 'ordinary';
    return indicateRarity.has(rarity) ? rarity : defaultRarity;
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
        // TODO
        [knobs.itemQuantity]:  itemQuantity,
        [knobs.roomCondition]: roomCondition,
        [knobs.roomSize]:      roomSize,
        [knobs.roomType]:      roomType = roomTypes.room,
    } = config;

    let typeString = getRoomTypeLabel(roomType);

    if (roomSize && roomSize === size.medium) {
        roomSize = 'medium sized';
    }

    let empty    = itemQuantity === quantity.zero ? 'empty' : '';
    let desc     = [ roomSize, empty, typeString ].filter(Boolean).join(' ');
    let sentence = `You enter ${indefiniteArticle(desc)} ${desc}`;

    if (roomCondition && roomCondition !== condition.average) {
        sentence += ` in ${roomCondition} condition`;
    }

    return sentence;
}

/**
 * Get doorway description
 *
 * @private
 *
 * @param {RoomDoor} door
 *
 * @returns {string}
 */
function getDoorwayDescription({ type, size, locked }) {
    let sizeDesc;
    let append = appendDoorway.has(type) && 'doorway';

    // TODO guard against non-lockable doors

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
 * @param {string} roomFurnishing
 *
 * @returns {string}
 */
function getFurnitureDetail(roomFurnishing) {
    switch (roomFurnishing) {
        case furnitureQuantity.minimum:
            return 'minimal furnishings';

        case furnitureQuantity.sparse:
            return 'sparse furnishings';

        case furnitureQuantity.average:
        case furnitureQuantity.furnished:
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
        // TODO
        [knobs.itemQuantity] : itemQuantity,
        [knobs.itemCondition]: itemCondition,
    } = config;

    if (itemQuantity === quantity.zero) {
        return;
    }

    switch (itemCondition) {
        case condition.busted:
        case condition.decaying:
            return `Everything in the room is ${itemCondition}`;

        case condition.good:
        case condition.poor:
            return `All of the items in the room are in ${itemCondition} condition`;

        case condition.exquisite:
            return `The room’s contents are in exquisite condition`;

        case condition.average:
        default:
            return;
    }
}

/**
 * Get key detail
 *
 * @private
 *
 * @param {string} type
 *
 * @returns {string}
 */
function getKeyDetail(type) {
    switch (type) {
        case doorType.brass:
        case doorType.iron:
        case doorType.steel:
        case doorType.stone:
            return capitalize(type) + ' key';

        case doorType.wooden:
            return 'Wooden handled key';

        case doorType.portcullis:
            return 'Large rusty key';

        case doorType.mechanical:
            return 'A mechanical leaver';

        default:
            console.warn(`Undefined key description for lockable door type ${type}`);
            return 'Key';
    }
}

/**
 * Get room dimensions
 *
 * @private
 *
 * @param {import('../typedefs.js').Size} roomSize
 *
 * @returns {string}
 */
function getRoomDimensions(roomSize) {
    let [ width, height ] = roomSize;

    return `${width * cellFeet} x ${height * cellFeet} feet`;
}

/**
 * Get room doorway description
 *
 * @private
 *
 * @param {RoomDoor[]} roomDoors
 *
 * @returns {?string}
 */
function getRoomDoorwayDescription(roomDoors) {
    let descParts = roomDoors.map(({ type, connection, size, locked }) => {
        if (type === doorType.concealed || type === doorType.secret) {
            return;
        }

        /** @type {Connection} connection */
        let { direction, to } = connection;

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
    getContentDescription       as testGetContentDescription,
    getContentRarityDetail      as testGetContentRarityDetail,
    getDescription              as testGetDescription,
    getDoorwayDescription       as testGetDoorwayDescription,
    getFurnitureDetail          as testGetFurnitureDetail,
    getItemConditionDescription as testGetItemConditionDescription,
    getKeyDetail                as testGetKeyDetail,
    getRoomDimensions           as testGetRoomDimensions,
    getRoomDoorwayDescription   as testGetRoomDoorwayDescription,
};

// -- Public Functions ---------------------------------------------------------

/**
 * Get doorway list
 *
 * @param {RoomDoor[]} roomDoors
 *
 * @returns {?string}
 */
export const getDoorwayList = (roomDoors) => {
    let doorList = roomDoors.map(({ type, connection, size, locked }) => {
        let { direction, to } = connection;

        let desc    = getDoorwayDescription({ type, size, locked });
        let connect = to === outside ? 'leading out of the dungeon' : `to Room ${to}`;
        let text    = `${capitalize(direction)} ${connect} (${em(desc)})`;
        let secret  = type === doorType.concealed || type === doorType.secret;

        return secret ? strong(text) : text;
    });

    return subtitle(`Doorways (${roomDoors.length})`) + list(doorList);
};

/**
 * Get key description
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
 * @returns {string}
 */
export const getMapDescription = () => {
    return subtitle('Map') + list([ rollArrayItem(mapDescriptions) ]);
};

/**
 * Get room description
 *
 * @param {RoomSettings} room // TODO
 * @param {RoomDoor[]} [roomDoors]
 *
 * @returns {string}
 */
export function getRoomDescription(room, roomDoors) {
    let { settings, roomNumber, size: roomDimensions } = room;

    let {
        [knobs.roomCount]: roomCount,
        [knobs.roomType] : type,
    } = settings;

    let numberLabel = roomCount > 1 ? ` ${roomNumber}` : '';
    let typeLabel   = type !== roomTypes.room ? ` - ${capitalize(getRoomTypeLabel(type))}` : '';
    let roomTitle   = title(`Room${numberLabel}${typeLabel}`);
    let dimensions  = roomDimensions ? element('span', getRoomDimensions(roomDimensions)) : '';
    let header      = element('header', roomTitle + dimensions);

    let content = header + subtitle('Description') + paragraph([
        getDescription(settings),
        ...getEnvironmentDescription(settings),
        getContentDescription(settings),
        getItemConditionDescription(settings),
        ...(roomDoors ? [ getRoomDoorwayDescription(roomDoors) ] : []),
    ].filter(Boolean).join('. ')+'.');

    return content;
}

/**
 * Get room type label
 *
 * @param {string} type
 *
 * @returns {string}
 */
export const getRoomTypeLabel = (type) => toWords(type) + (appendRoomTypes.has(type) ? ' room' : '');
