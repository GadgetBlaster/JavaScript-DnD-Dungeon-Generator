
import { generateItems } from './items/items';
import { getDescription } from './rooms/description';

export const generateRoom = (settings) => {
    return [
        getDescription(settings),
        ...generateItems(settings),
    ];
};
