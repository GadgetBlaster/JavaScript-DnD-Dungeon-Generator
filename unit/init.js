
import { dot, info, fail } from './output.js'
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
 * @param {string} status
 */
const renderStatus = (status) => {
    statusContainer.innerHTML = `Status: ${status}`;
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
 * @param {number} assertions
 * @param {number} failures
 */
const renderSummary = (assertions, failures) => {
    let total = `${assertions} Assertion${assertions === 1 ? '' : 's'}`;
    let fails = ((count) => {
        switch (count) {
            case 0:  return '<span class="ok">0 Failures, nice job 👏</span>';
            case 1:  return '<span class="fail">1 Failure</span>';
            default: return `<span class="fail">${count} Failures</span>`;
        }
    })(failures);

    summaryContainer.innerHTML = `${total}, ${fails}`;
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
 * Render summary log
 *
 * @param {string[]} summary
 */
const renderSummaryLog = (summary) => {
    logContainer.innerHTML = summary.map(({ isOk, msg }) => {
        if (verbose && isOk) {
            return info(msg);
        }

        return !isOk && fail(msg);
    }).filter(Boolean).join('');
};

/**
 * On complete
 *
 * @param {Summary}
 */
const onComplete = ({ assertions, failures, summary }) => {
    renderSummary(assertions, failures)
    renderSummaryLog(summary);
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
        onComplete(getSummary());
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
