
import { knobs } from './knobs';
import { list as roomTypes } from './type';
import { probability as conditionProbability } from '../attributes/condition'
import { probability as quantityProbability } from '../attributes/quantity'
import { probability as rarityProbability } from '../attributes/rarity'
import { random } from '../utility/random';
import { sizes } from '../attribute';

import {
    rollArrayItem,
    rollPercentile,
} from '../utility/roll';

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

export const getSettings = (config) => {


    Object.keys(config).forEach((key) => {
        if (config[key] !== random) {
            return;
        }

        switch (key) {
            case roomType:
                config[key] = rollArrayItem(roomTypes);
                return;

                case roomCondition:
                config[key] = conditionProbability.roll();
                return;

            case roomSize:
                config[key] = rollArrayItem(sizes)
                return;

            case itemQuantity:
                config[key] = quantityProbability.roll()
                break;

            case itemCondition:
                if (rollPercentile(uniformConditionChance)) {
                    config[key] = conditionProbability.roll();
                }
                break;

            case itemRarity:
                if (rollPercentile(uniformRarityChance)) {
                    config[key] = rarityProbability.roll();
                }
                break;
        }
    });

    return config;
}
