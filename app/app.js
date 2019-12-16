
import { getRoomDescription } from './room/description';
import { getItems } from './room/items';

import {
    actionGenerate,
    getFormData,
    knobUi,
} from './form';

const knobContainer = document.getElementById('knobs');
const contentContainer = document.getElementById('content');

const generateRoom = () => {
    let config = getFormData(knobContainer);

    let text = [
        getRoomDescription(config),
        getItems(config),
    ];

    contentContainer.innerHTML = '<p>' + text.join('</p><p>') + '</p>';
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
