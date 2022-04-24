// @ts-check

import { parseHtml } from '../../utility/element.js';
import { generators } from '../../controller/controller.js';
import {
    // Config
    testDisabledGenerators as disabledGenerators,

    // Public Functions
    // getActiveNavItem,
    getNav,
    setActiveNavItem,
} from '../nav.js';

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {

    // -- Public Functions -----------------------------------------------------

    // describe('getActiveNavItem()', () => {
    //     describe('given a container with three nav buttons', () => {
    //         const container = document.createElement('div');
    //         container.innerHTML = `
    //             <button data-target="grog" data-active="true">Grog</button>
    //             <button data-target="nog">Nog</button>
    //             <button data-target="frog">Frog</button>
    //         `;

    //         it('should return the `data-target` value of the active element', () => {
    //             assert(getActiveNavItem(container)).equals('grog');
    //         });
    //     });
    // });

    describe('getNav()', () => {
        const nav  = getNav('dungeon');
        const body = parseHtml(getNav('dungeon'));

        it('returns a string', () => {
            assert(nav).isString();
        });

        it('contains a nav button for each generator that is not disabled', () => {
            generators.filter((generator) => !disabledGenerators.has(generator)).forEach((generator) => {
                const button = body.querySelector(`button[data-target="${generator}"]`);
                assert(Boolean(button)).isTrue();
            });
        });

        it('sets the correct active item', () => {
            assert(body.querySelector('button[data-target="dungeon"]'))
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
