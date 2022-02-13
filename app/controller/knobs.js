
// @ts-check

// TODO add unit tests

import { conditions, probability as conditionProbability } from '../attribute/condition.js';
import { furnitureQuantityList, probability as furnitureQuantityProbability } from '../item/furnishing.js';
import { itemTypes } from '../item/item.js';
import { pages } from '../ui/nav.js';
import { quantities, probability as quantityProbability } from '../attribute/quantity.js';
import { rarities, probability as rarityProbability } from '../attribute/rarity.js';
import { roomTypes } from '../room/room.js';
import { sizes } from '../attribute/size.js';

// -- Type Imports -------------------------------------------------------------

/** @typedef {import('../attribute/condition.js').Condition} Condition */
/** @typedef {import('../attribute/quantity.js').Quantity} Quantity */
/** @typedef {import('../attribute/rarity').Rarity} Rarity */
/** @typedef {import('../attribute/size').Size} Size */
/** @typedef {import('../ui/nav').Page} Page */

// -- Types --------------------------------------------------------------------

/**
 * @typedef {object} ItemConfig
 *
 * @prop {Condition} itemCondition
 * @prop {Quantity} itemQuantity
 * @prop {Rarity} itemRarity
 * @prop {string} itemType // TODO add type
 */

/**
 * @typedef {object} RoomConfigBase
 *
 * @prop {Condition} roomCondition
 * @prop {number} roomCount
 * @prop {string} roomFurnishing // TODO add type
 * @prop {Size} roomSize
 * @prop {string} roomType // TODO add type
 */

/**
 * @typedef {object} DungeonConfigBase
 *
 * @prop {number} dungeonComplexity
 * @prop {number} dungeonConnections
 * @prop {number} dungeonMaps
 * @prop {number} dungeonTraps
 */

/** @typedef {RoomConfigBase | ItemConfig} RoomConfig */

/**
 * @typedef {DungeonConfigBase
 *     | Omit<RoomConfigBase, "roomCount">
 *     | ItemConfig
 * } DungeonConfig */

/**
 * @typedef {object} KnobSettings
 *
 * @prop {string} label
 * @prop {string} name
 * @prop {string} desc
 * @prop {string} type
 * @prop {number} [min]
 * @prop {number} [max]
 * @prop {any} [value] // TODO
 * @prop {any[]} [values] // TODO
 * @prop {Set<Page>} [pages]
 */

/**
 * @typedef {object} KnobSet
 *
 * @prop {string} label
 * @prop {{ [key in Page]?: string }} [labels]
 * @prop {Set<Page>} [pages]
 * @prop {KnobSettings[]} fields
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
        'random',
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
        pages : new Set([ 'dungeon' ]),
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
        pages : new Set([ 'dungeon', 'rooms' ]),
        fields: [
            {
                label : 'Rooms',
                name  : knobs.roomCount,
                desc  : 'Number of rooms to generate',
                type  : typeNumber,
                pages : new Set([ 'rooms' ]),
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
            },
        ],
    },
    {
        label : 'Item Settings',
        labels: {
            dungeon: 'Room Contents',
            rooms  : 'Room Contents',
        },
        pages : new Set([ 'dungeon', 'rooms', 'items' ]),
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

/**
 * TODO
 * @param {*} knobSet
 * @param {*} page
 * @returns
 */
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

/**
 * TODO
 * @param {*} page
 * @returns
 */
export const getKnobConfig = (page = 'dungeon') => {
    return config.reduce((knobSets, knobSet) => {
        if (!knobSet.pages.has(page)) {
            return knobSets;
        }

        knobSets.push(getFields(knobSet, page));

        return knobSets;
    }, []);
};
