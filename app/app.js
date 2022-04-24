// @ts-check

import { getSummaryLink } from './unit/output.js';
import { unitState } from './unit/state.js';
import run from './unit/run.js';
import suite from './unit/suite.js';

import {
    attachClickDelegate,
    getActiveGenerator,
    getTriggers,
    routes,
} from './controller/controller.js';

import { getKnobPanel } from './ui/form.js';
import { getNav, setActiveNavItem } from './ui/nav.js';

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

const initialPath = window.location.pathname;

const homeContent   = sections.content.innerHTML;
const footerContent = sections.footer.innerHTML;

// -- Initialization -----------------------------------------------------------

const triggers        = getTriggers(sections, homeContent, updatePath);
const activeGenerator = getActiveGenerator(initialPath);
const testSummary     = getSummaryLink(run(unitState(), suite));

attachClickDelegate(sections.body, triggers);

// -- Router -------------------------------------------------------------------

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
    event.state.path && triggers.render(routes[event.state.path]);
});

// -- Initial Render -----------------------------------------------------------

// TODO move to render content function

if (activeGenerator === 404) {
    sections.content.innerHTML = '404';
} else {

    sections.nav.innerHTML    = getNav(activeGenerator);
    sections.knobs.innerHTML  = getKnobPanel(activeGenerator);
    sections.footer.innerHTML = testSummary + footerContent;

    setActiveNavItem(sections.nav, activeGenerator);
}
