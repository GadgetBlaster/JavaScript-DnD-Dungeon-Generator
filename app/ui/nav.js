// @ts-check

import { capitalize, toss } from '../utility/tools.js';
import { generators } from '../controller/controller.js';
import { link } from './link.js';

// -- Types --------------------------------------------------------------------

/** @typedef {import('../controller/controller.js').Generator} Generator */
/** @typedef {import('../controller/controller.js').Sections} Sections */


// -- Public Functions ---------------------------------------------------------

/**
 * Returns the main navigation as an HTML element string.
 *
 * @param {Generator} [activeGenerator]
 *
 * @returns {string}
 */
export const getNav = (activeGenerator) => Object.entries(generators)
    .map(([ route, generator ], i) => link(capitalize(generator), route, {
        'data-action': 'navigate',
        'style'      : `animation-delay: ${2000 + (500 * i)}ms;`,
        ...(activeGenerator === generator ? { 'data-active':  '' } : null),
    })).join('');

/**
 * Sets the active navigation target.
 *
 * @param {HTMLElement} nav
 * @param {Generator} [generator]
 */
export function setActiveNavItem(nav, generator) {
    [ ...nav.children ].forEach((a) => {
        if (!(a instanceof HTMLElement)) {
            return;
        }

        let href = a.getAttribute('href');

        if (!href) {
            // TODO tests
            toss(`Nav item missing href in setActiveNavItem()`);
        }

        if (generators[href] === generator) {
            a.dataset.active = '';
            return;
        }

        delete a.dataset.active;
    });
}
