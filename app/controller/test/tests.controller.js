// @ts-check

import { getKnobPanel } from '../../ui/form.js';
import { getNav } from '../../ui/nav.js';
import { parseHtml, parseSvg } from '../../utility/element.js';
import {
    // Config
    generators,
    testGetGenerator as getGenerator,

    // Private Functions
    testGetErrorPageContent as getErrorPageContent,
    testGetReadyState       as getReadyState,
    testGetTargetControl    as getTargetControl,
    testGetTargetDataset    as getTargetDataset,
    testGetTrigger          as getTrigger,
    testIsSidebarExpanded   as isSidebarExpanded,
    testOnGenerate          as onGenerate,
    testOnNavigate          as onNavigate,
    testRenderApp           as renderApp,
    testRenderErrorPage     as renderErrorPage,
    testToggleAccordion     as toggleAccordion,
    testToggleExpand        as toggleExpand,
    testToggleVisibility    as toggleVisibility,

    // Public Functions
    attachEventDelegates,
    getActiveGenerator,
    getRender,
    getTriggers,
} from '../controller.js';

/** @typedef {import('../controller.js').Sections} Sections */
/** @typedef {import('../controller.js').Trigger} Trigger */
/** @typedef {import('../controller.js').Triggers} Triggers */
/** @typedef {import('../knobs.js').ItemConfig} ItemConfig */
/** @typedef {import('../knobs.js').RoomConfig} RoomConfig */

/**
 * Returns a mocked event with click target.
 *
 * @param {HTMLElement} targetEl
 *
 * @returns {Event}
 */
const getMockClickEvent = (targetEl) => ({
    ...new CustomEvent('click', { bubbles: true }),
    target: targetEl,
});

const knobHTML = getKnobPanel('items');
const navHTML  = getNav('items');

/**
 * Returns a mock sections object.
 *
 * @returns {Sections} */
