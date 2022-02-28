// @ts-check

import { applyRoomRandomization } from './settings.js';
import { generateItems } from '../item/generate.js';
import { isRequired } from '../utility/tools.js';

// -- Types --------------------------------------------------------------------

/** @typedef {import('../controller/knobs.js').DungeonConfig} DungeonConfig */
/** @typedef {import('../controller/knobs.js').RoomConfig} RoomConfig */
/** @typedef {import('../item/item.js').Item} Item */

/**
 * @typedef {object} Room
 *
 * @prop {string[]} items
 * @prop {number} roomNumber
 * @prop {number} roomNumber
 */

// -- Public Functions ---------------------------------------------------------

/**
 * Generates a randomized array of random room configs for the given knob
 * settings.
 *
 * TODO rename to generateRoomConfigs
 *
 * @param {RoomConfig | DungeonConfig} config
 *
 * @returns {{
 *     settings: RoomConfig | DungeonConfig; // TODO rename key to `config`
 *     items: string[]; // TODO update type to `Item[]`
 * }[]}
 */
export function generateRooms(config) {
    let {
        roomSize,
        roomCount,
        roomType,
        roomCondition,
    } = config;

    isRequired(roomCondition, 'roomCondition is required in generateRooms()');
    isRequired(roomCount,     'roomCount is required in generateRooms()');
    isRequired(roomSize,      'roomSize is required in generateRooms()');
    isRequired(roomType,      'roomType is required in generateRooms()');

    let count = Math.floor(Number(roomCount));

    return [ ...Array(count) ].map(() => {
        let roomConfig = applyRoomRandomization(config);

        return {
            settings: roomConfig,
            items: generateItems(roomConfig),
        };
    });
}
