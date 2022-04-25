// @ts-check

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
/** @typedef {import('../item/furnishing').FurnitureQuantity} FurnitureQuantity */
/** @typedef {import('../item/item.js').ItemType} ItemType */
/** @typedef {import('../room/room.js').RoomType} RoomType */
/** @typedef {import('./controller.js').Generator} Generator */

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

/**
 * @typedef {object} NameConfig
 */

/** @typedef {ItemConfig & RoomConfigBase} RoomConfig */
/** @typedef {ItemConfig & RoomConfigBase & DungeonConfigBase} DungeonConfig */

/**
 * @typedef {Partial<ItemConfig
 *     & RoomConfigBase
 *     & DungeonConfigBase
 * >} Config
 */

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
 * @prop {"number" | "range" | "select"} type
 * @prop {number} [min]
 * @prop {number} [max]
 * @prop {number | string} [value]
 * @prop {string[]} [values]
 * @prop {Set<Generator>} [generators]
 */

/**
 * @typedef {object} KnobConfig
 *
 * @prop {string} label
 * @prop {Set<Generator>} generators
 * @prop {KnobFieldConfig[]} fields
 */

// -- Config -------------------------------------------------------------------

/** @type {KnobConfig[]} */
export const knobConfig = [
    {
        label      : 'Dungeon Settings',
        generators : new Set([ 'dungeon' ]),
        fields     : [
            {
                label : 'Complexity',
                name  : 'dungeonComplexity',
                desc  : 'Controls dungeon size and room count.',
                type  : 'range',
                min   : 2,
                max   : 11,
                value : 5,
            },
            {
                label : 'Connections',
                name  : 'dungeonConnections',
                desc  : 'Probably that rooms will be connected to adjacent rooms. '
                    + 'Setting to 0% makes dungeons linear. '
                    + 'Setting to 100% places doorways between adjacent rooms.',
                type  : 'range',
                min   : 0,
                max   : 100,
                value : 12,
            },
            {
                label : 'Maps',
                name  : 'dungeonMaps',
                desc  : 'Number of maps to scatter throughout the dungeon.',
                type  : 'number',
                value : 2,
            },
            {
                label : 'Traps',
                name  : 'dungeonTraps',
                desc  : 'Trap randomization frequency.',
                type  : 'range',
                min   : 0,
                max   : 4,
                value : 1,
            },
        ],
    },
    {
        label      : 'Room Settings',
        generators : new Set([ 'dungeon', 'rooms' ]),
        fields     : [
            {
                label      : 'Rooms',
                name       : 'roomCount',
                desc       : 'Number of rooms to generate',
                type       : 'number',
                generators : new Set([ 'rooms' ]),
                value      : 1,
            },
            {
                label  : 'Type',
                name   : 'roomType',
                desc   : 'Random probability: Equally distributed.', // TODO
                type   : 'select',
                values : [ 'random', ...roomTypes ],
            },
            {
                label  :'Condition',
                name   : 'roomCondition',
                desc   : conditionProbability.description,
                type   : 'select',
                values : [ 'random', ...conditions ],
            },
            {
                label  : 'Size',
                name   : 'roomSize',
                desc   : 'Random probability: Equally distributed.', // TODO
                type   : 'select',
                values : [ 'random', ...sizes ],
            },
            {
                label  : 'Furnishing',
                name   : 'roomFurnitureQuantity',
                desc   : 'How furnished the rooms are. ' + furnitureQuantityProbability.description,
                type   : 'select',
                values : [ 'random', ...furnitureQuantities ],
            },
        ],
    },
    {
        label      : 'Item Settings',
        generators : new Set([ 'dungeon', 'rooms', 'items' ]),
        fields     : [
            {
                label  : 'Quantity',
                name   : 'itemQuantity',
                desc   : quantityProbability.description,
                type   : 'select',
                values : [ 'random', ...quantities ],
            },
            {
                label  : 'Type',
                name   : 'itemType',
                desc   : 'Random probability: Equally distributed.', // TODO
                type   : 'select',
                values : [ 'random', ...itemTypes ],
            },
            {
                label  : 'Condition',
                name   : 'itemCondition',
                desc   : conditionProbability.description,
                type   : 'select',
                values : [ 'random', ...conditions ],
            },
            {
                label  : 'Rarity',
                name   : 'itemRarity',
                desc   : rarityProbability.description,
                type   : 'select',
                values : [ 'random', ...rarities ],
            },
        ],
    },
];

// -- Private Functions --------------------------------------------------------

/**
 * Returns a knob config with fields filtered by the given generator. Fields
 * will only be filtered when a field's `generator` property is defined.
 * Otherwise the field is included in all generators.
 *
 * @param {KnobConfig} knobs
 * @param {Generator} generator
 * @param {Config} [config]
 *
 * @returns {KnobConfig}
 */
const getFields = (knobs, generator, config) => {
    let fields = knobs.fields.reduce((fieldsArray, knobFieldConfig) => {
        if (knobFieldConfig.generators && !knobFieldConfig.generators.has(generator)) {
            return fieldsArray;
        }

        let fieldConfig = { ...knobFieldConfig };

        if (config && config[fieldConfig.name]) {
            fieldConfig.value = config[fieldConfig.name];
        }

        fieldsArray.push(fieldConfig);

        return fieldsArray;
    }, []);

    return {
        ...knobs,
        fields,
    };
};

export { getFields as testGetFields };

// -- Public Functions ---------------------------------------------------------

/**
 * Returns an array of knob configs for the given generator.
 *
 * @param {KnobConfig[]} knobs
 * @param {Generator} generator
 * @param {Config} [config]
 *
 * @returns {KnobConfig[]}
 */
export const getKnobConfig = (knobs, generator, config) => {
    return knobs.reduce((knobSets, knobSet) => {
        if (!knobSet.generators.has(generator)) {
            return knobSets;
        }

        knobSets.push(getFields(knobSet, generator, config));

        return knobSets;
    }, []);
};
