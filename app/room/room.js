
import { getItemList } from '/app/room/items';
import { getDescription } from '/app/room/description';

export const generateRoom = (config) => {
    return [
        getDescription(config),
        getItemList(config),
    ];
};
