
import { list as conditions, probability as conditionProbability } from './attributes/condition';
import { list as itemTypes } from './items/type';
import { list as quantities, probability as quantityProbability } from './attributes/quantity';
import { list as rarities, probability as rarityProbability } from './attributes/rarity';
import { list as roomTypes } from './rooms/type';
import { list as sizes } from './attributes/size';
import { pages } from './ui/nav';
import { random } from './utility/random';

export const typeSelect = 'select';
export const typeNumber = 'number';
export const typeRange  = 'range';

const equalDistributionLabel = 'Random probability: Equally distributed';

const getValues = (values) => {
    return [
        random,
        ...values,
    ];
};

export const knobs = {
    dungeonComplexity: 'dungeon-complexity',
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
        label : 'Dungeon Settings',
        pages : new Set([ pages.dungeon ]),
        fields: {
            complexity: {
                label : 'Complexity',
                name  : knobs.dungeonComplexity,
                type  : typeRange,
                values: [ 2, 10 ],
            }
        },
    },
    {
        label : 'Room Settings',
        pages : new Set([ pages.dungeon, pages.room ]),
        fields: {
            count: {
                label : 'Rooms',
                pages : new Set([ pages.room ]),
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
        label : 'Item Settings',
        labels: {
            [pages.dungeon]: 'Room Contents',
            [pages.room]:    'Room Contents',
        },
        pages : new Set([ pages.dungeon, pages.room, pages.items ]),
        fields: {
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

const getFields = (knobSet, page) => {
    let knobSetFields = knobSet.fields;

    let fields = Object.keys(knobSetFields).reduce((obj, key) => {
        let knobConfig = knobSetFields[key];

        if (knobConfig.pages && !knobConfig.pages.has(page)) {
            return obj;
        }

        obj[key] = knobConfig;

        return obj;
    }, {});

    return {
        ...knobSet,
        fields,
    };
};

export const getKnobConfig = (page = pages.dungeon) => {
    return config.reduce((arr, knobSet) => {
        if (!knobSet.pages.has(page)) {
            return arr;
        }

        arr.push(getFields(knobSet, page));

        return arr;
    }, []);
};
