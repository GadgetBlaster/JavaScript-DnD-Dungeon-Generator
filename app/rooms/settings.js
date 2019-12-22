
import { knobs } from './knobs';
import { probability as conditionProbability } from '../attributes/condition'
import { probability as rarityProbability } from '../attributes/rarity'
import { quantities, sizes } from '../attribute';
import { random } from '../utility/random';

import {
    rollArrayItem,
    rollPercentile,
} from '../utility/roll';

const uniformConditionChance = 10;
const uniformRarityChance    = 10;

export const getSettings = (config) => {
    Object.keys(config).forEach((key) => {
        if (config[key] !== random) {
            return;
        }

        switch (key) {
            case knobs.roomCondition:
                config[key] = conditionProbability.roll();
                return;

            case knobs.roomSize:
                config[key] = rollArrayItem(sizes)
                return;

            case knobs.itemQuantity:
                config[key] = rollArrayItem(quantities)
                break;

            case knobs.itemCondition:
                if (rollPercentile(uniformConditionChance)) {
                    console.log('uniform item condition');
                    config[key] = conditionProbability.roll();
                }
                break;

            case knobs.itemRarity:
                if (rollPercentile(uniformRarityChance)) {
                    console.log('uniform item rarity');
                    config[key] = rarityProbability.roll();
                }
                break;
        }
    });

    return config;
}
