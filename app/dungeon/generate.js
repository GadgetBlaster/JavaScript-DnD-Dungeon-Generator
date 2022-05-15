// @ts-check

import { generateMap } from './map.js';
import { generateRooms } from '../room/generate.js';
import { getRoomDoors } from '../room/door.js';
import { roll, rollArrayItem } from '../utility/roll.js';
import { isRequired } from '../utility/tools.js';
import trapList from '../room/trap.js';

// -- Types --------------------------------------------------------------------

/** @typedef {import('../controller/knobs.js').DungeonConfig} DungeonConfig */
/** @typedef {import('../item/generate.js').Item} Item */
/** @typedef {import('../room/door.js').DoorKey} DoorKey */
/** @typedef {import('../room/generate').Room} Room */
/** @typedef {import('./grid.js').Dimensions} Dimensions */
/** @typedef {import('./map.js').AppliedRoom} AppliedRoom */
/** @typedef {import('./map.js').Doors} Doors */

/**
 * @typedef {object} Dungeon
 *
 * @prop {string} name
 * @prop {string} mapSvg
 * @prop {Room[]} rooms
 * @prop {Doors} doors
 */

/**
 * @typedef {Room & {
 *     doors: Doors;
 *     items?: Item[];
 *     keys?: DoorKey[];
 *     maps?: string[];
 *     traps?: string[];
 * }} DungeonRoom
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
 * TODO tests
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
 * TODO move trap generate to room generation?
 *
 * @param {Omit<DungeonConfig, "roomCount">} config
 *
 * @returns {Room[]}
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
    generateMapDimensions as testGenerateMapDimensions,
    generateTraps         as testGenerateTraps,
    getMaxRoomCount       as testGetMaxRoomCount,
};

// -- Public Functions ---------------------------------------------------------

/**
 * Returns a dungeon.
 *
 * @param {Omit<DungeonConfig, "roomCount">} config
 *
 * @returns {Dungeon}
 */
export function generateDungeon(config) {
    let {
        dungeonName,
        dungeonComplexity,
        dungeonConnections,
        dungeonMaps,
        dungeonTraps,
    } = config;

    isRequired(dungeonComplexity,  'dungeonComplexity is required in generateDungeon()');
    isRequired(dungeonConnections, 'dungeonConnections is required in generateDungeon()');
    isRequired(dungeonMaps,        'dungeonMaps is required in generateDungeon()');
    isRequired(dungeonTraps,       'dungeonTraps is required in generateDungeon()');

    let gridDimensions  = generateMapDimensions(dungeonComplexity);
    let rooms           = generateDungeonRooms(config);
    let dungeon         = generateMap(gridDimensions, rooms);
    let { doors, keys } = getRoomDoors(dungeon.doors);

    // TODO break out
    keys.length && keys.forEach((key) => {
        let room = rollArrayItem(dungeon.rooms);

        if (!room.keys) {
            room.keys = [];
        }

        room.keys.push(key);
    });

    distributeMaps(dungeonMaps, dungeon.rooms);

    return {
        name  : dungeonName,
        mapSvg: dungeon.map,
        rooms : dungeon.rooms,
        doors : doors,
    };
}
