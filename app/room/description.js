
import condition from '../attributes/condition';
import quantity from '../attributes/quantity';
import size from '../attributes/size';

import { title } from '../ui/title';

const getSizeDesc = (config) => {
    let {
        itemQuantity,
        roomCondition,
        roomSize,
    } = config;

    if (roomSize === size.medium) {
        roomSize = 'medium sized';
    }

    let empty = itemQuantity === quantity.zero ? ' empty' : '';
    let desc  = `You enter a ${roomSize}${empty} room`;

    switch (roomCondition) {
        case condition.decaying:
        case condition.busted:
        case condition.poor:
        case condition.good:
            desc += ` in ${roomCondition} condition`;
            break;
    }

    return desc;
};

const getContentsDesc = (config) => {
    let { itemQuantity } = config;

    switch (itemQuantity) {
        case quantity.one:
            return 'The room is entirely empty except for a single item';
        case quantity.couple:
            return `There are a couple of things in the room`;
        case quantity.few:
            return `There are a few things in the room`;
        case quantity.some:
        case quantity.several:
            return `There are ${itemQuantity} things in the room`;
        case quantity.many:
            return `The room is cluttered with items`;
        case quantity.numerous:
            return `There are numerous objects littering the room`;
        case quantity.zero:
            return;
        default:
            console.error(`Undescribed item quantity: ${itemQuantity}`);
            return;
    }
};

export const getDescription = (config) => {
    return title('Room Description') + [
        getSizeDesc(config),
        getContentsDesc(config),
    ].filter(Boolean).join('. ') + '.';
};
