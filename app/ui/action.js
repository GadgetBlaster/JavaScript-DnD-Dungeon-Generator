// @ts-check

import { toss } from '../utility/tools.js';

// -- Types --------------------------------------------------------------------

/** @typedef {(Event) => void} Trigger */
/** @typedef {{ [key: string]: Trigger }} Triggers */

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
 * @private
 *
 * @param {EventTarget} target
 *
 * @returns {{ [attribute: string]: string }}
 */
const getDataset = (target) => target instanceof HTMLElement ? target.dataset : {};

/**
 * Returns a trigger function for the given action.
 *
 * @param {Triggers} triggers
 * @param {string} [action]
 *
 * @returns {Trigger?}
 */
function getTrigger(triggers, action) {
    action && !triggers[action] && toss(`Invalid action \`${action}\``);

    return action && triggers[action];
}

export {
    getDataset as testGetDataset,
    getTrigger as testGetTrigger,
};

// -- Public Functions ---------------------------------------------------------

/**
 * Attaches a click event delegate to the given container with the given
 * action triggers.
 *
 * @param {HTMLElement} container
 * @param {Triggers} triggers
 */
export function attachActions(container, triggers) {
    container.addEventListener('click', (e) => {

        let { action } = getDataset(e.target);


        let trigger = getTrigger(triggers, action);

        if (!trigger) {
            return;
        }

        e.preventDefault();
        trigger(e);
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

    !target && toss('Missing target for accordion toggle');

    /** @type {HTMLElement} targetSectionEl */
    let targetSectionEl = container.querySelector(`[data-collapsed][data-id="${target}"]`);

    !targetSectionEl && toss(`Invalid accordion section target \`${target}\``);

    /** @type {NodeListOf<HTMLElement>} sectionEls */
    let sectionEls = container.querySelectorAll('[data-collapsed]');

    [ ...sectionEls ].forEach((el) => {
        if (el !== targetSectionEl) {
            el.dataset.collapsed = 'true';
        }
    });

    let isCollapsed = targetSectionEl.dataset.collapsed === 'true';

    targetSectionEl.dataset.collapsed = isCollapsed ? 'false' : 'true';
}

/**
 * Toggle visibility
 *
 * @param {Element} container
 * @param {Event} e
 */
export function toggleVisibility(container, e) {
    let { target } = getDataset(e.target);

    !target && toss('Missing target for visibility toggle');

    /** @type {HTMLElement} targetEl */
    let targetEl = container.querySelector(`[data-id="${target}"]`);

    !targetEl && toss(`Invalid visibility toggle target \`${target}\``);

    targetEl.hidden = !targetEl.hidden;
}
