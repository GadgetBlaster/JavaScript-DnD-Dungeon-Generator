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
        'data-active': activeGenerator === generator,
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
    getElements(nav.children).forEach((btn) => {
        if (btn.dataset.target === generator) {
            btn.dataset.active = 'true';
            return;
        }

        delete btn.dataset.active;
    });
}
