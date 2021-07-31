// @ts-check

// -- Config -------------------------------------------------------------------

/**
 * Actions
 */
export const actions = {
    accordion: 'accordion',
    generate : 'generate',
    home     : 'home',
    navigate : 'navigate',
    showHide : 'showHide',
};

// -- Private Functions --------------------------------------------------------

/**
 * Get element dataset.
 *
 * @param {EventTarget} target
 *
 * @returns {{ [attribute: string]: string }}
 */
const getDataset = (target) => target instanceof HTMLElement ? target.dataset : {};

// -- Public Functions ---------------------------------------------------------

/**
 * Attach actions
 *
 * @param {HTMLElement} container
 * @param {Object<string, function>} triggers
 */
export function attachActions(container, triggers) {
    container.addEventListener('click', (e) => {
        e.preventDefault();

        let { action } = getDataset(e.target);

        triggers[action] && triggers[action](e);
    });
}

/**
 * Toggle accordion
 *
 * @param {HTMLElement} container
 * @param {Event} e
 */
export function toggleAccordion(container, e) {
    let { target } = getDataset(e.target);

    /** @type {NodeListOf<HTMLElement>} sectionEls */
    let sectionEls = container.querySelectorAll('[data-collapsed]');

    /** @type {HTMLElement} targetSectionEl */
    let targetSectionEl  = container.querySelector(`[data-id="${target}"]`);

    [ ...sectionEls ].forEach((el) => {
        if (el !== targetSectionEl) {
            el.dataset.collapsed = 'true';
        }
    });

    let collapsed = targetSectionEl.dataset.collapsed === 'true';

    targetSectionEl.dataset.collapsed = collapsed ? 'false' : 'true';
}

/**
 * Toggle visibility
 *
 * @param {Element} container
 * @param {Event} e
 */
export function toggleVisibility(container, e) {
    let { target } = getDataset(e.target);

    /** @type {HTMLElement} targetEl */
    let targetEl = container.querySelector(`[data-id="${target}"]`);

    targetEl.hidden = !targetEl.hidden;
}
