
import { conditions, quantities, sizes, rarities } from './attribute';
import { list as itemTypes } from './items/type';
import { list as roomTypes } from './rooms/type';
import { probability as conditionProbability } from './attributes/condition';
import { probability as quantityProbability } from './attributes/quantity';
import { probability as rarityProbability } from './attributes/rarity';
import { random } from './utility/random';
import { pages } from './ui/nav';

export const typeSelect = 'select';
export const typeNumber = 'number';

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
    itemType: 'item-type',
    roomCondition: 'room-condition',
    roomCount: 'room-count',
    roomSize: 'room-size',
    roomType: 'room-type',
};

const config = [
    {
        label: 'Room Settings',
        pages: new Set([ pages.dungeon, pages.room ]),
        options: {
            count: {
                label : 'Rooms',
                name  : knobs.roomCount,
                type  : typeNumber,
                value : 1,
                desc  : 'Number of rooms to generate',
            },
            type: {
                label : 'Type',
                name  : knobs.roomType,
                type  : typeSelect,
                values: getValues(roomTypes),
                desc  : equalDistributionLabel,
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
                desc:   equalDistributionLabel,
            },
        },
    },
    {
        label: 'Item Settings',
        labels: {
            [pages.dungeon]: 'Room Contents',
            [pages.room]:    'Room Contents',
        },
        pages: new Set([ pages.dungeon, pages.room, pages.items ]),
        options: {
            quantity: {
                label:  'Quantity',
                name:   knobs.itemQuantity,
                type:   typeSelect,
                values: getValues(quantities),
                desc:   quantityProbability.description,
            },
            type: {
                label:  'Type',
                name:   knobs.itemType,
                type:   typeSelect,
                values: getValues(itemTypes),
                desc:   equalDistributionLabel,
            },
            condition: {
                label:  'Condition',
                name:   knobs.itemCondition,
                type:   typeSelect,
                values: getValues(conditions),
                desc:   conditionProbability.description,
            },
            rarity: {
                label:  'Rarity',
                name:   knobs.itemRarity,
                type:   typeSelect,
                values: getValues(rarities),
                desc:   rarityProbability.description,
            },
        },
    },
];

export const getKnobConfig = (page = pages.dungeon) => {
    return config.reduce((arr, knobSet) => {
        if (!knobSet.pages.has(page)) {
            return arr;
        }

        arr.push(knobSet);

        return arr;
    }, []);
};
