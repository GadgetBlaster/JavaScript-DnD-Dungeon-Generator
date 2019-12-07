
import {
    knobs,

    quantityNone,
    quantityOne,
    quantityFew,
    quantityMany,
    quantityCountless,

    conditions,
    sizes,
    quantities,
} from './knobs';

const quantityVerbLookup = {
    [quantityOne]:       'is',
    [quantityFew]:       'are a',
    [quantityMany]:      'are',
    [quantityCountless]: 'are',
};

const getRoomDescription = (config) => {
    let beginning = 'A';

    let empty = config[knobs.itemQuantity] === quantityNone ? 'empty' : '';

    return `A ${config[knobs.roomSize]} ${empty} room in ${config[knobs.roomCondition]} condition`;
};

const getContents = (config) => {
    let quantity = config[knobs.itemQuantity];

    if (quantity === quantityNone) {
        return;
    }

    let item = 'item' + (quantity === quantityOne ? '' : 's');

    return `There ${quantityVerbLookup[quantity]} ${quantity} ${item} in ${config[knobs.itemCondition]} conditoin`;
};

export const getDescription = (config) => {
    return [
        getRoomDescription(config),
        getContents(config),
    ].filter(Boolean).join('. ') + '.';
};
