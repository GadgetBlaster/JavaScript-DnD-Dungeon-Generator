// @ts-check

import { chunk } from '../utility/tools.js';

import { article, section } from '../ui/block.js';

import { list } from '../ui/list.js';
import { subtitle } from '../ui/typography.js';

import { drawLegend } from '../dungeon/legend.js';

import {
    getDoorwayList,
    getKeyDescription,
    getMapDescription,
    getRoomDescription,
} from '../room/description.js';

// TODO all HTML formatting should be excluded until this step, such as item
// lists, etc

// -- Type Imports -------------------------------------------------------------

/** @typedef {import('../room/generate.js').Room} Room */
/** @typedef {import('../dungeon/generate.js').Dungeon} Dungeon */
/** @typedef {import('../room/door.js').RoomDoor} RoomDoor */
/** @typedef {import('../item/item.js').Item} Item */

// -- Config -------------------------------------------------------------------

const roomsPerRow = 3;

// -- Private Functions --------------------------------------------------------

/**
 * Formats room generation.
 *
 * @param {Room} room
 * @param {RoomDoor[]} [doors] // TODO doors should be included on Room?
 *
 * @returns {string}
 */
function formatRoom(room, doors) {
    let roomDoors = doors && doors[room.roomNumber];
    let desc      = getRoomDescription(room, roomDoors);
    let doorList  = roomDoors ? getDoorwayList(roomDoors) : '';
    let items     = room.items.join('');
    let map       = room.map ? getMapDescription() : '';
    let keys      = room.keys ? getKeyDescription(room.keys) : '';
    let traps     = room.traps ? subtitle(`Traps (${room.traps.length})`) + list(room.traps) : '';

    return article(desc + doorList + items + map + keys + traps);
}

/**
 * Returns formatted rooms chunked into row sections.
 *
 * @param {Room[]} rooms
 * @param {RoomDoor[]} [doors]
 *
 * @returns {string}
 */
function formatRoomRows(rooms, doors) {
    let sections = chunk(rooms, roomsPerRow);

    return sections.map((roomChunk) => {
        let row = roomChunk.map((room) => formatRoom(room, doors)).join('');

        return section(row, { 'data-grid': 3 });
    }).join('');
}

// -- Public Functions ---------------------------------------------------------

/**
 * Formats output for the dungeon generation page.
 *
 * @param {Dungeon} dungeon
 */
export function formatDungeon(dungeon) {
    let { map, rooms, doors, mapDimensions } = dungeon;

    let legend   = drawLegend({ mapWidth: mapDimensions.gridWidth });
    let sections = formatRoomRows(rooms, doors);

    return section(map) + section(legend) + sections;
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
 * Formats room generation.
 *
 * @param {Room[]} rooms
 *
 * @returns {string}
 */
export function formatRooms(rooms) {
    rooms.forEach((_, i) => {
        rooms[i].roomNumber = i + 1;
    });

    return formatRoomRows(rooms);
}
