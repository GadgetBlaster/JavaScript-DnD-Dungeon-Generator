// @ts-check

import { attachClickDelegate, getTriggers } from './controller/controller.js';
import { getNav } from './ui/nav.js';
import { getSummaryLink } from './unit/output.js';
import { unitState } from './unit/state.js';
import run from './unit/run.js';
import suite from './unit/suite.js';

// -- Type Imports -------------------------------------------------------------

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
const triggers = getTriggers(sections, homeContent);

sections.nav.innerHTML    = getNav('dungeon');
sections.footer.innerHTML = testSummary + footerContent;

triggers.navigate({ target: 'dungeon' });

attachClickDelegate(sections.body, triggers);
