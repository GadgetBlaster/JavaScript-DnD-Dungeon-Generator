// @ts-check

import { button } from './button.js';
import { capitalize } from '../utility/tools.js';
import { generators } from '../controller/controller.js';

// -- Types --------------------------------------------------------------------

/** @typedef {import('../controller/controller.js').Generator} Generator */
/** @typedef {import('../controller/controller.js').Sections} Sections */

// -- Config -------------------------------------------------------------------

const disabledGenerators = new Set([ 'names' ]);

export { disabledGenerators as testDisabledGenerators };

// -- Private Functions --------------------------------------------------------

/**
 * Returns an array of HTMLElement children for an HTMLElement.
 *
 * @private
 *
 * @param {HTMLCollection} collection
 *
 * @returns {HTMLElement[]}
 */
const getElements = (collection) => [ ...collection ].map((el) =>
    el instanceof HTMLElement && el).filter(Boolean);

// -- Public Functions ---------------------------------------------------------

/**
 * Gets the active navigation target.
 *
 * @param {HTMLElement} nav
 *
 * @returns {Generator}
 */
export function getActiveNavItem(nav) {
    return /** @type {Generator} */ (
        getElements(nav.children).find((btn) => btn.dataset.active).dataset.target
    );
}

/**
 * Returns the main navigation as an HTML element string.
 *
 * @param {Generator} activeGenerator
 *
 * @returns {string}
 */
export const getNav = (activeGenerator) => generators
    .filter((generator) => !disabledGenerators.has(generator))
    .map((generator) => button(capitalize(generator), 'navigate', {
        target: generator,
        active: activeGenerator === generator,
    })).join('');

/**
 * Sets the active navigation target.
 *
 * @param {HTMLElement} nav
 * @param {Generator} generator
 */
export function setActiveNavItem(nav, generator) {
    getElements(nav.children).forEach((btn) => {
        if (btn.dataset.target === generator) {
            btn.dataset.active = 'true';
            return;
        }

        delete btn.dataset.active;
    });
}
