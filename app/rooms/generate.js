
import { list as conditions } from '../attributes/condition';
import { list as quantities } from '../attributes/quantity';
import { list as sizes } from '../attributes/size';
import { random } from '../utility/random';
import { rollArrayItem } from '../utility/roll';

export const getSettings = (config) => {
    Object.keys(config).forEach((key) => {
        if (config[key] !== random) {
            return;
        }

        let list;

        switch (key) {
            case 'itemQuantity':
                list = quantities;
                break;

            case 'roomCondition':
                list = conditions;
                break;

            case 'roomSize':
                list = sizes;
                break;
        }

        if (!list) {
            return;
        }

        config[key] = rollArrayItem(quantities);
    });

    return config;
}