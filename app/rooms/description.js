
import { knobs } from '../knobs';
import { random } from '../utility/random';
import { title, subTitle, paragraph } from '../ui/typography';
import { toWords } from '../utility/tools';
import condition from '../attributes/condition';
import quantity from '../attributes/quantity';
import rarity from '../attributes/rarity';
import size from '../attributes/size';
import type, { appendRoomTypes } from '../rooms/type';

const getSizeDesc = (settings) => {
    let {
        [knobs.itemQuantity]: itemQuantity,
        [knobs.roomCondition]: roomCondition,
        [knobs.roomSize]: roomSize,
        [knobs.roomType]: roomType,
    } = settings;

    let appendRoom = appendRoomTypes.has(roomType);
    let typeString = toWords(roomType) + (appendRoom ? ' room' : '');

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

export const getRoomDescription = (room, roomNumber) => {
    let { settings } = room;

    let {
        [knobs.roomCount]: roomCount,
        [knobs.roomType] : roomType,
    } = settings;

    let numberLabel = roomCount > 1 ? roomNumber : '';
    let typeLabel   = roomType !== type.room ? `: ${toWords(roomType)}` : '';
    let roomTitle   = title(`Room ${numberLabel}${typeLabel}`);

    let content = roomTitle + subTitle('Description') + paragraph([
        getSizeDesc(settings),
        getContentsDesc(settings),
        getItemConditionDescription(settings),
    ].filter(Boolean).join('. ')+'.')

    return content;
};
