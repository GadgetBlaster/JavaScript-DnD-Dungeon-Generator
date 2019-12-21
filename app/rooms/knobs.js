
import { random } from '../utility/random';

import {
    list as conditions,
    probability as conditionProbability,
} from '../attributes/condition';

import { list as quantities } from '../attributes/quantity';
import { list as sizes } from '../attributes/size';

const typeSelect = 'select';

const getValues = (values) => {
    return [
        random,
        ...values,
    ];
};

export const knobs = {
    itemCondition: 'item-condition',
    itemQuantity: 'item-quantity',
    roomCondition: 'room-condition',
    roomSize: 'room-size',
};

export const config = [
    {
        label: 'Room',
        options: {
            condition: {
                label:  'Room Condition',
                name:   knobs.roomCondition,
                type:   typeSelect,
                values: getValues(conditions),
                desc:   conditionProbability.description,
            },
            size: {
                label:  'Room Size',
                name:   knobs.roomSize,
                type:   typeSelect,
                values: getValues(sizes),
            },
        },
    },
    {
        label: 'Room Contents',
        options: {
            condition: {
                label:  'Item Condition',
                name:   knobs.itemCondition,
                type:   typeSelect,
                values: getValues(conditions),
                desc:   conditionProbability.description,
            },
            quantity: {
                label:  'Item Quantity',
                name:   knobs.itemQuantity,
                type:   typeSelect,
                values: getValues(quantities),
            },
        },
    },
];
