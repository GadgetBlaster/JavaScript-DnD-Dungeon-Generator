
import manifest from './manifest.js'

const urlParams = new URLSearchParams(window.location.search);
const isVerbose = urlParams.get('mode') === 'verbose';

const dotsContainer    = document.getElementById('dots');
const outputContainer  = document.getElementById('output');
const summaryContainer = document.getElementById('summary');
const statusContainer  = document.getElementById('status');

const htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;'
};

const escape = (string) => string.replace(/[&<>"'\/]/g, (match) => htmlEscapes[match]);

const dot  = (isOk) => `<span class="dot-${isOk ? 'ok' : 'fail'}"></span>`;
const info = (msg)  => `<li>${escape(msg)}</li>`;
const fail = (msg)  => `<li class="fail">${escape(msg)}</li>`;

/**
 * Failures
 *
 * @type {number}
 */
let failures = 0;

/**
 * Assertions
 *
 * @type {number}
 */
let assertions = 0;

/**
 * Path
 *
 * @type {string|undefined}
 */
let path;

/**
 * Count unit
 *
 * @param {Object} options
 *     @param {boolean} options.isOk
 */
const countUnit = ({ isOk }) => {
    assertions++;

    if (!isOk) {
        failures++;
    }
};

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
 * Render summary
 *
 * @param {number} assertions
 * @param {number} failures
 */
const renderSummary = (assertions, failures) => {
    let total = `${assertions} Assertion${assertions === 1 ? '' : 's'}`;
    let fails = getFailureSummary(failures);

    summaryContainer.innerHTML = `${total}, ${fails}`;
};

/**
 * Render error
 *
 * @param {Object} options
 *     @param {string} options.msg
 */
const printError = ({ msg }) => {
    outputContainer.innerHTML += fail(msg);
};

/**
 * Print output
 *
 * @param {Object} options
 *     @param {string} options.msg
 *     @param {boolean} options.isOk
 */
const printUnit = ({ msg, isOk }) => {
    dotsContainer.innerHTML += dot(isOk);

    if (isVerbose || !isOk) {
        outputContainer.innerHTML += isOk ? info(msg) : fail(`${msg} \nIn ${path}`);
    }
};

/**
 * Print
 *
 * @param {Object} options
 *     @param {string} options.msg
 *     @param {boolean} options.isOk
 */
export const unit = ({ msg, isOk }) => {
    countUnit({ isOk });
    printUnit({ msg, isOk });
};

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

    path = manifest[index];

    if (!path) {
        renderStatus('Complete');
        renderSummary(assertions, failures);
        return;
    }

    try {
        await import(path)
    } catch(error) {
        printError({ msg: error.toString() });
    }

    run(index + 1);
})();
