
import { conditions, quantities, sizes, rarities } from './attribute';
import { list as itemTypes } from './items/type';
import { list as roomTypes } from './rooms/type';
import { probability as conditionProbability } from './attributes/condition';
import { probability as quantityProbability } from './attributes/quantity';
import { probability as rarityProbability } from './attributes/rarity';
import { random } from './utility/random';
import { pages } from './ui/nav';

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
    itemType: 'item-type',
    roomCondition: 'room-condition',
    roomSize: 'room-size',
    roomType: 'room-type',
};

const config = [
    {
        label: 'Room Settings',
        pages: new Set([ pages.dungeon, pages.room ]),
        options: {
            type: {
                label : 'Type',
                name  : knobs.roomType,
                type  : typeSelect,
                values: getValues(roomTypes),
                desc  : equalDistributionLabel
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
        label: 'Item Settings',
        labels: {
            [pages.dungeon]: 'Room Contents',
            [pages.room]:    'Room Contents',
        },
        pages: new Set([ pages.dungeon, pages.room, pages.items ]),
        options: {
            quantity: {
                label:  'Item Quantity',
                name:   knobs.itemQuantity,
                type:   typeSelect,
                values: getValues(quantities),
                desc:   quantityProbability.description,
            },
            type: {
                label:  'Item Type',
                name:   knobs.itemType,
                type:   typeSelect,
                values: getValues(itemTypes),
                desc:   equalDistributionLabel,
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

export const getKnobConfig = (page = pages.dungeon) => {
    return config.reduce((arr, knobSet) => {
        if (!knobSet.pages.has(page)) {
            return arr;
        }

        let { labels } = knobSet;

        if (labels && labels[page]) {
            knobSet.label = labels[page];
        }

        arr.push(knobSet);

        return arr;
    }, []);
};
