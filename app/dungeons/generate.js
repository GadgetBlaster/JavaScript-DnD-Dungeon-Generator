// @ts-check

import { generateMap } from './map.js';
import { generateRooms } from '../rooms/generate.js';
import { getRoomDoor } from '../rooms/door.js';
import { knobs } from '../knobs.js';
import { roll, rollArrayItem } from '../utility/roll.js';
import { isRequired } from '../utility/tools.js';
import trapList from '../rooms/trap.js';

// -- Types --------------------------------------------------------------------

/** @typedef {import('./draw.js').GridDimensions} GridDimensions */
/** @typedef {import('./map.js').Door} Door */
/** @typedef {import('../knobs.js').DungeonConfig} DungeonConfig */
/** @typedef {import('../rooms/generate').Room} Room */

/**
 * @typedef {object} Dungeon
 *
 * @property {string} map // TODO rename to mapVector?
 * @property {Room[]} rooms
 * @property {Door[]} doors
 * @property {GridDimensions} mapDimensions
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
 * Returns an array of trap descriptions.
 *
 * TODO can duplicate traps be placed in the same room?
 *
 * @private
 *
 * @param {number} trapMin
 *
 * @returns {string[]}
 */
function generateTraps(trapMin) {
    let traps = [];

    if (trapMin < 1) {
        return traps;
    }

    let max   = trapMin * trapCountMultiplier;
    let min   = Math.max(1, (max - trapCountMultiplier - trapMin));
    let count = roll(min, max);

    for (let i = 0; i < count; i++) {
        traps.push(rollArrayItem(trapList));
    }

    return traps;
}

/**
 * Returns a maximum grid width and height for the dungeon.
 *
 * @private
 *
 * @param {number} complexity
 *
 * @returns {GridDimensions}
 */
function getMapDimensions(complexity) {
    let dimensionMin = complexity * complexityMultiplierMinXY;
    let dimensionMax = complexity * complexityMultiplierMaxXY;

    let gridWidth  = roll(dimensionMin, dimensionMax);
    let gridHeight = roll(dimensionMin, dimensionMax);

    return {
        gridWidth,
        gridHeight,
    };
}

/**
 * Returns a maximum room count for the dungeon.
 *
 * TODO fix name
 *
 * @private
 *
 * @param {number} complexity
 *
 * @returns {number}
 */
function getMxRoomCount(complexity) {
    return complexity * complexityRoomCountMultiplier;
}

export {
    generateTraps    as testGenerateTraps,
    getMapDimensions as testGetMapDimensions,
    getMxRoomCount   as testGetMxRoomCount,
};

// -- Public Functions ---------------------------------------------------------

/**
 * Returns a dungeon.
 *
 * @param {DungeonConfig} settings // TODO config
 *
 * @returns {Dungeon}
 */
export const generateDungeon = (settings) => {
    let {
        // TODO
        [knobs.dungeonComplexity] : complexity,
        [knobs.dungeonConnections]: connections,
        [knobs.dungeonMaps]       : maps,
        [knobs.dungeonTraps]      : trapMin,
    } = settings;

    isRequired(complexity,  'dungeonComplexity is required in generateDungeon()');
    isRequired(connections, 'dungeonConnections is required in generateDungeon()');
    isRequired(maps,        'dungeonMaps is required in generateDungeon()');
    isRequired(trapMin,     'dungeonTraps is required in generateDungeon()');

    // TODO merge to new object instead of overwriting
    settings[knobs.roomCount] = getMxRoomCount(complexity);

    let rooms = generateRooms(settings);
    let traps = generateTraps(trapMin);

    traps.length && traps.forEach((trap) => {
        let room = rollArrayItem(rooms);

        if (!room.traps) {
            room.traps = [];
        }

        room.traps.push(trap);
    });

    let mapDimensions = getMapDimensions(complexity);

    let mapSettings = {
        ...mapDimensions,
        rooms,
    };

    // TODO break out everything before generateMap() into
    // generateDungeonRooms() for testing since excess rooms are discarded

    let dungeon         = generateMap(mapSettings);
    let { doors, keys } = getRoomDoor(dungeon.doors);

    keys.length && keys.forEach((key) => {
        let room = rollArrayItem(dungeon.rooms);

        if (!room.keys) {
            room.keys = [];
        }

        room.keys.push(key);
    });

    if (maps) {
        for (let i = 0; i < maps; i++) {
            let room = rollArrayItem(dungeon.rooms);
            room.map = true;
        }
    }

    return {
        map  : dungeon.map,
        rooms: dungeon.rooms,
        doors: doors,
        mapDimensions,
    };
};
