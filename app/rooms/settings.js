
import { conditions, quantities, sizes } from '../attribute';
import { random } from '../utility/random';
import { rollArrayItem } from '../utility/roll';
import { knobs } from './knobs';

export const getSettings = (config) => {
    Object.keys(config).forEach((key) => {
        if (config[key] !== random) {
            return;
        }

        let list;

        switch (key) {
            case knobs.itemQuantity:
                list = quantities;
                break;

            case knobs.roomCondition:
                list = conditions;
                break;

            case knobs.roomSize:
                list = sizes;
                break;
        }

        if (!list) {
            return;
        }

        config[key] = rollArrayItem(list);
    });

    return config;
}