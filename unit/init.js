
import manifest from './manifest.js';
import run from './run.js';
import unit from './unit.js';

import {
    dot,
    fail,
    log,
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
 * Verbose
 *
 * @type {boolean}
 */
const verbose = urlParams.get('mode') === 'verbose';

const dotsContainer    = document.getElementById('dots');
const errorContainer   = document.getElementById('errors');
const logContainer     = document.getElementById('log');
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

render(statusContainer, 'Status: Running...');
run({ manifest, onComplete, onError, runUnits });
