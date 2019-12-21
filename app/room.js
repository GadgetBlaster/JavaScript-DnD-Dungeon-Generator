
import { getDescription } from './rooms/description';
import { getItemList } from './rooms/items';
import { getSettings } from './rooms/generate';

export const generateRoom = (config) => {
    let {
        itemCondition,
        itemQuantity,
        roomCondition,
        roomSize,
    } = getSettings(config);

    return [
        getDescription({ itemQuantity, roomCondition, roomSize }),
        getItemList({ itemQuantity, itemCondition }),
    ];
};
