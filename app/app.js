// @ts-check

import { getErrorMessage } from './utility/tools.js';
import { getFailureSummary, getSummaryLink } from './unit/output.js';
import { request } from './utility/xhr.js';
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

// -- Functions ----------------------------------------------------------------

/**
 * Logs an error.
 *
 * @param {string} error
 */
function logError(error) {
    console.error(error);

    request('/api/log/error', {
        callback: (response) => response.error && console.error(response),
        data    : { error: getErrorMessage(error) },
        method  : 'POST',
    });
}


// -- Config -------------------------------------------------------------------

/** @type {Sections} sections */
const sections = {
    body   : document.body,
    content: document.getElementById('content'),
    footer : document.getElementById('footer'),
    knobs  : document.getElementById('knobs'),
    nav    : document.getElementById('nav'),
};

// -- Tests --------------------------------------------------------------------

const testSummary     = run(unitState(), suite);
const testSummaryLink = getSummaryLink(testSummary);
const errorSummary    = getFailureSummary(testSummary);

if (errorSummary) {
    console.error(...errorSummary);
}

// -- Initialization -----------------------------------------------------------

const triggers        = getTriggers(sections, updatePath, getPathname);
const activeGenerator = getActiveGenerator(getPathname());
const render          = getRender(sections, logError);

attachClickDelegate(sections, triggers, logError);

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
sections.footer.innerHTML = getFooter(testSummaryLink);

render(activeGenerator);
