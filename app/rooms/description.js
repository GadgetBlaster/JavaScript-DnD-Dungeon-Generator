
import { knobs } from '../knobs';
import { title, subTitle, paragraph } from '../ui/typography';
import { toWords } from '../utility/tools';
import condition from '../attributes/condition';
import quantity from '../attributes/quantity';
import rarity from '../attributes/rarity';
import size from '../attributes/size';
import type from '../rooms/type';

const getSizeDesc = (settings) => {
    let {
        [knobs.itemQuantity]: itemQuantity,
        [knobs.roomCondition]: roomCondition,
        [knobs.roomSize]: roomSize,
        [knobs.roomType]: roomType,
    } = settings;

    let typeString = toWords(roomType);

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

const getContentsDesc = (settings) => {
    let {
        [knobs.itemQuantity]: itemQuantity,
        [knobs.roomType]: roomType,
    } = settings;

    let typeString = toWords(roomType);

    switch (itemQuantity) {
        case quantity.one:
            return `The ${typeString} is entirely empty except for a single item`;
        case quantity.couple:
            return `There are a couple of things in the ${typeString}`;
        case quantity.few:
            return `There are a few things in the ${typeString}`;
        case quantity.some:
        case quantity.several:
            return `You can see ${itemQuantity} objects as you look around`;
        case quantity.many:
            return `The ${typeString} is cluttered with items`;
        case quantity.numerous:
            return `There are numerous objects littering the ${typeString}`;
        case quantity.zero:
            return;
        default:
            console.warn(`Undescribed item quantity: ${itemQuantity}`);
            return;
    }
};

const getItemConditionDescription = (itemCondition) => {
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

const getItemRarityDescription = (itemRarity) => {
    switch (itemRarity) {
        case rarity.exotic:
        case rarity.legendary:
        case rarity.rare:
            return `All items in the room look ${itemRarity}`;

        case rarity.uncommon:
            return `The room’s items appear to be uncommon`;

        case rarity.abundant:
        case rarity.average:
        case rarity.common:
            return `The room contains ordinary items`;

        default:
            return;
    }
};

export const getRoomDescription = (settings, roomNumber) => {
    let {
        [knobs.itemCondition]: itemCondition,
        [knobs.itemRarity]   : itemRarity,
        [knobs.itemQuantity] : itemQuantity,
        [knobs.roomCount]    : roomCount,
        [knobs.roomType]     : roomType,
    } = settings;

    let numberLabel = roomCount > 1 ? roomNumber : '';
    let empty       = itemQuantity === quantity.zero
    let typeLabel   = roomType !== type.room ? `: ${toWords(roomType)}` : '';
    let roomTitle   = title(`Room ${numberLabel}${typeLabel}`);

    return roomTitle + subTitle('Description') + paragraph([
        getSizeDesc(settings),
        getContentsDesc(settings),
        !empty && getItemConditionDescription(itemCondition),
        !empty && getItemRarityDescription(itemRarity),
    ].filter(Boolean).join('. ')+'.');
};
