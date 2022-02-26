// @ts-check

import { applyRoomRandomization } from './settings.js';
import { generateItems } from '../item/generate.js';
import { isRequired } from '../utility/tools.js';

// -- Types --------------------------------------------------------------------

/** @typedef {import('../controller/knobs.js').DungeonConfig} DungeonConfig */
/** @typedef {import('../controller/knobs.js').RoomConfig} RoomConfig */

/**
 * TODO move to room.js?
 * @typedef {object} Room
 *
 * @prop {DungeonConfig | RoomConfig} settings
 * @prop {string[]} items
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
    let {
        roomSize     : roomSize,
        roomCount    : roomCount,
        roomType     : roomType,
        roomCondition: roomCondition,
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
