// @ts-check

import {
    // Config
    testGenerators as generators,

    // Private Functions
    testGetDataset       as getDataset,
    testGetTrigger       as getTrigger,
    testOnGenerate       as onGenerate,
    testOnNavigate       as onNavigate,
    testToggleAccordion  as toggleAccordion,
    testToggleVisibility as toggleVisibility,

    // Public Functions
    attachClickDelegate,
    getTriggers,
} from '../controller.js';

import { getKnobPanel } from '../../ui/form.js';
import { getNav, pages } from '../../ui/nav.js';

/** @typedef {import('../controller.js').Trigger} Trigger */

/**
 * Mocked event with target.
 *
 * @param {HTMLElement} targetEl
 *
 * @returns {Event}
 */
const getMockClickEvent = (targetEl) => ({
    ...new CustomEvent('click', { bubbles: true }),
    target: targetEl,
});

/** @typedef {import('../knobs.js').ItemConfig} ItemConfig */
/** @typedef {import('../knobs.js').RoomConfig} RoomConfig */

const knobHTML = getKnobPanel('items');
const navHTML  = getNav('items');

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {

    // -- Private Functions ----------------------------------------------------

    describe('generators', () => {
        /** @type {ItemConfig} itemSettings */
        const itemSettings = {
            itemCondition: 'average',
            itemQuantity : 'one',
            itemRarity   : 'legendary',
            itemType     : 'random',
        };

        /** @type {RoomConfig} roomSettings */
        const roomSettingsBase = {
            ...itemSettings,
            roomCondition     : 'average',
            roomFurnishing    : 'none', // TODO 'zero' when updated to Quantity
            roomSize          : 'small',
            roomType          : 'room',
        };

        it('includes a function for each page', () => {
            pages.forEach((page) => {
                assert(generators[page]).isFunction();
            });
        });

        describe('items', () => {
            it('returns generated items', () => {
                const result = generators.items(itemSettings);
                assert(result).stringIncludes('<h3>Items (1)</h3>');
                assert(/<ul(.+?)>(.+?)<\/ul>/.test(result)).isTrue();
            });
        });

        describe('rooms', () => {
            it('returns generated rooms', () => {
                const result = generators.rooms({
                    ...itemSettings,
                    ...roomSettingsBase,
                    roomCount : 1,
                });

                assert(result).stringIncludes('<h2>Room</h2>');
                assert(result).stringIncludes('<h3>Items (1)</h3>');
                assert(/<ul(.+?)>(.+?)<\/ul>/.test(result)).isTrue();
            });
        });

        describe('dungeon', () => {
            it('returns a generated dungeon', () => {
                const result = generators.dungeon({
                    ...itemSettings,
                    ...roomSettingsBase,
                    dungeonComplexity : 2,
                    dungeonConnections: 0,
                    dungeonMaps       : 0,
                    dungeonTraps      : 0,
                });

                assert(/<svg(.+?)>(.+?)<\/svg>/.test(result)).isTrue();
            });
        });
    });

    describe('getDataset()', () => {
        describe('given an HTML element target', () => {
            it('returns the element\'s data attributes', () => {
                const divEl = document.createElement('div');

                divEl.dataset.type = 'blackKnight';

                assert(getDataset(divEl)).equalsObject({ type: 'blackKnight' });
            });
        });

        describe('given a target that is not an HTML element', () => {
            it('returns an empty object', () => {
                assert(getDataset(null)).equalsObject({});
            });
        });
    });

    describe('getTrigger()', () => {
        describe('given an action that does not exist on the given triggers', () => {
            it('throws', () => {
                // @ts-expect-error
                assert(() => getTrigger({}, 'bellyFlop')).throws('Invalid action "bellyFlop" passed to getTrigger()');
            });
        });

        describe('given an action that exists on the given triggers', () => {
            it('returns the action', () => {
                const triggers = {
                    accordion: () => 'accordion',
                    generate : () => 'generate',
                    navigate : () => 'navigate',
                    toggle   : () => 'toggle',
                };

                const accordion = getTrigger(triggers, 'accordion');
                const generate  = getTrigger(triggers, 'generate');
                const navigate  = getTrigger(triggers, 'navigate');
                const toggle    = getTrigger(triggers, 'toggle');

                assert(accordion()).equals('accordion');
                assert(generate()).equals('generate');
                assert(navigate()).equals('navigate');
                assert(toggle()).equals('toggle');
            });
        });
    });

    describe('onNavigate()', () => {
        describe('given an event with the target page of "rooms"', () => {
            it('updates the content, knobs, and nav elements', () => {
                const contentEl = document.createElement('div');
                const knobsEl   = document.createElement('form');

                const navEl = document.createElement('nav');
                navEl.innerHTML = navHTML;

                /** @type {HTMLElement} */
                const dungeonButton = navEl.querySelector('[data-target="dungeon"]');

                /** @type {HTMLElement} */
                const roomsButton = navEl.querySelector('[data-target="rooms"]');

                const sections = {
                    content: contentEl,
                    knobs  : knobsEl,
                    nav    : navEl,
                };

                onNavigate(sections, 'Fake home content', getMockClickEvent(roomsButton));

                assert(contentEl.innerHTML).equals('Fake home content');
                assert(knobsEl.innerHTML).stringIncludes('Generate');
                assert(roomsButton.dataset.active).equals('true');
                assert(dungeonButton.dataset.active).isUndefined();
            });
        });
    });

    describe('onGenerate()', () => {
        // TODO flaky test, items can be zero?
        it('generates content', () => {
            const contentEl = document.createElement('div');

            const knobsEl = document.createElement('form');
            knobsEl.innerHTML = knobHTML;

            const navEl = document.createElement('nav');
            navEl.innerHTML = navHTML;

            onGenerate({
                content: contentEl,
                knobs  : knobsEl,
                nav    : navEl,
            });

            assert(/<h3>Items \([0-9]+\)<\/h3>/.test(contentEl.innerHTML)).isTrue();
            assert(/<ul(.+?)>(.+?)<\/ul>/.test(contentEl.innerHTML)).isTrue();
        });

        describe('when the page is invalid', () => {
            it('throws', () => {
                const contentEl = document.createElement('div');
                const knobsEl   = document.createElement('form');

                const badButton = document.createElement('button');
                badButton.dataset.active = 'true';
                badButton.dataset.target = 'evil-button';

                const navEl = document.createElement('div');
                navEl.appendChild(badButton);

                assert(() => onGenerate({
                    content: contentEl,
                    knobs  : knobsEl,
                    nav    : navEl,
                })).throws('Invalid active page in onGenerate()');
            });
        });
    });

    describe('toggleAccordion()', () => {
        describe('when there are 3 accordion sections', () => {
            const count       = 3;
            const containerEl = document.createElement('div');

            for (let i = 0; i < count; i++) {
                const fieldsetEl = document.createElement('div');
                const buttonEl   = document.createElement('button');

                fieldsetEl.dataset.collapsed = 'true';
                fieldsetEl.dataset.id = i.toString();

                buttonEl.dataset.action = 'accordion';
                buttonEl.dataset.target = i.toString();

                fieldsetEl.appendChild(buttonEl);
                containerEl.appendChild(fieldsetEl);
            }

            const each = ({ collapsed }) => {
                /** @type {NodeListOf<HTMLElement>} */
                const sectionEls = containerEl.querySelectorAll('[data-collapsed]');

                sectionEls.forEach((sectionEl) => {
                    sectionEl.dataset.collapsed = collapsed;
                });
            };

            const collapseAll = () => each({ collapsed: true });

            /** @type {HTMLElement} */
            const targetEl = containerEl.querySelector('[data-action="accordion"][data-target="1"]');

            describe('when an accordion section is collapsed', () => {
                it('expands the accordion item', () => {
                    collapseAll();

                    /** @type {HTMLElement} */
                    const sectionEl = containerEl.querySelector('[data-collapsed][data-id="1"]');

                    toggleAccordion(containerEl, getMockClickEvent(targetEl));
                    assert(sectionEl.dataset.collapsed).equals('false');
                });
            });

            describe('when an accordion section is expanded', () => {
                it('collapses the accordion item', () => {
                    collapseAll();

                    /** @type {HTMLElement} */
                    const sectionEl = containerEl.querySelector('[data-collapsed][data-id="1"]');
                    sectionEl.dataset.collapsed = 'false';

                    toggleAccordion(containerEl, getMockClickEvent(targetEl));
                    assert(sectionEl.dataset.collapsed).equals('true');
                });
            });

            describe('when another accordion section is expanded', () => {
                it('collapses all accordion items', () => {
                    collapseAll();

                    /** @type {HTMLElement} */
                    const accordionEl = containerEl.querySelector('[data-collapsed][data-id="2"]');
                    accordionEl.dataset.collapsed = 'false';

                    toggleAccordion(containerEl, getMockClickEvent(targetEl));
                    assert(accordionEl.dataset.collapsed).equals('true');
                });
            });

            describe('given an event with no click target' , () => {
                it('throws', () => {
                    const e = getMockClickEvent(document.createElement('button'));
                    assert(() => toggleAccordion(containerEl, e)).throws('Missing target for accordion toggle');
                });
            });

            describe('given an event with an invalid accordion section target' , () => {
                it('throws', () => {
                    const button = document.createElement('button');

                    button.dataset.action = 'accordion';
                    button.dataset.target = 'nope';

                    assert(() => toggleAccordion(containerEl, getMockClickEvent(button)))
                        .throws('Invalid accordion section target "nope"');
                });
            });
        });
    });

    describe('toggleVisibility()', () => {
        const targetId    = 'elf';
        const containerEl = document.createElement('div');
        const paragraphEl = document.createElement('p');

        paragraphEl.dataset.id = targetId;
        paragraphEl.hidden     = false;

        containerEl.appendChild(paragraphEl);

        describe('given an event with a valid target', () => {
            const button = document.createElement('button');

            button.dataset.target = targetId;

            describe('when the child is not hidden', () => {
                it('hides the element', () => {
                    paragraphEl.hidden = false;

                    toggleVisibility(containerEl, getMockClickEvent(button));
                    assert(paragraphEl.hidden).isTrue();
                });
            });

            describe('when the child is hidden', () => {
                it('hides the element', () => {
                    paragraphEl.hidden = true;

                    toggleVisibility(containerEl, getMockClickEvent(button));
                    assert(paragraphEl.hidden).isFalse();
                });
            });
        });

        describe('given an event with no target', () => {
            it('throws', () => {
                const button = document.createElement('button');

                assert(() => toggleVisibility(containerEl, getMockClickEvent(button)))
                    .throws('Missing target for visibility toggle');
            });
        });

        describe('given an event with an invalid target', () => {
            it('throws', () => {
                const button = document.createElement('button');

                button.dataset.target = 'frodo';

                assert(() => toggleVisibility(containerEl, getMockClickEvent(button)))
                    .throws('Invalid visibility toggle target "frodo"');
            });
        });
    });

    // -- Public Functions -----------------------------------------------------

    describe('attachClickDelegate()', () => {
        describe('when a child element is clicked', () => {
            const containerEl = document.createElement('div');
            const buttonEl1   = document.createElement('button');
            const buttonEl2   = document.createElement('button');
            const buttonEl3   = document.createElement('button');

            buttonEl1.dataset.action  = 'generate';
            buttonEl3.dataset.action = 'invalid-action';

            containerEl.appendChild(buttonEl1);
            containerEl.appendChild(buttonEl2);
            containerEl.appendChild(buttonEl3);

            const events = [];

            const trigger = (e) => events.push(e);
            const triggers = {
                accordion: trigger,
                generate : trigger,
                navigate : trigger,
                toggle   : trigger,
            };

            attachClickDelegate(containerEl, triggers);

            describe('when the clicked element has a valid `data-action` attribute', () => {
                buttonEl1.dispatchEvent(new CustomEvent('click', { bubbles: true }));
                const event = events.pop();

                it('triggers the click delegate and calls the action', () => {
                    assert(Boolean(event)).isTrue();
                });

                it('calls the action with a click event object param', () => {
                    assert(event).isObject();
                    event && assert(event.type).equals('click');
                });
            });

            describe('when the click target has no action', () => {
                it('no actions are called', () => {
                    buttonEl2.dispatchEvent(new CustomEvent('click', { bubbles: true }));
                    assert(events.length).equals(0);
                });
            });
        });
    });

    describe('getTriggers()', () => {
        const bodyEl    = document.createElement('div');
        const contentEl = document.createElement('div');
        const knobsEl   = document.createElement('form');
        const navEl     = document.createElement('nav');

        contentEl.innerHTML = 'Fake homepage content';
        knobsEl.innerHTML  = knobHTML;
        navEl.innerHTML    = navHTML;

        bodyEl.appendChild(navEl);
        bodyEl.appendChild(knobsEl);
        bodyEl.appendChild(contentEl);

        const sections = { body: bodyEl, content: contentEl, knobs: knobsEl, nav: navEl };
        const triggers = getTriggers(sections, contentEl.innerHTML);

        it('returns an object containing all application triggers', () => {
            assert(triggers.accordion).isFunction();
            assert(triggers.generate).isFunction();
            assert(triggers.navigate).isFunction();
            assert(triggers.toggle).isFunction();
        });

        describe('accordion', () => {
            it('toggles an accordion', () => {
                /** @type {HTMLElement} */
                const accordionButtonEl = knobsEl.querySelector('[data-target="fieldset-item-settings"]');

                /** @type {HTMLElement} */
                const fieldsetEl = knobsEl.querySelector('[data-id="fieldset-item-settings"]');

                triggers.accordion(getMockClickEvent(accordionButtonEl));

                assert(fieldsetEl.dataset.collapsed).equals('false');
            });
        });

        describe('generate', () => {
            it('updates the content', () => {
                /** @type {HTMLElement} */
                const generateButtonEl = knobsEl.querySelector('[data-action="generate"]');

                triggers.generate(getMockClickEvent(generateButtonEl));

                assert(/<h3>Items \([0-9]+\)<\/h3>/.test(contentEl.innerHTML)).isTrue();
                assert(/<ul(.+?)>(.+?)<\/ul>/.test(contentEl.innerHTML)).isTrue();
            });
        });

        describe('navigate', () => {
            it('updates the content', () => {
                /** @type {HTMLElement} */
                const roomsButtonEl = knobsEl.querySelector('[data-action="navigate"][data-target="rooms"]');

                triggers.navigate(getMockClickEvent(roomsButtonEl));

                assert(contentEl.innerHTML).equals('Fake homepage content');
            });
        });

        describe('toggle', () => {
            it('updates the target\'s visibility', () => {
                /** @type {HTMLElement} */
                const toggleButtonEl = knobsEl.querySelector('[data-action="toggle"][data-target="info-itemQuantity"]');

                /** @type {HTMLElement} */
                const infoEl = knobsEl.querySelector('[data-id="info-itemQuantity"]');

                assert(infoEl.hidden).isTrue();

                triggers.toggle(getMockClickEvent(toggleButtonEl));

                assert(infoEl.hidden).isFalse();
            });
        });
    });
};
