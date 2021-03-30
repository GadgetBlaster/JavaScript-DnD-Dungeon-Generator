
import run from './run.js';
import { plural } from '../utility/tools.js';
import { element } from '../utility/html.js';

import {
    getLog,
    getSummary,
    nav, // TODO move here
    scopeList,
} from './output.js';

/** @typedef {import('./state.js').Summary} Summary */
/** @typedef {import('./assert.js').Result} Result */
/** @typedef {import('./state.js').State} State */

/**
 * @typedef {object} RenderOptions
 *
 * @property {string} [scope]
 * @property {boolean} [verbose]
 */

// -- Config -------------------------------------------------------------------

/**
 * Animation delay in milliseconds.
 *
 * @type {number}
 */
const animationDelay = 2;

// -- Private Functions --------------------------------------------------------

/**
 * Renders unit test list.
 *
 * @param {Element} contentContainer
 * @param {object} suite
 * @param {RenderOptions} options
 */
export function _renderTestList(contentContainer, suite, { verbose }) {
    let list = scopeList(Object.keys(suite), { verbose });

    contentContainer.innerHTML = `
        <h1>Spell book</h1>
        <ul>${list}</ul>
    `;
}

/**
 * Renders unit test results.
 *
 * @param {Element} contentContainer
 * @param {Summary} summary
 * @param {RenderOptions} options
 */
export async function _renderResults(contentContainer, summary, { scope, verbose }) {
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
            'data-animate': 'show',
            class: `dot dot-${isOk ? 'ok' : 'fail'}`,
            style: `animation-delay: ${i * animationDelay}ms`,
        });
    }).join('');

    let delayStyle = `animation-delay: ${summary.results.length * animationDelay}ms`;
    let log = getLog(summary.results, { verbose });

    contentContainer.innerHTML = `
        <h1>Mumbling incantations</h1>
        <p>${scope || 'All Tests'}</p>
        <div>${dots}</div>
        <p data-animate="show" style="${delayStyle}">${getSummary(summary)}</p>
        <ul data-animate="show" style="${delayStyle}">${log}</ul>
    `;
}

// -- Public Functions ---------------------------------------------------------

/**
 * Renders the unit tests interface.
 *
 * @param {object} elements
 *     @param {Element} elements.contentContainer
 *     @param {Element} elements.navContainer
 * @param {object} suite
 * @param {State} state
 * @param {RenderOptions} options
 */
export const render = (elements, suite, state, options = {}) => {
    let {
        navContainer,
        contentContainer,
    } = elements;

    let { scope } = options;

    navContainer.innerHTML = nav(options);

    if (scope === 'list') {
        _renderTestList(contentContainer, suite, options);
        return;
    }

    let list = Object.keys(suite);
    let testScope = list.includes(scope) ? scope : undefined;
    let summary = run(state, suite, testScope);

    _renderResults(contentContainer, summary, options);
};
