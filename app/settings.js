
import { knobs } from './knobs';
import { list as roomTypes } from './rooms/type';
import { probability as conditionProbability } from './attributes/condition'
import { probability as quantityProbability } from './attributes/quantity'
import { probability as rarityProbability } from './attributes/rarity'
import { random } from './utility/random';
import { sizes } from './attribute';

import {
    rollArrayItem,
    rollPercentile,
} from './utility/roll';

const uniformConditionChance = 100;
const uniformRarityChance    = 100;

let {
    itemCondition,
    itemQuantity,
    itemRarity,
    roomCondition,
    roomSize,
    roomType,
} = knobs;

const randomizations = {
    [roomType]     : () => rollArrayItem(roomTypes),
    [roomCondition]: () => conditionProbability.roll(),
    [roomSize]     : () => rollArrayItem(sizes),
    [itemQuantity] : () => quantityProbability.roll(),
    [itemCondition]: () => rollPercentile(uniformConditionChance) && conditionProbability.roll(),
    [itemRarity]   : () => rollPercentile(uniformRarityChance) && rarityProbability.roll(),
};

export const applyRoomRandomization = (config) => {
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

    return settings;
};
