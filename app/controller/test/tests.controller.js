// @ts-check

import { getKnobPanel } from '../../ui/form.js';
import { getNav } from '../../ui/nav.js';
import { parseHtml } from '../../utility/element.js';
import {
    // Config
    generators,
    testGetGenerator as getGenerator,

    // Private Functions
    testGetDataset       as getDataset,
    testGetTrigger       as getTrigger,
    testOnGenerate       as onGenerate,
    testOnNavigate       as onNavigate,
    testRenderApp        as renderApp,
    testToggleAccordion  as toggleAccordion,
    testToggleVisibility as toggleVisibility,

    // Public Functions
    attachClickDelegate,
    getTriggers,
} from '../controller.js';

/** @typedef {import('../controller.js').Triggers} Triggers */
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

    describe('getGenerator()', () => {
        /** @type {ItemConfig} itemSettings */
        const itemSettings = {
            itemCondition : 'average',
            itemQuantity  : 'one',
            itemRarity    : 'legendary',
            itemType      : 'random',
        };

        /** @type {RoomConfig} */
        const roomSettingsBase = {
            ...itemSettings,
            roomCondition         : 'average',
            roomCount             : 1,
            roomFurnitureQuantity : 'none',
            roomSize              : 'small',
            roomType              : 'room',
        };

        it('returns a function for each generator', () => {
            generators.forEach((generator) => {
                assert(getGenerator(generator)).isFunction();
            });
        });

        describe('given an invalid generator', () => {
            it('throws', () => {
                // @ts-expect-error
                assert(() => getGenerator('poop'))
                    .throws('Invalid generator "poop" in getGenerator()');
            });
        });

        describe('dungeon generator', () => {
            it('returns a generated dungeon', () => {
                const dungeonGen = getGenerator('dungeon');
                const result     = dungeonGen({
                    ...itemSettings,
                    ...roomSettingsBase,
                    dungeonComplexity : 2,
                    dungeonConnections: 0,
                    dungeonMaps       : 0,
                    dungeonTraps      : 0,
                });

                // TODO
                assert(/<svg(.+?)>(.+?)<\/svg>/.test(result)).isTrue();
            });
        });

        describe('item generator', () => {
            it('returns generated items', () => {
                const itemGen = getGenerator('items');
                const body    = parseHtml(itemGen(itemSettings));

                const title = body.querySelector('h2');
                const list  = body.querySelector('ul');

                assert(title.textContent).stringIncludes('Items');
                assert(title.querySelector('span[data-info="true"]').textContent)
                    .stringIncludes('1');

                assert(list.querySelectorAll('li').length).equals(1);
            });
        });

        describe('room generator', () => {
            it('returns generated rooms', () => {
                const roomGen = getGenerator('rooms');
                const body    = parseHtml(roomGen({
                    ...itemSettings,
                    ...roomSettingsBase,
                    roomCount : 1,
                }));

                const title     = body.querySelector('h2');
                const subtitles = body.querySelectorAll('h3');
                const list      = body.querySelector('ul');

                assert(title.textContent).equals('Room');
                assert(subtitles[0].textContent).stringIncludes('Description');
                assert(subtitles[1].textContent).stringIncludes('Items');
                assert(subtitles[1].querySelector('span[data-info="true"]').textContent)
                    .stringIncludes('1');

                assert(list.querySelectorAll('li').length).equals(1);
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
                    accordion: () => 'accordion action',
                    expand   : () => 'expand action',
                    generate : () => 'generate action',
                    navigate : () => 'navigate action',
                    toggle   : () => 'toggle action',
                };

                Object.entries(([ action, expectation ]) => {
                    const trigger = getTrigger(triggers, action);
                    assert(trigger()).equals(expectation);
                });
            });
        });
    });

    describe('onGenerate()', () => {
        // TODO flaky test, items can be zero
        // it('generates content', () => {
        //     const contentEl = document.createElement('div');

        //     const knobsEl = document.createElement('form');
        //     knobsEl.innerHTML = knobHTML;

        //     const navEl = document.createElement('nav');
        //     navEl.innerHTML = navHTML;

        //     onGenerate({
        //         content: contentEl,
        //         knobs  : knobsEl,
        //         nav    : navEl,
        //     });

        //     assert(/<h3>Items \([0-9]+\)<\/h3>/.test(contentEl.innerHTML)).isTrue();
        //     assert(/<ul(.+?)>(.+?)<\/ul>/.test(contentEl.innerHTML)).isTrue();
        // });
    });

    describe('onNavigate()', () => {
        describe('given an event with the target generator of "rooms"', () => {
            it('updates the content, knobs, and nav elements and calls updatePath() with the new route', () => {
                const bodyEl    = document.createElement('div');
                const contentEl = document.createElement('div');
                const knobsEl   = document.createElement('form');

                const navEl = document.createElement('nav');
                navEl.innerHTML = navHTML;

                /** @type {HTMLElement} */
                const dungeonButton = navEl.querySelector('[data-target="dungeon"]');

                /** @type {HTMLElement} */
                const roomsButton = navEl.querySelector('[data-target="rooms"]');

                const sections = {
                    body   : bodyEl,
                    content: contentEl,
                    knobs  : knobsEl,
                    nav    : navEl,
                };

                let updatePathValue;

                onNavigate(sections, getMockClickEvent(roomsButton), (route) => {
                    updatePathValue = route;
                });

                // Sections
                assert(contentEl.innerHTML).stringIncludes('Ready');
                assert(knobsEl.innerHTML).stringIncludes('Generate');

                // Nav
                assert(roomsButton.dataset.active).equals('true');
                assert(dungeonButton.dataset.active).isUndefined();

                // Router
                assert(updatePathValue).equals('/rooms');
            });
        });
    });

    describe('renderApp()', () => {
        const bodyEl    = document.createElement('div');
        const contentEl = document.createElement('div');
        const knobsEl   = document.createElement('form');

        const navEl = document.createElement('nav');
        navEl.innerHTML = navHTML;

        const sections = {
            body   : bodyEl,
            content: contentEl,
            knobs  : knobsEl,
            nav    : navEl,
        };

        it('updates the content, knobs, and nav elements', () => {
            /** @type {HTMLElement} */
            const dungeonButton = navEl.querySelector('[data-target="dungeon"]');

            renderApp(sections, 'dungeon');

            assert(contentEl.innerHTML).stringIncludes('Ready');
            assert(knobsEl.innerHTML).stringIncludes('Generate');
            assert(dungeonButton.dataset.active).equals('true');
        });

        describe('when the route 404s', () => {
            it('updates the content', () => {
                renderApp(sections, 404);
                assert(contentEl.innerHTML).stringIncludes('404');
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
                expand   : trigger,
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
        knobsEl.innerHTML   = knobHTML;
        navEl.innerHTML     = navHTML;

        bodyEl.appendChild(navEl);
        bodyEl.appendChild(knobsEl);
        bodyEl.appendChild(contentEl);

        const sections = { body: bodyEl, content: contentEl, knobs: knobsEl, nav: navEl };
        const triggers = getTriggers(sections, () => {}); // TODO test updatePath param

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
                const wasCollapsed = fieldsetEl.dataset.collapsed === 'true';

                triggers.accordion(getMockClickEvent(accordionButtonEl));

                assert(fieldsetEl.dataset.collapsed).equals(wasCollapsed ? 'false' : 'true');
            });
        });

        describe('generate', () => {
            // TODO flaky test, items can be zero
            // it('updates the content', () => {
            //     /** @type {HTMLElement} */
            //     const generateButtonEl = knobsEl.querySelector('[data-action="generate"]');

            //     triggers.generate(getMockClickEvent(generateButtonEl));

            //     assert(/<h3>Items \([0-9]+\)<\/h3>/.test(contentEl.innerHTML)).isTrue();
            //     assert(/<ul(.+?)>(.+?)<\/ul>/.test(contentEl.innerHTML)).isTrue();
            // });
        });

        describe('navigate', () => {
            it('updates the content', () => {
                /** @type {HTMLElement} */
                const roomsButtonEl = navEl.querySelector('[data-action="navigate"][data-target="rooms"]');

                triggers.navigate(getMockClickEvent(roomsButtonEl));

                assert(contentEl.innerHTML).equals('Ready!'); // TODO
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
