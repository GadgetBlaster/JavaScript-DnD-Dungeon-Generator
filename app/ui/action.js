
export const actions = {
    accordion: 'accordion',
    generate : 'generate',
    home     : 'home',
    navigate : 'navigate',
    showHide : 'showHide',
};

export const toggleVisibility = (target) => {
    let targetEl = document.body.querySelector(`[data-id="${target}"]`);

    targetEl.hidden = !targetEl.hidden;
};

export const toggleAccordion = (target) => {
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

        if ([ actions.generate, actions.home].includes(action)) {
            e.preventDefault();
        }

        triggers[action] && triggers[action](target, e.target);
    });
};
