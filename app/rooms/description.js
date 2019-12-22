
import { knobs } from './knobs';
import { title } from '../ui/type';
import condition from '../attributes/condition';
import quantity from '../attributes/quantity';
import size from '../attributes/size';

const getSizeDesc = (settings) => {
    let {
        [knobs.itemQuantity]: itemQuantity,
        [knobs.roomCondition]: roomCondition,
        [knobs.roomSize]: roomSize,
    } = settings;

    if (roomSize === size.medium) {
        roomSize = 'medium sized';
    }

    let empty = itemQuantity === quantity.zero ? ' empty' : '';
    let desc  = `You enter a ${roomSize}${empty} room`;

    if (roomCondition !== condition.average) {
        desc += ` in ${roomCondition} condition`;
    }

    return desc;
};

const getContentsDesc = (settings) => {
    let { [knobs.itemQuantity]: itemQuantity } = settings;

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
            console.warn(`Undescribed item quantity: ${itemQuantity}`);
            return;
    }
};

export const getDescription = (settings) => {
    return title('Room Description') + '<p>' + [
        getSizeDesc(settings),
        getContentsDesc(settings),
    ].filter(Boolean).join('. ') + '.</p>';
};
