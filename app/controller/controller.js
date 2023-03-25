// @ts-check

import {
    disableSaveButton,
    enableSaveButton,
    getToolbar,
} from '../ui/toolbar.js';
import { toast } from '../ui/alert.js';
import { dungeonIcon, itemsIcon, roomsIcon } from '../ui/icon.js';
import { spinner } from '../ui/spinner.js';
import {
    formatDungeon,
    formatError,
    formatItems,
    formatName,
    formatReadyState,
    formatRooms,
    getFormattedHomepage,
} from './formatter.js';
import { generateDungeon } from '../dungeon/generate.js';
import { getMapSvg } from '../dungeon/map.js';
import { generateItems } from '../item/generate.js';
import { generateName } from '../name/generate.js';
import { generateRooms } from '../room/generate.js';
import { getDoorsByRoomNumber } from '../room/door.js';
import { getFormData, getKnobPanel, validateOnBlur } from '../ui/form.js';
import { getNav, setActiveNavItem } from '../ui/nav.js';
import { toss, isRequired } from '../utility/tools.js';
import { formatNotes, releaseNotes } from '../pages/notes.js';

// -- Type Imports -------------------------------------------------------------

/** @typedef {import('../utility/xhr.js').Request} Request */
/** @typedef {import('./knobs.js').Config} Config */
/** @typedef {import('./knobs.js').DungeonConfig} DungeonConfig */
/** @typedef {import('./knobs.js').ItemConfig} ItemConfig */
/** @typedef {import('./knobs.js').NameConfig} NameConfig */
/** @typedef {import('./knobs.js').RoomConfig} RoomConfig */

// -- Types --------------------------------------------------------------------

/** @typedef {(Event) => void} Trigger */ // Rename to AppEvent?
/** @typedef {{ [key in Action]: Trigger }} Triggers */
/** @typedef {typeof generators[keyof typeof generators]} Generator */
/** @typedef {typeof pages[keyof typeof pages]} Page */

/**
 * @typedef {object} Controller
 *
 * @prop {() => string} getPathname
 * @prop {(error: Error | object | string) => void} onError
 * @prop {Request} request
 * @prop {Sections} sections
 * @prop {State} state
 * @prop {(path: string) => void} updatePath
 */

/**
 * @typedef {object} Sections
 *
 * @prop {HTMLElement} body
 * @prop {HTMLElement} content
 * @prop {HTMLElement} footer
 * @prop {HTMLElement} knobs
 * @prop {HTMLElement} nav
 * @prop {HTMLElement} overlay
 * @prop {HTMLElement} toast
 * @prop {HTMLElement} toolbar
 */

/**
 * @typedef {object} State
 *
 * @prop {() => object} get
 * @prop {(object) => object} set
 */

/**
 * @typedef {object} Route
 *
 * @prop {Generator} [generator]
 * @prop {string} [key]
 * @prop {Page} [page]
 */

/**
 * @typedef {"accordion"
 * | "expand"
 * | "generate"
 * | "navigate"
 * | "save"
 * | "toggle"
 * } Action
 */

/** @typedef {404} StatusCode */

// -- Config -------------------------------------------------------------------

/**
 * App generators, keyed by generator route.
 *
 * Object order determines the order of navigation links.
 */
export const generators = Object.freeze(/** @type {const} */ ({
    '/maps' : 'maps',
    '/rooms': 'rooms',
    '/items': 'items',
    // '/names': 'names', // Disabled
}));

export const generatorConfigs = {
    maps : { title: 'Generate Dungeon', icon: dungeonIcon },
    rooms: { title: 'Generate Rooms',   icon: roomsIcon },
    items: { title: 'Generate Items',   icon: itemsIcon },
};

export const pages = Object.freeze(/** @type {const} */ ({
    '/'             : 'home',
    '/release-notes': 'notes',
}));

const genKeyRouteRegEx = `^\\\/(${Object.keys(generators).join('|').replace(/\//g, '')})\\\/([a-z0-9]{13}$)`;

/**
 * Version of the JSON schema used for generations/creations. Sent to the API to
 * enable migrating old content to the latest format.
 */
const schemaVersion = 1;

export {
    genKeyRouteRegEx   as testGenKeyRouteRegEx,
};

// -- Private Generator Functions ----------------------------------------------

/**
 * Generates and formats output for the dungeon generator.
 *
 * @private
 *
 * @param {State} state
 * @param {Config} config
 *
 * @returns {string}
 */
