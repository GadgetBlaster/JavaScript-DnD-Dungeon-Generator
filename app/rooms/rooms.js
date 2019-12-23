
import { generateRoom } from './room';
import { knobs } from '../knobs';

export const generateRooms = (settings) => {
    let { [knobs.roomCount]: roomCount } = settings;
    let count = Math.floor(Number(roomCount));

    return [ ...Array(count) ].map((_, i) => {
        return generateRoom(settings, i + 1);
    }).join('');
};
