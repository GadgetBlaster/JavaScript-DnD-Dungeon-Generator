// @ts-check

import { capitalize } from '../utility/tools.js';
import { generators, routeLookup } from '../controller/controller.js';
import { link } from './link.js';

// -- Types --------------------------------------------------------------------

/** @typedef {import('../controller/controller.js').Generator} Generator */
/** @typedef {import('../controller/controller.js').Sections} Sections */

// -- Config -------------------------------------------------------------------

/** @type {Set<Generator>} */
const disabledGenerators = new Set([ 'names' ]);

export { disabledGenerators as testDisabledGenerators };

// -- Public Functions ---------------------------------------------------------

/**
 * Returns the main navigation as an HTML element string.
 *
 * @param {Generator} [activeGenerator]
 *
 * @returns {string}
 */
export const getNav = (activeGenerator) => generators
    .filter((generator) => !disabledGenerators.has(generator))
    .map((generator, i) => link(capitalize(generator), routeLookup[generator], {
        'data-action': 'navigate',
        'data-active': activeGenerator === generator ? '' : undefined,
        'data-target': generator,
        'style'      : `animation-delay: ${2000 + (500 * i)}ms;`,
    })).join('');

/**
 * Sets the active navigation target.
 *
 * @param {HTMLElement} nav
 * @param {Generator} generator
 */
export function setActiveNavItem(nav, generator) {
    [ ...nav.children ].forEach((btn) => {
        if (!(btn instanceof HTMLElement)) {
            return;
        }

        if (btn.dataset.target === generator) {
            btn.dataset.active = '';
            return;
        }

        delete btn.dataset.active;
    });
}
