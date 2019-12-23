
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

const uniformConditionChance = 10;
const uniformRarityChance    = 10;

let {
    itemCondition,
    itemQuantity,
    itemRarity,
    roomCondition,
    roomSize,
    roomType,
} = knobs;

export const applyRoomRandomization = (config) => {
    let settings = { ...config };

    Object.keys(settings).forEach((key) => {
        if (settings[key] !== random) {
            return;
        }

        switch (key) {
            case roomType:
                settings[key] = rollArrayItem(roomTypes);
                return;

            case roomCondition:
                settings[key] = conditionProbability.roll();
                return;

            case roomSize:
                settings[key] = rollArrayItem(sizes)
                return;

            case itemQuantity:
                settings[key] = quantityProbability.roll()
                break;

            case itemCondition:
                if (rollPercentile(uniformConditionChance)) {
                    settings[key] = conditionProbability.roll();
                }
                break;

            case itemRarity:
                if (rollPercentile(uniformRarityChance)) {
                    settings[key] = rarityProbability.roll();
                }
                break;
        }
    });

    return settings;
}
