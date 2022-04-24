// @ts-check

import { formatDungeon, formatError, formatItems, formatName, formatRooms } from './formatter.js';
import { generateDungeon } from '../dungeon/generate.js';
import { generateItems } from '../item/generate.js';
import { generateName } from '../name/generate.js';
import { generateRooms } from '../room/generate.js';
import { getFormData, getKnobPanel } from '../ui/form.js';
import { setActiveNavItem } from '../ui/nav.js';
import { toss, isRequired } from '../utility/tools.js';

// -- Type Imports -------------------------------------------------------------

/** @typedef {import('./knobs.js').Config} Config */
/** @typedef {import('./knobs.js').DungeonConfig} DungeonConfig */
/** @typedef {import('./knobs.js').ItemConfig} ItemConfig */
/** @typedef {import('./knobs.js').NameConfig} NameConfig */
/** @typedef {import('./knobs.js').RoomConfig} RoomConfig */

// -- Types --------------------------------------------------------------------

/** @typedef {(Event) => void} Trigger */ // Rename to AppEvent?
/** @typedef {{ [key in Action]: Trigger }} Triggers */
/** @typedef {keyof routes} Path */
/** @typedef {typeof generators[number]} Generator */

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

/** @typedef {Generator | "error" | 404} Page */

// -- Config -------------------------------------------------------------------

export const generators = Object.freeze(/** @type {const} */ ([
    'dungeon',
    'rooms',
    'items',
    'names',
]));

export const routes = Object.freeze(/** @type {const} */ ({
    '/'      : 'dungeon',
    '/items' : 'items',
    '/names' : 'names',
    '/rooms' : 'rooms',
}));

const routeLookup = Object.freeze(Object.entries(routes).reduce((lookup, [ route, generator ]) => {
    lookup[generator] = route;
    return lookup;
}, {}));

// -- Private Generator Functions ----------------------------------------------

/**
 * Generates and formats output for the dungeon generator.
 *
 * @private
 *
 * @param {DungeonConfig} config
 *
 * @returns {string}
 */
function dungeonGenerator(config) {
    return formatDungeon(generateDungeon(config));
}
/**
 * Generates and formats output for the item generator.
 *
 * @private
 *
 * @param {ItemConfig} config
 *
 * @returns {string}
 */
function itemGenerator(config) {
    return formatItems(generateItems(config));
}

/**
 * Generates and formats output for the name generator.
 *
 * Note: Currently disabled.
 *
 * @private
 *
 * @param {NameConfig} config
 *
 * @returns {string}
 */
function nameGenerator(config) {
    return formatName(generateName(config));
}

/**
 * Generates and formats output for the room generator.
 *
 * @private
 *
 * @param {RoomConfig} config
 *
 * @returns {string}
 */
function roomGenerator(config) {
    return formatRooms(generateRooms(config));
}

// -- Private Functions --------------------------------------------------------

/**
 * Returns a generator function.
 *
 * @private
 * @throws
 *
 * @param {Generator} generator
 *
 * @returns {(Config) => string}
 */
