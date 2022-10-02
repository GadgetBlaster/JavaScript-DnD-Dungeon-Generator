// @ts-check

import { generateItems } from '../item/generate.js';
import { isRequired } from '../utility/tools.js';
import { probability as conditionProbability } from '../attribute/condition.js';
import { probability as furnitureQuantityProbability } from '../item/furnishing.js';
import { probability as quantityProbability } from '../attribute/quantity.js';
import { probability as rarityProbability } from '../attribute/rarity.js';
import { rollArrayItem, rollPercentile } from '../utility/roll.js';
import { toss } from '../utility/tools.js';
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
/** @typedef {import('../controller/knobs.js').RoomConfig} RoomConfig */
/** @typedef {import('../dungeon/grid.js').Coordinates} Coordinates */
/** @typedef {import('../item/furnishing').FurnitureQuantity} FurnitureQuantity */
/** @typedef {import('../item/generate.js').Item} Item */
/** @typedef {import('../item/generate.js').ItemSet} ItemSet */
/** @typedef {import('./door.js').Door} Door */
/** @typedef {import('./door.js').DoorKey} DoorKey */
/** @typedef {import('./room.js').RoomType} RoomType */

// -- Types --------------------------------------------------------------------

/**
 * @typedef {{
 *     itemQuantity: Quantity;
 *     roomCondition: Condition;
 *     roomFurnitureQuantity: FurnitureQuantity;
 *     roomSize: Size;
 *     roomType: RoomType;
 *     uniformItemCondition?: Condition;
 *     uniformItemRarity?: Rarity;
 * }} RandomizedRoomConfig
 */

/**
 * @typedef {object} Room
 *
 * @prop {RandomizedRoomConfig} config
 * @prop {ItemSet} itemSet
 * @prop {number} roomNumber
 * @prop {boolean} [map]                        // TODO rename to `hasMap`
 * @prop {DoorKey[]} [keys]
 * @prop {string} [rect]
 * @prop {number[]} [size]                      // TODO {Dimensions} dimensions
 * @prop {string[]} [traps]                     // TODO `Trap` type
 * @prop {Coordinates[]} [walls]
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
 * Applies randomization to the given `Config`, returning randomized
 * `ItemConfig` and `RandomizedRoomConfig` objects.
 *
 * @private
 *
 * @param {Config} config
 *
 * @param {object} options
 *     @param {boolean} [options.isRandomItemConditionUniform]
 *     @param {boolean} [options.isRandomItemRarityUniform]
 *
 * @returns {{
 *   randomizedItemConfig: ItemConfig;
 *   randomizedRoomConfig: RandomizedRoomConfig
 * }}
 */
function applyRoomRandomization(config, {
    isRandomItemConditionUniform,
    isRandomItemRarityUniform,
} = {}) {
    if (!config.rooms) {
        toss('config.rooms is required in applyRoomRandomization()');
    }

    if (!config.items) {
        toss('config.items is required in applyRoomRandomization()');
    }

    let {
        roomCondition,
        roomFurnitureQuantity,
        roomSize,
        roomType,
    } = config.rooms;

    let {
        itemCondition,
        itemQuantity,
        itemRarity,
    } = config.items;

    // Room config

    let randomizedRoomCondition = roomCondition === 'random'
        ? conditionProbability.roll()
        : roomCondition;

    let randomizedFurnitureQuantity = roomFurnitureQuantity === 'random'
        ? furnitureQuantityProbability.roll()
        : roomFurnitureQuantity;

    let randomizedRoomType = roomType === 'random'
        ? rollRoomType(roomTypeProbability.roll())
        : roomType;

    let randomizedRoomSize = roomSize === 'random'
        ? rollRoomSize(randomizedRoomType)
        : roomSize;

    // Item config

    let randomizedItemQuantity = itemQuantity === 'random'
        ? quantityProbability.roll()
        : itemQuantity;

    // TODO replace with max item quantity per room type config?
    if (roomType === 'hallway' && randomizedItemQuantity === 'numerous') {
        randomizedItemQuantity = /** @type {Quantity} */ ('several');
    }

    /** @type {RandomizedRoomConfig} */
    let randomizedRoomConfig = {
        itemQuantity: randomizedItemQuantity,
        roomCondition: randomizedRoomCondition,
        roomFurnitureQuantity: randomizedFurnitureQuantity,
        roomSize: randomizedRoomSize,
        roomType: randomizedRoomType,
    };

    /** @type {Partial<ItemConfig>} */
    let randomizedItemConfig = {
        itemQuantity: randomizedItemQuantity,
    };

    if (itemCondition === 'random' && isRandomItemConditionUniform) {
        let condition = conditionProbability.roll();

        randomizedRoomConfig.uniformItemCondition = condition;
        randomizedItemConfig.itemCondition        = condition;
    }

    if (itemRarity === 'random' && isRandomItemRarityUniform) {
        let rarity = rarityProbability.roll();

        randomizedRoomConfig.uniformItemRarity = rarity;
        randomizedItemConfig.itemRarity        = rarity;
    }

    return {
        randomizedItemConfig: { ...config.items, ...randomizedItemConfig },
        randomizedRoomConfig,
    };
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
 * @param {Config} config
 *
 * @returns {Room[]}
 */
export function generateRooms(config) {
    if (!config.rooms) {
        toss('config.rooms is required in generateRooms()');
    }

    let {
        roomSize,
        roomCount,
        roomType,
        roomCondition,
    } = config.rooms;

    isRequired(roomCondition, 'roomCondition is required in generateRooms()');
    isRequired(roomCount,     'roomCount is required in generateRooms()');
    isRequired(roomSize,      'roomSize is required in generateRooms()');
    isRequired(roomType,      'roomType is required in generateRooms()');

    let count = Math.floor(Number(roomCount));

    return [ ...Array(count).keys() ].map((roomNumber) => {
        let {
            randomizedItemConfig,
            randomizedRoomConfig,
        } = applyRoomRandomization(config, {
            isRandomItemConditionUniform: rollPercentile(uniformItemConditionChance),
            isRandomItemRarityUniform: rollPercentile(uniformItemRarityChance),
        });

        return {
            config: randomizedRoomConfig,
            itemSet: generateItems(randomizedItemConfig, randomizedRoomConfig),
            roomNumber: roomNumber + 1,
        };
    });
}
