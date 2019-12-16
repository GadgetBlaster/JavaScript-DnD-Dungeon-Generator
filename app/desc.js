
import { knobs } from './knobs';

import {
    quantityZero,
    quantityOne,
    quantityCouple,
    quantityFew,
    quantityMany,
    quantityCountless,
} from './quantity';

import {
    conditionDecaying,
    conditionBusted,
    conditionPoor,
    conditionAverage,
    conditionGood,
    conditionExquisite,
} from './condition';

const getRoomDescription = (config) => {
    let {
        itemQuantity,
        roomCondition,
        roomSize,
    } = knobs;

    let {
        [itemQuantity]: quantity,
        [roomCondition]: condition,
        [roomSize]: size,
    } = config;

    let empty = quantity === quantityZero ? ' empty' : '';
    let desc = `You enter a ${size}${empty} room`;

    switch (condition) {
        case conditionDecaying:
        case conditionBusted:
        case conditionPoor:
        case conditionGood:
            desc += ` in ${condition} condition`;
    }

    return desc;
};

const getContents = (config) => {
    let { itemQuantity } = knobs;

    let quantity = config[itemQuantity];

    switch (quantity) {
        case quantityZero:
            return;
        case quantityOne:
            return 'The room is entirely empty except for a single item';
        case quantityCouple:
        case quantityFew:
            return `There are a ${quantity} items in the room`;
        case quantityMany:
            return `The room is filled with many items.`;
        case quantityCountless:
            return `There are ${quantity} items littering the room`;
        default:
            return;
    }
};

export const getDescription = (config) => {
    return [
        getRoomDescription(config),
        getContents(config),
    ].filter(Boolean).join('. ') + '.';
};
