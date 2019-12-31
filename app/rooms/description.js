
import { cellFeet } from '../dungeons/grid';
import { element } from '../utility/html';
import { getEnvironmentDescription } from './environment';
import { knobs } from '../knobs';
import { list } from '../ui/list';
import { random } from '../utility/random';
import { title, subTitle, paragraph, strong, em } from '../ui/typography';
import { toWords, capitalize } from '../utility/tools';
import condition from '../attributes/condition';
import doorType, { lockable, outside } from './door';
import quantity from '../attributes/quantity';
import rarity from '../attributes/rarity';
import roomType, { appendRoomTypes } from '../rooms/type';
import size from '../attributes/size';

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
        [knobs.itemQuantity]: itemQuantity,
        [knobs.itemRarity]  : itemRarity,
        [knobs.roomType]    : roomType,
    } = settings;

    let type = toWords(roomType);

    let defaultRarity = itemRarity === random ? '' : 'ordinary';
    let rarity = contentsRarity.has(itemRarity) ? itemRarity : defaultRarity;

    switch (itemQuantity) {
        case quantity.one:
            return `The ${type} is entirely empty except for a single ${rarity} item`;
        case quantity.couple:
            return `There are a couple of ${rarity} things in the ${type}`;
        case quantity.few:
            return `There are a few ${rarity} things in the ${type}`;
        case quantity.some:
        case quantity.several:
            return `You can see ${itemQuantity} ${rarity} objects as you look around`;
        case quantity.many:
            return `The ${type} is cluttered with ${rarity} items`;
        case quantity.numerous:
            return `There are numerous ${rarity} objects littering the ${type}`;
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

const getDoorwayDesc = (type, size) => {
    let sizeDesc;
    let appendDoorway = lockable.has(type) && 'doorway';

    if (size === 2 && appendDoorway) {
        sizeDesc = 'double wide';
    } else if (size > 2) {
        sizeDesc = 'massive';
    }

    return [ sizeDesc, type, appendDoorway ].filter(Boolean).join(' ');
};

const getDoorwayDescription = (roomDoors) => {
    let descParts = roomDoors.map(({ type, connection, size }) => {
        if (type === doorType.concealed || type === doorType.secret) {
            return;
        }

        let { direction, to } = connection;

        let desc = getDoorwayDesc(type, size);
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
    let doorList = roomDoors.map(({ type, connection, size }) => {

        let { direction, to } = connection;

        let desc    = getDoorwayDesc(type, size);
        let connect = to === outside ? 'leading out of the dungeon' : `to Room ${to}`;
        let text    = `${capitalize(direction)} ${connect} (${em(desc)})`;
        let secret  = type === doorType.concealed || type === doorType.secret;

        return secret ? strong(text) : text;
    });

    return subTitle(`Doorways (${roomDoors.length})`) + list(doorList);
};

const getRoomDimensions = (room) => {
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
