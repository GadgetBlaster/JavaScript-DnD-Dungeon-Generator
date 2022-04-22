// @ts-check

import { generateItems } from '../item/generate.js';
import { isRequired } from '../utility/tools.js';
import { probability as conditionProbability } from '../attribute/condition.js';
import { probability as furnitureQuantityProbability } from '../item/furnishing.js';
import { probability as quantityProbability } from '../attribute/quantity.js';
import { probability as rarityProbability } from '../attribute/rarity.js';
import { rollArrayItem, rollPercentile } from '../utility/roll.js';
import { roomTypes, probability as roomTypeProbability } from './room.js';
import { roomTypeSizes } from './dimensions.js';

// -- Type Imports -------------------------------------------------------------

/** @typedef {import('../attribute/condition.js').Condition} Condition */
/** @typedef {import('../attribute/quantity.js').Quantity} Quantity */
/** @typedef {import('../attribute/rarity.js').Rarity} Rarity */
/** @typedef {import('../attribute/size.js').Size} Size */
/** @typedef {import('../controller/knobs.js').Config} Config */
/** @typedef {import('../controller/knobs.js').DungeonConfig} DungeonConfig */
/** @typedef {import('../controller/knobs.js').ItemConfig} ItemConfig */
/** @typedef {import('../controller/knobs.js').ItemConfigFields} ItemConfigFields */
/** @typedef {import('../controller/knobs.js').RoomConfig} RoomConfig */
/** @typedef {import('../controller/knobs.js').RoomConfigFields} RoomConfigFields */
/** @typedef {import('../dungeon/grid.js').Coordinates} Coordinates */
/** @typedef {import('../item/furnishing').FurnitureQuantity} FurnitureQuantity */
/** @typedef {import('../item/generate.js').Item} Item */
/** @typedef {import('../item/generate.js').ItemSet} ItemSet */
/** @typedef {import('./door.js').Door} Door */
/** @typedef {import('./door.js').DoorKey} DoorKey */
/** @typedef {import('./room.js').RoomType} RoomType */

// -- Types --------------------------------------------------------------------

/**
 * @typedef {(RoomConfig | DungeonConfig) & {
 *     itemQuantity: Quantity;
 *     roomCondition: Condition;
 *     roomFurnitureQuantity: FurnitureQuantity;
 *     roomSize: Size;
 *     roomType: RoomType;
 * }} GeneratedRoomConfig
 */

/**
 * @typedef {object} Room
 *
 * @prop {GeneratedRoomConfig} settings  // TODO name rename `settings` to `config`
 * @prop {ItemSet} itemSet
 * @prop {number} roomNumber
 * @prop {boolean} [map]                        // TODO rename to `hasMap`
 * @prop {DoorKey[]} [keys]
 * @prop {number[]} [size]                      // TODO {Dimensions} dimensions
 * @prop {Coordinates[]} [walls]
 * @prop {string[]} [traps]                     // TODO `Trap` type
 */

// -- Config -------------------------------------------------------------------

/**
 * Percentile chance that items in the room have uniform condition.
 */
const uniformItemConditionChance = 10;

/**
 * Percentile chance that items in the room have uniform rarity.
 */
const uniformItemRarityChance = 10;

// -- Private Functions --------------------------------------------------------

/**
 * Applies randomization to the given `RoomConfig` or `DungeonConfig`, returning
 * a subset of config's fields.
 *
 * @private
 *
 * @param {RoomConfig | DungeonConfig} config
 *
 * @param {object} [options]
 *     @param {boolean} [options.isRandomItemConditionUniform]
 *     @param {boolean} [options.isRandomItemRarityUniform]
 *
 * @returns {GeneratedRoomConfig}
 */
function applyRoomRandomization(config, {
    isRandomItemConditionUniform,
    isRandomItemRarityUniform,
} = {}) {
    let {
        itemCondition,
        itemQuantity,
        itemRarity,
        roomCondition,
        roomFurnitureQuantity,
        roomSize,
        roomType,
    } = config;

    let generatedRoomConfig = {};

    // Room config

    if (roomCondition === 'random') {
        generatedRoomConfig.roomCondition = conditionProbability.roll();
    }

    if (roomFurnitureQuantity === 'random') {
        generatedRoomConfig.roomFurnitureQuantity = furnitureQuantityProbability.roll();
    }

    if (roomType === 'random') {
        roomType = rollRoomType(roomTypeProbability.roll());
        generatedRoomConfig.roomType = roomType;
    }

    if (roomSize === 'random') {
        generatedRoomConfig.roomSize = rollRoomSize(roomType);
    }

    // Item config

    if (itemCondition === 'random' && isRandomItemConditionUniform) {
        generatedRoomConfig.itemCondition = conditionProbability.roll();
    }

    if (itemRarity === 'random' && isRandomItemRarityUniform) {
        generatedRoomConfig.itemRarity = rarityProbability.roll();
    }

    if (itemQuantity === 'random') {
        itemQuantity = quantityProbability.roll();
        generatedRoomConfig.itemQuantity = itemQuantity;
    }

    // TODO replace with max item quantity per room type config
    // move to separate function?
    if (roomType === 'hallway' && itemQuantity === 'numerous') {
        generatedRoomConfig.itemQuantity = /** @type {Quantity} */ ('several');
    }

    return { ...config, ...generatedRoomConfig };
}

/**
 * Returns a randomly selected room size appropriate to the given room type.
 *
 * @private
 *
 * @param {RoomType} type
 *
 * @returns {Size} size
 */
const rollRoomSize = (type) => rollArrayItem(roomTypeSizes[type]);

/**
 * Returns a random room type using the room type probability table.
 *
 * @private
 *
 * @param {RoomType | "random"} type
 *
 * @returns {RoomType} roomType
 */
function rollRoomType(type) {
    if (type === 'random') {
        return rollArrayItem(roomTypes);
    }

    return type;
}

export {
    applyRoomRandomization as testApplyRoomRandomization,
    rollRoomSize           as testRollRoomSize,
    rollRoomType           as testRollRoomType,
};

// -- Public Functions ---------------------------------------------------------

/**
 * Generates a randomized array of random room configs for the given knob
 * settings.
 *
 * @param {RoomConfig | DungeonConfig} config
 *
 * @returns {Omit<Room, "roomNumber">[]}
 */
export function generateRooms(config) {
    let {
        roomSize,
        roomCount,
        roomType,
        roomCondition,
    } = config;

    isRequired(roomCondition, 'roomCondition is required in generateRooms()');
    isRequired(roomCount,     'roomCount is required in generateRooms()');
    isRequired(roomSize,      'roomSize is required in generateRooms()');
    isRequired(roomType,      'roomType is required in generateRooms()');

    let count = Math.floor(Number(roomCount));

    return [ ...Array(count) ].map(() => {
        let randomizedRoomConfig = applyRoomRandomization(config, {
            isRandomItemConditionUniform: rollPercentile(uniformItemConditionChance),
            isRandomItemRarityUniform: rollPercentile(uniformItemRarityChance),
        });

        let roomConfig = { ...config, ...randomizedRoomConfig };

        return {
            itemSet: generateItems(roomConfig),
            settings: roomConfig, // TODO name `config`
        };
    });
}
