
import { applyRoomRandomization } from './settings.js';
import { generateItems } from '../items/generate.js';
import { knobs } from '../knobs.js';

/**
 * @typedef {object} RoomConfig
 *
 * @property {RoomSettings} settings
 * @property {string[]} items
 */

/**
 * @typedef {import('./settings.js').RoomSettings
 */

/**
 * Generates room randomization
 *
 * @param {KnobSettings} settings // TODO typedef
 *
 * @returns {RoomConfig[]}
 */
export function generateRooms(settings) {
    let { [knobs.roomCount]: roomCount } = settings;

    let count = Math.floor(Number(roomCount));

    return [ ...Array(count) ].map(() => {
        let roomSettings = applyRoomRandomization(settings);

        return {
            settings: roomSettings,
            items: generateItems(roomSettings),
        };
    });
}
