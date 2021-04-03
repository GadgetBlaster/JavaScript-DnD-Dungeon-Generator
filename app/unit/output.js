
import { element } from '../utility/html.js';
import { link } from '../ui/link.js';
import { plural } from '../utility/tools.js';
import run from './run.js';

/** @typedef {import('../utility/html.js').Attrs} Attrs */
/** @typedef {import('./assert.js').Result} Result */
/** @typedef {import('./state.js').State} State */
/** @typedef {import('./state.js').Summary} Summary */

/**
 * @typedef {object} OutputOptions
 *
 * @property {string} [scope]
 * @property {boolean} [verbose]
 */

// -- Config -------------------------------------------------------------------

/**
 * Animation delay in milliseconds.
 *
 * @type {number}
 */
 const animationDelay = 2;

/**
 * HTML escapes
 */
const _htmlEscapes = {
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
const unitUrl = './unit.html';

// -- Private Functions --------------------------------------------------------

/**
 * Log entry
 *
 * @param {string} msg
 * @param {Attrs} attrs
 *
 * @returns {string}
 */
const logEntry = (msg, attrs) => element('li', escapeHTML(msg), attrs);

/**
 * Make params
 *
 * @param {object} entries
 *
 * @returns {string}
 */
 const makeParams = (entries) => {
    let params = Object.entries(entries)
        .filter(([ , value ]) => Boolean(value))
        .map(([ key, value ]) => `${key}=${value}`)
        .join('&');

    return params && `?${params}`;
};

// -- Public Functions ---------------------------------------------------------

/**
 * Escape HTML for output as text content.
 *
 * @param {string} string
 *
 * @returns {string}
 */
export function escapeHTML(string) {
    return string.replace(/[&<>"'\/]/g, (match) => _htmlEscapes[match]);
}

/**
 * Get result log
 *
 * @param {Result[]} results
 * @param {object} [options]
 *     @param {boolean} [options.verbose]
 *
 * @returns {string}
 */
 export function getLog(results, { verbose } = {}) {
    return results.map(({ isOk, msg }) => {
        if (verbose && isOk) {
            return logEntry(msg);
        }

        return !isOk && logEntry(msg, { class: 'fail' });
    }).filter(Boolean).join('');
};

/**
 * Get navigation
 *
 * @param {options} options
 *     @param {string} [options.scope]
 *     @param {boolean} [options.verbose]
 *
 * @returns {string}
 */
 export const getNav = ({ scope, verbose }) => [
    link('All', unitUrl + makeParams({ scope: null, verbose }), !scope ? { 'data-active': true } : null),
    link('Tests', unitUrl + makeParams({ scope: 'list', verbose }), scope === 'list' ? { 'data-active': true } : null),
    element('span', '', { role: 'presentation', 'data-separator': true }),
    link('Verbose', unitUrl + makeParams({ scope, verbose: !verbose }), verbose ? { 'data-active': verbose } : null)
].join('');

/**
 * Get unit test output.
 *
 * TODO test
 *
 * @param {object} suite
 * @param {State} state
 * @param {OutputOptions} options
 */
 export const getOutput = (suite, state, options = {}) => {
    let { scope } = options;

    if (scope === 'list') {
        return getTestList(suite, options);
    }

    let list = Object.keys(suite);
    let testScope = list.includes(scope) ? scope : undefined;
    let summary = run(state, suite, testScope);

    return getResults(summary, options);
};

/**
 * Result Msg
 * TODO get
 * @param {Entry[]} entries
 *
 * @returns {string}
 */
 export const getResultMessage = (entries) => entries.reduce((accumulator, value, index) => {
    return `${accumulator}${'  '.repeat(index)}${value.msg}\n`;
}, '').trim();

/**
 * Get test results
 *
 * TODO test
 *
 * @param {Summary} summary
 * @param {OutputOptions} options
 */
 export function getResults(summary, { scope, verbose }) {
    let { failures, errors } = summary;

    if (failures) {
        console.error(`Encountered ${failures} ${plural(failures, 'ogre')}!`);
    }

    if (errors.length) {
        console.error(`Encountered ${errors.length} ${plural(errors.length, 'dragon')}!`);
    }

    if (!failures && !errors.length) {
        console.log('Zero mischievous kobolds found 👏');
    }

    let dots = summary.results.map(({ isOk  }, i) => {
        return element('span', '', {
            'data-animate': 'show',
            class: `dot dot-${isOk ? 'ok' : 'fail'}`,
            style: `animation-delay: ${i * animationDelay}ms`,
        });
    }).join('');

    let delayStyle = `animation-delay: ${summary.results.length * animationDelay}ms`;
    let log = getLog(summary.results, { verbose });

    return `
        <h1>Mumbling incantations</h1>
        <p>${scope || 'All Tests'}</p>
        <div>${dots}</div>
        <p data-animate="show" style="${delayStyle}">${getSummary(summary)}</p>
        <ul data-animate="show" style="${delayStyle}">${log}</ul>
    `;
}

/**
 * Get test suite list
 *
 * @param {string[]} scopes
 * @param {options} [options]
 *     @param {boolean} [options.verbose]
 *
 * @returns {string}
 */
 export function getSuiteList(scopes, { verbose } = {}) {
    return scopes.map((scope) => {
        return element('li', link(scope, makeParams({ scope, verbose })));
    }).join('');
};

/**
 * Get test summary.
 *
 * @param {import('./state.js').Summary} summary
 *
 * @returns {string}
 */
 export function getSummary(summary) {
    let {
        assertionsText,
        checkedForText,
        issuesText,
    } = getSummaryParts(summary);

    let content = `${checkedForText} ${assertionsText}. `;

    if (issuesText) {
        return content + element('span', `${issuesText} 😕`, { class: 'fail' });
    }

    return content + element('span', '0 Encounters, nice job 👏', { class: 'ok' });
}

/**
 * Get test summary link.
 *
 * @param {import('./state.js').Summary} summary
 *
 * @returns {string}
 */
 export function getSummaryLink(summary) {
    let {
        assertionsText,
        checkedForText,
        issuesText,
    } = getSummaryParts(summary);

    if (issuesText) {
        let assertionContent = element('p', `${checkedForText} ${assertionsText}.`);
        let encounterContent = element('p', link(issuesText, unitUrl, {
            'data-error': true,
        }));

        return assertionContent + encounterContent;
    }

    return element('p', `${checkedForText} ${link(assertionsText, unitUrl)}.`);
}

/**
 * Get test summary parts.
 *
 * @param {import('./state.js').Summary} summary
 *
 * @returns {{
 *     assertionsText: string,
 *     checkedForText: string,
 *     issuesText: string?,
 * }}
 */
export const getSummaryParts = (summary = {}) => {
    let { assertions, errors, failures } = summary;

    let checkedForText = `Checked for ${assertions}`;
    let assertionsText = `mischievous ${plural(assertions, 'kobold')}`;

    if (failures || errors.length) {
        let failureText = ` ${failures} ${plural(failures, 'ogre')}`;
        let errorText   = ` ${errors.length} ${plural(errors.length, 'dragon')}`;

        let issuesText = 'Encountered';
        issuesText += failures ? failureText : '';
        issuesText += failures && errors.length ? ' and' : '';
        issuesText += errors.length ? errorText : '';
        issuesText += errors.length ? '!' : '.';

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
};

/**
 * Get unit test list
 *
 * TODO test
 *
 * @param {object} suite
 * @param {OutputOptions} options
 */
export function getTestList(suite, { verbose }) {
    let list = getSuiteList(Object.keys(suite), { verbose });

    return `
        <h1>Spell book</h1>
        <ul>${list}</ul>
    `;
}
