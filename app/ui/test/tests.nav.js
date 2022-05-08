// @ts-check

import { parseHtml } from '../../utility/element.js';
import { generators } from '../../controller/controller.js';
import {
    // Config
    testDisabledGenerators as disabledGenerators,

    // Public Functions
    testGetElements as getElements,

    // Public Functions
    getNav,
    setActiveNavItem,
} from '../nav.js';

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {

    // -- Config ---------------------------------------------------------------

    describe('disabledGenerators', () => {
        it('should be a set of Generators', () => {
            assert(disabledGenerators).isSet();

            disabledGenerators.forEach((generator) => {
                assert(generator).isInArray(generators);
            });
        });
    });

    // -- Private Functions ----------------------------------------------------

    describe('getElements()', () => {
        describe('given an invalid HTML collection', () => {
            it('returns an empty array', () => {
                // @ts-expect-error
                assert(getElements([ 'hi', 'toad '])).equalsArray([]);
            });
        });

        describe('given a valid HTML collection', () => {
            it('returns an array of HTML Elements', () => {
                const div  = document.createElement('div');
                const p    = document.createElement('p');
                const span = document.createElement('span');

                div.appendChild(p);
                div.appendChild(span);

                const elements = getElements(div.children);

                assert(elements).isArray();
                assert(elements[0].tagName).equals('P');
                assert(elements[1].tagName).equals('SPAN');
            });
        });
    });

    // -- Public Functions -----------------------------------------------------

    describe('getNav()', () => {
        const body = parseHtml(getNav('dungeon'));

        it('returns valid HTML', () => {
            assert(Boolean(body)).isTrue();
        });

        it('contains a nav link for each generator that is not disabled', () => {
            generators.filter((generator) => !disabledGenerators.has(generator)).forEach((generator) => {
                const button = body.querySelector(`a[data-target="${generator}"]`);
                assert(Boolean(button)).isTrue();
            });
        });

        it('sets the correct active item', () => {
            assert(body.querySelector('a[data-target="dungeon"]'))
                .hasAttributes({ 'data-active': 'true' });
        });
    });

    describe('setActiveNavItem()', () => {
        describe('given a container with three nav buttons', () => {
            const nav = document.createElement('div');
            nav.innerHTML = `
                <button data-target="dungeon" data-active="true">Frog</button>
                <button data-target="rooms">Grog</button>
                <button data-target="items">Nog</button>
            `;

            describe('given a generator which is already active', () => {
                setActiveNavItem(nav, 'dungeon');

                it('remains the active element', () => {
                    /** @type {HTMLElement} targetEl */
                    const targetEl = nav.querySelector('[data-target="dungeon"]');
                    assert(targetEl.dataset.active).equals('true');
                });

                it('is the only active element', () => {
                    assert(nav.querySelectorAll('[data-active]').length).equals(1);
                });
            });

            describe('given a generator that is not the active generator', () => {
                setActiveNavItem(nav, 'items');

                it('sets the target element as the active element', () => {
                    /** @type {HTMLElement} targetEl */
                    const targetEl = nav.querySelector('[data-target="items"]');
                    assert(targetEl.dataset.active).equals('true');
                });

                it('is the only active element', () => {
                    assert(nav.querySelectorAll('[data-active]').length).equals(1);
                });
            });
        });
    });

};
