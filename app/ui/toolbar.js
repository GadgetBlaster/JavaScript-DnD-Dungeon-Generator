// @ts-check

import { toss } from '../utility/tools.js';
import { element } from '../utility/element.js';
import { button } from './button.js';

// TODO tests

// -- Types --------------------------------------------------------------------

/** @typedef {import('../controller/controller.js').Generator} Generator */
/** @typedef {import('../controller/controller.js').Sections} Sections */

// -- Config -------------------------------------------------------------------


// -- Private Functions --------------------------------------------------------

/**
 * Enables the save button.
 *
 * @param {HTMLElement} toolbar
 *
 * @returns {HTMLButtonElement | undefined}
 */
function getSaveButton(toolbar) {
    let btn = toolbar.querySelector('[data-action="save"]');

    if (!btn || !(btn instanceof HTMLButtonElement)) {
        return;
    }

    return btn;
}

/**
 * Returns an HTML toolbar string containing the given items.
 *
 * @param {string[]} items
 *
 * @returns {string}
 */
const toolbarItems = (items) => items.map((item) => element('li', item)).join('');

// -- Public Functions ---------------------------------------------------------

/**
 * Disables the save button.
 *
 * @param {HTMLElement} toolbar
 */
export function disableSaveButton(toolbar) {
    getSaveButton(toolbar)?.setAttribute('disabled', '');
}

/**
 * Enables the save button.
 *
 * @throws
 *
 * @param {HTMLElement} toolbar
 */
export function enableSaveButton(toolbar) {
    let btn = getSaveButton(toolbar);

    if (!btn) {
        toss('Unable to find save button in enableSaveButton()');
    }

    btn.removeAttribute('disabled');
}

/**
 * Returns a toolbar for the current generator.
 *
 * @param {Generator} [generator]
 *
 * @returns {string}
 */
export function getToolbar(generator) {
    let defaultButtons = [
        button('Save', 'save', { disabled: true }),
    ];

    switch (generator) {
        case 'maps':
            return toolbarItems(defaultButtons);

        case 'rooms':
            return toolbarItems(defaultButtons);

        case 'items':
            return toolbarItems(defaultButtons);

        default:
            toss('Invalid generator in getToolbar()');
    }
}
