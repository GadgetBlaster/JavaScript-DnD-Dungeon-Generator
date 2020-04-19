
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
 * Get failure summary
 *
 * @param {number} failures
 *
 * @returns {string}
 */
const getFailureSummary = (failures) => {
    switch (failures) {
        case 0:  return '<span class="ok">0 Failures, nice job 👏</span>';
        case 1:  return '<span class="fail">1 Failure</span>';
        default: return `<span class="fail">${failures} Failures</span>`;
    }
};

/**
 * Print error
 *
 * @param {Object} options
 *     @param {string} options.msg
 */
const printError = ({ msg }) => {
    errorContainer.innerHTML += fail(msg);
};

/**
 * On complete
 *
 * @param {Summary} summary
 */
const onComplete = ({ assertions, failures, summary }) => {
    let total = `${assertions} Assertion${assertions === 1 ? '' : 's'}`;
    let fails = getFailureSummary(failures);

    summaryContainer.innerHTML = `${total}, ${fails}`;

    logContainer.innerHTML = summary.map(({ isOk, msg }) => {
        if (verbose && isOk) {
            return info(msg);
        }

        return !isOk && fail(msg);
    }).filter(Boolean).join('');
};

/**
 * On assert
 *
 * @param {Object} options
 *     @param {boolean} options.isOk
 */
const onAssert = ({ isOk }) => {
    dotsContainer.innerHTML += dot({ isOk });
};

/**
 * @type {Unit}
 */
const {
    getSummary,
    runTests,
} = unit({ onAssert });

/**
 * Run
 *
 * @param {number} [index]
 */
(async function run(index = 0) {
    if (!manifest.length) {
        renderStatus('Empty manifest');
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
