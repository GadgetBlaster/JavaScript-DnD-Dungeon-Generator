
import runSuite from './run.js';
import suite from './suite.js';
import unit from './unit.js';

import {
    dot,
    log,
    nav,
    print,
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

/** @type {Function} onAssert */
const onAssert = (result) => print(dotsContainer, dot(result));

/**
 * On complete
 *
 * @param {Summary}
 */
const onComplete = ({ assertions, errors, failures, results }) => {
    render(statusContainer, 'Status: Complete');
    render(summaryContainer, summary(assertions, failures, errors.length));
    render(logContainer, log([ ...errors, ...results], { verbose }));
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

    render(statusContainer, 'Status: Running...');
    render(infoContainer, testScope ? `Tests: ${scope}` : 'Tests: All');

    onComplete(runSuite(unit({ onAssert }), suite, testScope));
})();
