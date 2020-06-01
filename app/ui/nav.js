
import { actions } from './action.js';
import { button } from './button.js';

export const pages = {
    dungeon: 'dungeon',
    room: 'room',
    items: 'items',
};

let { dungeon, room, items } = pages;
let { navigate } = actions;

export const nav = [
    button('Dungeon', navigate, { target: dungeon, active: true }),
    button('Rooms', navigate, { target: room }),
    button('Items', navigate, { target: items }),
].join('');

export const setActive = (target) => {
    [ ...target.parentNode.children ].forEach((btn) => {
        delete btn.dataset.active;
    });

    target.dataset.active = true;
};

export const getActive = (navContainer) => {
    let activeBtn = [ ...navContainer.children ].find((btn) => {
        return btn.dataset.active;
    });

    return activeBtn.dataset.target;
};
