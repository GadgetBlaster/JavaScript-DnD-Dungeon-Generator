// @ts-check

// TODO add unit tests

import { conditions, probability as conditionProbability } from '../attribute/condition.js';
import { furnitureQuantities, probability as furnitureQuantityProbability } from '../item/furnishing.js';
import { itemTypes } from '../item/item.js';
import { quantities, probability as quantityProbability } from '../attribute/quantity.js';
import { rarities, probability as rarityProbability } from '../attribute/rarity.js';
import { roomTypes } from '../room/room.js';
import { sizes } from '../attribute/size.js';

// -- Type Imports -------------------------------------------------------------

/** @typedef {import('../attribute/condition.js').Condition} Condition */
/** @typedef {import('../attribute/quantity.js').Quantity} Quantity */
/** @typedef {import('../attribute/rarity.js').Rarity} Rarity */
/** @typedef {import('../attribute/size.js').Size} Size */
/** @typedef {import('../item/item.js').ItemType} ItemType */
/** @typedef {import('../item/furnishing').FurnitureQuantity} FurnitureQuantity */
/** @typedef {import('../room/room.js').RoomType} RoomType */
/** @typedef {import('../ui/nav').Page} Page */

// -- Types --------------------------------------------------------------------

/**
 * @typedef {object} ItemConfig
 *
 * @prop {Condition} itemCondition
 * @prop {Quantity} itemQuantity
 * @prop {Rarity} itemRarity
 * @prop {ItemType} itemType
 */

/**
 * @typedef {object} RoomConfigBase
 *
 * @prop {Condition} roomCondition
 * @prop {number} roomCount
 * @prop {FurnitureQuantity} roomFurnitureQuantity
 * @prop {Size} roomSize
 * @prop {RoomType} roomType
 */

/**
 * @typedef {object} DungeonConfigBase
 *
 * @prop {number} dungeonComplexity
 * @prop {number} dungeonConnections
 * @prop {number} dungeonMaps
 * @prop {number} dungeonTraps
 */

/** @typedef {RoomConfigBase & ItemConfig} RoomConfig */
/** @typedef {DungeonConfigBase & RoomConfig} DungeonConfig */
/** @typedef {ItemConfig | RoomConfig | DungeonConfig } Config */

/** @typedef {keyof ItemConfig} ItemConfigFields */
/** @typedef {keyof RoomConfigBase} RoomConfigFields */
/** @typedef {keyof DungeonConfigBase} DungeonConfigFields */

/**
 * @typedef {ItemConfigFields
 *     | RoomConfigFields
 *     | DungeonConfigFields
 * } ConfigFields
 */

/**
 * @typedef {object} KnobSettings
 *
 * @prop {string} label
 * @prop {ConfigFields} name
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
                name  : 'dungeonComplexity',
                desc  : descComplexity,
                type  : typeRange,
                min   : 2,
                max   : 11,
                value : 5,
            },
            {
                label : 'Connections',
                name  : 'dungeonConnections',
                desc  : descConnections,
                type  : typeRange,
                min   : 0,
                max   : 100,
                value : 12,
            },
            {
                label : 'Maps',
                name  : 'dungeonMaps',
                desc  : descMaps,
                type  : typeNumber,
                value : 2,
            },
            {
                label : 'Traps',
                name  : 'dungeonTraps',
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
                name  : 'roomCount',
                desc  : 'Number of rooms to generate',
                type  : typeNumber,
                pages : new Set([ 'rooms' ]),
                value : 1,
            },
            {
                label : 'Type',
                name  : 'roomType',
                desc  : descEqualDistribution,
                type  : typeSelect,
                values: getValues(roomTypes),
            },
            {
                label :'Condition',
                name  : 'roomCondition',
                desc  : conditionProbability.description,
                type  : typeSelect,
                values: getValues(conditions),
            },
            {
                label : 'Size',
                name  : 'roomSize',
                desc  : descEqualDistribution,
                type  : typeSelect,
                values: getValues(sizes),
            },
            {
                label : 'Furnishing',
                name  : 'roomFurnitureQuantity',
                desc  : descFurnitureQuantity + ' ' + furnitureQuantityProbability.description,
                type  : typeSelect,
                values: getValues(furnitureQuantities),
            },
        ],
    },
    {
        label : 'Item Settings',
        pages : new Set([ 'dungeon', 'rooms', 'items' ]),
        fields: [
            {
                label : 'Quantity',
                name  : 'itemQuantity',
                desc  : quantityProbability.description,
                type  : typeSelect,
                values: getValues(quantities),
            },
            {
                label : 'Type',
                name  : 'itemType',
                desc  : descEqualDistribution,
                type  : typeSelect,
                values: getValues(itemTypes),
            },
            {
                label : 'Condition',
                name  : 'itemCondition',
                desc  : conditionProbability.description,
                type  : typeSelect,
                values: getValues(conditions),
            },
            {
                label : 'Rarity',
                name  : 'itemRarity',
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
