// @ts-check

import { article, header, section } from '../ui/block.js';
import { drawLegend } from '../dungeon/legend.js';
import { capitalize, isRequired } from '../utility/tools.js';
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
 * Returns an html element span string containing info detail text.
 *
 * @param {string} content
 *
 * @returns {string}
 */
const detail = (content) => span(` (${content})`, { 'data-info': true });

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
 * Returns an item set's total item count as a string.
 *
 * @private
 *
 * @param {ItemSet} itemSet
 *
 * @returns {string}
 */
function getItemTotal({ containers, items }) {
    let itemCount = items.reduce((tally, { count }) => tally + count, 0);
    let containerItemCount = containers.reduce((tally, { count }) => tally + count, 0);

    return (itemCount + containerItemCount).toString();
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
function formatItemContent(itemSet) {
    // TODO columns

    let {
        conditionUniformity,
        containers,
        items,
        rarityUniformity,
    } = itemSet;


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

    return description
        + containerList
        + itemsList;
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
    let {
        roomNumber,
        itemSet,
    } = room;

    let {
        description,
        dimensions,
        title: roomTitle,
        type,
    } = getRoomDescription(room, doors);

    let articleHeader = header(title(roomTitle)
        + (dimensions ? span(dimensions) : ''));

    let doorList = doors ? getDoorwayList(doors, roomNumber) : '';

    let map   = room.map ? getMapDescription() : '';
    let keys  = room.keys ? getKeyDescription(room.keys) : '';
    let traps = room.traps
        ? subtitle('Traps' + detail(room.traps.length.toString())) + list(room.traps)
        : '';

    return article(articleHeader
        + (type ? paragraph(`Type: ${type}`) : '')
        + subtitle('Description')
        + paragraph(description)
        + doorList
        + subtitle('Items' + detail(getItemTotal(itemSet)))
        + formatItemContent(itemSet)
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
    detail as testDetail,
    getItemDescription as testGetItemDescription,
};

// -- Public Functions ---------------------------------------------------------

/**
 * Formats output for the dungeon generation page.
 *
 * @param {Dungeon} dungeon
 */
export function formatDungeon(dungeon) {
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
export function formatItems(itemSet) {
    let content = header(title('Items' + detail(getItemTotal(itemSet))))
        + formatItemContent(itemSet);

    return section(article(content));
}

/**
 * TODO
 * @param {string} name
 *
 * @returns {string}
 */
export function formatName(name) {
    return section(article(title(name)));
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
