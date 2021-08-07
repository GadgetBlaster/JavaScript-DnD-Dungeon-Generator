// @ts-check

import { applyRoomRandomization } from './settings.js';
import { generateItems } from '../items/generate.js';
import { isRequired } from '../utility/tools.js';
import { knobs } from '../knobs.js';

// -- Types --------------------------------------------------------------------

/** @typedef {import('../knobs.js').DungeonConfig} DungeonConfig */
/** @typedef {import('../knobs.js').RoomConfig} RoomConfig */

/**
 * @typedef {object} Room
 *
 * @property {DungeonConfig | RoomConfig} settings
 * @property {string[]} items
 */

// -- Public Functions ---------------------------------------------------------

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
    let {
        [knobs.roomSize]: roomSize,
        [knobs.roomCount]: roomCount,
        [knobs.roomType]: roomType,
        [knobs.roomCondition]: roomCondition,
    } = config;

    isRequired(roomCondition, 'roomCondition is required in generateRooms()');
    isRequired(roomCount,     'roomCount is required in generateRooms()');
    isRequired(roomSize,      'roomSize is required in generateRooms()');
    isRequired(roomType,      'roomType is required in generateRooms()');

    let count = Math.floor(Number(roomCount));

    return [ ...Array(count) ].map(() => {
        let roomSettings = applyRoomRandomization(config);

        return {
            settings: roomSettings,
            items: generateItems(roomSettings),
        };
    });
}
