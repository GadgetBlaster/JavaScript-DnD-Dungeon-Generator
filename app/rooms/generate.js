
import { applyRoomRandomization } from './settings';
import { generateItems } from '../items/generate';
import { knobs } from '../knobs';

export const generateRooms = (settings) => {
    let { [knobs.roomCount]: roomCount } = settings;

    let count = Math.floor(Number(roomCount));

    return [ ...Array(count) ].map(() => {
        let roomSettings = applyRoomRandomization(settings);

        return {
            settings: roomSettings,
            items: generateItems(roomSettings),
        };
    });
};
