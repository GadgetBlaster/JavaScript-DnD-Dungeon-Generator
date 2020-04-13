
import manifest from './manifest.js'

const urlParams = new URLSearchParams(window.location.search);
const isVerbose = urlParams.get('mode') === 'verbose';

const countContainer   = document.getElementById('count');
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
 * File
 *
 * @type {string}
 */
let file;

/**
 * Set status
 *
 * @param {string} status
 */
const setStatus = (status) => {
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
}

/**
 * Set summary
 *
 * @param {number} assertions
 * @param {number} failures
 */
const setSummary = (assertions, failures) => {
    let total = `${assertions} Assertion${assertions === 1 ? '' : 's'}`;
    let fails = getFailureSummary(failures);

    summaryContainer.innerHTML = `${total}, ${fails}`;
};

/**
 * Render count
 *
 * @param {Object} options
 *     @param {boolean} options.isOk
 */
export const renderDot = ({ isOk }) => {
    countContainer.innerHTML += dot(isOk);
};

/**
 * Render output
 *
 * @param {Object} options
 *     @param {string} options.msg
 *     @param {boolean} options.isOk
 */
export const renderOutput = ({ msg, isOk }) => {
    assertions++;

    if (!isOk) {
        failures++;
    }

    if (isVerbose || !isOk) {
        outputContainer.innerHTML += isOk ? info(msg) : fail(`${msg} \nIn ${file}`);
    }
};

/**
 * Render error
 *
 * @param {Object} options
 *     @param {string} options.msg
 */
export const renderError = ({ msg }) => {
    outputContainer.innerHTML += fail(`Error: ${msg}`);
};

/**
 * Run tests
 *
 * @param {number} index
 */
const runtTests = async (index = 0) => {
    if (!manifest.length) {
        setStatus('Empty manifest');
        return;
    }

    setStatus('Running');

    file = manifest[index];

    if (!file) {
        setStatus('Complete');
        setSummary(assertions, failures);
        return;
    }

    await import(file).catch((err) => {
        renderError({ msg: err });
    });

    runtTests(index + 1);
};

runtTests();
