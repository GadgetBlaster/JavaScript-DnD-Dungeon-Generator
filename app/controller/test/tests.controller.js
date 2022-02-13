// @ts-check

import {
    // Private Functions
    testGetDataset       as getDataset,
    testGetTrigger       as getTrigger,
    testOnNavigate       as onNavigate,
    testToggleAccordion  as toggleAccordion,
    testToggleVisibility as toggleVisibility,

    // Public Functions
    attachClickDelegate,
    getTriggers,
} from '../controller.js';

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

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {

    // -- Private Functions ----------------------------------------------------

    describe('getDataset()', () => {
        describe('given an HTML element target', () => {
            it('should return the elements data attributes', () => {
                const div = document.createElement('div');

                div.dataset.type = 'blackKnight';

                assert(getDataset(div)).equalsObject({ type: 'blackKnight' });
            });
        });

        describe('given a target that is not an HTML element', () => {
            it('should return an empty object', () => {
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
            it('should update the content, knobs, and nav', () => {
                const contentEl = document.createElement('div');
                const knobsEl   = document.createElement('form');

                const dungeonButton = document.createElement('button');
                dungeonButton.dataset.target = 'dungeon';
                dungeonButton.dataset.active = 'true';

                const roomsButton = document.createElement('button');
                roomsButton.dataset.target = 'rooms';

                const navEl = document.createElement('div');
                navEl.appendChild(dungeonButton);
                navEl.appendChild(roomsButton);

                const sections = {
                    content: contentEl,
                    knobs  : knobsEl,
                    nav    : navEl,
                };

                onNavigate(sections, 'Fake home content', getMockClickEvent(roomsButton));

                assert(contentEl.innerHTML).equals('Fake home content');
                assert(knobsEl.innerHTML).stringIncludes('Generate');

                assert(navEl.querySelector('[data-active="true"]').attributes['data-target'].value)
                    .equals('rooms');

                assert(navEl.querySelector('[data-target="dungeon"]').attributes['data-active'])
                    .isUndefined();
            });
        });
    });

    describe('toggleAccordion()', () => {
        describe('when there are 3 accordion sections', () => {
            const count     = 3;
            const container = document.createElement('div');

            for (let i = 0; i < count; i++) {
                const fieldset = document.createElement('div');
                const button   = document.createElement('button');

                fieldset.dataset.collapsed = 'true';
                fieldset.dataset.id = i.toString();

                button.dataset.action = 'accordion';
                button.dataset.target = i.toString();

                fieldset.appendChild(button);
                container.appendChild(fieldset);
            }

            const each = ({ collapsed }) => {
                /** @type {NodeListOf<HTMLElement>} sectionEls */
                const sectionEls = container.querySelectorAll('[data-collapsed]');

                sectionEls.forEach((sectionEl) => {
                    sectionEl.dataset.collapsed = collapsed;
                });
            };

            const collapseAll = () => each({ collapsed: true });

            /** @type {HTMLElement} targetEl */
            const targetEl = container.querySelector('[data-action="accordion"][data-target="1"]');

            describe('when an accordion section is collapsed', () => {
                it('should expand that accordion item', () => {
                    collapseAll();

                    /** @type {HTMLElement} sectionEl */
                    const sectionEl = container.querySelector('[data-collapsed][data-id="1"]');

                    toggleAccordion(container, getMockClickEvent(targetEl));
                    assert(sectionEl.dataset.collapsed).equals('false');
                });
            });

            describe('when an accordion section is expanded', () => {
                it('should collapse that accordion item', () => {
                    collapseAll();

                    /** @type {HTMLElement} sectionEl */
                    const sectionEl = container.querySelector('[data-collapsed][data-id="1"]');
                    sectionEl.dataset.collapsed = 'false';

                    toggleAccordion(container, getMockClickEvent(targetEl));
                    assert(sectionEl.dataset.collapsed).equals('true');
                });
            });

            describe('when another accordion section is expanded', () => {
                it('should collapse all accordion items', () => {
                    collapseAll();

                    /** @type {HTMLElement} sectionEle */
                    const sectionEle = container.querySelector('[data-collapsed][data-id="2"]');
                    sectionEle.dataset.collapsed = 'false';

                    toggleAccordion(container, getMockClickEvent(targetEl));
                    assert(sectionEle.dataset.collapsed).equals('true');
                });
            });

            describe('given an event with no click target' , () => {
                it('should throw', () => {
                    const e = getMockClickEvent(document.createElement('button'));
                    assert(() => toggleAccordion(container, e)).throws('Missing target for accordion toggle');
                });
            });

            describe('given an event with an invalid accordion section target' , () => {
                it('should throw', () => {
                    const button = document.createElement('button');

                    button.dataset.action = 'accordion';
                    button.dataset.target = 'nope';

                    assert(() => toggleAccordion(container, getMockClickEvent(button)))
                        .throws('Invalid accordion section target "nope"');
                });
            });
        });
    });

    describe('toggleVisibility()', () => {
        const targetId  = 'elf';
        const container = document.createElement('div');
        const paragraph = document.createElement('p');

        paragraph.dataset.id = targetId;
        paragraph.hidden     = false;

        container.appendChild(paragraph);

        describe('given an event with a valid target', () => {
            const button = document.createElement('button');

            button.dataset.target = targetId;

            describe('when the child is not hidden', () => {
                it('should hide the element', () => {
                    paragraph.hidden = false;

                    toggleVisibility(container, getMockClickEvent(button));
                    assert(paragraph.hidden).isTrue();
                });
            });

            describe('when the child is hidden', () => {
                it('should hide the element', () => {
                    paragraph.hidden = true;

                    toggleVisibility(container, getMockClickEvent(button));
                    assert(paragraph.hidden).isFalse();
                });
            });
        });

        describe('given an event with no target', () => {
            it('should throw', () => {
                const button = document.createElement('button');

                assert(() => toggleVisibility(container, getMockClickEvent(button)))
                    .throws('Missing target for visibility toggle');
            });
        });

        describe('given an event with an invalid target', () => {
            it('should throw', () => {
                const button = document.createElement('button');

                button.dataset.target = 'frodo';

                assert(() => toggleVisibility(container, getMockClickEvent(button)))
                    .throws('Invalid visibility toggle target "frodo"');
            });
        });
    });

    // -- Public Functions -----------------------------------------------------

    describe('attachClickDelegate()', () => {
        describe('when a child element is clicked', () => {
            const container = document.createElement('div');
            const button    = document.createElement('button');
            const button2   = document.createElement('button');
            const button3   = document.createElement('button');

            button.dataset.action  = 'generate';
            button3.dataset.action = 'invalid-action';

            container.appendChild(button);
            container.appendChild(button2);
            container.appendChild(button3);

            const events = [];

            const trigger = (e) => events.push(e);
            const triggers = {
                accordion: trigger,
                generate : trigger,
                navigate : trigger,
                toggle   : trigger,
            };

            attachClickDelegate(container, triggers);

            describe('when the clicked element has a valid `data-action` attribute', () => {
                button.dispatchEvent(new CustomEvent('click', { bubbles: true }));
                const event = events.pop();

                it('should trigger the click delegate and call the action', () => {
                    assert(Boolean(event)).isTrue();
                });

                it('should call the action with a click event object param', () => {
                    assert(event).isObject();
                    event && assert(event.type).equals('click');
                });
            });

            describe('when the click target has no action', () => {
                it('should not call any actions', () => {
                    button2.dispatchEvent(new CustomEvent('click', { bubbles: true }));
                    assert(events.length).equals(0);
                });
            });
        });
    });

    describe('getTriggers()', () => {
        it('should return an object containing all application triggers', () => {
            const fakeEl   = document.createElement('div');
            const sections = {
                body   : fakeEl,
                content: fakeEl,
                knobs  : fakeEl,
                nav    : fakeEl,
            };

            const triggers = getTriggers(sections, '');

            assert(triggers.accordion).isFunction();
            assert(triggers.generate).isFunction();
            assert(triggers.navigate).isFunction();
            assert(triggers.toggle).isFunction();
        });
    });
};
