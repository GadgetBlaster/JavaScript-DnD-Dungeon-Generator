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
 * @returns {string}
 */
export function getActiveNavItem(nav) {
    return getElements(nav.children).find((btn) => btn.dataset.active).dataset.target;
}

/** Main Navigation HTML string */
export const getNav = () => [
    button('Dungeon', 'navigate', { target: 'dungeon', active: true }),
    button('Rooms',   'navigate', { target: 'rooms' }),
    button('Items',   'navigate', { target: 'items' }),
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
