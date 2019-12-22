
import { quantities, sizes } from '../attribute';
import { random } from '../utility/random';
import { rollArrayItem } from '../utility/roll';
import { knobs } from './knobs';
import { probability as conditionProbability } from '../attributes/condition'

export const getSettings = (config) => {
    Object.keys(config).forEach((key) => {
        if (config[key] !== random) {
            return;
        }

        switch (key) {
            case knobs.itemQuantity:
                config[key] = rollArrayItem(quantities)
                break;

            case knobs.roomCondition:
                config[key] = conditionProbability.roll();
                return;

            case knobs.roomSize:
                config[key] = rollArrayItem(sizes)
                return;
        }
    });

    return config;
}
