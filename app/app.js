
import { actions, attachActions, toggleVisibility } from './ui/action';
import { generateRoom } from './room';
import { knobs, getFormData } from './ui/form';

const knobContainer = document.getElementById('knobs');
const contentContainer = document.getElementById('content');

const generate = () => {
    let config = getFormData(knobContainer);
    let text   = generateRoom(config);

    contentContainer.innerHTML = '<section>' + text.join('') + '</section>';
};

attachActions({
    [actions.generate]: generate,
    [actions.showHide]: toggleVisibility,
});

knobContainer.innerHTML = knobs;
