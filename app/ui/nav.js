// @ts-check

import { button } from './button.js';

// -- Types --------------------------------------------------------------------

/** @typedef {"dungeon" | "rooms" | "items"} Page */
/** @typedef {import('../controller/controller.js').Sections} Sections */


// -- Types --------------------------------------------------------------------

/** @typedef {typeof conditions[number]} Condition */

// -- Config -------------------------------------------------------------------

export const conditions = Object.freeze(/** @type {const} */ ([
    'decaying',
    'busted',
    'poor',
    'average',
    'good',
    'exquisite',
]));


// -- Config -------------------------------------------------------------------

export const pages = Object.freeze(/** @type {const} */ ([
    'dungeon',
    'rooms',
    'items',
]));

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
export const getNav = (activePage) => [
    button('Dungeon', 'navigate', { target: 'dungeon', active: activePage === 'dungeon' }),
    button('Rooms',   'navigate', { target: 'rooms',   active: activePage === 'rooms' }),
    button('Items',   'navigate', { target: 'items',   active: activePage === 'items' }),
].join('');

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
