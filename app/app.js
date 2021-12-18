// TODO break out into modules and add tests

import { getSummaryLink } from './unit/output.js';
import { unitState } from './unit/state.js';
import run from './unit/run.js';
import suite from './unit/suite.js';

import {
    attachClickDelegate,
    getTriggers,
} from './ui/action.js';

import { getNav } from './ui/nav.js';
import { updateKnobs } from './ui/form.js';

// -- Types --------------------------------------------------------------------

/** @typedef {import('./ui/action.js').Sections} Sections */

// -- Config -------------------------------------------------------------------

/** @type {Sections} */
const sections = {
    body   : document.body,
    content: document.getElementById('content'),
    footer : document.getElementById('footer'),
    knobs  : document.getElementById('knobs'),
    nav    : document.getElementById('nav'),
};

const testSummary = getSummaryLink(run(unitState(), suite), { asLink: true });
sections.footer.insertAdjacentHTML('afterbegin', testSummary);

// const homeContent = sections.content.innerHTML;

// const navigateHome = () => {
//     sections.content.innerHTML = homeContent;
// };

// -- Initialization -----------------------------------------------------------

sections.nav.innerHTML = getNav();

attachClickDelegate(sections.body, getTriggers(sections));

updateKnobs(sections.knobs);
