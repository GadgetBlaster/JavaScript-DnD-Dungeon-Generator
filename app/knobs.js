
import { furnitureQuantityList, probability as furnitureQuantityProbability } from './items/types/furnishing';
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

const descEqualDistribution = 'Random probability: Equally distributed';

const descComplexity = `Controls dungeon size and room count. Need more
    complexity? Generate multiple dungeon levels and add stairways.`;

const descConnections = `Probably that rooms will be connected to adjacent
    rooms. Setting to zero will make dungeons more linear, setting to 100
    places a doorway between every adjacent room.`;

const descFurnitureQuantity = 'How furnished the rooms in the dungeon are.';

const getValues = (values) => {
    return [
        random,
        ...values,
    ];
};

export const knobs = {
    dungeonComplexity : 'dungeon-complexity',
    dungeonConnections: 'dungeon-connections',
    dungeonMaps       : 'dungeon-maps',
    dungeonLocks      : 'dungeon-locks',
    itemCondition     : 'item-condition',
    itemQuantity      : 'item-quantity',
    itemRarity        : 'item-rarity',
    itemType          : 'item-type',
    roomCondition     : 'room-condition',
    roomCount         : 'room-count',
    roomFurnishing    : 'room-furnishing',
    roomSize          : 'room-size',
    roomType          : 'room-type',
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
                value : 5,
                values: [ 2, 10 ],
                desc  : descComplexity,
            },
            connections: {
                label : 'Connections',
                name  : knobs.dungeonConnections,
                type  : typeRange,
                value : 12,
                values: [ 0, 100 ],
                desc  : descConnections,
            },
            maps: {
                label : 'Maps',
                name  : knobs.dungeonMaps,
                type  : typeNumber,
                value : 2,
                desc  : 'Number of maps of the dungeon to hide',
            },
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
                desc  : descEqualDistribution,
            },
            condition: {
                label :'Condition',
                name  : knobs.roomCondition,
                type  : typeSelect,
                values: getValues(conditions),
                desc  : conditionProbability.description,
            },
            size: {
                label : 'Size',
                name  : knobs.roomSize,
                type  : typeSelect,
                values: getValues(sizes),
                desc  : descEqualDistribution,
            },
            furnishing: {
                label : 'Furnishing',
                name  : knobs.roomFurnishing,
                type  : typeSelect,
                values: getValues(furnitureQuantityList),
                desc  : furnitureQuantityProbability.description,
            }
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
                desc:   descEqualDistribution,
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