function getGenerator(generator) {
    switch (generator) {
        case 'dungeon':
            return dungeonGenerator;

        case 'rooms':
            return roomGenerator;

        case 'items':
            return itemGenerator;

        case 'names':
            return nameGenerator;

        default:
            toss(`Invalid generator "${generator}" in getGenerator()`);
    }
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
 * Returns an error object containing title & message strings.
 *
 * @private
 *
 * @param {Page} [page]
 *
 * @returns {{ title: string; message: string }}
 */
function getErrorMessage(page) {
    if (page === 404) {
        return {
            title: '404',
            message: 'These are not the mischievous kobolds you are looking for.',
        };
    }

    // TODO log errors?
    return {
        title: 'Oh no!',
        message: 'Goblins have infiltrated the castle and hacked into the JavaScript!'
            + '<br />I need to fix this...',
    };
}

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
 * Returns a boolean to indicate if the sidebar is expanded
 *
 * @private
 *
 * @param {HTMLElement} body
 *
 * @returns {boolean}
 */
const isSidebarExpanded = (body) => body.dataset.layout === 'expanded-sidebar';

/**
 * Generator event handler.
 *
 * @private
 * @throws
 *
 * @param {Pick<Sections, "body" | "content" | "knobs" | "nav">} sections
 * @param {() => string} getPathname
 */
function onGenerate(sections, getPathname) {
    let { body, content, knobs } = sections;

    let config          = getFormData(knobs);
    let activeGenerator = getActiveGenerator(getPathname());

    if (!activeGenerator) {
        renderApp(sections, 'error');
        return;
    }

    let generate = getGenerator(activeGenerator);

    content.innerHTML = generate(config);

    if (isSidebarExpanded(body)) {
        toggleExpand({ body, knobs }, getPathname);
    }
}

/**
 * Navigation event handler.
 *
 * @private
 *
 * @param {Pick<Sections, "body" | "content" | "knobs" | "nav">} sections
 * @param {Event} e
 * @param {(string) => void} updatePath
 */
function onNavigate({ body, content, knobs, nav }, e, updatePath) {
    let { target } = getDataset(e.target);
    let generator = /** @type {Generator} */ (target);

    let route = routeLookup[generator];
    isRequired(route, `Invalid target "${generator}" in onNavigate()`);

    // Update URL
    updatePath(route);

    // Render it
    renderApp({ body, content, knobs, nav }, generator);
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
 * @param {Pick<Sections, "body" | "knobs">} sections
 * @param {() => string} getPathname
 */
function toggleExpand({ body, knobs }, getPathname) {
    body.dataset.layout = body.dataset.layout === 'expanded-sidebar'
        ? 'default'
        : 'expanded-sidebar';

    let generator = getActiveGenerator(getPathname());
    let isExpanded = isSidebarExpanded(body);

    knobs.innerHTML = getKnobPanel(generator, {
        config: getFormData(knobs),
        isExpanded,
    });
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

/**
 * Renders the given generator.
 *
 * TODO tests
 *
 * @private
 *
 * @param {Pick<Sections, "body" | "content" | "knobs" | "nav">} sections
 * @param {Page} page
 */
function renderApp({ body, content, knobs, nav }, page) {
    if (!page || page == 404 || page == 'error') {
        let { title, message } = getErrorMessage(page);

        body.dataset.layout = 'full';
        content.innerHTML = formatError(title, message);
        return;
    }

    body.dataset.layout = 'default';

    setActiveNavItem(nav, page);

    let isExpanded = isSidebarExpanded(body);

    knobs.innerHTML   = getKnobPanel(page, { isExpanded });
    content.innerHTML = 'Ready!';
}

export {
    getDataset       as testGetDataset,
    getErrorMessage  as testGetErrorMessage,
    getGenerator     as testGetGenerator,
    getTrigger       as testGetTrigger,
    onGenerate       as testOnGenerate,
    onNavigate       as testOnNavigate,
    renderApp        as testRenderApp,
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
 * Returns the active generator based on the route, or undefined.
 *
 * TODO tests
 *
 * @param {string} route
 *
 * @returns {Generator | undefined}
 */
export function getActiveGenerator(route) {
    return routes[route];
}

/**
 * Returns the app's render function.
 *
 * @param {Pick<Sections, "body" | "content" | "knobs" | "nav">} sections
 *
 * @returns {(generator: Page) => void}
 */
export const getRender = (sections) => (generator) => renderApp(sections, generator);

/**
 * Returns an object of action triggers.
 *
 * @param {Pick<Sections, "body" | "content" | "knobs" | "nav">} sections
 * @param {(string) => void} updatePath
 * @param {() => string} getPathname
 *
 * @returns {Triggers}
 */
export function getTriggers(sections, updatePath, getPathname) {
    let { body, knobs } = sections;

    return {
        accordion: (e) => toggleAccordion(body, e),
        expand   : ( ) => toggleExpand({ body, knobs }, getPathname),
        generate : ( ) => onGenerate(sections, getPathname),
        navigate : (e) => onNavigate(sections, e, updatePath),
        toggle   : (e) => toggleVisibility(body, e),
    };
}
