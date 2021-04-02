
import { element } from '../utility/html.js';
import { link } from '../ui/link.js';
import { plural } from '../utility/tools.js';
import run from './run.js';

/** @typedef {import('./state.js').Summary} Summary */
/** @typedef {import('./assert.js').Result} Result */
/** @typedef {import('./state.js').State} State */

/**
 * @typedef {object} RenderOptions
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
 * Make params
 *
 * @param {object} entries
 *
 * @returns {string}
 */
const _makeParams = (entries) => {
    let params = Object.entries(entries)
        .filter(([ , value ]) => Boolean(value))
        .map(([ key, value ]) => `${key}=${value}`)
        .join('&');

    return params && `?${params}`;
};

/**
 * Renders unit test results.
 *
 * TODO test
 *
 * @param {Element} contentContainer
 * @param {Summary} summary
 * @param {RenderOptions} options
 */
 export async function _renderResults(contentContainer, summary, { scope, verbose }) {
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

    contentContainer.innerHTML = `
        <h1>Mumbling incantations</h1>
        <p>${scope || 'All Tests'}</p>
        <div>${dots}</div>
        <p data-animate="show" style="${delayStyle}">${getSummary(summary)}</p>
        <ul data-animate="show" style="${delayStyle}">${log}</ul>
    `;
}

/**
 * Renders unit test list.
 *
 * TODO test
 *
 * @param {Element} contentContainer
 * @param {object} suite
 * @param {RenderOptions} options
 */
 export function _renderTestList(contentContainer, suite, { verbose }) {
    let list = scopeList(Object.keys(suite), { verbose });

    contentContainer.innerHTML = `
        <h1>Spell book</h1>
        <ul>${list}</ul>
    `;
}

/**
 * Scope list
 *
 * @param {string[]} scopes
 * @param {options} [options]
 *     @param {boolean} [options.verbose]
 *
 * @returns {string}
 */
export const scopeList = (scopes, { verbose } = {}) => {
    return scopes.map((scope) => {
        return element('li', link(scope, _makeParams({ scope, verbose })));
    }).join('');
};

// -- Public Functions ---------------------------------------------------------

/**
 * Escape HTML for output as text content.
 *
 * @param {string} string
 *
 * @returns {string}
 */
export const escapeHTML = (string) => string.replace(/[&<>"'\/]/g, (match) => _htmlEscapes[match]);

/**
 * Fail
 *
 * @param {string} msg
 *
 * @returns {string}
 */
export const fail = (msg) => element('li', escapeHTML(msg), { class: 'fail' });

/**
 * Info
 *
 * @param {string} msg
 *
 * @returns {string}
 */
export const info = (msg) => element('li', escapeHTML(msg));

/**
 * Get result log
 *
 * @param {Result[]} results
 * @param {object} [options]
 *     @param {boolean} [options.verbose]
 *
 * @returns {string}
 */
export const getLog = (results, { verbose } = {}) => {
    return results.map(({ isOk, msg }) => {
        if (verbose && isOk) {
            return info(msg);
        }

        return !isOk && fail(msg);
    }).filter(Boolean).join('');
};

/**
 * Path list
 *
 * @param {options} options
 *     @param {string} [options.scope]
 *     @param {boolean} [options.verbose]
 *
 * @returns {string}
 */
export const nav = ({ scope, verbose }) => [
    link('All', `./unit.html${_makeParams({ scope: null, verbose })}`, !scope ? { 'data-active': true } : null),
    link('Tests', `./unit.html${_makeParams({ scope: 'list', verbose })}`, scope === 'list' ? { 'data-active': true } : null),
    element('span', '', { role: 'presentation', 'data-separator': true }),
    link('Verbose', `./unit.html${_makeParams({ scope, verbose: !verbose })}`, verbose ? { 'data-active': verbose } : null)
].join('');

/**
 * Renders the unit tests interface.
 *
 * TODO test
 *
 * @param {object} elements
 *     @param {Element} elements.contentContainer
 *     @param {Element} elements.navContainer
 * @param {object} suite
 * @param {State} state
 * @param {RenderOptions} options
 */
 export const render = (elements, suite, state, options = {}) => {
    let {
        navContainer,
        contentContainer,
    } = elements;

    let { scope } = options;

    navContainer.innerHTML = nav(options);

    if (scope === 'list') {
        _renderTestList(contentContainer, suite, options);
        return;
    }

    let list = Object.keys(suite);
    let testScope = list.includes(scope) ? scope : undefined;
    let summary = run(state, suite, testScope);

    _renderResults(contentContainer, summary, options);
};

/**
 * Result Msg
 *
 * @param {Entry[]} entries
 *
 * @returns {string}
 */
export const resultMsg = (entries) => entries.reduce((accumulator, value, index) => {
    return `${accumulator}${'  '.repeat(index)}${value.msg}\n`;
}, '').trim();

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
export const _getSummaryParts = (summary = {}) => {
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
    } = _getSummaryParts(summary);

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
    } = _getSummaryParts(summary);

    let content = `${checkedForText} ${assertionsText}. `;

    if (issuesText) {
        return content + element('span', `${issuesText} 😕`, { class: 'fail' });
    }

    return content + element('span', '0 Encounters, nice job 👏', { class: 'ok' });
}