function dungeonGenerator(state, config) {
    let dungeon = generateDungeon(config);
    state.set(dungeon);

    let format = getFormatter('maps');
    return format(dungeon);
}

/**
 * Generates and formats output for the item generator.
 *
 * @private
 *
 * @param {State} state
 * @param {Config} config
 *
 * @returns {string}
 */
function itemGenerator(state, config) {
    if (!config.items) { toss('config.items is required in itemGenerator()'); }

    let newState = generateItems(config.items);
    state.set(newState);

    return formatItems(newState);
}

/**
 * Generates and formats output for the name generator.
 *
 * Note: Currently disabled.
 *
 * @private
 *
 * @param {State} state
 * @param {Config} config
 *
 * @returns {string}
 */
function nameGenerator(state, config) {
    let newState = generateName(config);
    state.set(newState);

    return formatName(newState);
}

/**
 * Generates and formats output for the room generator.
 *
 * @private
 *
 * @param {State} state
 * @param {Config} config
 *
 * @returns {string}
 */
function roomGenerator(state, config) {
    let newState = generateRooms(config);
    state.set(newState);

    return formatRooms(newState);
}

// -- Private Functions --------------------------------------------------------

/**
 * Returns the active generator based on the route, or undefined.
 *
 * TODO update tests
 * @private
 *
 * @param {string} path
 *
 * @returns {Route}
 */
function getActiveRoute(path) {
    let page = pages[path];

    if (page) {
        return { page };
    }

    if (generators[path]) {
        return { generator: generators[path] };
    }

    let parts = path?.match(genKeyRouteRegEx);

    if (parts?.length === 3) {
        parts.shift();

        let [ gen, key ] = parts;

        if (!generators[`/${gen}`]) {
            return {}; // 404
        }

        return {
            generator: /** @type {Generator} */ (gen),
            key,
        };
    }

    return {}; // 404
}

/**
 * Returns a formatter function.
 *
 * @private
 * @throws
 *
 * @param {Generator} generator
 *
 * @returns {(any) => string} // TODO
 */
function getFormatter(generator) {
    switch (generator) {
        case 'maps':
            return (dungeon) => {
                return formatDungeon(dungeon, getMapSvg(dungeon), getDoorsByRoomNumber(dungeon.doors));
            };

        case 'rooms':
            return formatRooms;

        case 'items':
            return formatItems;

        // case 'names':
        //     return formatName;

        default:
            toss(`Invalid generator "${generator}" in getGenerator()`);
    }
}

/**
 * Returns a generator function.
 *
 * @private
 * @throws
 *
 * @param {Generator} generator
 *
 * @returns {(state: State, config: Config) => string}
 */
function getGenerator(generator) {
    switch (generator) {
        case 'maps':
            return dungeonGenerator; // TODO Simpler to call generator functions directly instead of return them?

        case 'rooms':
            return roomGenerator;

        case 'items':
            return itemGenerator;

        // case 'names':
        //     return nameGenerator;

        default:
            toss(`Invalid generator "${generator}" in getGenerator()`);
    }
}

/**
 * Returns an error object containing title & message strings.
 *
 * @private
 *
 * @param {StatusCode} [statusCode]
 *
 * @returns {{ title: string; messages: string[] }}
 */
