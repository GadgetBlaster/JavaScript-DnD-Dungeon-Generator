
import { cellFeet } from '../dungeons/grid.js';
import { element } from '../utility/html.js';
import { furnitureQuantity } from '../items/types/furnishing.js';
import { getEnvironmentDescription } from './environment.js';
import { knobs } from '../knobs.js';
import { list } from '../ui/list.js';
import { random } from '../utility/random.js';
import { rollArrayItem } from '../utility/roll.js';
import { title, subTitle, paragraph, strong, em } from '../ui/typography.js';
import { toWords, capitalize } from '../utility/tools.js';
import condition from '../attributes/condition.js';
import doorType, { appendDoorway, outside } from './door.js';
import quantity from '../attributes/quantity.js';
import rarity from '../attributes/rarity.js';
import roomType, { appendRoomTypes } from '../rooms/type.js';
import size from '../attributes/size.js';

const mapDescriptions = [
    'Searching the room reveals a map that appears to be of the dungeon.',
    'A large map of the dungeon is hanging on the wall.',
    'A map of the dungeon has crudely been carved in to the wall.',
    'Searching the room reveals a loose stone (or board) with a map hidden underneath it.',
    'The floor of the room is etched with an intricate map of the dungeon.',
];

export const getMapDescription = () => subTitle('Map') + list([ rollArrayItem(mapDescriptions) ]);

const getKeyDetail = (type) => {
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
};

export const getKeyDescription = (keys) => {
    return subTitle(`Keys (${keys.length})`) + list(keys.map((key) => {
        let connections = key.connections

        let [ from, to ] = Object.keys(connections);

        return `${getKeyDetail(key.type)} to room ${from} / ${to}`;
    }));
};

export const getRoomTypeLabel = (type) => toWords(type) + (appendRoomTypes.has(type) ? ' room' : '');

const getSizeDesc = (settings) => {
    let {
        [knobs.itemQuantity]: itemQuantity,
        [knobs.roomCondition]: roomCondition,
        [knobs.roomSize]: roomSize,
        [knobs.roomType]: type,
    } = settings;

    let typeString = getRoomTypeLabel(type);

    if (roomSize === size.medium) {
        roomSize = 'medium sized';
    }

    let empty = itemQuantity === quantity.zero ? ' empty' : '';
    let desc  = `You enter a ${roomSize}${empty} ${typeString}`;

    if (roomCondition !== condition.average) {
        desc += ` in ${roomCondition} condition`;
    }

    return desc;
};

const contentsRarity = new Set([
    rarity.exotic,
    rarity.legendary,
    rarity.rare,
    rarity.uncommon,
]);

const getContentsDesc = (settings) => {
    let {
        [knobs.itemQuantity]  : itemQuantity,
        [knobs.itemRarity]    : itemRarity,
        [knobs.roomFurnishing]: furnitureQuantitySetting,
        [knobs.roomType]      : roomType,
    } = settings;

    let type = getRoomTypeLabel(roomType).toLowerCase();

    let defaultRarity  = itemRarity === random ? '' : 'ordinary';
    let rarity         = contentsRarity.has(itemRarity) ? itemRarity : defaultRarity;
    let furniture      = '';

    switch (furnitureQuantitySetting) {
        case furnitureQuantity.minimum:
            furniture = 'minimal furnishings'
            break;

        case furnitureQuantity.sparse:
            furniture = 'sparse furnishings'
            break;

        case furnitureQuantity.average:
        case furnitureQuantity.furnished:
            furniture = 'some furniture';
            break;
    }

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
            return `You can see ${furnitureText}${itemQuantity} ${rarity} items as you search around`;

        case quantity.many:
            furnitureText = furniture ? (' and ' + furniture) : '';
            return `The ${type} is cluttered with ${rarity} items${furnitureText}`;

        case quantity.numerous:
            furnitureText = furniture ? (' amongst ' + furniture ) : '';
            return `There are numerous ${rarity} objects littering the ${type}${furnitureText}`;

        case quantity.zero:
            return;

        default:
            console.warn(`Undescribed item quantity: ${itemQuantity}`);
            return;
    }
};

const getItemConditionDescription = (settings) => {
    let {
        [knobs.itemQuantity] : itemQuantity,
        [knobs.itemCondition]: itemCondition,
    } = settings;

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
};

const getDoorwayDesc = ({ type, size, locked }) => {
    let sizeDesc;
    let append = appendDoorway.has(type) && 'doorway';

    if (size === 2 && append) {
        sizeDesc = 'double wide';
    } else if (size === 3) {
        sizeDesc = 'large';
    } else if (size > 3) {
        sizeDesc = 'massive';
    }

    let lockedDesc = locked ? 'locked' : '';

    return [ sizeDesc, lockedDesc, type, append ].filter(Boolean).join(' ');
};

const getDoorwayDescription = (roomDoors) => {
    let descParts = roomDoors.map(({ type, connection, size, locked }) => {
        if (type === doorType.concealed || type === doorType.secret) {
            return;
        }

        let { direction, to } = connection;

        let desc = getDoorwayDesc({ type, size, locked });
        let out  = to === outside ? ' out of the dungeon' : '';

        let article = type === doorType.archway ? 'an' : 'a';
        let single  = roomDoors.length === 1 ? 'single ' : '';

        return `${article} ${single}${desc} leads ${direction}${out}`;
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
};

export const getDoorwayList = (roomDoors) => {
    let doorList = roomDoors.map(({ type, connection, size, locked }) => {

        let { direction, to } = connection;

        let desc    = getDoorwayDesc({ type, size, locked });
        let connect = to === outside ? 'leading out of the dungeon' : `to Room ${to}`;
        let text    = `${capitalize(direction)} ${connect} (${em(desc)})`;
        let secret  = type === doorType.concealed || type === doorType.secret;

        return secret ? strong(text) : text;
    });

    return subTitle(`Doorways (${roomDoors.length})`) + list(doorList);
};

const getRoomDimensions = (room) => {
    if (!room.size) {
        return '';
    }

    let [ width, height ] = room.size;

    return `${width * cellFeet} x ${height * cellFeet} feet`;
};

export const getRoomDescription = (room, roomDoors) => {
    let { settings, roomNumber } = room;

    let {
        [knobs.roomCount]: roomCount,
        [knobs.roomType] : type,
    } = settings;

    let numberLabel = roomCount > 1 ? ` ${roomNumber}` : '';
    let typeLabel   = type !== roomType.room ? ` - ${capitalize(getRoomTypeLabel(type))}` : '';
    let dimensions  = element('span', getRoomDimensions(room));
    let roomTitle   = title(`Room${numberLabel}${typeLabel}`);
    let header      = element('header', roomTitle + dimensions);

    let content = header + subTitle('Description') + paragraph([
        getSizeDesc(settings),
        ...getEnvironmentDescription(settings),
        getContentsDesc(settings),
        getItemConditionDescription(settings),
        ...(roomDoors ? [ getDoorwayDescription(roomDoors) ] : []),
    ].filter(Boolean).join('. ')+'.')

    return content;
};
