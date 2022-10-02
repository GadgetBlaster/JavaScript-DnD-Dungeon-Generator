// @ts-check

import { getKnobPanel } from '../../ui/form.js';
import { getNav } from '../../ui/nav.js';
import { getToolbar } from '../../ui/toolbar.js';
import { parseHtml, parseSvg } from '../../utility/element.js';
import {
    // Config
    generators,
    pages,
    testGenKeyRouteRegEx as genKeyRouteRegEx,

    // Private Functions
    testGetActiveRoute      as getActiveRoute,
    testGetErrorPageContent as getErrorPageContent,
    testGetGenerator        as getGenerator,
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
    getRender,
    getTriggers,
} from '../controller.js';

/** @typedef {import('../controller.js').Controller} Controller */
/** @typedef {import('../controller.js').Sections} Sections */
/** @typedef {import('../controller.js').State} State */
/** @typedef {import('../controller.js').Trigger} Trigger */
/** @typedef {import('../controller.js').Triggers} Triggers */
/** @typedef {import('../knobs.js').ItemConfig} ItemConfig */
/** @typedef {import('../knobs.js').RoomConfig} RoomConfig */

/**
 * Returns a mocked event with click target.
 *
 * @param {Element} targetEl
 *
 * @returns {Event}
 */
const getMockClickEvent = (targetEl) => ({
    ...new CustomEvent('click', { bubbles: true }),
    target: targetEl,
});

const knobHTML    = getKnobPanel('items');
const navHTML     = getNav('items');
const toolbarHTML = getToolbar('items');

/**
 * Returns a mock sections object.
 *
 * @returns {Sections}
 */
function getMockSections() {
    const body    = document.createElement('div');
    const content = document.createElement('div');
    const footer  = document.createElement('footer');
    const knobs   = document.createElement('form');
    const nav     = document.createElement('nav');
    const overlay = document.createElement('div');
    const toast   = document.createElement('div');
    const toolbar = document.createElement('menu');

    body.appendChild(content);
    body.appendChild(footer);
    body.appendChild(knobs);
    body.appendChild(nav);
    body.appendChild(overlay);
    body.appendChild(toast);
    body.appendChild(toolbar);

    body.dataset.layout = 'default';

    knobs.innerHTML   = knobHTML;
    nav.innerHTML     = navHTML;
    toolbar.innerHTML = toolbarHTML;

    return {
        body,
        content,
        footer,
        knobs,
        nav,
        overlay,
        toast,
        toolbar,
    };
}

/**
 * Returns a mock state object.
 *
 * @returns {State}
 */
function getMockState() {
    let state;

    return {
        get: () => state,
        set: (newState) => state = newState,
    };
}

/**
 * Returns a mock controller object.
 *
 * @param {Partial<Controller>} overrides
 */
