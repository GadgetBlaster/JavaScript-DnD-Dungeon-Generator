
export const actions = {
    generate: 'generate',
    navigate: 'navigate',
    showHide: 'showHide',
    expandCollapse: 'expandCollapse',
};

export const toggleVisibility = (target) => {
    let targetEl = document.body.querySelector(`[data-id="${target}"]`);

    targetEl.hidden = !targetEl.hidden;
};

export const toggleCollapsed = (target) => {
    let accordions = document.body.querySelectorAll('[data-collapsed');
    let targetEl = document.body.querySelector(`[data-id="${target}"]`);

    [ ...accordions ].forEach((el) => {
        if (el !== targetEl) {
            el.dataset.collapsed = true;
        }
    });

    let collapsed = targetEl.dataset.collapsed === 'true';

    targetEl.dataset.collapsed = collapsed === true ? false : true;
};

export const attachActions = (triggers) => {
    document.body.addEventListener('click', (e) => {
        let action = e.target.dataset.action;
        let target = e.target.dataset.target;

        if (action === actions.generate) {
            e.preventDefault();
        }

        triggers[action] && triggers[action](target, e.target);
    });
};
