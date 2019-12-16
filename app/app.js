
import { getDescription } from './desc';

import {
    actionGenerate,
    getFormData,
    knobUi,
} from './form';

const knobContainer = document.getElementById('knobs');
const contentContainer = document.getElementById('content');

const generateRoom = () => {
    let config = getFormData(knobContainer);
    let desc   = getDescription(config);

    contentContainer.innerHTML = desc;
};

document.body.addEventListener('click', (e) => {
    e.preventDefault();

    let action = e.target.dataset.action;

    switch (action) {
        case actionGenerate:
            generateRoom();
            break;
    }
});

knobContainer.innerHTML = knobUi;
