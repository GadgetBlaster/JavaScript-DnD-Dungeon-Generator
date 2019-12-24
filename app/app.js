
// TODO:
// Room type item affinity
// Flush out items
// Fill containers
// Doors, locked doors, keys
// Secret doors, secret rooms
// Traps
// Item rarity for speific type

import {
    actions,
    attachActions,
    toggleVisibility,
} from './ui/action';

import { generateItems } from './items/items';
import { generateRooms } from './rooms/rooms';
import { getKnobConfig } from './knobs';
import { nav, setActive, getActive, pages } from './ui/nav';
import { renderKnobs, getFormData } from './ui/form';
import { section } from './ui/block';

const navContainer     = document.getElementById('nav');
const knobContainer    = document.getElementById('knobs');
const contentContainer = document.getElementById('content');

const navigate = (e) => {
    let target = e && e.target;
    let value;

    if (target) {
        value = target.dataset.value;
        setActive(target);
    }

    let page = value || getActive(navContainer);

    let config = getKnobConfig(page);

    contentContainer.innerHTML = '';
    knobContainer.innerHTML    = renderKnobs(config, page);
};

const generators = {
    [pages.dungeon]: () => [ 'TODO' ],
    [pages.room]   : generateRooms,
    [pages.items]  : generateItems,
};

const generate = () => {
    let settings  = getFormData(knobContainer);
    let page      = getActive(navContainer);
    let generator = generators[page]

    if (!generator) {
        throw 'Invalid page';
    }

    let text = generator(settings);

    contentContainer.innerHTML = section(text);
};

attachActions({
    [actions.generate]: generate,
    [actions.showHide]: toggleVisibility,
    [actions.navigate]: navigate,
});

navContainer.innerHTML  = nav;

navigate();
generate();
