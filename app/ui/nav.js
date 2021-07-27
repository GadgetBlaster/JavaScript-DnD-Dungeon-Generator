// @ts-check

import { actions } from './action.js';
import { button } from './button.js';

// -- Config -------------------------------------------------------------------

/** Pages */
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
 * @param {HTMLElement} el
 *
 * @returns {ReturnType<HTMLElement[]>}
 */
const getChildren = (el) => [ ...el.children ];

/**
 * Returns an array of HTMLElement siblings for an HTMLElement.
 *
 * @param {HTMLElement} el
 *
 * @returns {ReturnType<HTMLElement[]>}
 */
const getSiblings = (el) => [ ...el.parentNode.children ];

// -- Public Functions ---------------------------------------------------------

/**
 * Get active navigation target.
 *
 * @param {HTMLElement} navContainer
 *
 * @returns {string}
 */
export function getActive(navContainer) {
    return getChildren(navContainer).find((btn) => btn.dataset.active).dataset.target;
}

/**
 * Set active navigation target.
 *
 * @param {HTMLElement} target
 */
export function setActive(target) {
    getSiblings(target).forEach((btn) => {
        delete btn.dataset.active;
    });

    target.dataset.active = 'true';
}
