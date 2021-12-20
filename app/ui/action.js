// @ts-check

import { chunk, toss } from '../utility/tools.js';

import { article, section } from './block.js';
import { getActiveNavItem, setActiveNavItem } from './nav.js';
import { getFormData, getKnobPanel } from './form.js';
import { list } from './list.js';
import { subtitle } from './typography.js';

import {
    getDoorwayList,
    getKeyDescription,
    getMapDescription,
    getRoomDescription,
} from '../room/description.js';

import { drawLegend } from '../dungeon/legend.js';
import { generateDungeon } from '../dungeon/generate.js';

import { generateItems } from '../item/generate.js';
import { generateRooms } from '../room/generate.js';

// -- Types --------------------------------------------------------------------

/** @typedef {import('./nav.js').Page} Page */

/** @typedef {(Event) => void} Trigger */
/** @typedef {{ [key in Action]?: Trigger }} Triggers */

/**
 * @typedef {object} Sections
 *
 * @prop {HTMLElement} body
 * @prop {HTMLElement} content
 * @prop {HTMLElement} footer
 * @prop {HTMLElement} knobs
 * @prop {HTMLElement} nav
 */

/**
 * @typedef {"accordion"
 * | "generate"
 * | "home"
 * | "navigate"
 * | "toggle"
 * } Action
 */

// -- TODO Refactor ------------------------------------------------------------
// - Refactor so content generation and markup structure are separate operations
// - Add unit tests.

const roomsPerRow = 3;

const formatRoom = (room, doors) => {
    let roomDoors = doors && doors[room.roomNumber];
    let desc      = getRoomDescription(room, roomDoors);
    let doorList  = roomDoors ? getDoorwayList(roomDoors) : '';
    let items     = room.items.join('');
    let map       = room.map ? getMapDescription() : '';
    let keys      = room.keys ? getKeyDescription(room.keys) : '';
    let traps     = room.traps ? subtitle(`Traps (${room.traps.length})`) + list(room.traps) : '';

    return article(desc + doorList + items + map + keys + traps);
};

const getItems = (settings) => {
    let items = generateItems(settings).join('');

    return section(article(items));
};

const getRoomRows = (rooms, doors) => {
    let sections = chunk(rooms, roomsPerRow);

    return sections.map((roomChunk) => {
        let row = roomChunk.map((room) => formatRoom(room, doors)).join('');

        return section(row, { 'data-grid': 3 });
    }).join('');
};

const getRooms = (settings) => {
    let rooms = generateRooms(settings);

    rooms.forEach((_, i) => {
        rooms[i].roomNumber = i + 1;
    });

    return getRoomRows(rooms);
};

const getDungeon = (settings) => {
    let { map, rooms, doors, mapDimensions } = generateDungeon(settings);

    let legend   = drawLegend({ mapWidth: mapDimensions.gridWidth });
    let sections = getRoomRows(rooms, doors);

    return section(map) + section(legend) + sections;
};

const generators = {
    dungeon: getDungeon,
    items  : getItems,
    rooms  : getRooms,
};

// -- Private Functions --------------------------------------------------------

/**
 * Get element dataset.
 *
 * @private
 *
 * @param {EventTarget} target
 *
 * @returns {{ [attribute: string]: string }}
 */
const getDataset = (target) => target instanceof HTMLElement ? target.dataset : {};

/**
 * Returns a trigger function for the given action.
 *
 * @param {Triggers} triggers
 * @param {string} [action]
 *
 * @returns {Trigger?}
 */
function getTrigger(triggers, action) {
    action && !triggers[action] && toss(`Invalid action "${action}"`);

    return action && triggers[action];
}

/**
 * Generator event handler.
 *
 * TODO tests!
 *
 * @param {Pick<Sections, "content" | "knobs" | "nav">} sections
 */
const onGenerate = ({ content, knobs, nav }) => {
    let settings  = getFormData(knobs);
    let page      = getActiveNavItem(nav);
    let generator = generators[page];

    if (!generator) {
        throw new Error('Invalid page');
    }

    content.innerHTML = generator(settings);
};

/**
 * Navigation event handler.
 *
 * TODO tests!
 *
 * @param {Pick<Sections, "content" | "knobs" | "nav">} sections
 * @param {string} homeContent
 * @param {Event} e
 */
function onNavigate({ content, knobs, nav }, homeContent, e) {
    let { target: page } = getDataset(e.target);

    setActiveNavItem(nav, /** @type {Page} */ (page));

    knobs.innerHTML = getKnobPanel(/** @type {Page} */ (page));

    content.innerHTML = homeContent;
}

export {
    getDataset as testGetDataset,
    getTrigger as testGetTrigger,
};

// -- Public Functions ---------------------------------------------------------

/**
 * Attaches an application click event delegate to the document body.
 *
 * @param {HTMLElement} docBody
 * @param {Triggers} triggers
 */
export function attachClickDelegate(docBody, triggers) {
    docBody.addEventListener('click', (e) => {
        let { action } = getDataset(e.target);
        let trigger = getTrigger(triggers, action);

        if (!trigger) {
            return;
        }

        e.preventDefault();
        trigger(e);
    });
}

/**
 * Get triggers
 *
 * @param {Sections} sections
 * @param {string} homeContent
 *
 * @returns {Triggers}
 */
export const getTriggers = ({ body, content, knobs, nav }, homeContent) => ({
    accordion: (e) => toggleAccordion(body, e),
    generate : ( ) => onGenerate({ content, knobs, nav }),
    navigate : (e) => onNavigate({ content, knobs, nav }, homeContent, e),
    toggle   : (e) => toggleVisibility(body, e),
});

/**
 * Toggle accordion
 *
 * @param {HTMLElement} container
 * @param {Event} e
 */
export function toggleAccordion(container, e) {
    let { target } = getDataset(e.target);

    !target && toss('Missing target for accordion toggle');

    /** @type {HTMLElement} targetSectionEl */
    let targetSectionEl = container.querySelector(`[data-collapsed][data-id="${target}"]`);

    !targetSectionEl && toss(`Invalid accordion section target \`${target}\``);

    /** @type {NodeListOf<HTMLElement>} sectionEls */
    let sectionEls = container.querySelectorAll('[data-collapsed]');

    [ ...sectionEls ].forEach((el) => {
        if (el !== targetSectionEl) {
            el.dataset.collapsed = 'true';
        }
    });

    let isCollapsed = targetSectionEl.dataset.collapsed === 'true';

    targetSectionEl.dataset.collapsed = isCollapsed ? 'false' : 'true';
}

/**
 * Toggle visibility
 *
 * @param {Element} container
 * @param {Event} e
 */
export function toggleVisibility(container, e) {
    let { target } = getDataset(e.target);

    !target && toss('Missing target for visibility toggle');

    /** @type {HTMLElement} targetEl */
    let targetEl = container.querySelector(`[data-id="${target}"]`);

    !targetEl && toss(`Invalid visibility toggle target \`${target}\``);

    targetEl.hidden = !targetEl.hidden;
}
