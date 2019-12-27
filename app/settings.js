
import { knobs } from './knobs';
import { list as roomTypes, probability as roomTypeProbability } from './rooms/type';
import { probability as conditionProbability } from './attributes/condition'
import { probability as quantityProbability } from './attributes/quantity'
import { probability as rarityProbability } from './attributes/rarity'
import { random } from './utility/random';
import { roomTypeSizes } from './rooms/dimensions';

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

const rollRoomSize = (roomType) => {
    return rollArrayItem(roomTypeSizes[roomType]);
};

const rollRoomType = () => {
    let type = roomTypeProbability.roll();

    if (type === random) {
        return rollArrayItem(roomTypes);
    }

    return type;
};

const roomRandomizations = {
    [roomType]     : () => rollRoomType(),
    [roomCondition]: () => conditionProbability.roll(),
    [itemQuantity] : () => quantityProbability.roll(),
    [itemCondition]: () => rollPercentile(uniformConditionChance) && conditionProbability.roll(),
    [itemRarity]   : () => rollPercentile(uniformRarityChance) && rarityProbability.roll(),
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

    if (settings[roomSize] === random) {
        settings[roomSize] = rollRoomSize(settings[roomType]);
    }

    return settings;
};

export const applyRoomRandomization = (config) => {
    return applyRandomization(config, roomRandomizations);
};
