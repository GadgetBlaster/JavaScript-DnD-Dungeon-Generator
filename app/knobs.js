
import { furnitureQuantityList, probability as furnitureQuantityProbability } from './items/types/furnishing.js';
import { list as conditions, probability as conditionProbability } from './attributes/condition.js';
import { list as itemTypes } from './items/type.js';
import { list as quantities, probability as quantityProbability } from './attributes/quantity.js';
import { list as rarities, probability as rarityProbability } from './attributes/rarity.js';
import { list as roomTypes } from './rooms/type.js';
import { list as sizes } from './attributes/size.js';
import { pages } from './ui/nav.js';
import { random } from './utility/random.js';

export const typeSelect = 'select';
export const typeNumber = 'number';
export const typeRange  = 'range';

const descEqualDistribution = 'Random probability: Equally distributed.';

const descComplexity = `Controls dungeon size and room count. Need more
    complexity? Generate multiple dungeon levels and add stairways.`;

const descConnections = `Probably that rooms will be connected to adjacent
    rooms. Setting to zero will make dungeons more linear, setting to 100
    places a doorway between every adjacent room.`;

const descFurnitureQuantity = 'How furnished the dungeon‘s rooms are.';

const descMaps = 'Number of dungeon maps that can be found.';

const descTraps = 'Trap randomization frequency.';

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
    dungeonTraps      : 'dungeon-traps',
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

/**
 * Knob settings
 *
 * @typedef {Object} KnobSettings
 *
 * @property {string} label
 * @property {string} name
 * @property {string} desc
 * @property {string} type
 * @property {number} min
 * @property {number} max
 * @property {*} value
 * @property {*[]} values
 */

/**
 * Knob set
 *
 * @typedef {Object} KnobSet
 *
 * @property {string} label
 * @property {Object<string, string>} [labels]
 * @property {Set<string>} [pages]
 * @property {Object<string, KnobSettings>} fields
 */

 /**
  * Config
  *
  * @type {KnobSet[]}
  */
const config = [
    {
        label : 'Dungeon Settings',
        pages : new Set([ pages.dungeon ]),
        fields: {
            complexity: {
                label : 'Complexity',
                name  : knobs.dungeonComplexity,
                desc  : descComplexity,
                type  : typeRange,
                min   : 2,
                max   : 11,
                value : 5,
            },
            connections: {
                label : 'Connections',
                name  : knobs.dungeonConnections,
                desc  : descConnections,
                type  : typeRange,
                min   : 0,
                max   : 100,
                value : 12,
            },
            maps: {
                label : 'Maps',
                name  : knobs.dungeonMaps,
                desc  : descMaps,
                type  : typeNumber,
                value : 2,
            },
            traps: {
                label : 'Traps',
                name  : knobs.dungeonTraps,
                desc  : descTraps,
                type  : typeRange,
                min   : 0,
                max   : 4,
                value : 1,
            },
        },
    },
    {
        label : 'Room Settings',
        pages : new Set([ pages.dungeon, pages.room ]),
        fields: {
            count: {
                label : 'Rooms',
                name  : knobs.roomCount,
                desc  : 'Number of rooms to generate',
                type  : typeNumber,
                pages : new Set([ pages.room ]),
                value : 1,
            },
            type: {
                label : 'Type',
                name  : knobs.roomType,
                desc  : descEqualDistribution,
                type  : typeSelect,
                values: getValues(roomTypes),
            },
            condition: {
                label :'Condition',
                name  : knobs.roomCondition,
                desc  : conditionProbability.description,
                type  : typeSelect,
                values: getValues(conditions),
            },
            size: {
                label : 'Size',
                name  : knobs.roomSize,
                desc  : descEqualDistribution,
                type  : typeSelect,
                values: getValues(sizes),
            },
            furnishing: {
                label : 'Furnishing',
                name  : knobs.roomFurnishing,
                desc  : descFurnitureQuantity + ' ' + furnitureQuantityProbability.description,
                type  : typeSelect,
                values: getValues(furnitureQuantityList),
            }
        },
    },
    {
        label : 'Item Settings',
        labels: {
            [pages.dungeon]: 'Room Contents',
            [pages.room]   : 'Room Contents',
        },
        pages : new Set([ pages.dungeon, pages.room, pages.items ]),
        fields: {
            quantity: {
                label : 'Quantity',
                name  : knobs.itemQuantity,
                desc  : quantityProbability.description,
                type  : typeSelect,
                values: getValues(quantities),
            },
            type: {
                label : 'Type',
                name  : knobs.itemType,
                desc  : descEqualDistribution,
                type  : typeSelect,
                values: getValues(itemTypes),
            },
            condition: {
                label : 'Condition',
                name  : knobs.itemCondition,
                desc  : conditionProbability.description,
                type  : typeSelect,
                values: getValues(conditions),
            },
            rarity: {
                label : 'Rarity',
                name  : knobs.itemRarity,
                desc  : rarityProbability.description,
                type  : typeSelect,
                values: getValues(rarities),
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
