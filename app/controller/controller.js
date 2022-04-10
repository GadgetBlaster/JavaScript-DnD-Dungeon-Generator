// @ts-check

import { toss, isRequired } from '../utility/tools.js';

import { getActiveNavItem, setActiveNavItem } from '../ui/nav.js';
import { getFormData, getKnobPanel } from '../ui/form.js';

import { generateDungeon } from '../dungeon/generate.js';

import { generateItems } from '../item/generate.js';
import { generateRooms } from '../room/generate.js';

import {
    formatDungeonPage,
    formatItemsPage,
    formatRoomsPage,
} from './formatter.js';

// -- Type Imports -------------------------------------------------------------

/** @typedef {import('../ui/nav.js').Page} Page */
/** @typedef {import('./knobs.js').ItemConfig} ItemConfig */
/** @typedef {import('./knobs.js').RoomConfig} RoomConfig */
/** @typedef {import('./knobs.js').DungeonConfig} DungeonConfig */

// -- Types --------------------------------------------------------------------

/** @typedef {(Event) => void} Trigger */
/** @typedef {{ [key in Action]: Trigger }} Triggers */

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
 * | "expand"
 * | "generate"
 * | "navigate"
 * | "toggle"
 * } Action
 */

// -- Config -------------------------------------------------------------------

const generators = {
    dungeon: dungeonGenerator,
    items  : itemGenerator,
    rooms  : roomGenerator,
};

// -- Private Functions --------------------------------------------------------

/**
 * Generates and formats output for the item generation page.
 *
 * @param {ItemConfig} config
 *
 * @returns {string}
 */
function itemGenerator(config) {
    return formatItemsPage(generateItems(config));
}

/**
 * Generates and formats output for the room generation page.
 *
 * @param {RoomConfig} config
 *
 * @returns {string}
 */
function roomGenerator(config) {
    return formatRoomsPage(generateRooms(config));
}

/**
 * Generates and formats output for the dungeon generation page.
 *
 * @param {DungeonConfig} config
 *
 * @returns {string}
 */
function dungeonGenerator(config) {
    return formatDungeonPage(generateDungeon(config));
}

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
 * @private
 * @throws
 *
 * @param {Triggers} triggers
 * @param {Action} action
 *
 * @returns {Trigger?}
 */
function getTrigger(triggers, action) {
    isRequired(triggers[action], `Invalid action "${action}" passed to getTrigger()`);

    return triggers[action];
}

/**
 * Generator event handler.
 *
 * @private
 * @throws
 *
 * @param {Pick<Sections, "content" | "knobs" | "nav">} sections
 */
function onGenerate({ content, knobs, nav }) {
    let config    = getFormData(knobs);
    let page      = getActiveNavItem(nav);
    let generator = generators[page];

    isRequired(generator, `Invalid active page "${page}" in onGenerate()`);

    content.innerHTML = generator(config);
}

/**
 * Navigation event handler.
 *
 * @private
 *
 * @param {Pick<Sections, "content" | "knobs" | "nav">} sections
 * @param {string} homeContent
 * @param {Event} e
 */
function onNavigate({ content, knobs, nav }, homeContent, e) {
    let { target: page } = getDataset(e.target);

    setActiveNavItem(nav, /** @type {Page} */ (page));

    knobs.innerHTML   = getKnobPanel(/** @type {Page} */ (page));
    content.innerHTML = homeContent;
}

/**
 * Toggles an accordion element identified by the value of the `data-target`
 * attribute on a click event's `target` element.
 *
 * @private
 * @throws
 *
 * @param {HTMLElement} container
 * @param {Event} e
 */
function toggleAccordion(container, e) {
    let { target } = getDataset(e.target);

    isRequired(target, 'Missing target for accordion toggle');

    /** @type {HTMLElement} targetSectionEl */
    let targetSectionEl = container.querySelector(`[data-collapsed][data-id="${target}"]`);

    !targetSectionEl && toss(`Invalid accordion section target "${target}"`);

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
 * Toggles the generation form from sidebar to full screen.
 *
 * @private
 *
 * @param {HTMLElement} body
 */
function toggleExpand(body) {
    let isCollapsed = body.dataset.layout === 'default';

    body.dataset.layout = isCollapsed ? 'expanded-sidebar' : 'default';
}

/**
 * Toggles visibility of an element identified by the value of the `data-target`
 * attribute on a click event's `target` element.
 *
 * @private
 * @throws
 *
 * @param {Element} container
 * @param {Event} e
 */
function toggleVisibility(container, e) {
    let { target } = getDataset(e.target);

    isRequired(target, 'Missing target for visibility toggle');

    /** @type {HTMLElement} targetEl */
    let targetEl = container.querySelector(`[data-id="${target}"]`);

    !targetEl && toss(`Invalid visibility toggle target "${target}"`);

    targetEl.hidden = !targetEl.hidden;
}

export {
    generators       as testGenerators,
    getDataset       as testGetDataset,
    getTrigger       as testGetTrigger,
    onGenerate       as testOnGenerate,
    onNavigate       as testOnNavigate,
    toggleAccordion  as testToggleAccordion,
    toggleVisibility as testToggleVisibility,
};

// -- Public Functions ---------------------------------------------------------

/**
 * Attaches an application level click delegate to the document body.
 *
 * @param {HTMLElement} docBody
 * @param {Triggers} triggers
 */
export function attachClickDelegate(docBody, triggers) {
    docBody.addEventListener('click', (e) => {
        /** @type {{ action?: Action }} */
        let { action } = getDataset(e.target);

        if (!action) {
            return;
        }

        let trigger = getTrigger(triggers, action);

        e.preventDefault();
        trigger(e);
    });
}

/**
 * Get triggers
 *
 * @param {Pick<Sections, "body" | "content" | "knobs" | "nav" >} sections
 * @param {string} homeContent
 *
 * @returns {Triggers}
 */
export const getTriggers = ({ body, content, knobs, nav }, homeContent) => ({
    accordion: (e) => toggleAccordion(body, e),
    expand   : ( ) => toggleExpand(body),
    generate : ( ) => onGenerate({ content, knobs, nav }),
    navigate : (e) => onNavigate({ content, knobs, nav }, homeContent, e),
    toggle   : (e) => toggleVisibility(body, e),
});