function getMockSections() {
    const body    = document.createElement('div');
    const content = document.createElement('div');
    const footer  = document.createElement('footer');
    const knobs   = document.createElement('form');
    const nav     = document.createElement('nav');

    body.appendChild(content);
    body.appendChild(footer);
    body.appendChild(knobs);
    body.appendChild(nav);

    body.dataset.layout = 'default';

    knobs.innerHTML = knobHTML;
    nav.innerHTML   = navHTML;

    return {
        body,
        content,
        footer,
        knobs,
        nav,
    };
}

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {

    // -- Private Functions ----------------------------------------------------

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
                const body       = parseHtml(dungeonGen({
                    ...itemSettings,
                    ...roomSettingsBase,
                    dungeonComplexity : 2,
                    dungeonConnections: 0,
                    dungeonMaps       : 0,
                    dungeonTraps      : 0,
                }));

                assert(Boolean(body.querySelector('svg'))).isTrue();
                assert(body.querySelector('h2')).hasTextContent('Room 1');
            });
        });

        describe('item generator', () => {
            it('returns generated items', () => {
                const itemGen = getGenerator('items');
                const body    = parseHtml(itemGen(itemSettings));

                const title = body.querySelector('h2');
                const list  = body.querySelector('ul');

                assert(title).hasTextContent('Items');
                title && assert(title.querySelector('span[data-detail]'))
                    .hasTextContent('1');

                assert(list).isElementTag('ul');
                list && assert(list.querySelectorAll('li').length).equals(1);
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

                assert(title).hasTextContent('Room');
                assert(subtitles[0]).hasTextContent('Description');
                assert(subtitles[1]).hasTextContent('Items');
                assert(subtitles[1].querySelector('span[data-detail]'))
                    .hasTextContent('1');

                assert(list).isElementTag('ul');
                list && assert(list.querySelectorAll('li').length).equals(1);
            });
        });

        // TODO
        // describe('name generator', () => {

        // });
    });

    describe('getErrorPageContent()', () => {
        it('returns an error object', () => {
            const content = getErrorPageContent();

            assert(content).isObject();
            assert(content.title).equals('Oh no!');
            assert(content.messages).isArray();
            content.messages.forEach((message) => { assert(message).isString(); });
        });

        describe('given a 404 page', () => {
            it('returns a 404 error', () => {
                const content = getErrorPageContent(404);

                assert(content).isObject();
                assert(content.title).stringIncludes('404');
                assert(content.messages).isArray();
                content.messages.forEach((message) => { assert(message).isString(); });
            });
        });
    });

    describe('getReadyState()', () => {
        generators.forEach((generator) => {
            describe(`given a generator of "${generator}"`, () => {
                it('returns an object containing a title and icon', () => {
                    const result = getReadyState(generator);

                    assert(result).isObject();
                    assert(result.title).isString();

                    const icon = parseSvg(result.icon);

                    assert(icon.children.length).equals(1);
                    assert(icon.children.item(0)).isElementTag('svg');
                });
            });
        });

        describe('given an invalid generator', () => {
            it('throws', () => {
                // @ts-expect-error
                assert(() => getReadyState('Alwrong the Goblin!'))
                    .throws('Invalid generator "Alwrong the Goblin!" in getReadyState()');
            });
        });
    });

    describe('getTargetControl()', () => {
        describe('given an input element event target', () => {
            it('returns the element', () => {
                const input   = document.createElement('input');
                const element = getTargetControl(getMockClickEvent(input).target);

                assert(element).isElementTag('input');
            });
        });

        describe('given a select element event target', () => {
            it('returns the element', () => {
                const input   = document.createElement('select');
                const element = getTargetControl(getMockClickEvent(input).target);

                assert(element).isElementTag('select');
            });
        });

        describe('given an event target which is not a control element', () => {
            it('returns null', () => {
                const input  = document.createElement('div');
                const result = getTargetControl(getMockClickEvent(input).target);

                assert(result).isNull();
            });
        });
    });

    describe('getTargetDataset()', () => {
        describe('given an HTML element target', () => {
            it('returns the element\'s data attributes', () => {
                const divEl = document.createElement('div');

                divEl.dataset.type = 'blackKnight';

                assert(getTargetDataset(divEl)).equalsObject({ type: 'blackKnight' });
            });
        });

        describe('given a target that is not an HTML element', () => {
            it('returns an empty object', () => {
                assert(getTargetDataset(null)).equalsObject({});
            });
        });
    });

    describe('getTrigger()', () => {
        describe('given an action that does not exist on the given triggers', () => {
            it('throws', () => {
                // @ts-expect-error
                assert(() => getTrigger({}, 'bellyFlop'))
                    .throws('Invalid action "bellyFlop" passed to getTrigger()');
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
                    assert(trigger({})).equals(expectation);
                });
            });
        });
    });

    describe('isSidebarExpanded()', () => {
        const body = document.createElement('div');

        describe('when the sidebar is not expanded()', () => {
            it('returns true', () => {
                body.dataset.layout = 'default';
                assert(isSidebarExpanded(body)).isFalse();
            });
        });

        describe('when the sidebar is expanded()', () => {
            it('returns true', () => {
                body.dataset.layout = 'sidebar-expanded';
                assert(isSidebarExpanded(body)).isTrue();
            });
        });
    });

    describe('onGenerate()', () => {
        const sections = getMockSections();
        const { body, content } = sections;

        it('generates content for the current route', () => {
            onGenerate(sections, () => '/items');

            const title = content.querySelector('h2');

            assert(Boolean(content.querySelector('article'))).isTrue();
            assert(title).hasTextContent('Items');
        });

        describe('when the active page is not a generator', () => {
            it('renders an error page', () => {
                onGenerate(sections, () => '/nothing-to-see-here');

                const title = content.querySelector('h2');

                assert(title).hasTextContent('Oh no!');
            });
        });

        describe('when the sidebar is expanded', () => {
            it('closes the sidebar', () => {
                body.dataset.layout = 'sidebar-expanded';

                onGenerate(sections, () => '/items');

                assert(body).hasAttributes({ 'data-layout': 'default' });
            });
        });
    });

    describe('onNavigate()', () => {
        describe('given an event with the target generator of "rooms"', () => {
            it('updates the content, knobs, and nav elements and calls updatePath() with the new route', () => {
                const sections = getMockSections();
                const { content, knobs, nav } = sections;

                /** @type {HTMLElement | null} */
                const dungeonButton = nav.querySelector('[data-target="dungeon"]');

                /** @type {HTMLElement | null} */
                const roomsButton = nav.querySelector('[data-target="rooms"]');

                assert(Boolean(dungeonButton)).isTrue();
                assert(Boolean(roomsButton)).isTrue();

                let updatePathValue;

                roomsButton && onNavigate(sections, getMockClickEvent(roomsButton), (route) => {
                    updatePathValue = route;
                });

                // Sections
                assert(content).hasTextContent('Generate Room');
                assert(knobs).hasTextContent('Generate');

                // Nav
                roomsButton && assert(roomsButton.dataset.active).equals('');
                dungeonButton && assert(dungeonButton.dataset.active).isUndefined();

                // Router
                assert(updatePathValue).equals('/rooms');
            });
        });
    });

    describe('renderApp()', () => {
        const sections = getMockSections();
        const { body, content, knobs, nav } = sections;

        it('updates the content, knobs, and nav elements', () => {
            /** @type {HTMLElement | null} */
            const dungeonButton = nav.querySelector('[data-target="dungeon"]');

            assert(Boolean(dungeonButton)).isTrue();

            renderApp(sections, 'dungeon');

            assert(content).hasTextContent('Generate Dungeon');
            assert(knobs).hasTextContent('Generate');
            dungeonButton && assert(dungeonButton.dataset.active).equals('');
        });

        describe('when the layout is full', () => {
            it('updates the layout to "default"', () => {
                const bodyEl = document.createElement('div');
                bodyEl.dataset.layout = 'full';

                renderApp({ ...sections, body: bodyEl }, 'items');

                assert(bodyEl).hasAttributes({ 'data-layout': 'default' });
            });
        });

        describe('when the sidebar is expanded', () => {
            it('persists the expanded sidebar', () => {
                const bodyEl = document.createElement('div');
                bodyEl.dataset.layout = 'sidebar-expanded';

                renderApp({ ...sections, body: bodyEl }, 'items');

                assert(bodyEl).hasAttributes({ 'data-layout': 'sidebar-expanded' });
                assert(Boolean(knobs.querySelector('div[data-grid="1"]'))).isTrue();
            });
        });

        describe('when the page is undefined', () => {
            it('renders a 404 message in a full layout', () => {
                // @ts-expect-error
                renderApp(sections);
                assert(body).hasAttributes({ 'data-layout': 'full' });
                assert(content.querySelector('h2')).hasTextContent('404');
            });
        });
    });

    describe('renderErrorPage()', () => {
        const sections = getMockSections();
        const { body, content } = sections;

        it('renders an error message in a full layout', () => {
            renderErrorPage(sections);

            assert(body).hasAttributes({ 'data-layout': 'full' });
            assert(content.querySelector('h2')).hasTextContent('Oh no!');
        });

        describe('given a 404 status code', () => {
            it('renders a 404 message', () => {
                renderErrorPage(sections, 404);

                assert(content.querySelector('h2')).hasTextContent('404');
            });
        });
    });

    describe('toggleAccordion()', () => {
        describe('with 3 accordion sections', () => {
            const count       = 3;
            const containerEl = document.createElement('div');

            for (let i = 0; i < count; i++) {
                const fieldsetEl = document.createElement('div');
                const buttonEl   = document.createElement('button');

                fieldsetEl.dataset.accordion = 'collapsed';
                fieldsetEl.dataset.id = i.toString();

                buttonEl.dataset.action = 'accordion';
                buttonEl.dataset.target = i.toString();

                fieldsetEl.appendChild(buttonEl);
                containerEl.appendChild(fieldsetEl);
            }

            const each = ({ collapsed }) => {
                /** @type {NodeListOf<HTMLElement>} */
                const sectionEls = containerEl.querySelectorAll('[data-accordion]');

                sectionEls.forEach((sectionEl) => {
                    sectionEl.dataset.accordion = collapsed ? 'collapsed' : 'expanded';
                });
            };

            const collapseAll = () => each({ collapsed: true });

            /** @type {HTMLElement | null} */
            const targetEl = containerEl.querySelector('[data-action="accordion"][data-target="1"]');

            describe('the mock target', () => {
                it('is defined', () => {
                    assert(Boolean(targetEl)).isTrue();
                });
            });

            describe('when an accordion section is collapsed', () => {
                it('expands the accordion item', () => {
                    collapseAll();

                    /** @type {HTMLElement | null} */
                    const sectionEl = containerEl.querySelector('[data-accordion][data-id="1"]');

                    assert(Boolean(sectionEl)).isTrue();

                    targetEl && toggleAccordion(containerEl, getMockClickEvent(targetEl));
                    sectionEl && assert(sectionEl.dataset.accordion).equals('expanded');
                });
            });

            describe('when an accordion section is expanded', () => {
                it('collapses the accordion item', () => {
                    collapseAll();

                    /** @type {HTMLElement | null} */
                    const sectionEl = containerEl.querySelector('[data-accordion][data-id="1"]');
                    assert(Boolean(sectionEl)).isTrue();

                    if (sectionEl) {
                        sectionEl.dataset.accordion = 'expanded';
                    }

                    targetEl && toggleAccordion(containerEl, getMockClickEvent(targetEl));
                    sectionEl && assert(sectionEl.dataset.accordion).equals('collapsed');
                });
            });

            describe('when another accordion section is expanded', () => {
                it('collapses all accordion items', () => {
                    collapseAll();

                    /** @type {HTMLElement | null} */
                    const accordionEl = containerEl.querySelector('[data-accordion][data-id="2"]');
                    assert(Boolean(accordionEl)).isTrue();

                    if (accordionEl) {
                        accordionEl.dataset.accordion = 'expanded';
                    }

                    targetEl && toggleAccordion(containerEl, getMockClickEvent(targetEl));
                    accordionEl && assert(accordionEl.dataset.accordion).equals('collapsed');
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

    describe('toggleExpand()', () => {
        const sections = getMockSections();
        const { body, content, knobs } = sections;

        describe('when the sidebar is not expanded', () => {
            it('expands the sidebar', () => {
                assert(body).hasAttributes({ 'data-layout': 'default' });
                assert(Boolean(knobs.querySelector('div[data-grid]'))).isFalse();

                toggleExpand(sections, () => '/items');

                assert(body).hasAttributes({ 'data-layout': 'sidebar-expanded' });
                assert(Boolean(knobs.querySelector('div[data-grid]'))).isTrue();
            });
        });

        describe('when the sidebar is expanded', () => {
            it('collapses the sidebar', () => {
                assert(body).hasAttributes({ 'data-layout': 'sidebar-expanded' });
                assert(Boolean(knobs.querySelector('div[data-grid]'))).isTrue();

                toggleExpand(sections, () => '/items');

                assert(body).hasAttributes({ 'data-layout': 'default' });
                assert(Boolean(knobs.querySelector('div[data-grid]'))).isFalse();
            });
        });

        describe('when the active page is not a generator', () => {
            it('renders an error page', () => {
                toggleExpand(sections, () => '/nothing-to-see-here');

                const title = content.querySelector('h2');

                assert(Boolean(title)).isTrue();
                title && assert(title).hasTextContent('Oh no!');
            });
        });
    });

    describe('toggleVisibility()', () => {
        const targetId    = 'elf';
        const containerEl = document.createElement('div');
        const paragraphEl = document.createElement('p');

        paragraphEl.id     = targetId;
        paragraphEl.hidden = false;

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

    describe('attachEventDelegates()', () => {
        describe('when a child element is clicked', () => {
            const sections = getMockSections();

            const button1 = document.createElement('button');
            const button2 = document.createElement('button');
            const button3 = document.createElement('button');
            const button4 = document.createElement('button');

            button1.dataset.action = 'generate';
            button3.dataset.action = 'invalid-action';
            button4.dataset.action = 'navigate';

            sections.body.appendChild(button1);
            sections.body.appendChild(button2);
            sections.body.appendChild(button3);
            sections.body.appendChild(button4);

            const events = [];

            const trigger = (e) => events.push(e);

            const triggers = {
                accordion: trigger,
                expand   : trigger,
                generate : trigger,
                navigate : () => { throw new Error('Fake!'); },
                toggle   : trigger,
            };

            let errorResult;

            attachEventDelegates(sections, triggers, (error) => errorResult = error);

            describe('when the clicked element has a valid data-action attribute', () => {
                button1.dispatchEvent(new CustomEvent('click', { bubbles: true }));
                const event = events.pop();

                it('triggers the click delegate and calls the action', () => {
                    assert(Boolean(event)).isTrue();
                });

                it('calls the action with a click event object param', () => {
                    assert(event).isObject();
                    assert(event.type).equals('click');
                });
            });

            describe('when the click target has no action', () => {
                it('no actions are called', () => {
                    button2.dispatchEvent(new CustomEvent('click', { bubbles: true }));
                    assert(events.length).equals(0);
                });
            });

            describe('when the click target has an invalid action', () => {
                it('no actions are called', () => {
                    button3.dispatchEvent(new CustomEvent('click', { bubbles: true }));
                    assert(events.length).equals(0);
                });
            });

            describe('when an error is thrown', () => {
                it('renders an error page and calls the onError callback', () => {
                    button4.dispatchEvent(new CustomEvent('click', { bubbles: true }));

                    assert(sections.body).hasTextContent('Oh no!');
                    assert(errorResult.toString()).stringIncludes('Error: Fake!');
                });
            });
        });
    });

    describe('getActiveGenerator()', () => {
        it('returns the active generated based on the route', () => {
            assert(getActiveGenerator('/rooms')).equals('rooms');
        });

        describe('given an invalid route', () => {
            it('returns undefined', () => {
                assert(getActiveGenerator('/cowboys')).isUndefined();
            });
        });
    });

    describe('getRender()', () => {
        const sections = getMockSections();
        const { content, knobs } = sections;

        let errorResult;

        const render = getRender(sections, (error) => errorResult = error);

        it('returns a render function bound to the given sections', () => {
            render('items');

            assert(content).hasTextContent('Generate Items');
            assert(Boolean(knobs.querySelector('button[data-action="generate"]'))).isTrue();
        });

        describe('when an error is thrown', () => {
            it('renders an error page and calls the onError callback', () => {
                // @ts-expect-error
                render('bubbling cauldron oil');

                assert(sections.body).hasTextContent('Oh no!');
                assert(errorResult.toString()).stringIncludes('Invalid generator "bubbling cauldron oil"');
            });
        });
    });

    describe('getTriggers()', () => {
        const sections = getMockSections();
        const { body, content, knobs, nav } = sections;

        let updatePathValue;

        const updatePath = (path) => { updatePathValue = path; };
        const getPathname = () => '/items';

        const triggers = getTriggers(sections, updatePath, getPathname);

        it('returns an object containing all application triggers', () => {
            assert(triggers.accordion).isFunction();
            assert(triggers.generate).isFunction();
            assert(triggers.navigate).isFunction();
            assert(triggers.toggle).isFunction();
        });

        describe('accordion', () => {
            it('toggles an accordion', () => {
                /** @type {HTMLElement | null} */
                const accordionButtonEl = knobs.querySelector('[data-target="fieldset-item-settings"]');

                /** @type {HTMLElement | null} */
                const fieldsetEl = knobs.querySelector('[data-id="fieldset-item-settings"]');

                assert(Boolean(accordionButtonEl)).isTrue();
                assert(Boolean(fieldsetEl)).isTrue();

                const wasCollapsed = fieldsetEl && fieldsetEl.dataset.accordion === 'collapsed';

                accordionButtonEl && triggers.accordion(getMockClickEvent(accordionButtonEl));

                fieldsetEl && assert(fieldsetEl.dataset.accordion).equals(wasCollapsed ? 'expanded' : 'collapsed');
            });
        });

        describe('expand', () => {
            it('toggles the layout state', () => {
                assert(body).hasAttributes({ 'data-layout': 'default' });

                triggers.expand({});

                assert(body).hasAttributes({ 'data-layout': 'sidebar-expanded' });
            });
        });

        describe('generate', () => {
            it('updates the content for the current route', () => {
                /** @type {HTMLElement | null} */
                const generateButtonEl = knobs.querySelector('[data-action="generate"]');

                generateButtonEl && triggers.generate(getMockClickEvent(generateButtonEl));

                const title = content.querySelector('h2');

                assert(Boolean(generateButtonEl)).isTrue();

                assert(Boolean(content.querySelector('article'))).isTrue();
                assert(Boolean(title)).isTrue();
                title && assert(title).hasTextContent('Items');
            });
        });

        describe('navigate', () => {
            it('updates the content to the generator\'s ready state', () => {
                /** @type {HTMLElement | null} */
                const roomsButtonEl = nav.querySelector('[data-action="navigate"][data-target="rooms"]');

                assert(Boolean(roomsButtonEl)).isTrue();
                assert(content).hasTextContent('Items');

                roomsButtonEl && triggers.navigate(getMockClickEvent(roomsButtonEl));

                assert(content).hasTextContent('Generate Rooms');
            });

            it('calls updatePath() with the new pathname', () => {
                /** @type {HTMLElement | null} */
                const roomsButtonEl = nav.querySelector('[data-action="navigate"][data-target="rooms"]');

                assert(Boolean(roomsButtonEl)).isTrue();

                roomsButtonEl && triggers.navigate(getMockClickEvent(roomsButtonEl));

                assert(updatePathValue).equals('/rooms');
            });
        });

        describe('toggle', () => {
            it('updates the target\'s visibility', () => {
                /** @type {HTMLElement | null} */
                const toggleButtonEl = knobs.querySelector('[data-action="toggle"][data-target="info-item-quantity"]');

                /** @type {HTMLElement | null} */
                const infoEl = knobs.querySelector('[id="info-item-quantity"]');

                assert(Boolean(toggleButtonEl)).isTrue();
                assert(Boolean(infoEl)).isTrue();

                infoEl && assert(infoEl.hidden).isTrue();

                toggleButtonEl && triggers.toggle(getMockClickEvent(toggleButtonEl));

                infoEl && assert(infoEl.hidden).isFalse();
            });
        });
    });
};
