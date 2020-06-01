
/**
 * Actions
 *
 * @type {Object.<string, string>}
 */
export const actions = {
    accordion: 'accordion',
    generate : 'generate',
    home     : 'home',
    navigate : 'navigate',
    showHide : 'showHide',
};

/**
 * Attach actions
 *
 * @param {Element} container
 * @param {Object.<string, function>} triggers
 */
export const attachActions = (container, triggers) => {
    container.addEventListener('click', (e) => {
        let action = e.target.dataset.action;

        if ([ actions.generate, actions.home ].includes(action)) {
            e.preventDefault();
        }

        triggers[action] && triggers[action](e);
    });
};

/**
 * Toggle accordion
 *
 * @param {Element} container
 * @param {Event} e
 */
export const toggleAccordion = (container, e) => {
    let target = e.target.dataset.target;

    let accordions = container.querySelectorAll('[data-collapsed]');
    let targetEl   = container.querySelector(`[data-id="${target}"]`);

    [ ...accordions ].forEach((el) => {
        if (el !== targetEl) {
            el.dataset.collapsed = true;
        }
    });

    let collapsed = targetEl.dataset.collapsed === 'true';

    targetEl.dataset.collapsed = collapsed === true ? false : true;
};

/**
 * Toggle visibility
 *
 * @param {Element} container
 * @param {Event} e
 */
export const toggleVisibility = (container, e) => {
    let target   = e.target.dataset.target;
    let targetEl = container.querySelector(`[data-id="${target}"]`);

    targetEl.hidden = !targetEl.hidden;
};
