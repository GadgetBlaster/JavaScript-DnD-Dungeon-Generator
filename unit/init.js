
import { dot, info, fail, summary, log } from './output.js'
import manifest from './manifest.js'
import unit from './unit.js'

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
 * Render status
 *
 * @param {string} text
 */
const renderStatus = (text) => {
    statusContainer.innerHTML = `Status: ${text}`;
};

/**
 * Print dot
 *
 * @param {Object} options
 *     @param {boolean} options.isOk
 */
const printDot = ({ isOk }) => {
    dotsContainer.innerHTML += dot({ isOk });
};

/**
 * Render summary
 *
 * @param {string} text
 */
const renderSummary = (text) => {
    summaryContainer.innerHTML = text;
};

/**
 * Print error
 *
 * @param {string} msg
 */
const printError = (msg) => {
    errorContainer.innerHTML += fail(msg);
};

/**
 * Render log
 *
 * @param {string} text
 */
const renderLog = (text) => {
    logContainer.innerHTML = text;
};

/**
 * On complete
 *
 * @param {Summary}
 * @param {Object} options
 *     @param {boolean} options.verbose
 */
const onComplete = ({ assertions, failures, results }, { verbose }) => {
    renderSummary(summary(assertions, failures));
    renderLog(log(results, { verbose }));
};

/**
 * @type {Unit}
 */
const { getSummary, runTests } = unit({ onAssert: printDot });

/**
 * Run
 *
 * @param {number} [index]
 */
(async function run(index = 0) {
    if (!manifest.length) {
        renderStatus('Empty test manifest');
        return;
    }

    renderStatus('Running');

    /** {string} path */
    let path = manifest[index];

    if (!path) {
        renderStatus('Complete');
        onComplete(getSummary(), { verbose });
        return;
    }

    try {
        /** {Function} tests */
        let { default: tests } = await import(path);
        runTests(path, tests);
    } catch ({ stack }) {
        console.error(stack);
        printError({ msg: stack.toString() });
    }

    run(index + 1);
})();
