
import { element } from '../utility/html.js';
import { link } from '../ui/link.js';
import { plural } from '../utility/tools.js';

// -- Config -------------------------------------------------------------------

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
 * Result log
 *
 * @param {Result[]} results
 * @param {object} [options]
 *     @param {boolean} [options.verbose]
 *
 * @returns {string}
 */
export const log = (results, { verbose } = {}) => {
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
 * Render
 *
 * @param {Element} el
 * @param {string} text
 */
export const render = (el, text) => {
    el.innerHTML = text;
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
export function getSummary(summary, { delay = 0 } = {}) {
    let {
        assertionsText,
        checkedForText,
        issuesText,
    } = _getSummaryParts(summary);

    let content = `${checkedForText} ${assertionsText}. `;

    if (issuesText) {
        return element('p', content + element('span', `${issuesText} 😕`, { class: 'fail' }));
    }

    content += element('span', '0 Encounters, nice job 👏', { class: 'ok' });
    return element('p', content, {
        class: 'delay',
        style: `animation-delay: ${delay}ms`,
    });
}
