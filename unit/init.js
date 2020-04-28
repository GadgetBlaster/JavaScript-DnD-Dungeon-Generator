
import run from './run.js';
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

const { getSummary, runUnits, onError } = unit({
    onAssert: (result) => print(dotsContainer, dot(result)),
});

/**
 * On complete
 *
 * @type {Function}
 */
const onComplete = () => {
    let {
        assertions,
        errors,
        failures,
        results,
    } = getSummary();

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
        render(statusContainer, 'Scope');
        render(logContainer, scopeList(list, { verbose }));
        return;
    }

    render(statusContainer, 'Status: Running...');

    if (list.includes(scope)) {
        render(infoContainer, `Scope: ${scope}`);
        run({ suite, onComplete, onError, runUnits, scope });
        return;
    }

    render(infoContainer, 'Scope: All the things');
    run({ suite, onComplete, onError, runUnits });
})();
