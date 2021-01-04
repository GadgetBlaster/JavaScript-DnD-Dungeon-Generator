
import { actions } from './action.js';
import { button } from './button.js';

// -- Config -------------------------------------------------------------------

/**
 * Pages
 *
 * @type {Object<string, string>}
 */
export const pages = {
    dungeon: 'dungeon',
    room: 'room',
    items: 'items',
};

let { dungeon, room, items } = pages;
let { navigate } = actions;

/**
 * Nav
 *
 * @type {string}
 */
export const nav = [
    button('Dungeon', navigate, { target: dungeon, active: true }),
    button('Rooms', navigate, { target: room }),
    button('Items', navigate, { target: items }),
].join('');

// -- Public Functions ---------------------------------------------------------

/**
 * Get active
 *
 * @param {Element} navContainer
 *
 * @returns {string}
 */
export const getActive = (navContainer) => {
    return [ ...navContainer.children ].find((btn) => btn.dataset.active).dataset.target;
};

/**
 * Set active
 *
 * @param {Element} target
 */
export const setActive = (target) => {
    [ ...target.parentNode.children ].forEach((btn) => {
        delete btn.dataset.active;
    });

    target.dataset.active = true;
};
