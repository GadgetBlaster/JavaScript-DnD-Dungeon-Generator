
import runSuite from './run.js';
import suite from './suite.js';
import unit from './unit.js';

import {
    dot,
    log,
    nav,
    render,
    scopeList,
    summary,
} from './output.js';

/**
 * URL params
 *
 * @type {URLSearchParams}
 */
const urlParams = new URLSearchParams(window.location.search);

/**
 * Scope
 *
 * @type {string}
 */
const scope = urlParams.get('scope');

/**
 * Verbose
 *
 * @type {boolean}
 */
const verbose = Boolean(urlParams.get('verbose'));

const dotsContainer    = document.getElementById('dots');
const infoContainer    = document.getElementById('info');
const logContainer     = document.getElementById('log');
const navContainer     = document.getElementById('nav');
const statusContainer  = document.getElementById('status');
const summaryContainer = document.getElementById('summary');

/**
 * Delay
 *
 * @param {number} [ms=0]
 *
 * @returns {Promise}
 */
const delay = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Append
 *
 * @param {Result} result
 *
 * @returns {Element}
 */
const drawDot = (result) => dotsContainer.appendChild(dot(result));

/**
 * On complete
 *
 * @param {Summary}
 */
const onComplete = async ({ assertions, errors, failures, results }) => {
    for (let i = 0; i < results.length; i++) {
        await delay();
        drawDot(results[i]);
    }

    render(statusContainer, 'Complete');
    render(summaryContainer, summary(assertions, failures, errors.length));
    render(logContainer, log(results, { verbose }));
};

render(navContainer, nav({
    scope,
    verbose,
}));

(() => {
    const list = Object.keys(suite);

    if (scope === 'list') {
        render(statusContainer, 'Tests');
        render(logContainer, scopeList(list, { verbose }));
        return;
    }

    let testScope = list.includes(scope) ? scope : undefined;

    render(statusContainer, 'Running tests');
    render(infoContainer, `Tests: ${testScope ? scope : 'All'}`);

    onComplete(runSuite(unit(), suite, testScope));
})();
