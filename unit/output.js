
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
 * Summary
 *
 * @param {number} assertions
 * @param {number} failures
 *
 * @returns {string}
 */
export const summary = (assertions, failures) => {
    let total = `${assertions} Assertion${assertions === 1 ? '' : 's'}`;
    let fails = ((count) => {
        switch (count) {
            case 0:  return '<span class="ok">0 Failures, nice job 👏</span>';
            case 1:  return '<span class="fail">1 Failure</span>';
            default: return `<span class="fail">${count} Failures</span>`;
        }
    })(failures);

    return `${total}, ${fails}`;
};
