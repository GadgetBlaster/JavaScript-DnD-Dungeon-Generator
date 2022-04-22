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
/** @typedef {import('./controller.js').Page} Page */

// -- Types --------------------------------------------------------------------

/**
 * @typedef {object} ItemConfig
 *
 * @prop {Condition | "random"} itemCondition
 * @prop {Quantity | "random"} itemQuantity
 * @prop {Rarity | "random"} itemRarity
 * @prop {ItemType | "random"} itemType
 */

/**
 * @typedef {object} RoomConfigBase
 *
 * @prop {Condition | "random"} roomCondition
 * @prop {number} roomCount
 * @prop {FurnitureQuantity | "random"} roomFurnitureQuantity
 * @prop {Size | "random"} roomSize
 * @prop {RoomType | "random"} roomType
 */

/**
 * @typedef {object} DungeonConfigBase
 *
 * @prop {number} dungeonComplexity
 * @prop {number} dungeonConnections
 * @prop {number} dungeonMaps
 * @prop {number} dungeonTraps
 */

/** @typedef {ItemConfig & RoomConfigBase} RoomConfig */
/** @typedef {ItemConfig & RoomConfigBase & DungeonConfigBase} DungeonConfig */

/**
 * @typedef {Partial<ItemConfig
 *     & RoomConfigBase
 *     & DungeonConfigBase
 * >} Config */

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
 * @typedef {object} KnobFieldConfig
 *
 * @prop {string} label
 * @prop {ConfigFields} name
 * @prop {string} desc
 * @prop {string} type // TODO
 * @prop {number} [min]
 * @prop {number} [max]
 * @prop {number | string} [value]
 * @prop {string[]} [values]
 * @prop {Set<Page>} [pages]
 */

/**
 * @typedef {object} KnobConfig
 *
 * @prop {string} label
 * @prop {Set<Page>} pages
 * @prop {KnobFieldConfig[]} fields
 */

// -- Config -------------------------------------------------------------------

// TODO Replace with type checking
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

/** @type {KnobConfig[]} */
export const knobConfig = [
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

// -- Private Functions --------------------------------------------------------

/**
 * Returns a knob config with its fields filtered by the given page. Fields will
 * only be filtered when a field's `pages` property is defined. Otherwise the
 * field is included on all pages.
 *
 * @param {KnobConfig} knobSet
 * @param {Page} page
 * @param {Config} [config]
 *
 * @returns {KnobConfig}
 */
const getFields = (knobSet, page, config) => {
    // TODO filter?
    let fields = knobSet.fields.reduce((fieldsArray, knobSettings) => {
        if (knobSettings.pages && !knobSettings.pages.has(page)) {
            return fieldsArray;
        }

        let settings = { ...knobSettings };

        if (config && config[settings.name]) {
            settings.value = config[settings.name];
        }

        fieldsArray.push(settings);

        return fieldsArray;
    }, []);

    return {
        ...knobSet,
        fields,
    };
};

export { getFields as testGetFields };

// -- Public Functions ---------------------------------------------------------

/**
 * Returns an array of knob configs for the given page.
 *
 * @param {KnobConfig[]} knobs
 * @param {Page} page
 * @param {Config} [config]
 *
 * @returns {KnobConfig[]}
 */
export const getKnobConfig = (knobs, page, config) => {
    return knobs.reduce((knobSets, knobSet) => {
        if (!knobSet.pages.has(page)) {
            return knobSets;
        }

        knobSets.push(getFields(knobSet, page, config));

        return knobSets;
    }, []);
};