function getMockController(overrides = {}) {
    let state = getMockState();

    return {
        getPathname: () => '/items',
        onError: () => {},
        request: () => {},
        sections: getMockSections(),
        state,
        updatePath: () => {},
        ...overrides,
    };
}

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {

    // -- Config ---------------------------------------------------------------

    describe('generators', () => {

    });

    describe('pages', () => {

    });

    describe('genKeyRouteRegEx', () => {
        describe('given a path to a generator with a valid key', () => {
            it('parses correct path parts', () => {
                Object.entries(generators).forEach(([ genRoute, generator ]) => {
                    let route = `${genRoute}/1234567891234`;
                    let parts = route.match(genKeyRouteRegEx);

                    assert(parts).isArray();
                    parts && assert(parts.length).equals(3);
                    parts && assert(parts[0]).equals(route);
                    parts && assert(parts[1]).equals(generator);
                    parts && assert(parts[2]).equals('1234567891234');
                });
            });
        });

        describe('given a path to a generator without a key', () => {
            it('returns null', () => {
                assert('/items'.match(genKeyRouteRegEx)).isNull();
            });
        });

        describe('given a path to a generator with an invalid key', () => {
            it('returns null', () => {
                [ '', '1234', '1234567&91234', '1234567-91234' ].forEach((invalidKey) => {
                    assert(`/items/${invalidKey}`.match(genKeyRouteRegEx)).isNull();
                });
            });
        });

        describe('given a path to an invalid generator with a valid key', () => {
            it('returns null', () => {
                assert('/nope/1234567891234'.match(genKeyRouteRegEx)).isNull();
            });
        });
    });

    // -- Private Functions ----------------------------------------------------

    describe('getActiveRoute()', () => {
        describe('when the path is a page', () => {
            it('returns the active page', () => {
                assert(getActiveRoute('/')).equalsObject({
                    page: 'home',
                });
            });
        });

        describe('when the path is a generator', () => {
            it('returns the active generator', () => {
                assert(getActiveRoute('/rooms')).equalsObject({
                    generator: 'rooms',
                });
            });
        });

        describe('when the path is a generator with a key', () => {
            describe('when the key is valid', () => {
                it('returns the active generator and the key', () => {
                    assert(getActiveRoute('/rooms/asd3uyt76k98n')).equalsObject({
                        generator: 'rooms',
                        key: 'asd3uyt76k98n',
                    });
                });
            });

            describe('when the key is invalid', () => {
                it('returns an empty object', () => {
                    assert(getActiveRoute('/rooms/123')).equalsObject({});
                });
            });
        });

        describe('when there is a trailing slash in the path', () => {
            it('returns an empty object', () => {
                [ '/rooms/', '/rooms/asd3uyt76k98n/' ].forEach((path) => {
                    assert(getActiveRoute(path)).equalsObject({});
                });
            });
        });

        describe('when the path is invalid', () => {
            it('returns an empty object', () => {
                assert(getActiveRoute('/cowboys')).equalsObject({});
            });
        });
    });

    describe('getGenerator()', () => {
        /** @type {ItemConfig} itemSettings */
        const itemConfig = {
            itemCondition: 'average',
            itemQuantity : 'one',
            itemRarity   : 'legendary',
            itemType     : 'random',
        };

        /** @type {RoomConfig} */
        const roomConfig = {
            roomCondition        : 'average',
            roomCount            : 1,
            roomFurnitureQuantity: 'none',
            roomSize             : 'small',
            roomType             : 'room',
        };

        it('returns a function for each generator', () => {
            Object.values(generators).forEach((generator) => {
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
                const dungeonGen = getGenerator('maps');
                const body       = parseHtml(dungeonGen(getMockState(), {
                    items: itemConfig,
                    rooms: roomConfig,
                    maps : {
                        dungeonComplexity : 2,
                        dungeonConnections: 0,
                        dungeonMaps       : 0,
                        dungeonName       : 'Spooky dungeon',
                        dungeonTraps      : 0,
                    },
                }));

                assert(Boolean(body.querySelector('svg'))).isTrue();

                const headers = body.querySelectorAll('h1');
                assert(headers[0]).hasTextContent('Spooky dungeon');
                assert(headers[1]).hasTextContent('Room 1'); // TODO should be an h2
            });
        });

        describe('item generator', () => {
            it('returns generated items', () => {
                const itemGen = getGenerator('items');
                const body    = parseHtml(itemGen(getMockState(), { items: itemConfig }));

                const title = body.querySelector('h1');
                const list  = body.querySelector('ul');

                assert(title).hasTextContent('Items');
                assert(title?.querySelector('span[data-detail]'))
                    .hasTextContent('1');

                assert(list).isElementTag('ul');
                assert(list?.querySelectorAll('li').length).equals(1);
            });
        });

        describe('room generator', () => {
            it('returns generated rooms', () => {
                const roomGen = getGenerator('rooms');
                const body    = parseHtml(roomGen(getMockState(), {
                    items: itemConfig,
                    rooms: {
                        ...roomConfig,
                        roomCount : 1,
                    },
                }));

                assert(body.querySelectorAll('article').length).equals(1);

                const title     = body.querySelector('h1');
                const subtitles = body.querySelectorAll('h2');
                const list      = body.querySelector('ul');

                assert(title).hasTextContent('Room');
                assert(subtitles[0]).hasTextContent('Description');
                assert(subtitles[1]).hasTextContent('Items');
                assert(subtitles[1].querySelector('span[data-detail]'))
                    .hasTextContent('1');

                assert(list).isElementTag('ul');
                assert(list?.querySelectorAll('li').length).equals(1);
            });

            describe('given multiple rooms', () => {
                it('returns generated rooms based on the `roomCount`', () => {
                    const roomGen = getGenerator('rooms');
                    const body    = parseHtml(roomGen(getMockState(), {
                        items: itemConfig,
                        rooms: {
                            ...roomConfig,
                            roomCount : 3,
                        },
                    }));

                    assert(body.querySelectorAll('article').length).equals(3);
                });
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
        Object.values(generators).forEach((generator) => {
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
                    save     : () => 'save action',
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
        it('generates content for the current route', () => {
            const controller = getMockController();

            onGenerate(controller);

            const content = controller.sections.content;
            const title = content.querySelector('h1');

            assert(Boolean(content.querySelector('article'))).isTrue();
            assert(title).hasTextContent('Items');
        });

        describe('when the active page is not a generator', () => {
            it('renders an error page', () => {
                const controller = getMockController({
                    getPathname: () => '/nothing-to-see-here',
                });

                onGenerate(controller);

                const content = controller.sections.content;
                const title = content.querySelector('h1');

                assert(title).hasTextContent('Oh no!');
            });
        });

        describe('when the sidebar is expanded', () => {
            it('closes the sidebar', () => {
                const controller = getMockController();
                const { body } = controller.sections;

                body.dataset.layout = 'sidebar-expanded';

                onGenerate(controller);

                assert(body).hasAttributes({ 'data-layout': 'default' });
            });
        });
    });

    describe('onNavigate()', () => {
        describe('given an event with the href of "/rooms"', () => {
            it('updates the content, knobs, and nav elements and calls updatePath() for the new path', () => {
                const controller = getMockController({
                    updatePath: (route) => { updatePathValue = route; },
                });
                const { content, knobs, nav } = controller.sections;

                const dungeonLink = nav.querySelector('[data-action="navigate"][href="/maps"]');
                const roomsLink   = nav.querySelector('[data-action="navigate"][href="/rooms"]');

                assert(dungeonLink).isElementTag('a');
                assert(roomsLink).isElementTag('a');

                let updatePathValue;

                roomsLink && onNavigate(controller, getMockClickEvent(roomsLink));

                // Content
                assert(content).hasTextContent('Generate Room');

                // Knobs
                assert(knobs).hasTextContent('Generate');

                // Nav
                roomsLink && assert(roomsLink).hasAttributes({ 'data-active': '' });
                dungeonLink && assert(dungeonLink).excludesAttributes([ 'data-active' ]);

                // updatePath()
                assert(updatePathValue).equals('/rooms');
            });
        });
    });

    describe('renderApp()', () => {
        const controller = getMockController();
        const { body, content, knobs, nav, toolbar } = controller.sections;

        it('updates the content, knobs, nav, and toolbar elements', () => {
            const dungeonLink = nav.querySelector('[data-action="navigate"][href="/maps"]');

            assert(dungeonLink).isElementTag('a');

            renderApp(controller, '/maps');

            // Content
            assert(content).hasTextContent('Generate Dungeon');

            // Knobs
            assert(knobs).hasTextContent('Generate');

            // Nav
            dungeonLink && assert(dungeonLink).hasAttributes({ 'data-active': '' });

            // Toolbar
            assert(Boolean(toolbar.querySelector('button[data-action="save"]'))).isTrue();
        });

        describe('when the layout is full', () => {
            it('updates the layout to "default"', () => {
                body.dataset.layout = 'full';

                renderApp(controller, '/items');

                assert(body).hasAttributes({ 'data-layout': 'default' });
            });
        });

        describe('when the sidebar is expanded', () => {
            it('persists the expanded sidebar', () => {
                body.dataset.layout = 'sidebar-expanded';

                renderApp(controller, '/items');

                assert(body).hasAttributes({ 'data-layout': 'sidebar-expanded' });
                assert(Boolean(knobs.querySelector('div[data-grid="1"]'))).isTrue();
            });
        });

        describe('when the route is empty', () => {
            it('renders a 404 message in a full layout', () => {
                renderApp(controller, '');

                assert(body).hasAttributes({ 'data-layout': 'full' });
                assert(content.querySelector('h1')).hasTextContent('404');
            });
        });

        describe('when the route contains a key', () => {
            it('makes a network request to fetch the content for the key', () => {
                // TODO
            });
        });
    });

    describe('renderErrorPage()', () => {
        const sections = getMockSections();
        const { body, content } = sections;

        it('renders an error message in a full layout', () => {
            renderErrorPage(sections);

            assert(body).hasAttributes({ 'data-layout': 'full' });
            assert(content.querySelector('h1')).hasTextContent('Oh no!');
        });

        describe('given a 404 status code', () => {
            it('renders a 404 message', () => {
                renderErrorPage(sections, 404);

                assert(content.querySelector('h1')).hasTextContent('404');
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
        const controller = getMockController();
        const { body, knobs } = controller.sections;

        describe('when the sidebar is not expanded', () => {
            it('expands the sidebar', () => {
                assert(body).hasAttributes({ 'data-layout': 'default' });
                assert(Boolean(knobs.querySelector('div[data-grid]'))).isFalse();

                toggleExpand(controller);

                assert(body).hasAttributes({ 'data-layout': 'sidebar-expanded' });
                assert(Boolean(knobs.querySelector('div[data-grid]'))).isTrue();
            });
        });

        describe('when the sidebar is expanded', () => {
            it('collapses the sidebar', () => {
                assert(body).hasAttributes({ 'data-layout': 'sidebar-expanded' });
                assert(Boolean(knobs.querySelector('div[data-grid]'))).isTrue();

                toggleExpand(controller);

                assert(body).hasAttributes({ 'data-layout': 'default' });
                assert(Boolean(knobs.querySelector('div[data-grid]'))).isFalse();
            });
        });

        describe('when the active page is not a generator', () => {
            it('renders an error page', () => {
                const controller404 = getMockController({
                    getPathname: () => '/nothing-to-see-here',
                });

                toggleExpand(controller404);

                const title = controller404.sections.content.querySelector('h1');

                assert(Boolean(title)).isTrue();
                assert(title).hasTextContent('Oh no!');
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
        describe('when an element is clicked', () => {
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
                save     : trigger,
                toggle   : trigger,
            };

            let errorResult;

            attachEventDelegates(sections, triggers, (error) => { errorResult = error; });

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

                    assert(sections.content).hasTextContent('Oh no!');
                    assert(errorResult.toString()).stringIncludes('Error: Fake!');
                });
            });
        });

        describe('when an element loses focus', () => {
            // TODO
        });
    });

    describe('getRender()', () => {
        let errorResult;

        const controller = getMockController({
            onError: (error) => { errorResult = error; },
        });

        const { content, knobs } = controller.sections;

        const render = getRender(controller);

        it('returns a render function bound to the given sections', () => {
            render('/items');

            assert(content).hasTextContent('Generate Items');
            assert(Boolean(knobs.querySelector('button[data-action="generate"]'))).isTrue();
        });

        describe('when a route does not exist', () => {
            it('renders a 404', () => {
                render('/bubbling-cauldron-of-oil');
                assert(content).hasTextContent('404');
            });
        });

        describe('when an error is thrown', () => {
            // TODO
        });
    });

    describe('getTriggers()', () => {
        let updatedPathValue;

        const controller = getMockController({
            getPathname: () => '/items',
            updatePath: (path) => { updatedPathValue = path; },
        });

        const { body, content, knobs, nav } = controller.sections;
        const triggers = getTriggers(controller);

        it('returns an object containing all application triggers', () => {
            assert(triggers.accordion).isFunction();
            assert(triggers.generate).isFunction();
            assert(triggers.navigate).isFunction();
            assert(triggers.save).isFunction();
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

                const title = content.querySelector('h1');

                assert(Boolean(generateButtonEl)).isTrue();

                assert(Boolean(content.querySelector('article'))).isTrue();
                assert(Boolean(title)).isTrue();
                assert(title).hasTextContent('Items');
            });
        });

        describe('navigate', () => {
            it('updates the content to the generator\'s ready state', () => {
                const roomsLink = nav.querySelector('[data-action="navigate"][href="/rooms"]');

                assert(Boolean(roomsLink)).isTrue();
                assert(content).hasTextContent('Items');

                roomsLink && triggers.navigate(getMockClickEvent(roomsLink));

                assert(content).hasTextContent('Generate Rooms');
            });

            it('calls updatePath() with the new pathname', () => {
                const roomsLink = nav.querySelector('[data-action="navigate"][href="/rooms"]');

                assert(roomsLink).isElementTag('a');

                roomsLink && triggers.navigate(getMockClickEvent(roomsLink));

                assert(updatedPathValue).equals('/rooms');
            });
        });

        describe('save', () => {
            // TODO
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
