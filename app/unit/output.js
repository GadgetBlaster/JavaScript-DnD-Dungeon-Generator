
import { element } from '../utility/html.js';
import { link } from '../ui/link.js';

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
 * Dot
 *
 * @param {Result} result
 *
 * @returns {Element}
 */
export const dot = ({ isOk }) => {
    let el = document.createElement('span');

    el.className = `dot dot-${isOk ? 'ok' : 'fail'}`;

    return el;
};

/**
 * Escape HTML
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
 * Format summary
 *
 * @param {Summary} summary
 *
 * @returns {string}
 */
export const formatSummary = ({ assertions, failures, errors }) => {
    if (errors.length) {
        let content = `${errors.length} Error${errors.length === 1 ? '' : 's'} 😕`;
        return element('span', content, { class: 'fail' });
    }

    let out = [];

    out.push(`${assertions} Assertion${assertions === 1 ? '' : 's'}`);

    if (!assertions) {
        return out.join(', ');
    }

    out.push(((count) => {
        switch (count) {
            case 0:  return element('span', '0 Failures, nice job 👏', { class: 'ok' });
            case 1:  return element('span', '1 Failure', { class: 'fail' });
            default: return element('span', `${count} Failures`, { class: 'fail' });
        }
    })(failures));

    return out.join(', ');
};
