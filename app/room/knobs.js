
import { conditions } from '/app/attribute/condition';
import { quantities } from '/app/attribute/quantity';
import { random } from '/app/attribute/random';
import { sizes } from '/app/attribute/size';

const typeSelect = 'select';

export const knobs = {
    roomCondition: 'RoomCondition',
    roomSize:      'RoomSize',
    itemCondition: 'ItemCondition',
    itemQuantity:  'ItemQuantity',
};

export const knobConfig = [
    {
        label: 'Room Options',
        options: {
            condition: {
                label:  'Room Condition',
                name:   knobs.roomCondition,
                type:   typeSelect,
                values: conditions,
            },
            size: {
                label:  'Room Size',
                name:   knobs.roomSize,
                type:   typeSelect,
                values: sizes,
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
                values: conditions,
            },
            quantity: {
                label:  'Item Quantity',
                name:   knobs.itemQuantity,
                type:   typeSelect,
                values: quantities,
            },
        },
    },
];
