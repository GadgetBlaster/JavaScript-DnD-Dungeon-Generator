
import {
    actions,
    attachActions,
    toggleVisibility,
} from './ui/action';

import { generateItems } from './items/items';
import { generateRoom } from './room';
import { getKnobConfig } from './knobs';
import { getKnobs, getFormData } from './ui/form';
import { getSettings } from './settings';
import { nav, setActive, getActive, pages } from './ui/nav';

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

    let config = getKnobConfig(value);

    contentContainer.innerHTML = '';
    knobContainer.innerHTML    = getKnobs(config);
};

const generators = {
    [pages.dungeon]: () => [ 'TODO' ],
    [pages.room]: generateRoom,
    [pages.items]: generateItems,
};

const generate = () => {
    let settings  = getSettings(getFormData(knobContainer));
    let page      = getActive(navContainer);
    let generator = generators[page]

    if (!generator) {
        throw 'Invalid page'
    }

    let text = generator(settings);

    contentContainer.innerHTML = '<section>' + text.join('') + '</section>';
};

attachActions({
    [actions.generate]: generate,
    [actions.showHide]: toggleVisibility,
    [actions.navigate]: navigate,
});

navContainer.innerHTML  = nav;

navigate();
