
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

const uniformConditionChance = 10;
const uniformRarityChance    = 10;

const rollRoomSize = (type) => {
    return rollArrayItem(roomTypeSizes[type]);
};

const rollRoomType = () => {
    let type = roomTypeProbability.roll();

    if (type === random) {
        return rollArrayItem(roomTypes);
    }

    return type;
};

const roomRandomizations = {
    [knobs.itemCondition] : () => rollPercentile(uniformConditionChance) && conditionProbability.roll(),
    [knobs.itemQuantity]  : () => quantityProbability.roll(),
    [knobs.itemRarity]    : () => rollPercentile(uniformRarityChance) && rarityProbability.roll(),
    [knobs.roomCondition] : () => conditionProbability.roll(),
    [knobs.roomFurnishing]: () => furnitureQuantityProbability.roll(),
    [knobs.roomType]      : () => rollRoomType(),
};

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

export const applyRoomRandomization = (config) => {
    return applyRandomization(config, roomRandomizations);
};
