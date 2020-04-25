
/**
 * HTML escapes
 *
 * @type {Object.<string, string>}
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
 * Escape HTML
 *
 * @param {string} string
 *
 * @returns {string}
 */
export const escapeHTML = (string) => string.replace(/[&<>"'\/]/g, (match) => htmlEscapes[match]);

/**
 * Dot
 *
 * @param {Result} result
 *
 * @returns {string}
 */
export const dot = ({ isOk }) => `<span class="dot dot-${isOk ? 'ok' : 'fail'}"></span>`;

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
 * @param {boolean} [options]
 *     @param {boolean} [options.active]
 *
 * @returns {string}
 */
export const link = (label, href, { active } = {}) => `<a href="${href}"${active ? ' data-active' : ''}>${label}</a>`;

/**
 * Result log
 *
 * @param {Result[]} results
 * @param {Object} [options]
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
 *     @param {string} [options.action]
 *     @param {boolean} [options.verbose]
 *
 * @returns {string}
 */
export const nav = ({ action, verbose }) => {
    const makeParams = (options) => {
        let params = Object.entries(options)
            .filter(([ _, value ]) => Boolean(value))
            .map(([ key, value ]) => `${key}=${value}`)
            .join('&');

        return params && `?${params}`;
    };

    const links = [
        link('Run All', `./unit.html${makeParams({ action: null, verbose })}`, { active: !action }),
        link('Test Files', `./unit.html${makeParams({ action: 'list', verbose })}`, { active: action === 'list' }),
        '<span role="presentation" data-separator></span>',
        link('Verbose', `./unit.html${makeParams({ action, verbose: !verbose })}`, { active: verbose })
    ];

    return links.join('');
};

/**
 * Path list
 *
 * @param {string[]}
 *
 * @returns {string}
 */
export const pathList = (paths) => {
    return paths.map((path) => {
        return `<li>${link(path, `?action=${path}`)}</li>`;
    }).join('');
};

/**
 * Print
 *
 * @param {Element} el
 * @param {string} text
 */
export const print = (el, text) => {
    el.innerHTML += text;
};

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
 * @param {string[]} entries
 *
 * @returns {string}
 */
export const resultMsg = (entries) => entries.reduce((accumulator, value, index) => {
    return `${accumulator}${'  '.repeat(index)}${value}\n`;
}, '').trim();

/**
 * Summary
 *
 * @param {number} assertions
 * @param {number} failures
 *
 * @returns {string}
 */
export const summary = (assertions, failures) => {
    let total = `${assertions} Assertion${assertions === 1 ? '' : 's'}`;

    if (!assertions) {
        return total;
    }

    let fails = ((count) => {
        switch (count) {
            case 0:  return '<span class="ok">0 Failures, nice job 👏</span>';
            case 1:  return '<span class="fail">1 Failure</span>';
            default: return `<span class="fail">${count} Failures</span>`;
        }
    })(failures);

    return `${total}, ${fails}`;
};
