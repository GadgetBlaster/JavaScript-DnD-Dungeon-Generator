
import { applyRoomRandomization } from './settings.js';
import { generateItems } from '../items/generate.js';
import { knobs } from '../knobs.js';

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
