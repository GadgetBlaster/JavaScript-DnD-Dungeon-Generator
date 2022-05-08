// @ts-check

import { getSummaryLink } from './unit/output.js';
import { unitState } from './unit/state.js';
import run from './unit/run.js';
import suite from './unit/suite.js';

import {
    attachClickDelegate,
    getActiveGenerator,
    getRender,
    getTriggers,
    routes,
} from './controller/controller.js';

import { getFooter } from './ui/footer.js';
import { getNav } from './ui/nav.js';

// -- Type Imports -------------------------------------------------------------

/** @typedef {import('./controller/controller.js').Path} Path */
/** @typedef {import('./controller/controller.js').Sections} Sections */

// -- Types --------------------------------------------------------------------

/**
 * @typedef {object} HistoryEntryState
 *
 * @prop {Path} path
 */

// -- Config -------------------------------------------------------------------

/** @type {Sections} sections */
const sections = {
    body   : document.body,
    content: document.getElementById('content'),
    footer : document.getElementById('footer'),
    knobs  : document.getElementById('knobs'),
    nav    : document.getElementById('nav'),
};

// -- Initialization -----------------------------------------------------------

const triggers        = getTriggers(sections, updatePath, getPathname);
const activeGenerator = getActiveGenerator(getPathname());
const testSummary     = getSummaryLink(run(unitState(), suite));
const render          = getRender(sections);

attachClickDelegate(sections, triggers, console.error);

// -- Router -------------------------------------------------------------------

/**
 * Returns the current route
 *
 * @returns {string}
 */
function getPathname() {
    return window.location.pathname;
}

/**
 * Updates the app's URL path.
 *
 * @param {Path} path
 */
function updatePath(path) {
    /** @type {HistoryEntryState} */
    let entry = { path };

    window.history.pushState(entry, '', path);
}

window.addEventListener('popstate', (event) => {
    event.state && event.state.path && render(routes[event.state.path]);
});

// -- Initial Render -----------------------------------------------------------

sections.nav.innerHTML    = getNav(activeGenerator);
sections.footer.innerHTML = getFooter(testSummary);

render(activeGenerator || 404);
