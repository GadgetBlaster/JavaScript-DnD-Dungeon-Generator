
export const actions = {
    generate: 'generate',
    navigate: 'navigate',
    showHide: 'showHide',
    expandCollapse: 'expandCollapse',
};

export const toggleVisibility = (e) => {
    let id = e.target.dataset.target;
    let el = document.body.querySelector(`[data-id="${id}"]`);

    el.hidden = !el.hidden;
};

export const toggleCollapsed = (e) => {
    let id = e.target.dataset.target;
    let el = document.body.querySelector(`[data-id="${id}"]`);

    let collapsed = el.dataset.collapsed === 'true';

    el.dataset.collapsed = collapsed === true ? false : true;
};

export const attachActions = (actions) => {
    document.body.addEventListener('click', (e) => {
        e.preventDefault();

        let action = e.target.dataset.action;

        actions[action] && actions[action](e);
    });
};