function getErrorPageContent(statusCode) {
    switch (statusCode) {
        case 404:
            return {
                title   : '404',
                messages: [ 'These are not the mischievous kobolds you are looking for.' ],
            };

        default:
            return {
                title   : 'Oh no!',
                messages: [
                    'Goblins have infiltrated the castle and hacked into the JavaScript!',
                    'This error has been scribbled on a magical scroll by a preposterous robot so AJ can fix this bug.',
                ],
            };
    }
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
 * @returns {Trigger}
 */
function getTrigger(triggers, action) {
    isRequired(triggers[action], `Invalid action "${action}" passed to getTrigger()`);

    return triggers[action];
}

/**
 * Returns title and icon for the given generator's ready state.
 *
 * @private
 * @throws
 *
 * @param {Generator} generator
 *
 * @returns {{ title: string; icon: string }}
 */
function getReadyState(generator) {
    return generatorConfigs[generator] || toss(`Invalid generator "${generator}" in getReadyState()`);
}

/**
 * Returns the element if the event target is a control element, otherwise null.
 *
 * @private
 *
 * @param {EventTarget | null} target
 *
 * @returns {HTMLInputElement | HTMLSelectElement | null}
 */
const getTargetControl = (target) =>
    target instanceof HTMLInputElement || target instanceof HTMLSelectElement
        ? target
        : null;

/**
 * Returns an event target's dataset, if any.
 *
 * @private
 *
 * @param {EventTarget | null} target
 *
 * @returns {DOMStringMap}
 */
const getTargetDataset = (target) => target instanceof HTMLElement ? target.dataset : {};

/**
 * Returns an event target's href, if any.
 *
 * @private
 *
 * @param {EventTarget | null} target
 *
 * @returns {string?}
 */
const getTargetHref = (target) => target instanceof HTMLElement ? target.getAttribute('href') : null;

/**
 * Returns a boolean to indicate if the sidebar is expanded
 *
 * @private
 *
 * @param {HTMLElement} body
 *
 * @returns {boolean}
 */
const isSidebarExpanded = (body) => body.dataset.layout === 'sidebar-expanded';

/**
 * Generator event handler.
 *
 * @private
 * @throws // TODO What throws?
 *
 * @param {Controller} controller
 */
function onGenerate(controller) {
    let { state, sections, getPathname } = controller;
    let { body, content, knobs } = sections;

    let config = getFormData(knobs);

    let { generator } = getActiveRoute(getPathname());

    if (!generator) {
        renderErrorPage(sections);
        return;
    }

    let generate = getGenerator(generator);

    content.innerHTML = generate(state, config);

    // Disabled
    // enableSaveButton(sections.toolbar); // TODO test

    if (isSidebarExpanded(body)) {
        toggleExpand(controller);
    }
}

/**
 * Navigation event handler.
 *
 * @private
 *
 * @param {Controller} controller
 * @param {Event} e
 */
function onNavigate(controller, e) {
    let href = getTargetHref(e.target);

    if (!href) {
        toss(`Invalid href "${href}" in onNavigate`);
    }

    let { sections, updatePath } = controller;

    // Update URL
    updatePath(href);

    // Render it
    renderApp(controller, href);

    disableSaveButton(sections.toolbar); // TODO test
}

/**
 * Initiates downloading a JSON file for the current generation.
 *
 * Disabled.
 *
 * @private
 *
 * @param {Controller} controller
 */
function onSave({ getPathname, onError, request, sections, state, updatePath }) {
    let {
        generator,
        key, // TODO update existing records
    } = getActiveRoute(getPathname());

    request(`/api/save/${generator}`, {
        data: {
            version: schemaVersion,
            ...state.get(),
        },
        method: 'POST',
        callback: (result) => {
            if (result?.status !== 200 || !result?.data?.key) {
                toast(sections.toast, 'An error occurred while saving.', { success: false });
                onError(result);
                return;
            }

            toast(sections.toast, 'Creation saved.');
            updatePath(`/${generator}/${encodeURIComponent(result.data.key)}`);
        },
    });
}

/**
 * Renders the given page or generator.
 *
 * @private
 *
 * @param {Controller} controller
 * @param {string} path
 */
function renderApp(controller, path) {
    let { onError, request, state, sections } = controller;
    let { content } = sections;
    let { generator, key, page } = getActiveRoute(path);

    if (page) {
        renderPage(sections, { page });
        return;
    }

    if (!generator) {
        renderErrorPage(sections, 404);
        return;
    }

    if (!key) {
        renderGenerator(sections, generator);
        return;
    }

    // Loading creations from the API is disabled.
    renderErrorPage(sections, 404);
    return;

    // content.innerHTML = spinner();

    // request('/api/fetch/creation', {
    //     data: { key },
    //     method: 'POST',
    //     callback: (result) => {
    //         if (result?.status !== 200) {
    //             onError({ ...result, key });
    //             renderErrorPage(sections, result?.status);
    //             return;
    //         }

    //         let type = result.data?.type;

    //         if (!generator || type !== generator) {
    //             renderErrorPage(sections, 404);
    //             return;
    //         }

    //         let config;

    //         try {
    //             config = JSON.parse(result.data.config);
    //         } catch (error) {
    //             onError(error);
    //             renderErrorPage(sections);
    //             return;
    //         }

    //         state.set(config);

    //         let formatConfig = getFormatter(generator);
    //         renderGenerator(sections, generator, formatConfig(config));
    //     },
    // });
}

/**
 * Renders the error page.
 *
 * @private
 *
 * @param {Sections} sections
 * @param {404} [statusCode]
 */
function renderErrorPage({ body, content, knobs, nav, toolbar }, statusCode) {
    let { title, messages } = getErrorPageContent(statusCode);

    setActiveNavItem(nav); // Clear it
    setLayout(body, 'full');

    toolbar.innerHTML = '';
    knobs.innerHTML   = '';
    content.innerHTML = formatError(title, messages);
}

/**
 * Renders a generator.
 *
 * // TODO tests from `renderApp()`
 *
 * @private
 *
 * @param {Sections} sections
 * @param {Generator} generator
 * @param {string} [savedGeneration]
 */
function renderGenerator(sections, generator, savedGeneration) {
    let { body, content, knobs, nav, toolbar } = sections;

    if (body.dataset.layout === 'full') {
        setLayout(body, 'default');
    }

    setActiveNavItem(nav, generator);

    let isExpanded = isSidebarExpanded(body);

    // Incomplete toolbar UI. Disabled.
    // toolbar.innerHTML = getToolbar(generator);
    knobs.innerHTML   = getKnobPanel(generator, { isExpanded });

    if (savedGeneration) {
        content.innerHTML = savedGeneration;
        return;
    }

    let { title, icon } = getReadyState(generator);

    switch (generator) {
        case 'items':
            content.innerHTML = formatReadyState(
                title,
                icon,
                generator,
                [ 'Configure the items generator on the left then click "Generate".' ]
            );
            break;

        case 'maps':
            content.innerHTML = formatReadyState(
                title,
                icon,
                generator,
                [
                    "Mystic Waffle's random dungeon generator is a simple grid-based map generator which includes room descriptions and item contents. ",
                    'Configure map, room, and item settings on the left then click "Generate".'
                ]
            );
            break;

        case 'rooms':
            content.innerHTML = formatReadyState(
                title,
                icon,
                generator,
                [
                    "Generate one or more spaces for your adventure's scene, such as a wizard's laboratory, a smithy, or an armory. ",
                    'Set your desired configurations on the left then then click "Generate".'
                ]
            );
            break;
     }

}

/**
 * Renders a page.
 *
 * // TODO tests
 *
 * @private
 *
 * @param {Sections} sections
 * @param {{ page: Page }} pageRoute
 */
function renderPage({ body, content, knobs, nav, toolbar }, { page }) {
    setActiveNavItem(nav); // Clear it

    toolbar.innerHTML = '';
    knobs.innerHTML   = '';

    switch (page) {
        case 'home':
            setLayout(body, 'full');
            content.innerHTML = getFormattedHomepage();
            return;

        case 'notes':
            setLayout(body, 'slim');
            content.innerHTML = formatNotes(releaseNotes);
            return;

        default:
            toss(`Invalid page "${page}" in renderPage()`);
    }
}

/**
 * Sets the layout.
 *
 * TODO tests
 *
 * @param {HTMLElement} body
 * @param {"default" | "full" | "slim" | "sidebar-expanded"} layout
 *
 */
function setLayout(body, layout) {
    body.dataset.layout = layout;
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
    let { target } = getTargetDataset(e.target);

    isRequired(target, 'Missing target for accordion toggle');

    /** @type {HTMLElement | null} targetSectionEl */
    let targetSectionEl = container.querySelector(`[data-accordion][data-id="${target}"]`);

    if (!targetSectionEl) {
        toss(`Invalid accordion section target "${target}"`);
    }

    /** @type {NodeListOf<HTMLElement>} sectionEls */
    let sectionEls = container.querySelectorAll('[data-accordion]');

    [ ...sectionEls ].forEach((el) => {
        if (el !== targetSectionEl) {
            el.dataset.accordion = 'collapsed';
        }
    });

    let isCollapsed = targetSectionEl.dataset.accordion === 'collapsed';

    targetSectionEl.dataset.accordion = isCollapsed ? 'expanded' : 'collapsed';
}

/**
 * Toggles the generation form from sidebar to full screen.
 *
 * @private
 *
 * @param {Controller} controller
 */
function toggleExpand({ sections, getPathname }) {
    let { body, knobs } = sections;

    setLayout(body, body.dataset.layout === 'sidebar-expanded'
        ? 'default'
        : 'sidebar-expanded'
    );

    let { generator } = getActiveRoute(getPathname());

    if (!generator) {
        renderErrorPage(sections);
        return;
    }

    let isExpanded = isSidebarExpanded(body);

    knobs.innerHTML = getKnobPanel(generator, {
        config: getFormData(knobs),
        isExpanded,
    });
}

/**
 * Toggles visibility of an element based on the element's id, identified by the
 * value of the `data-target` attribute on a click event's `target` element.
 *
 * @private
 * @throws
 *
 * @param {Element} container
 * @param {Event} e
 */
function toggleVisibility(container, e) {
    let { target } = getTargetDataset(e.target);

    isRequired(target, 'Missing target for visibility toggle');

    /** @type {HTMLElement | null} targetEl */
    let targetEl = container.querySelector(`[id="${target}"]`);

    if (!targetEl) {
        toss(`Invalid visibility toggle target "${target}"`);
    }

    targetEl.hidden = !targetEl.hidden;
}

export {
    getActiveRoute      as testGetActiveRoute,
    getErrorPageContent as testGetErrorPageContent,
    getGenerator        as testGetGenerator,
    getReadyState       as testGetReadyState,
    getTargetControl    as testGetTargetControl,
    getTargetDataset    as testGetTargetDataset,
    getTrigger          as testGetTrigger,
    isSidebarExpanded   as testIsSidebarExpanded,
    onGenerate          as testOnGenerate,
    onNavigate          as testOnNavigate,
    renderApp           as testRenderApp,
    renderErrorPage     as testRenderErrorPage,
    toggleAccordion     as testToggleAccordion,
    toggleExpand        as testToggleExpand,
    toggleVisibility    as testToggleVisibility,
};

// -- Public Functions ---------------------------------------------------------

/**
 * Attaches an application level click delegate to the document body.
 *
 * TODO private
 *
 * @param {Sections} sections
 * @param {Triggers} triggers
 * @param {(any) => void} onError
 */
export function attachEventDelegates(sections, triggers, onError) {
    let { body, knobs } = sections;

    body.addEventListener('click', (e) => {
        /** @type {{ action?: Action }} */
        let { action } = getTargetDataset(e.target);

        if (!action) {
            return;
        }

        // TODO handle cmd click on links
        e.preventDefault();

        try {
            let trigger = getTrigger(triggers, action);

            trigger(e);
        } catch (error) {
            onError(error);
            renderErrorPage(sections);
        }
    });

    // TODO tests
    body.addEventListener('blur', (e) => {
        let control = getTargetControl(e.target);

        if (!control) {
            return;
        }

        try {
            validateOnBlur(knobs, control);
        } catch (error) {
            onError(error);
            renderErrorPage(sections);
        }
    }, true);
}

/**
 * Initializes the application controller, injecting dependencies and creating
 * a state object bound to a closure.
 *
 * @param {Omit<Controller, 'state'>} dependencies
 *
 * @returns {{
 *     render: (path) => void;
 * }}
 */
export function initController(dependencies) {
    let state;

    let controller = {
        ...dependencies,
        state: {
            get: () => state,
            set: (newState) => state = newState,
        },
    };

    let { sections, onError, getPathname } = controller;

    let triggers = getTriggers(controller);
    let { generator } = getActiveRoute(getPathname()); // TODO check for generator

    attachEventDelegates(sections, triggers, onError);

    sections.nav.innerHTML = getNav(generator);

    return {
        render: getRender(controller),
    };
}

/**
 * Returns the app's render function.
 *
 * TODO @private
 *
 * @param {Controller} controller
 *
 * @returns {(path: string) => void}
 */
export const getRender = (controller) => (path) => {
    let { sections, onError } = controller;

    try {
        renderApp(controller, path);
    } catch (error) {
        onError(error);
        renderErrorPage(sections);
    }
};

/**
 * Returns an object of action triggers.
 *
 * TODO @private
 *
 * @param {Controller} controller
 *
 * @returns {Triggers}
 */
export function getTriggers(controller) {
    let { sections: { body } } = controller;

    return {
        accordion: (e) => toggleAccordion(body, e),
        expand   : ( ) => toggleExpand(controller),
        generate : ( ) => onGenerate(controller),
        navigate : (e) => onNavigate(controller, e),
        save     : ( ) => {}, // onSave(controller), // Disabled
        toggle   : (e) => toggleVisibility(body, e),
    };
}
