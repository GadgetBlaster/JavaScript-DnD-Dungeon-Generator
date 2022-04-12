// @ts-check

import { article, section } from '../ui/block.js';
import { drawLegend } from '../dungeon/legend.js';
import { capitalize, isRequired } from '../utility/tools.js';
import { element } from '../utility/element.js';
import { indicateItemRarity } from '../item/item.js';
import { list } from '../ui/list.js';
import { paragraph, span, subtitle, title } from '../ui/typography.js';
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
/** @typedef {import('../item/generate.js').ItemSet} ItemSet */
/** @typedef {import('../room/generate.js').Room} Room */

// -- Private Functions --------------------------------------------------------

/**
 * TODO tets
 * @param {string} content
 *
 * @returns {string}
 */
const detail = (content) => span(` ( ${content} )`, { 'data-info': true });

/**
 * Get item description
 *
 * TODO uniformity formatting?
 *
 * @param {Item} item
 *
 * @returns {string}
 */
function getItemDescription(item) {
    let {
        condition,
        count,
        name,
        rarity,
    } = item;

    let indicateRare = indicateItemRarity.has(rarity);

    let notes = [];

    if (count > 1) {
        notes.push(count);
    }

    if (indicateRare) {
        notes.push(rarity);
    }

    if (condition !== 'average') {
        notes.push(`${condition} condition`);
    }

    let noteText = notes.join(', ');

    return name + (noteText ? detail(noteText) : '');
}

/**
 * Formats output for the item display.
 *
 * @private
 *
 * @param {ItemSet} itemSet
 *
 * @returns {string}
 */
function formatItems(itemSet) {
    // TODO columns

    let {
        conditionUniformity,
        containers,
        items,
        rarityUniformity,
    } = itemSet;

    let total = items.reduce((tally, { count }) => tally + count, 0) +
        itemSet.containers.reduce((tally, { count }) => tally + count, 0);

    let itemsList = items.length ? list(items.map((item) => getItemDescription(item))) : '';
    let containerList = '';

    if (containers.length) {
        containerList = itemSet.containers.map((item) => {
            isRequired(item.contents, 'Contents are required in containers');

            let content = getItemDescription(item)
                + list(item.contents.map((containerItem) => getItemDescription(containerItem)));

            return article(content);
        }).join('');
    }

    let description = '';

    if (conditionUniformity) {
        description += paragraph(`Item Condition: ${capitalize(conditionUniformity)}`);
    }

    if (rarityUniformity) {
        description += paragraph(`Item Rarity: ${capitalize(rarityUniformity)}`);
    }

    return subtitle('Items' + detail(total)) +
        description +
        containerList +
        itemsList;
}

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

    let {
        description,
        dimensions,
        title: roomTitle,
        type,
    } = getRoomDescription(room, doors);

    let header = element('header', title(roomTitle)
        + (dimensions ? span(dimensions) : ''));

    let doorList  = doors ? getDoorwayList(doors, roomNumber) : '';
    let items     = formatItems(room.itemSet);
    let map       = room.map ? getMapDescription() : '';
    let keys      = room.keys ? getKeyDescription(room.keys) : '';
    let traps     = room.traps ? subtitle('Traps' + detail(room.traps.length)) + list(room.traps) : '';

    return article(header
        + (type ? paragraph(`Type: ${type}`) : '')
        + subtitle('Description')
        + paragraph(description)
        + doorList
        + items
        + map
        + keys
        + traps
    );
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

export {
    getItemDescription as testGetItemDescription,
};

// -- Public Functions ---------------------------------------------------------

/**
 * Formats output for the dungeon generation page.
 *
 * @param {Dungeon} dungeon
 */
export function formatDungeonPage(dungeon) {
    let { mapSvg, rooms, doors } = dungeon;

    return section(mapSvg)
        + section(drawLegend())
        + formatRoomGrid(rooms, doors);
}

/**
 * Formats output for the item generation page.
 *
 * @param {ItemSet} itemSet
 *
 * @returns {string}
 */
export function formatItemsPage(itemSet) {
    return section(article(formatItems(itemSet)));
}

/**
 * Formats output for the room generation page.
 *
 * @param {Room[]} rooms
 *
 * @returns {string}
 */
export function formatRoomsPage(rooms) {
    // TODO roomNumber should already be set
    rooms.forEach((_, i) => {
        rooms[i].roomNumber = i + 1;
    });

    return formatRoomGrid(rooms);
}
