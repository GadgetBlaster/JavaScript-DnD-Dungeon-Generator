// @ts-check

import { capitalizeWords, pluralize } from '../utility/tools.js';
import { div } from '../ui/block.js';
import { element } from '../utility/element.js';
import { link } from '../ui/link.js';
import { list } from '../ui/list.js';
import { paragraph, span, title } from '../ui/typography.js';

import run from './run.js';

// -- Types Imports ------------------------------------------------------------

/** @typedef {import('../utility/element').Attributes} Attributes */
/** @typedef {import('./assert.js').Result} Result */
/** @typedef {import('./state.js').CurrentScope} CurrentScope */
/** @typedef {import('./state.js').Entry} Entry */
/** @typedef {import('./state.js').State} State */
/** @typedef {import('./state.js').Summary} Summary */

// -- Types --------------------------------------------------------------------

/**
 * @typedef {object} OutputOptions
 *
 * @prop {function} [onError]
 * @prop {function} [onSuccess]
 * @prop {string} [scope]
 * @prop {boolean} [verbose]
 */

// -- Config -------------------------------------------------------------------

/**
 * HTML escape character lookup.
 */
const htmlEscapes = {
    '"': '&quot;',
    '/': '&#x2F;',
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#x27;',
};

/**
 * URL to the unit test interface.
 *
 * @type {string}
 */
const unitUrl = '/unit.html';

// -- Private Functions --------------------------------------------------------

/**
 * Returns escaped HTML for output as text content.
 *
 * @private
 *
 * @param {string} string
 *
 * @returns {string}
 */
