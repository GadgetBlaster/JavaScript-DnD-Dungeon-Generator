
import manifest from './manifest.js'
import unit from './unit.js'

import {
    dot,
    fail,
    log,
    print,
    render,
    summary,
} from './output.js'

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
 * Run
 *
 * @param {number} [index=0]
 */
(async function run(index = 0) {
    if (!manifest.length) {
        render(statusContainer, 'Status: Empty test manifest');
        return;
    }

    render(statusContainer, 'Status: Running...');

    /** {string} path */
    let path = manifest[index];

    if (!path) {
        let { assertions, failures, results } = getSummary();

        render(statusContainer, 'Status: Complete');
        render(summaryContainer, summary(assertions, failures));
        render(logContainer, log(results, { verbose }));
        return;
    }

    try {
        /** {Function} units */
        let { default: units } = await import(path);
        runUnits(path, units);
    } catch ({ stack }) {
        console.error(stack);
        print(errorContainer, fail(stack.toString()));
    }

    run(index + 1);
})();
