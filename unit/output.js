
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
