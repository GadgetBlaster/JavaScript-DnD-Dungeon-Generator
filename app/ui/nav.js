
import { actions } from './action';
import { button } from './button'

export const pages = {
    dungeon: 'dungeon',
    room: 'room',
    items: 'items',
};

let { dungeon, room, items } = pages;

let { navigate } = actions;

const link = [
    button('Dungeon', navigate, { value: dungeon, active: true }),
    button('Room', navigate, { value: room }),
    button('Items', navigate, { value: items }),
];

export const setActive = (target) => {
    [ ...target.parentNode.children ].forEach((btn) => {
        delete btn.dataset.active;
    });

    target.dataset.active = true;
}

export const getActive = (navContainer) => {
    let activeBtn = [ ...navContainer.children ].find((btn) => {
        return btn.dataset.active
    });

    return activeBtn.dataset.value;
};

export const nav = link.join('');
