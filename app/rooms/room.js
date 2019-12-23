
import { generateItems } from '../items/items';
import { getDescription } from './description';

export const generateRoom = (settings) => {
    return [
        getDescription(settings),
        ...generateItems(settings),
    ];
};
