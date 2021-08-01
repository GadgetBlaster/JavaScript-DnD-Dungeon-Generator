// @ts-check

import { applyRoomRandomization } from './settings.js';
import { generateItems } from '../items/generate.js';
import { knobs } from '../knobs.js';

/** @typedef {import('../knobs.js').DungeonConfig} DungeonConfig */
/** @typedef {import('../knobs.js').RoomConfig} RoomConfig */

/**
 * @typedef {object} Room
 *
 * @property {DungeonConfig | RoomConfig} settings
 * @property {string[]} items
 */

/**
 * Generates a randomized array of random room configs for the given knob
 * settings.
 *
 * @param {DungeonConfig | RoomConfig} config
 *
 * @returns {Room[]}
 */
export function generateRooms(config) {
    // TODO Use object properties directly, not key constants
    let { [knobs.roomCount]: roomCount } = config;

    let count = Math.floor(Number(roomCount));

    return [ ...Array(count) ].map(() => {
        let roomSettings = applyRoomRandomization(config);

        return {
            settings: roomSettings,
            items: generateItems(roomSettings),
        };
    });
}
