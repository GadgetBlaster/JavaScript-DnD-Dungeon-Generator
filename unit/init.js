
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
 * On complete
 *
 * @param {Summary}
 * @param {Object} options
 *     @param {boolean} options.verbose
 */
const onComplete = ({ assertions, failures, results }, { verbose }) => {
    render(summaryContainer, summary(assertions, failures));
    render(logContainer, log(results, { verbose }));
};

/**
 * @type {Unit}
 */
const { getSummary, runTests } = unit({
    onAssert: (result) => print(dotsContainer, dot(result)),
});

/**
 * Run
 *
 * @param {number} [index]
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
        render(statusContainer, 'Status: Complete');
        onComplete(getSummary(), { verbose });
        return;
    }

    try {
        /** {Function} tests */
        let { default: tests } = await import(path);
        runTests(path, tests);
    } catch ({ stack }) {
        console.error(stack);
        print(errorContainer, fail(stack.toString()));
    }

    run(index + 1);
})();
