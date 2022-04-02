// @ts-check

import { article, section } from '../ui/block.js';
import { drawLegend } from '../dungeon/legend.js';
import { list } from '../ui/list.js';
import { subtitle } from '../ui/typography.js';
import {
    getDoorwayList,
    getKeyDescription,
    getMapDescription,
    getRoomDescription,
} from '../room/description.js';

// TODO all HTML formatting should be excluded until this step, such as item
// lists, etc

// -- Type Imports -------------------------------------------------------------

/** @typedef {import('../dungeon/generate.js').Dungeon} Dungeon */
/** @typedef {import('../dungeon/map.js').Door} Door */
/** @typedef {import('../dungeon/map.js').Doors} Doors */
/** @typedef {import('../item/generate.js').Item} Item */
/** @typedef {import('../room/generate.js').Room} Room */

// -- Private Functions --------------------------------------------------------

/**
 * Formats room generation.
 *
 * @private
 *
 * @param {Room} room
 * @param {Door[]} [doors]
 *
 * @returns {string}
 */
function formatRoom(room, doors) {
    let { roomNumber } = room;

    let desc      = getRoomDescription(room, doors);
    let doorList  = doors ? getDoorwayList(doors, roomNumber) : '';
    let items     = room.items.join('');
    let map       = room.map ? getMapDescription() : '';
    let keys      = room.keys ? getKeyDescription(room.keys) : '';
    let traps     = room.traps ? subtitle(`Traps (${room.traps.length})`) + list(room.traps) : '';

    return article(desc + doorList + items + map + keys + traps);
}

/**
 * Formats room generation.
 *
 * @private
 *
 * @param {Room[]} rooms
 * @param {Doors} [doors = {}]
 *
 * @returns {string}
 */
function formatRoomGrid(rooms, doors = {}) {
    let formattedRooms = rooms.map((room) =>
        formatRoom(room, doors[room.roomNumber])).join('');

    return section(formattedRooms, { 'data-grid': 3 });
}

// -- Public Functions ---------------------------------------------------------

/**
 * Formats output for the dungeon generation page.
 *
 * @param {Dungeon} dungeon
 */
export function formatDungeon(dungeon) {
    let { map, rooms, doors } = dungeon;

    return section(map)
        + section(drawLegend())
        + formatRoomGrid(rooms, doors);
}

/**
 * Formats output for the item generation page.
 *
 * @param {string[]} items // TODO refactor to Item[]
 */
export function formatItems(items) {
    return section(article(items.join('')));
}

/**
 * Formats output for the room generation page.
 *
 * @param {Room[]} rooms
 *
 * @returns {string}
 */
export function formatRooms(rooms) {
    // TODO roomNumber should already be set
    rooms.forEach((_, i) => {
        rooms[i].roomNumber = i + 1;
    });

    return formatRoomGrid(rooms);
}
