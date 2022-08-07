// @ts-check

import { article, div, header, section } from '../ui/block.js';
import { capitalize, isRequired, pluralize } from '../utility/tools.js';
import { drawLegend } from '../dungeon/legend.js';
import { element } from '../utility/element.js';
import { generators } from './controller.js';
import { indicateItemRarity } from '../item/item.js';
import { list } from '../ui/list.js';
import { paragraph, span, subtitle, title } from '../ui/typography.js';

import {
    getDoorwayDescriptionList,
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

// -- Const --------------------------------------------------------------------

const idealItemsPerColumn = 12;
const maxItemColumns      = 3;
const maxRoomColumns      = 3;

// -- Private Functions --------------------------------------------------------

/**
 * Returns an html element span string containing info detail text.
 *
 * @param {string} content
 *
 * @returns {string}
 */
const formatDetail = (content) => span(`(${content})`, { 'data-detail': '' });

/**
 * Formats output for the item display.
 *
 * @private
 *
 * @param {ItemSet} itemSet
 * @param {object} [options]
 *     @param {number} [options.columns = 1]
 *
 * @returns {string}
 */
function formatItemContent(itemSet, { columns = 1 } = {}) {
    let {
        conditionUniformity,
        containers,
        items,
        rarityUniformity,
    } = itemSet;

    let itemListAttrs = { 'data-spacing': 'b-none' };

    if (columns > 1) {
        itemListAttrs['data-columns'] = columns;
    }

    let descArgs = {
        isConditionUniform : Boolean(conditionUniformity),
        isRarityUniform    : Boolean(rarityUniformity),
    };

    let itemsList = items.length ? list(items.map((item) => getItemDescription(item, descArgs)), itemListAttrs) : '';

    let containerList = containers.map((item) => {
        isRequired(item.contents, 'Contents are required in containers');

        let content = getItemDescription(item, descArgs)
            + list(item.contents.map((containerItem) => getItemDescription(containerItem, descArgs)), {
                'data-spacing': 'b-none',
            });

        return section(content);
    }).join('');

    let description = '';

    if (conditionUniformity) {
        description += paragraph(`Item condition: ${capitalize(conditionUniformity)}`);
    }

    if (rarityUniformity) {
        description += paragraph(`Item rarity: ${capitalize(rarityUniformity)}`);
    }

    return description
        + containerList
        + itemsList;
}

/**
 * Formats room display.
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

    let doorwayDescriptions = '';

    if (doors) {
        doorwayDescriptions = subtitle('Doorways ' + formatDetail(doors.length.toString()))
            + list(getDoorwayDescriptionList(doors, roomNumber).map(({
                direction,
                desc,
                connection,
            }) => `${capitalize(direction)}: ${capitalize(desc)} ${connection}`));
    }

    let map   = room.map  ? getMapDescription() : '';
    let keys  = room.keys ? getKeyDescription(room.keys) : '';
    let traps = room.traps
        ? subtitle('Traps ' + formatDetail(room.traps.length.toString())) + list(room.traps)
        : '';

    return article(articleHeader
        + (type ? paragraph(`Type: ${type}`) : '')
        + subtitle('Description')
        + paragraph(description)
        + doorwayDescriptions
        + subtitle('Items ' + formatDetail(getItemTotal(itemSet).toString()))
        + formatItemContent(itemSet)
        + map
        + keys
        + traps
    );
}

/**
 * Formats display for an array of rooms.
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

    let columns = Math.min(maxRoomColumns, rooms.length);

    return section(formattedRooms, { 'data-grid': columns });
}

/**
 * Get item description
 *
 * @param {Item} item
 * @param {object} args
 *     @param {boolean} args.isConditionUniform
 *     @param {boolean} args.isRarityUniform
 *
 * @returns {string}
 */
function getItemDescription(item, { isConditionUniform, isRarityUniform }) {
    let {
        condition,
        count,
        name,
        rarity,
        setCount,
        type,
        variant,
    } = item;

    let indicateCondition = !isConditionUniform && condition !== 'average';
    let indicateRare      = !isRarityUniform && indicateItemRarity.has(rarity);

    let notes = [];

    if (count > 1) {
        notes.push(count);
    }

    if (indicateRare) {
        notes.push(rarity);
    }

    if (indicateCondition) {
        notes.push(`${condition} condition`);
    }

    let noteText = notes.join(', ');

    if (variant) {
        name += `, ${variant}`;
    }

    if (setCount > 1) {
        if (type === 'coin') {
            name = `${setCount} ${pluralize(setCount, name)}`;
        } else {
            name += `, set of ${setCount}`;
        }
    }

    return name + (noteText ? ' ' + formatDetail(noteText) : '');
}

/**
 * Returns an item set's total item count as a string.
 *
 * @private
 *
 * @param {ItemSet} itemSet
 *
 * @returns {number}
 */
function getItemTotal({ containers, items }) {
    let itemCount = items.reduce((tally, { count }) => tally + count, 0);
    let containerItemCount = containers.reduce((tally, { count }) => tally + count, 0);

    return (itemCount + containerItemCount);
}

export {
    formatDetail       as testFormatDetail,
    formatItemContent  as testFormatItemContent,
    formatRoom         as testFormatRoom,
    formatRoomGrid     as testFormatRoomGrid,
    getItemDescription as testGetItemDescription,
    getItemTotal       as testGetItemTotal,
};

// -- Public Functions ---------------------------------------------------------

/**
 * Formats output of the dungeon generator.
 *
 * @param {Dungeon} dungeon
 */
export function formatDungeon(dungeon) {
    let { name, map, rooms, doors } = dungeon;

    let dungeonTitle = name ? title(name, { 'data-spacing': 'b-medium' }) : '';

    return dungeonTitle
        + section(map)
        + section(drawLegend())
        + formatRoomGrid(rooms, doors);
}

/**
 * Formats output for an error page.
 *
 * @param {string} errorTitle
 * @param {string[]} messages
 *
 * @returns {string}
 */
export function formatError(errorTitle, messages) {
    return title(errorTitle, { 'data-title': 'page', 'data-spacing': 'b-medium' })
        + messages.map((message, i) => i > 0
            ? paragraph(message, { 'data-align': 'center' })
            : title(message, { 'data-align': 'center' })
        ).join('');
}

export function formatHomepage() {
    return title('D&D Generator', { 'data-title': 'page', 'data-spacing': 'b-medium' }) +
        Object.entries(generators).map(([ route, generator ]) =>
            element('a', capitalize(generator), {
                'data-action': 'navigate',
                'data-ready': true,
                href: route,
            }));
}

/**
 * Formats output of the item generator.
 *
 * @param {ItemSet} itemSet
 *
 * @returns {string}
 */
export function formatItems(itemSet) {
    let columns = Math.min(Math.ceil(itemSet.items.length / idealItemsPerColumn), maxItemColumns);

    let content = header(title('Items ' + formatDetail(getItemTotal(itemSet).toString())))
        + formatItemContent(itemSet, { columns });

    return section(article(content));
}

/**
 * Formats output of the name generator.
 *
 * @param {string} name
 *
 * @returns {string}
 */
export function formatName(name) {
    return section(article(title(name)));
}

/**
 * Formats the ready state UI.
 *
 * @private
 *
 * @param {string} message
 * @param {string} icon
 *
 * @returns {string}
 */
export function formatReadyState(message, icon) {
    let content = div(icon, { 'data-spacing': 'b' }) + message;

    return element('button', content, {
        'data-action': 'generate',
        'data-ready': true,
    });
}

/**
 * Formats output of the room generator.
 *
 * @param {Room[]} rooms
 *
 * @returns {string}
 */
export function formatRooms(rooms) {
    return formatRoomGrid(rooms);
}
