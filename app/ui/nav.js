// @ts-check

import { actions } from './action.js';
import { button } from './button.js';

// -- Config -------------------------------------------------------------------

/**
 * Pages
 */
export const pages = {
    dungeon: 'dungeon',
    room   : 'room',
    items  : 'items',
};

let { dungeon, room, items } = pages;
let { navigate } = actions;

/** Main Navigation HTML string */
export const nav = [
    button('Dungeon', navigate, { target: dungeon, active: true }),
    button('Rooms',   navigate, { target: room }),
    button('Items',   navigate, { target: items }),
].join('');

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
 * @param {HTMLElement} navContainer
 *
 * @returns {string}
 */
export function getActive(navContainer) {
    return getElements(navContainer.children).find((btn) => btn.dataset.active).dataset.target;
}

/**
 * Sets the active navigation target.
 *
 * @param {HTMLElement} target
 */
export function setActive(target) {
    getElements(target.parentNode.children).forEach((btn) => {
        delete btn.dataset.active;
    });

    target.dataset.active = 'true';
}
