
export const actions = {
    generate: 'generate',
    navigate: 'navigate',
    showHide: 'showHide',
    expandCollapse: 'expandCollapse',
};

export const toggleVisibility = (target) => {
    let el = document.body.querySelector(`[data-id="${target}"]`);

    el.hidden = !el.hidden;
};

export const toggleCollapsed = (target) => {
    let el = document.body.querySelector(`[data-id="${target}"]`);

    let collapsed = el.dataset.collapsed === 'true';

    el.dataset.collapsed = collapsed === true ? false : true;
};

export const attachActions = (actions) => {
    document.body.addEventListener('click', (e) => {
        e.preventDefault();

        let action = e.target.dataset.action;
        let target = e.target.dataset.target;

        actions[action] && actions[action](target, e.target);
    });
};
