// @ts-check

import { button } from './button.js';
import { capitalize } from '../utility/tools.js';
import { pages } from '../controller/controller.js';

// -- Types --------------------------------------------------------------------

/** @typedef {import('../controller/controller.js').Page} Page */
/** @typedef {import('../controller/controller.js').Sections} Sections */

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
 * @returns {Page}
 */
export function getActiveNavItem(nav) {
    return /** @type {Page} */ (getElements(nav.children).find((btn) => btn.dataset.active).dataset.target);
}

/**
 * Returns the main Navigation as an HTML element string.
 *
 * @param {Page} activePage
 *
 * @returns {string}
 */
export const getNav = (activePage) => pages.map((page) =>
    button(capitalize(page), 'navigate', {
        target: page,
        active: activePage === page,
    })).join('');

/**
 * Sets the active navigation target.
 *
 * @param {HTMLElement} nav
 * @param {Page} page
 */
export function setActiveNavItem(nav, page) {
    getElements(nav.children).forEach((btn) => {
        if (btn.dataset.target === page) {
            btn.dataset.active = 'true';
            return;
        }

        delete btn.dataset.active;
    });
}
