
import run from './run.js';
import { plural } from '../utility/tools.js';
import { element } from '../utility/html.js';

import {
    log,
    nav, // TODO move here
    scopeList,
    getSummary,
} from './output.js';

/** @typedef {import('./state.js').Summary} Summary */
/** @typedef {import('./assert.js').Result} Result */

// -- Config -------------------------------------------------------------------

/**
 * Animation delay in milliseconds
 *
 * @type {number}
 */
const animationDelay = 5;

// -- Private Functions --------------------------------------------------------

/**
 *
 */
export function _renderTestList(elements, suite, { verbose }) {
    let {
        headerContainer,
        listContainer,
    } = elements;

    headerContainer.innerHTML = 'Tests';
    listContainer.innerHTML = scopeList(Object.keys(suite), { verbose });
}

/**
 *
 */
export async function _renderResults(elements, summary, { verbose }) {
    let {
        dotsContainer,
        logContainer,
    } = elements;

    let { failures, errors } = summary;

    if (failures) {
        console.error(`Encountered ${failures} ${plural(failures, 'ogre')}!`);
    }

    if (errors.length) {
        console.error(`Encountered ${errors.length} ${plural(errors.length, 'dragon')}!`);
    }

    if (!failures && !errors.length) {
        console.log('Zero mischievous kobolds found 👏');
    }

    let dots = summary.results.map(({ isOk  }, i) => {
        return element('span', '', {
            class: `dot dot-${isOk ? 'ok' : 'fail'} delay`,
            style: `animation-delay: ${i * animationDelay}ms`,
        });
    }).join('');

    dotsContainer.innerHTML = dots + getSummary(summary, { delay: summary.results.length * animationDelay });
    logContainer.innerHTML  = log(summary.results, { verbose });
}

// -- Public Functions ---------------------------------------------------------

/**
 * Renders the unit tests interface.
 *
 * @param {object} elements
 * @param {object} suite
 * @param {import(./state.js).State} state
 * @param {object} [options]
 *   @param {string} [options.scope]
 *   @param {boolean} [options.verbose]
 */
export const render = async (elements, suite, state, { scope, verbose } = {}) => {
    let {
        headerContainer,
        infoContainer,
        navContainer,
    } = elements;

    navContainer.innerHTML = nav({ scope, verbose });

    if (scope === 'list') {
        _renderTestList(elements, suite, { verbose });
        return;
    }

    let list = Object.keys(suite);
    let testScope = list.includes(scope) ? scope : undefined;

    headerContainer.innerHTML = 'Mumbling incantations';
    infoContainer.innerHTML = `${testScope ? scope : 'All Tests'}`;

    /** @type {Summary} summary */
    let summary = run(state, suite, testScope);

    _renderResults(elements, summary, { verbose });
};
