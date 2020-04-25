
import manifest from './manifest.js';
import run from './run.js';
import unit from './unit.js';

import {
    dot,
    fail,
    log,
    nav,
    pathList,
    print,
    render,
    summary,
} from './output.js';

/**
 * URL params
 *
 * @type {URLSearchParams}
 */
const urlParams = new URLSearchParams(window.location.search);

/**
 * Action
 *
 * @type {string}
 */
const action = urlParams.get('action');

/**
 * Verbose
 *
 * @type {boolean}
 */
const verbose = Boolean(urlParams.get('verbose'));

const dotsContainer    = document.getElementById('dots');
const errorContainer   = document.getElementById('errors');
const infoContainer    = document.getElementById('info');
const logContainer     = document.getElementById('log');
const navContainer     = document.getElementById('nav');
const statusContainer  = document.getElementById('status');
const summaryContainer = document.getElementById('summary');

/**
 * @type {Unit}
 */
const { getSummary, runUnits } = unit({
    onAssert: (result) => print(dotsContainer, dot(result)),
});

/**
 * On complete
 */
const onComplete = () => {
    let { assertions, failures, results } = getSummary();

    render(statusContainer, 'Status: Complete');
    render(summaryContainer, summary(assertions, failures));
    render(logContainer, log(results, { verbose }));
};

/**
 * On error
 *
 * @param {string} error
 */
const onError = (error) => {
    print(errorContainer, fail(error));
};

render(navContainer, nav({
    action,
    verbose,
}));

(() => {
    if (action === 'list') {
        render(logContainer, pathList(manifest));
        return;
    }

    render(statusContainer, 'Status: Running...');

    if (manifest.includes(action)) {
        render(infoContainer, `Scope: ${action}`);
        run({ manifest: [ action ], onComplete, onError, runUnits });
        return;
    }

    render(infoContainer, 'Scope: All Tests');
    run({ manifest, onComplete, onError, runUnits });
})();
