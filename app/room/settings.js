// @ts-check

// TODO move functionality to `/room/generate.js`

import { probability as conditionProbability } from '../attribute/condition.js';
import { probability as furnitureQuantityProbability } from '../item/furnishing.js';
import { probability as quantityProbability } from '../attribute/quantity.js';
import { probability as rarityProbability } from '../attribute/rarity.js';
import { random } from '../utility/random.js';
import { rollArrayItem, rollPercentile } from '../utility/roll.js';
import { roomTypeSizes } from './dimensions.js';
import { roomTypes, probability as roomTypeProbability } from './room.js';

// -- Types --------------------------------------------------------------------

/** @typedef {import('../attribute/size.js').Size} Size */
/** @typedef {import('../controller/knobs.js').DungeonConfig} DungeonConfig */
/** @typedef {import('../controller/knobs.js').RoomConfig} RoomConfig */
/** @typedef {import('../controller/knobs.js').RoomConfigFields} RoomConfigFields */
/** @typedef {import('../controller/knobs.js').ItemConfigFields} ItemConfigFields */
/** @typedef {import('../utility/roll.js').Probability} Probability */
/** @typedef {import('./generate.js').Room} Room */
/** @typedef {import('./room.js').RoomType} RoomType */

// -- Config -------------------------------------------------------------------

/**
 * Percentile chance that items in the room have uniform condition.
 *
 * @type {number}
 */
const uniformConditionChance = 10;

/**
 * Percentile chance that items in the room have uniform rarity.
 *
 * @type {number}
 */
const uniformRarityChance = 10;

/**
 * An object of randomization functions for room configs.
 *
 * TODO use field list type
 *
 * @type {{ [key in RoomConfigFields & ItemConfigFields]: () => string }}
 */
const roomRandomizations = {
    itemCondition        : () => rollUniformity(uniformConditionChance, conditionProbability),
    itemQuantity         : () => quantityProbability.roll(),
    itemRarity           : () => rollUniformity(uniformRarityChance, rarityProbability),
    roomCondition        : () => conditionProbability.roll(),
    roomFurnitureQuantity: () => furnitureQuantityProbability.roll(),
    roomType             : () => rollRoomType(roomTypeProbability.roll()),
};

// -- Private Functions --------------------------------------------------------

/**
 * Returns a randomly selected appropriate room size for a room type.
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
    if (type === random) {
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
    rollRoomType   as testRollRoomType,
    rollUniformity as testRollUniformity,
};

// -- Public Functions ---------------------------------------------------------

// TODO consolidate with applyRoomRandomization?
function applyRandomization(config, randomizations) {
    let settings = { ...config };

    Object.keys(settings).forEach((key) => {
        if (settings[key] !== random) {
            return;
        }

        let randomValue = randomizations[key] && randomizations[key]();

        if (randomValue) {
            settings[key] = randomValue;
        }
    });

    if (settings.roomSize === random) {
        settings.roomSize = rollRoomSize(settings.roomType);
    }

    if (settings.roomType === 'hallway' && settings.itemQuantity === 'numerous') {
        settings.itemQuantity = 'several';
    }

    return settings;
}

/**
 * Apply room randomizations
 *
 * TODO rename to `applyRoomRandomizations`
 *
 * @param {RoomConfig | DungeonConfig} config
 *
 * @returns {DungeonConfig | RoomConfig}
 */
export function applyRoomRandomization(config) {
    return applyRandomization(config, roomRandomizations);
}
