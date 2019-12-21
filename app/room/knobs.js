
import { random } from '../utility/random';

import { list as conditions } from '../attributes/condition';
import { list as quantities } from '../attributes/quantity';
import { list as sizes } from '../attributes/size';

const typeSelect = 'select';

const getValues = (values) => {
    return [
        random,
        ...values,
    ];
};

export const config = [
    {
        label: 'Room',
        options: {
            condition: {
                label:  'Room Condition',
                name:   'roomCondition',
                type:   typeSelect,
                values: getValues(conditions),
            },
            size: {
                label:  'Room Size',
                name:   'roomSize',
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
                name:   'itemCondition',
                type:   typeSelect,
                values: getValues(conditions),
            },
            quantity: {
                label:  'Item Quantity',
                name:   'itemQuantity',
                type:   typeSelect,
                values: getValues(quantities),
            },
        },
    },
];
