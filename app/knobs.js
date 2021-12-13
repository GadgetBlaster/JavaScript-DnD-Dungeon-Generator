
// @ts-check
// TODO move to ui/knobs.js and add unit tests

import { furnitureQuantityList, probability as furnitureQuantityProbability } from './item/types/furnishing.js';
import { list as conditions, probability as conditionProbability } from './attribute/condition.js';
import { list as itemTypes } from './item/type.js';
import { list as quantities, probability as quantityProbability } from './attribute/quantity.js';
import { list as rarities, probability as rarityProbability } from './attribute/rarity.js';
import { list as roomTypes } from './room/type.js';
import { list as sizes } from './attribute/size.js';
import { pages } from './ui/nav.js';
import { random } from './utility/random.js';

// -- Types --------------------------------------------------------------------

/** @typedef {import('./attribute/condition.js').Condition} Condition */
/** @typedef {import('./attribute/quantity.js').Quantity} Quantity */
/** @typedef {import('./attribute/rarity').Rarity} Rarity */
/** @typedef {import('./attribute/size').Size} Size */

/**
 * Item config
 *
 * @typedef {object} ItemConfig
 *
 * @prop {Condition} condition
 * @prop {Quantity} quantity
 * @prop {Rarity} rarity
 * @prop {string} type
 */

/**
 * Room config
 *
 * @typedef {object} RoomConfig
 *
 * @prop {Condition} condition
 * @prop {number} count
 * @prop {string} furnishing
 * @prop {Size} size
 * @prop {string} type
 */

/**
 * Dungeon config
 *
 * @typedef {object} DungeonConfig
 *
 * @prop {string} complexity
 * @prop {string} connections
 * @prop {string} maps
 * @prop {string} traps
 */

/**
 * Knob settings
 *
 * @typedef {object} KnobSettings
 *
 * @property {string} label
 * @property {string} name
 * @property {string} desc
 * @property {string} type
 * @property {number} [min]
 * @property {number} [max]
 * @property {any} [value]
 * @property {any[]} [values]
 */

/**
 * Knob set
 *
 * @typedef {object} KnobSet
 *
 * @property {string} label
 * @property {{ [key: string]: string }} [labels]
 * @property {Set<string>} [pages]
 * @property {KnobSettings[]} fields
 */

// -- Config -------------------------------------------------------------------

export const typeSelect = 'select';
export const typeNumber = 'number';
export const typeRange  = 'range';

const descEqualDistribution = 'Random probability: Equally distributed.';
const descComplexity        = 'Controls dungeon size and room count.';
const descConnections       = [
    'Probably that rooms will be connected to adjacent rooms.',
    'Setting to 0% makes dungeons linear.',
    'Setting to 100% places doorways between every adjacent room.',
].join(' ');
const descFurnitureQuantity = 'How furnished the dungeon‘s rooms are.';
const descMaps              = 'Number of dungeon maps that can be found.';
const descTraps             = 'Trap randomization frequency.';

const getValues = (values) => {
    return [
        random,
        ...values,
    ];
};

export const knobs = {
    dungeonComplexity : 'dungeonComplexity',
    dungeonConnections: 'dungeonConnections',
    dungeonMaps       : 'dungeonMaps',
    dungeonTraps      : 'dungeonTraps',
    itemCondition     : 'itemCondition',
    itemQuantity      : 'itemQuantity',
    itemRarity        : 'itemRarity',
    itemType          : 'itemType',
    roomCondition     : 'roomCondition',
    roomCount         : 'roomCount',
    roomFurnishing    : 'roomFurnishing',
    roomSize          : 'roomSize',
    roomType          : 'roomType',
};

 /**
  * Config
  *
  * @type {KnobSet[]}
  */
const config = [
    {
        label : 'Dungeon Settings',
        pages : new Set([ pages.dungeon ]),
        fields: [
            {
                label : 'Complexity',
                name  : knobs.dungeonComplexity,
                desc  : descComplexity,
                type  : typeRange,
                min   : 2,
                max   : 11,
                value : 5,
            },
            {
                label : 'Connections',
                name  : knobs.dungeonConnections,
                desc  : descConnections,
                type  : typeRange,
                min   : 0,
                max   : 100,
                value : 12,
            },
            {
                label : 'Maps',
                name  : knobs.dungeonMaps,
                desc  : descMaps,
                type  : typeNumber,
                value : 2,
            },
            {
                label : 'Traps',
                name  : knobs.dungeonTraps,
                desc  : descTraps,
                type  : typeRange,
                min   : 0,
                max   : 4,
                value : 1,
            },
        ],
    },
    {
        label : 'Room Settings',
        pages : new Set([ pages.dungeon, pages.room ]),
        fields: [
            {
                label : 'Rooms',
                name  : knobs.roomCount,
                desc  : 'Number of rooms to generate',
                type  : typeNumber,
                pages : new Set([ pages.room ]),
                value : 1,
            },
            {
                label : 'Type',
                name  : knobs.roomType,
                desc  : descEqualDistribution,
                type  : typeSelect,
                values: getValues(roomTypes),
            },
            {
                label :'Condition',
                name  : knobs.roomCondition,
                desc  : conditionProbability.description,
                type  : typeSelect,
                values: getValues(conditions),
            },
            {
                label : 'Size',
                name  : knobs.roomSize,
                desc  : descEqualDistribution,
                type  : typeSelect,
                values: getValues(sizes),
            },
            {
                label : 'Furnishing',
                name  : knobs.roomFurnishing,
                desc  : descFurnitureQuantity + ' ' + furnitureQuantityProbability.description,
                type  : typeSelect,
                values: getValues(furnitureQuantityList),
            }
        ],
    },
    {
        label : 'Item Settings',
        labels: {
            [pages.dungeon]: 'Room Contents',
            [pages.room]   : 'Room Contents',
        },
        pages : new Set([ pages.dungeon, pages.room, pages.items ]),
        fields: [
            {
                label : 'Quantity',
                name  : knobs.itemQuantity,
                desc  : quantityProbability.description,
                type  : typeSelect,
                values: getValues(quantities),
            },
            {
                label : 'Type',
                name  : knobs.itemType,
                desc  : descEqualDistribution,
                type  : typeSelect,
                values: getValues(itemTypes),
            },
            {
                label : 'Condition',
                name  : knobs.itemCondition,
                desc  : conditionProbability.description,
                type  : typeSelect,
                values: getValues(conditions),
            },
            {
                label : 'Rarity',
                name  : knobs.itemRarity,
                desc  : rarityProbability.description,
                type  : typeSelect,
                values: getValues(rarities),
            },
        ],
    },
];

const getFields = (knobSet, page) => {
    let fields = knobSet.fields.reduce((fieldsArray, knobSettings) => {
        if (knobSettings.pages && !knobSettings.pages.has(page)) {
            return fieldsArray;
        }

        fieldsArray.push(knobSettings);

        return fieldsArray;
    }, []);

    return {
        ...knobSet,
        fields,
    };
};

export const getKnobConfig = (page = pages.dungeon) => {
    return config.reduce((knobSets, knobSet) => {
        if (!knobSet.pages.has(page)) {
            return knobSets;
        }

        knobSets.push(getFields(knobSet, page));

        return knobSets;
    }, []);
};
