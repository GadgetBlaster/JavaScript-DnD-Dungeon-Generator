
import { conditions, quantities, sizes, rarities } from '../attribute';
import { probability as conditionProbability } from '../attributes/condition';
import { probability as quantityProbability } from '../attributes/quantity';
import { probability as rarityProbability } from '../attributes/rarity';
import { random } from '../utility/random';

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
    itemRarity: 'item-rarity',
    roomCondition: 'room-condition',
    roomSize: 'room-size',
};

export const config = [
    {
        label: 'Room Settings',
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
                desc:   'Random: Equal probability'
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
                desc:   quantityProbability.description,
            },
            rarity: {
                label:  'Item Rarity',
                name:   knobs.itemRarity,
                type:   typeSelect,
                values: getValues(rarities),
                desc:   rarityProbability.description,
            },
        },
    },
];
