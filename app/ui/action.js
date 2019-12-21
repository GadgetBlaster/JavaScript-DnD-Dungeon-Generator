
export const actions = {
    generate: 'generate',
    showHide: 'showHide',
};

export const toggleVisibility = (e) => {
    let id = e.target.dataset.target;
    let el = document.body.querySelector(`[data-id="${id}"`);
    
    el.hidden = !el.hidden;
};

export const attachActions = (actions) => {
    document.body.addEventListener('click', (e) => {
        e.preventDefault();

        let action = e.target.dataset.action;

        actions[action] && actions[action](e);
    });
};
