
import { knobs } from '../knobs';

import {
    quantityZero,
    quantityOne,
    quantityCouple,
    quantityFew,
    quantitySome,
    quantitySeveral,
    quantityMany,
    quantityCountless,
} from '../quantity';

import {
    conditionDecaying,
    conditionBusted,
    conditionPoor,
    conditionAverage,
    conditionGood,
    conditionExquisite,
} from '../condition';

import {
    sizeMedium,
} from '../size';

const getDescription = (config) => {
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


    if (size === sizeMedium) {
        size = 'medium sized';
    }

    let empty = quantity === quantityZero ? ' empty' : '';
    let desc  = `You enter a ${size}${empty} room`;

    switch (condition) {
        case conditionDecaying:
        case conditionBusted:
        case conditionPoor:
        case conditionGood:
            desc += ` in ${condition} condition`;
            break;
    }

    return desc;
};

const getContents = (config) => {
    let { itemQuantity } = knobs;

    let quantity = config[itemQuantity];

    switch (quantity) {
        case quantityOne:
            return 'The room is entirely empty except for a single item';
        case quantityCouple:
            return `There are a couple of things in the room`;
        case quantityFew:
            return `There are a few things in the room`;
        case quantitySome:
        case quantitySeveral:
            return `There are ${quantity} things in the room`;
        case quantityMany:
            return `The room is filled with many items`;
        case quantityCountless:
            return `There are countless items littering the room`;
        case quantityZero:
        default:
            return;
    }
};

export const getRoomDescription = (config) => {
    return [
        getDescription(config),
        getContents(config),
    ].filter(Boolean).join('. ') + '.';
};
