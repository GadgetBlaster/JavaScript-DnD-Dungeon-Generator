
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
 * @param {Object} options
 *     @param {boolean} options.isOk
 *
 * @returns {string}
 */
export const dot = ({ isOk }) => `<span class="dot dot-${isOk ? 'ok' : 'fail'}"></span>`;

/**
 * Info
 *
 * @param {string} msg
 *
 * @returns {string}
 */
export const info = (msg) => `<li>${escapeHTML(msg)}</li>`;

/**
 * Fail
 *
 * @param {string} msg
 *
 * @returns {string}
 */
export const fail = (msg) => `<li class="fail">${escapeHTML(msg)}</li>`;

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