function escapeHTML(string) {
    return string.replace(/[&<>"'\/]/g, (match) => htmlEscapes[match]);
}

/**
 * Returns a summary of unit tests errors.
 *
 * @private
 *
 * @param {Summary} summary
 *
 * @returns {string[] | undefined}
 */
function getFailureSummary({ errors, failures, results }) {
    if (!failures && !errors) {
        return;
    }

    let messages = [];

    if (failures) {
        messages.push(`Encountered ${failures} ${pluralize(failures, 'ogre')}!`);
    }

    if (errors) {
        messages.push(`Encountered ${errors} ${pluralize(errors, 'dragon')}!`);
    }

    let log = results.filter(({ isOk }) => !isOk).map(({ msg }) => msg);

    if (log) {
        messages.push(...log);
    }

    return messages;
}

/**
 * Returns the result log as an HTML list element string.
 *
 * @private
 *
 * @param {Result[]} results
 * @param {object} options
 *     @param {boolean} [options.verbose]
 *
 * @returns {string}
 */
function getLog(results, { verbose } = {}) {
    let items = results.map(({ isOk, msg }) => {
        if (!verbose && isOk) {
            return;
        }

        return element('li', escapeHTML(msg), {
            'data-unit-test': isOk ? 'ok' : 'fail',
        });
    }).filter(Boolean).join('');

    if (!items) {
        return '';
    }

    return element('ul', items, { 'data-list-style': 'none' });
}

/**
 * Returns test results as an HTML string.
 *
 * @private
 *
 * @param {Summary} summary
 * @param {OutputOptions} [options]
 */
function getResults(summary, options = {}) {
    let {
        errors,
        failures,
        results,
    } = summary;

    let {
        onError,
        onSuccess,
        scope,
        verbose,
    } = options;

    if (failures || errors) {
        getFailureSummary(summary)?.forEach((error) => onError?.(error));
    }

    if (onSuccess && !failures && !errors) {
        onSuccess('Zero mischievous kobolds found 👏');
    }

    let dots = results.map(({ isOk }) => {
        return span('', {
            'data-dot': isOk ? 'ok' : 'fail',
        });
    }).join('');

    return title(scope || 'All Tests')
        + paragraph(getSummary(summary))
        + div(dots, { 'data-flex': 'justify-center wrap' })
        + getLog(results, { verbose });
}

/**
 * Returns an array of HTML anchor element strings for each unit test scope.
 *
 * @private
 *
 * @param {string[]} scopes
 * @param {object} options
 *     @param {boolean} [options.verbose]
 *
 * @returns {string[]}
 */
function getSuiteList(scopes, { verbose } = {}) {
    return scopes.map((scope) => {
        return link(scope, makeParams({ scope, verbose }));
    });
}

/**
 * Returns the unit test summary as an HTML string.
 *
 * @private
 *
 * @param {Summary} summary
 *
 * @returns {string}
 */
function getSummary(summary) {
    let {
        assertionsText,
        checkedForText,
        issuesText,
    } = getSummaryParts(summary);

    let content = `${checkedForText} ${assertionsText}. `;

    if (issuesText) {
        return content + span(`${issuesText} 😕`, { class: 'fail' });
    }

    return content + span('0 Encounters, nice job 👏', { class: 'ok' });
}

/**
 * Returns an object summarizing unit test results.
 *
 * @private
 *
 * @param {Summary} summary
 *
 * @returns {{
 *     assertionsText: string;
 *     checkedForText: string;
 *     issuesText?: string;
 * }}
 */
function getSummaryParts(summary) {
    let { assertions, errors, failures } = summary;

    let checkedForText = `Checked for ${assertions}`;
    let assertionsText = `mischievous ${pluralize(assertions, 'kobold')}`;

    if (failures || errors) {
        let failureText = ` ${failures} ${pluralize(failures, 'ogre')}`;
        let errorText   = ` ${errors} ${pluralize(errors, 'dragon')}`;

        let issuesText = 'Encountered';
        issuesText += failures ? failureText : '';
        issuesText += failures && errors ? ' and' : '';
        issuesText += errors ? errorText : '';
        issuesText += errors ? '!' : '';

        return {
            assertionsText,
            checkedForText,
            issuesText,
        };
    }

    return {
        assertionsText,
        checkedForText,
    };
}

/**
 * Returns a list of unit tests as an HTML string.
 *
 * @private
 *
 * @param {object} suite
 * @param {object} options
 *     @param {boolean} [options.verbose]
 *
 * @returns {string}
 */
function getTestList(suite, { verbose } = {}) {
    return title('Spell book')
        + list(getSuiteList(Object.keys(suite), { verbose }));
}

/**
 * Constructs URL params for the unit test navigation.
 *
 * @private
 *
 * @param {object} entries
 *
 * @returns {string}
 */
function makeParams(entries) {
    let params = Object.entries(entries)
        .filter(([ , value ]) => Boolean(value))
        .map(([ key, value ]) => `${key}=${value}`)
        .join('&');

    return params && `?${params}`;
}

export {
    escapeHTML        as testEscapeHTML,
    getFailureSummary as testGetFailureSummary,
    getLog            as testGetLog,
    getResults        as testGetResults,
    getSuiteList      as testGetSuiteList,
    getSummary        as testGetSummary,
    getSummaryParts   as testGetSummaryParts,
    getTestList       as testGetTestList,
};

// -- Public Functions ---------------------------------------------------------

/**
 * Returns unit test output as an HTML string.
 *
 * @param {State} state
 * @param {object} suite
 * @param {OutputOptions} [options]
 *
 * @returns {string}
 */
export function getOutput(state, suite, options = {}) {
    let { scope = '' } = options;

    if (scope === 'list') {
        return getTestList(suite, options);
    }

    let testScope = Object.keys(suite).includes(scope) ? scope : undefined;
    let summary   = run(state, suite, testScope);

    return summary ? getResults(summary, options) : 'Error: Failed to run tests';
}

/**
 * Returns an assertion result's message string.
 *
 * @param {CurrentScope[]} entries
 *
 * @returns {string}
 */
export const getResultMessage = (entries) => entries.reduce((accumulator, value, index) => {
    return `${accumulator}${'  '.repeat(index)}${value.msg}\n`;
}, '').trim();

/**
 * Returns the unit test interface's navigation as an HTML string.
 *
 * @param {{
 *     scope?: string;
 *     verbose?: boolean;
 * }} options
 *
 * @returns {string}
 */
export const getTestNav = ({ scope, verbose } = {}) => [
    link('All', unitUrl + makeParams({ scope: null, verbose }), !scope ? { 'data-active': true } : undefined),
    link('Tests', unitUrl + makeParams({ scope: 'list', verbose }), scope === 'list' ? { 'data-active': true } : undefined),
    element('span', '', { role: 'presentation', 'data-separator': true }),
    link('Verbose', unitUrl + makeParams({ scope, verbose: !verbose }), verbose ? { 'data-active': verbose } : undefined),
].join('');

/**
 * Returns a test summary as an HTML message.
 *
 * @param {boolean} skip
 * @param {(error: string) => void} onError
 * @param {State} state
 * @param {object} suite
 *
 * @returns {string}
 */
export function getTestSummary(skip, onError, state, suite) {
    if (skip) {
        return 'Tests disabled';
    }

    let summary = run(state, suite);

    if (!summary) {
        return 'Tests failed to run...';
    }

    let errors = getFailureSummary(summary);

    if (errors) {
        errors.forEach((error) => onError(error));
    }

    let {
        assertionsText,
        checkedForText,
        issuesText,
    } = getSummaryParts(summary);

    if (issuesText) {
        return `${checkedForText} ${assertionsText}... ${link(issuesText, unitUrl, { 'data-error': true })}!`;
    }

    return `${checkedForText} ${link(capitalizeWords(assertionsText), unitUrl)}`;
}
