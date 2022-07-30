// @ts-check

import { toss } from '../utility/tools.js';
import { element } from '../utility/element.js';
import { button } from './button.js';

// TODO tests

// -- Types --------------------------------------------------------------------

/** @typedef {import('../controller/controller.js').Generator} Generator */

// -- Config -------------------------------------------------------------------


// -- Private Functions --------------------------------------------------------

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
 * Returns a toolbar for the current generator.
 *
 * @param {Generator} [generator]
 *
 * @returns {string}
 */
export function getToolbar(generator) {
    let defaultButtons = [
        button('Save', 'save'),
    ];

    switch (generator) {
        case 'dungeon':
            return toolbarItems(defaultButtons);

        case 'rooms':
            return toolbarItems(defaultButtons);

        case 'items':
            return toolbarItems(defaultButtons);

        default:
            toss('Invalid generator in getToolbar()');
    }
}
