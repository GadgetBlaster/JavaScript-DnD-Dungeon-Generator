
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
 * An object of randomization functions for KnobSettings.
 *
 * @type {object.<string, () => string>}
 */
const roomRandomizations = {
    [knobs.itemCondition] : () => rollPercentile(uniformConditionChance) && conditionProbability.roll(),
    [knobs.itemQuantity]  : () => quantityProbability.roll(),
    [knobs.itemRarity]    : () => rollPercentile(uniformRarityChance) && rarityProbability.roll(),
    [knobs.roomCondition] : () => conditionProbability.roll(),
    [knobs.roomFurnishing]: () => furnitureQuantityProbability.roll(),
    [knobs.roomType]      : () => rollRoomType(),
};

// -- Private Functions --------------------------------------------------------

/**
 * Returns a randomly selected appropriate room size for a room type.
 *
 * @param {string} type
 *
 * @returns {string} size
 */
const rollRoomSize = (type) => {
    return rollArrayItem(roomTypeSizes[type]);
};

/**
 * Returns a random room type using the room type probability table.
 *
 * @returns {string} roomType
 */
const rollRoomType = () => {
    let type = roomTypeProbability.roll();

    if (type === random) {
        return rollArrayItem(roomTypes);
    }

    return type;
};

// -- Public Functions ---------------------------------------------------------

// TODO combine with applyRoomRandomization
const applyRandomization = (config, randomizations) => {
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
};

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
export const applyRoomRandomization = (config) => {
    return applyRandomization(config, roomRandomizations);
};
