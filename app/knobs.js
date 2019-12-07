
const typeSelect = 'select';

export const valueRandom = 'random';

export const conditionDecaying  = 'decaying';
export const conditionBusted    = 'busted';
export const conditionPoor      = 'poor';
export const conditionAverage   = 'average';
export const conditionGood      = 'good';
export const conditionExquisite = 'exquisite';

export const sizeTiny    = 'tiny';
export const sizeSmall   = 'small';
export const sizeMedium  = 'medium';
export const sizeLarge   = 'large';
export const sizeMassive = 'massive';

export const quantityNone      = 'none';
export const quantityOne       = 'one';
export const quantityFew       = 'few';
export const quantityMany      = 'many';
export const quantityCountless = 'countless';

export const conditions = [
    conditionDecaying,
    conditionBusted,
    conditionPoor,
    conditionAverage,
    conditionGood,
    conditionExquisite,
];

export const sizes = [
    sizeTiny,
    sizeSmall,
    sizeMedium,
    sizeLarge,
    sizeMassive,
];

export const quantities = [
    quantityNone,
    quantityOne,
    quantityFew,
    quantityMany,
    quantityCountless,
];

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
