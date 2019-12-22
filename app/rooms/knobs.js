
import { conditions, quantities, sizes, rarities } from '../attribute';
import { probability as conditionProbability } from '../attributes/condition';
import { probability as quantityProbability } from '../attributes/quantity';
import { probability as rarityProbability } from '../attributes/rarity';
import { random } from '../utility/random';
import { list as types } from '../rooms/type';

const typeSelect = 'select';

const equalDistributionLabel = 'Random probability: Equally distributed';

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
    roomType: 'room-type',
};

export const config = [
    {
        label: 'Room Settings',
        options: {
            type: {
                label:  'Type',
                name:   knobs.roomType,
                type:   typeSelect,
                values: getValues(types),
                desc:   equalDistributionLabel
            },
            condition: {
                label:  'Condition',
                name:   knobs.roomCondition,
                type:   typeSelect,
                values: getValues(conditions),
                desc:   conditionProbability.description,
            },
            size: {
                label:  'Size',
                name:   knobs.roomSize,
                type:   typeSelect,
                values: getValues(sizes),
                desc:   equalDistributionLabel
            },
        },
    },
    {
        label: 'Room Contents',
        options: {
            quantity: {
                label:  'Item Quantity',
                name:   knobs.itemQuantity,
                type:   typeSelect,
                values: getValues(quantities),
                desc:   quantityProbability.description,
            },
            condition: {
                label:  'Item Condition',
                name:   knobs.itemCondition,
                type:   typeSelect,
                values: getValues(conditions),
                desc:   conditionProbability.description,
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
