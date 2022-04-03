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

/** @typedef {import('../attribute/size.js').Size} Size */
/** @typedef {import('../attribute/condition.js').Condition} Condition */
/** @typedef {import('../item/furnishing').FurnitureQuantity} FurnitureQuantity */
/** @typedef {import('../controller/knobs.js').DungeonConfig} DungeonConfig */
/** @typedef {import('../controller/knobs.js').ItemConfigFields} ItemConfigFields */
/** @typedef {import('../controller/knobs.js').RoomConfig} RoomConfig */
/** @typedef {import('../controller/knobs.js').RoomConfigFields} RoomConfigFields */
/** @typedef {import('../item/generate.js').Item} Item */
/** @typedef {import('./door.js').Door} Door */
/** @typedef {import('./door.js').DoorKey} DoorKey */
/** @typedef {import('./room.js').RoomType} RoomType */

// -- Types --------------------------------------------------------------------

/**
 * @typedef {object} Room
 *
 * @prop {Condition} condition
 * @prop {Size} size
 * @prop {RoomType} type
 * @prop {FurnitureQuantity} furnitureQuantity
 * @prop {Item[]} [items]
 */

/**
 * TODO use field list type
 *
 * @typedef {{
 *   [key in RoomConfigFields & ItemConfigFields]: () => string
 * }} RoomRandomizations
 */

// -- Config -------------------------------------------------------------------

/**
 * Percentile chance that items in the room have uniform condition.
 */
const uniformConditionChance = 10;

/**
 * Percentile chance that items in the room have uniform rarity.
 */
const uniformRarityChance = 10;

/**
 * An object of randomization functions for room configs.
 *
 * @type {RoomRandomizations}
 */
const roomRandomizations = {
    itemCondition        : () => rollUniformity(uniformConditionChance, conditionProbability),
    itemQuantity         : () => quantityProbability.roll(),
    itemRarity           : () => rollUniformity(uniformRarityChance, rarityProbability),
    roomCondition        : () => conditionProbability.roll(),
    roomFurnitureQuantity: () => furnitureQuantityProbability.roll(),
    roomType             : () => rollRoomType(roomTypeProbability.roll()),
};

export {
    roomRandomizations as testRoomRandomizations,
};

// -- Private Functions --------------------------------------------------------

/**
 * Applies randomization to the given room configs.
 *
 * @private
 *
 * @param {RoomConfig | DungeonConfig} config
 * @param {RoomRandomizations} randomizations
 *
 * @returns {DungeonConfig | RoomConfig}
 */
function applyRoomRandomization(config, randomizations) {
    let randomizedConfig = { ...config };

    Object.keys(randomizedConfig).forEach((key) => {
        if (randomizedConfig[key] !== 'random') {
            return;
        }

        let randomValue = randomizations[key] && randomizations[key]();

        if (randomValue) {
            randomizedConfig[key] = randomValue;
        }
    });

    if (randomizedConfig.roomSize === 'random') {
        randomizedConfig.roomSize = rollRoomSize(randomizedConfig.roomType);
    }

    if (randomizedConfig.roomType === 'hallway' && randomizedConfig.itemQuantity === 'numerous') {
        randomizedConfig.itemQuantity = 'several';
    }

    return randomizedConfig;
}

/**
 * Returns a randomly selected appropriate room size for a room type.
 *
 * @private
 *
 * @param {RoomType | "random"} type
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

/**
 * Returns a random condition for all items in the room, or null to indicate
 * each item should have a random condition.
 *
 * @private
 *
 * @param {number} uniformityChance
 *     Returns null to indicate all items in the room should have a uniform
 *     condition.
 *
 * @param {Probability} probability
 *
 * @returns {string|undefined}
 */
function rollUniformity(uniformityChance, probability) {
    if (!rollPercentile(uniformityChance)) {
        return;
    }

    return probability.roll();
}

export {
    applyRoomRandomization as testApplyRoomRandomization,
    rollRoomType           as testRollRoomType,
    rollUniformity         as testRollUniformity,
};

// -- Public Functions ---------------------------------------------------------

/**
 * Generates a randomized array of random room configs for the given knob
 * settings.
 *
 * @param {RoomConfig | DungeonConfig} config
 *
 * @returns {{
 *     settings: RoomConfig | DungeonConfig; // TODO rename key to `config`
 *     items: string[]; // TODO update type to `Item[]`
 * }[]}
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
        let roomConfig = applyRoomRandomization(config, roomRandomizations);

        return {
            settings: roomConfig,
            items: generateItems(roomConfig),
        };
    });
}
