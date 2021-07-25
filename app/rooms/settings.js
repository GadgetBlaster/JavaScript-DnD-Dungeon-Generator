
import { knobs } from '../knobs.js';
import { probability as conditionProbability } from '../attributes/condition.js';
import { probability as furnitureQuantityProbability } from '../items/types/furnishing.js';
import { probability as quantityProbability } from '../attributes/quantity.js';
import { probability as rarityProbability } from '../attributes/rarity.js';
import { random } from '../utility/random.js';
import { rollArrayItem, rollPercentile } from '../utility/roll.js';
import { roomTypeSizes } from './dimensions.js';
import quantity from '../attributes/quantity.js';
import roomType, { list as roomTypes, probability as roomTypeProbability } from './type.js';

/**
 * Room settings
 *
 * @typedef {Object} RoomSettings
 *
 * @property {string} itemCondition
 * @property {string} itemQuantity
 * @property {string} itemQuantity
 * @property {string} itemRarity
 * @property {string} roomCondition
 * @property {string} roomFurnishing
 * @property {string} roomFurnishing
 * @property {string} roomSize
 * @property {string} roomType
 */

/** @typedef {import('../utility/roll.js').Probability} Probability */

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
 * An object of randomization functions for room specific `KnobSettings`.
 *
 * @type {{ [knobSetting: string]: () => string }}
 */
const roomRandomizations = {
    [knobs.itemCondition] : () => rollUniformity(uniformConditionChance, conditionProbability),
    [knobs.itemQuantity]  : () => quantityProbability.roll(),
    [knobs.itemRarity]    : () => rollUniformity(uniformRarityChance, rarityProbability),
    [knobs.roomCondition] : () => conditionProbability.roll(),
    [knobs.roomFurnishing]: () => furnitureQuantityProbability.roll(),
    [knobs.roomType]      : () => rollRoomType(roomTypeProbability.roll()),
};

// -- Private Functions --------------------------------------------------------

/**
 * Returns a randomly selected appropriate room size for a room type.
 *
 * @param {string} type
 *
 * @returns {string} size
 */
const rollRoomSize = (type) => rollArrayItem(roomTypeSizes[type]);

/**
 * Returns a random room type using the room type probability table.
 *
 * @param {string} type
 *
 * @returns {string} roomType
 */
function rollRoomType(type) {
    if (type === random) {
        return rollArrayItem(roomTypes);
    }

    return type;
};

/**
 * Returns a random condition for all items in the room, or null to indicate
 * each item should have a random condition.
 *
 * @param {number} uniformityChance
 *     Returns null to indicate all items in the room should have a uniform
 *     condition.
 *
 * @param {Probability} probability
 *
 * @returns {string|null} itemCondition
 */
function rollUniformity(uniformityChance, probability) {
    if (!rollPercentile(uniformityChance)) {
        return null;
    }

    return probability.roll();
}

export const _private = {
    rollRoomType,
    rollUniformity,
};

// -- Public Functions ---------------------------------------------------------

// TODO consolidate with applyRoomRandomization
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

    if (settings[knobs.roomSize] === random) {
        settings[knobs.roomSize] = rollRoomSize(settings[knobs.roomType]);
    }

    if (settings[knobs.roomType] === roomType.hallway && settings[knobs.itemQuantity] === quantity.numerous) {
        settings[knobs.itemQuantity] = quantity.several;
    }

    return settings;
}

/**
 * Apply room randomizations
 *
 * TODO rename to `applyRoomRandomizations`
 * TODO rename `config` to `knobSettings`
 *
 * @param {KnobSettings} config
 *
 * @returns {import('./generate.js').RoomConfig}
 */
export function applyRoomRandomization(config) {
    return applyRandomization(config, roomRandomizations);
}
