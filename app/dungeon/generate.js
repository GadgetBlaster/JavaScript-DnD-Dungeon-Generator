// @ts-check

import { generateMap } from './map.js';
import { generateRooms } from '../room/generate.js';
import { getDoorKeys } from '../room/door.js';
import { roll, rollArrayItem } from '../utility/roll.js';
import { isRequired, toss } from '../utility/tools.js';
import trapList from '../room/trap.js';

// -- Types --------------------------------------------------------------------

/** @typedef {import('../controller/knobs.js').Config} Config */
/** @typedef {import('../item/generate.js').Item} Item */
/** @typedef {import('../room/door.js').Door} Door */
/** @typedef {import('../room/door.js').DoorKey} DoorKey */
/** @typedef {import('../room/generate').Room} Room */
/** @typedef {import('./grid.js').Dimensions} Dimensions */
/** @typedef {import('./map.js').AppliedRoom} AppliedRoom */
/** @typedef {import('./map.js').DungeonDoors} DungeonDoors */

/**
 * @typedef {object} Dungeon
 *
 * @prop {string} name
 * @prop {Dimensions} dimensions
 * @prop {AppliedRoom[]} rooms
 * @prop {Door[]} doors
 */

// -- Config -------------------------------------------------------------------

// TODO minimum complexity constant

const complexityMultiplierMaxXY     = 6;
const complexityMultiplierMinXY     = 5;
const complexityRoomCountMultiplier = 10;
const trapCountMultiplier           = 5;

export const maxDungeonMaps = 10;
export const minDungeonMaps = 0;

export {
    complexityMultiplierMaxXY     as testComplexityMultiplierMaxXY,
    complexityMultiplierMinXY     as testComplexityMultiplierMinXY,
    complexityRoomCountMultiplier as testComplexityRoomCountMultiplier,
    trapCountMultiplier           as testTrapCountMultiplier,
};

// -- Private Functions --------------------------------------------------------


/**
 * Distributes maps throughout the dungeon.
 *
 * @private
 *
 * @param {DoorKey[]} keys
 * @param {AppliedRoom[]} rooms
 */
function distributeKeys(keys, rooms) {
    keys.length && keys.forEach((key) => {
        let room = rollArrayItem(rooms);

        if (!room.keys) {
            room.keys = [];
        }

        room.keys.push(key);
    });
}

/**
 * Distributes maps throughout the dungeon.
 *
 * @private
 *
 * @param {number} dungeonMaps
 * @param {AppliedRoom[]} rooms
 */
function distributeMaps(dungeonMaps, rooms) {
    let count = Math.max(Math.min(maxDungeonMaps, dungeonMaps), minDungeonMaps);

    for (let i = 0; i < count; i++) {
        let room = rollArrayItem(rooms);
        room.map = true;
    }
}

/**
 * Returns generate dungeon room configs.
 *
 * TODO break out trap generation
 *
 * @private
 * @throws
 *
 * @param {Config} config
 *
 * @returns {Room[]}
 */
function generateDungeonRooms(config) {
    if (!config.maps) {
        toss('config.maps is required in generateDungeonRooms()');
    }

    if (!config.rooms) {
        toss('config.rooms is required in generateDungeonRooms()');
    }

    let {
        dungeonComplexity,
        dungeonTraps,
    } = config.maps;

    let rooms = generateRooms({
        ...config,
        rooms: {
            ...config.rooms,
            roomCount: getMaxRoomCount(dungeonComplexity),
        },
    });

    let traps = generateTraps(dungeonTraps);

    // TODO break out into distribute traps function
    traps.length && traps.forEach((trap) => {
        let room = rollArrayItem(rooms);

        if (!room.traps) {
            room.traps = [];
        }

        room.traps.push(trap);
    });

    return rooms;
}

/**
 * Returns a maximum grid width and height for the dungeon.
 *
 * @private
 *
 * @param {number} complexity
 *
 * @returns {Dimensions}
 */
function generateMapDimensions(complexity) {
    let dimensionMin = complexity * complexityMultiplierMinXY;
    let dimensionMax = complexity * complexityMultiplierMaxXY;

    let width  = roll(dimensionMin, dimensionMax);
    let height = roll(dimensionMin, dimensionMax);

    return {
        width,
        height,
    };
}

/**
 * Returns an array of trap descriptions.
 *
 * TODO should duplicate traps be able to be placed in the same room?
 *
 * @private
 *
 * @param {number} count
 *
 * @returns {string[]}
 */
function generateTraps(count) {
    let traps = [];

    if (count < 1) {
        return traps;
    }

    let max = count * trapCountMultiplier;
    let min = Math.max(1, (max - trapCountMultiplier - count));

    let trapCount = roll(min, max);

    for (let i = 0; i < trapCount; i++) {
        traps.push(rollArrayItem(trapList));
    }

    return traps;
}

/**
 * Returns the maximum room count for the dungeon's complexity.
 *
 * @private
 *
 * @param {number} complexity
 *
 * @returns {number}
 */
function getMaxRoomCount(complexity) {
    return complexity * complexityRoomCountMultiplier;
}

export {
    distributeKeys        as testDistributeKeys,
    distributeMaps        as testDistributeMaps,
    generateMapDimensions as testGenerateMapDimensions,
    generateTraps         as testGenerateTraps,
    getMaxRoomCount       as testGetMaxRoomCount,
};

// -- Public Functions ---------------------------------------------------------

/**
 * Returns a dungeon.
 *
 * TODO
 * - Drop `walls` from rooms returned by `generateMap()`, they are only used in
 *   procedural generation, not restoring maps.
 *
 * @param {Config} config
 *
 * @returns {Dungeon}
 */
export function generateDungeon(config) {
    if (!config.maps) {
        toss('config.maps is required in generateDungeon()');
    }

    let {
        dungeonName,
        dungeonComplexity,
        dungeonConnections,
        dungeonMaps,
        dungeonTraps,
    } = config.maps;

    isRequired(dungeonComplexity,  'dungeonComplexity is required in generateDungeon()');
    isRequired(dungeonConnections, 'dungeonConnections is required in generateDungeon()');
    isRequired(dungeonMaps,        'dungeonMaps is required in generateDungeon()');
    isRequired(dungeonName,        'dungeonName is required in generateDungeon()');
    isRequired(dungeonTraps,       'dungeonTraps is required in generateDungeon()');

    let gridDimensions  = generateMapDimensions(dungeonComplexity);
    let roomConfigs     = generateDungeonRooms(config);

    let {
        dimensions,
        rooms,
        doors,
    } = generateMap(gridDimensions, roomConfigs);

    distributeKeys(getDoorKeys(doors), rooms);
    distributeMaps(dungeonMaps, rooms);

    return {
        dimensions,
        doors,
        name: dungeonName,
        rooms,
    };
}
