
import { generateRoom } from './room/room';

import {
    actionGenerate,
    getFormData,
    knobs,
} from '/app/ui/form';

const knobContainer = document.getElementById('knobs');
const contentContainer = document.getElementById('content');

const generate = () => {
    let config = getFormData(knobContainer);
    let text   = generateRoom(config);

    contentContainer.innerHTML = '<section>' + text.join('') + '</section>';
};

document.body.addEventListener('click', (e) => {
    e.preventDefault();

    let action = e.target.dataset.action;

    switch (action) {
        case actionGenerate:
            generate();
            break;
    }
});

knobContainer.innerHTML = knobs;
