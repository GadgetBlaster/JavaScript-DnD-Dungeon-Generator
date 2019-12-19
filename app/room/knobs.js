
import { random } from '/app/utility/random';

import { conditions } from '/app/attribute/condition';
import { quantities } from '/app/attribute/quantity';
import { sizes } from '/app/attribute/size';

const typeSelect = 'select';

const getValues = (values) => {
    return [
        random,
        ...values,
    ];
};

export const config = [
    {
        label: 'Room Options',
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
