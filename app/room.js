
import { getDescription } from './rooms/description';
import { getItemList } from './rooms/items';
import { getSettings } from './rooms/settings';

export const generateRoom = (config) => {
    let settings = getSettings(config);

    return [
        getDescription(settings),
        getItemList(settings),
    ];
};
 