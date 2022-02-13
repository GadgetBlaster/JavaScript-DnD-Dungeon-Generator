// @ts-check

import { getSummaryLink } from './unit/output.js';
import { unitState } from './unit/state.js';
import run from './unit/run.js';
import suite from './unit/suite.js';

import { attachClickDelegate, getTriggers } from './controller/controller.js';

import { getKnobPanel } from './ui/form.js';
import { getNav } from './ui/nav.js';

// -- Types --------------------------------------------------------------------

/** @typedef {import('./controller/controller.js').Sections} Sections */

// -- Config -------------------------------------------------------------------

/** @type {Sections} sections */
const sections = {
    body   : document.body,
    content: document.getElementById('content'),
    footer : document.getElementById('footer'),
    knobs  : document.getElementById('knobs'),
    nav    : document.getElementById('nav'),
};

const homeContent   = sections.content.innerHTML;
const footerContent = sections.footer.innerHTML;

// -- Initialization -----------------------------------------------------------

const testSummary = getSummaryLink(run(unitState(), suite));

sections.nav.innerHTML    = getNav();
sections.knobs.innerHTML  = getKnobPanel();
sections.footer.innerHTML = testSummary + footerContent;

attachClickDelegate(sections.body, getTriggers(sections, homeContent));
