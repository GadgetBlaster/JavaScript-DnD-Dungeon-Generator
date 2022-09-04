// @ts-check

import { toss } from '../utility/tools.js';

// -- Config -------------------------------------------------------------------

/**
 * Toast exit duration. Must match the `animation-duration` CSS on the
 * `[data-toast][data-visible="exit"]` styles.
 */
const toastExitDuration = 2000; // ms

// -- Public Functions ---------------------------------------------------------

let toastTimeoutID;

/**
 * Returns a toast message as an HTML string.
 *
 * TODO unit test
 *
 * @param {HTMLElement} el
 *   The "toast" Sections element, denoted by `id="toast"` in the main layout.
 *
 * @param {string} label
 *
 * @param {{ duration?: number; success?: boolean }} [options]
 */
export const toast = (el, label, { duration = 6000, success = true } = {}) => {
    if (!toast) { toss('toast element is required in toast()'); }
    if (!label) { toss('label is required in toast()'); }

    clearTimeout(toastTimeoutID);

    el.innerHTML = label;
    el.dataset.visible = '';
    el.dataset.toast = success ? 'success' : 'error';

    toastTimeoutID = setTimeout(() => {
        el.dataset.visible = 'exit';

        toastTimeoutID = setTimeout(() => {
            delete el.dataset.visible;
            el.dataset.toast = '';
        }, toastExitDuration);
    }, duration);
};
