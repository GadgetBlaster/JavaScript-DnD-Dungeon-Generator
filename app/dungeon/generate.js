// @ts-check

import { generateMap } from './map.js';
import { generateRooms } from '../room/generate.js';
import { getRoomDoors } from '../room/door.js';
import { roll, rollArrayItem } from '../utility/roll.js';
import { isRequired } from '../utility/tools.js';
import trapList from '../room/trap.js';

// -- Types --------------------------------------------------------------------

/** @typedef {import('../controller/knobs.js').DungeonConfig} DungeonConfig */
/** @typedef {import('../room/generate').Room} Room */
/** @typedef {import('./grid.js').Dimensions} Dimensions */
/** @typedef {import('./map.js').Door} Door */

/**
 * @typedef {object} Dungeon
 *
 * @prop {string} map // TODO rename to mapVector?
 * @prop {Room[]} rooms
 * @prop {Door[]} doors
 * @prop {Dimensions} gridDimensions
 */

// -- Config -------------------------------------------------------------------

// TODO minimum complexity constant

const complexityMultiplierMaxXY     = 6;
const complexityMultiplierMinXY     = 5;
const complexityRoomCountMultiplier = 10;
const trapCountMultiplier           = 5;

export {
    complexityMultiplierMaxXY     as testComplexityMultiplierMaxXY,
    complexityMultiplierMinXY     as testComplexityMultiplierMinXY,
    complexityRoomCountMultiplier as testComplexityRoomCountMultiplier,
    trapCountMultiplier           as testTrapCountMultiplier,
};

// -- Private Functions --------------------------------------------------------

/**
 * Returns generate dungeon room configs.
 *
 * @param {DungeonConfig} config
 *
 * @returns {object} // TODO
 */
function generateDungeonRooms(config) {
    let {
        dungeonComplexity,
        dungeonTraps,
    } = config;

    let rooms = generateRooms({
        ...config,
        roomCount: getMaxRoomCount(dungeonComplexity),
    });

    let traps = generateTraps(dungeonTraps);

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
 * TODO can duplicate traps be placed in the same room?
 *
 * @private
 *
 * @param {number} dungeonTraps
 *
 * @returns {string[]}
 */
function generateTraps(dungeonTraps) {
    let traps = [];

    if (dungeonTraps < 1) {
        return traps;
    }

    let max   = dungeonTraps * trapCountMultiplier;
    let min   = Math.max(1, (max - trapCountMultiplier - dungeonTraps));
    let count = roll(min, max);

    for (let i = 0; i < count; i++) {
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
    generateMapDimensions as testGenerateMapDimensions,
    generateTraps         as testGenerateTraps,
    getMaxRoomCount       as testGetMaxRoomCount,
};

// -- Public Functions ---------------------------------------------------------

/**
 * Returns a dungeon.
 *
 * @param {DungeonConfig} config
 *
 * @returns {Dungeon}
 */
export function generateDungeon(config) {
    let {
        dungeonComplexity,
        dungeonConnections,
        dungeonMaps,
        dungeonTraps,
    } = config;

    isRequired(dungeonComplexity,  'dungeonComplexity is required in generateDungeon()');
    isRequired(dungeonConnections, 'dungeonConnections is required in generateDungeon()');
    isRequired(dungeonMaps,        'dungeonMaps is required in generateDungeon()');
    isRequired(dungeonTraps,       'dungeonTraps is required in generateDungeon()');

    let rooms = generateDungeonRooms(config);

    // TODO break out everything before generateMap() into
    // generateDungeonRooms() for testing since excess rooms are discarded
    let gridDimensions  = generateMapDimensions(dungeonComplexity);
    let dungeon         = generateMap(gridDimensions, rooms);
    let { doors, keys } = getRoomDoors(dungeon.doors);

    keys.length && keys.forEach((key) => {
        let room = rollArrayItem(dungeon.rooms);

        if (!room.keys) {
            room.keys = [];
        }

        room.keys.push(key);
    });

    if (dungeonMaps) {
        for (let i = 0; i < dungeonMaps; i++) {
            let room = rollArrayItem(dungeon.rooms);
            room.map = true;
        }
    }

    return {
        map  : dungeon.map,
        rooms: dungeon.rooms,
        doors: doors,
        // TODO update to Dimensions
        mapDimensions: {
            gridWidth: gridDimensions.width,
            gridHeight: gridDimensions.height,
        },
    };
}
