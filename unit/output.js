
// -- Config -------------------------------------------------------------------

/**
 * HTML escapes
 *
 * @type {object<string, string>}
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
        .filter(([ _, value ]) => Boolean(value))
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
export const fail = (msg) => `<li class="fail">${escapeHTML(msg)}</li>`;

/**
 * Info
 *
 * @param {string} msg
 *
 * @returns {string}
 */
export const info = (msg) => `<li>${escapeHTML(msg)}</li>`;

/**
 * Link
 *
 * @param {string} label
 * @param {string} href
 * @param {object} [options]
 *     @param {boolean} [options.active]
 *
 * @returns {string}
 */
export const link = (label, href, { active } = {}) => `<a href="${href}"${active ? ' data-active' : ''}>${label}</a>`;

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
    link('All', `./unit.html${_makeParams({ scope: null, verbose })}`, { active: !scope }),
    link('Tests', `./unit.html${_makeParams({ scope: 'list', verbose })}`, { active: scope === 'list' }),
    '<span role="presentation" data-separator></span>',
    link('Verbose', `./unit.html${_makeParams({ scope, verbose: !verbose })}`, { active: verbose })
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
        return `<li>${link(scope, _makeParams({ scope, verbose }))}</li>`;
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
        return `<span class="fail">${errors.length} Error${errors.length === 1 ? '' : 's'} 😕</span>`;
    }

    let out = [];

    out.push(`${assertions} Assertion${assertions === 1 ? '' : 's'}`);

    if (!assertions) {
        return out.join(', ');
    }

    out.push(((count) => {
        switch (count) {
            case 0:  return '<span class="ok">0 Failures, nice job 👏</span>';
            case 1:  return '<span class="fail">1 Failure</span>';
            default: return `<span class="fail">${count} Failures</span>`;
        }
    })(failures));

    return out.join(', ');
};
