// @ts-check

import {
    getActiveNavItem,
    getNav,
    setActiveNavItem,
} from '../nav.js';

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {
    describe('getActiveNavItem()', () => {
        describe('given a container with three nav buttons', () => {
            const container = document.createElement('div');
            container.innerHTML = `
                <button data-target="grog" data-active="true">Grog</button>
                <button data-target="nog">Nog</button>
                <button data-target="frog">Frog</button>
            `;

            it('should return the `data-target` value of the active element', () => {
                assert(getActiveNavItem(container)).equals('grog');
            });
        });
    });

    describe('getNav()', () => {
        it('should be a string', () => {
            assert(getNav()).isString();
        });

        it('should contain 3 nav buttons', () => {
            const nav = getNav();
            assert(/<button(.+?)data-target="dungeon"(.+?)>(.+?)<\/button>/.test(nav)).isTrue();
            assert(/<button(.+?)data-target="rooms"(.+?)>(.+?)<\/button>/.test(nav)).isTrue();
            assert(/<button(.+?)data-target="items"(.+?)>(.+?)<\/button>/.test(nav)).isTrue();
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

            describe('given a page which is already the active page', () => {
                setActiveNavItem(nav, 'dungeon');

                it('should remain the active element', () => {
                    /** @type {HTMLElement} targetEl */
                    const targetEl = nav.querySelector('[data-target="dungeon"]');
                    assert(targetEl.dataset.active).equals('true');
                });

                it('should be the only active element', () => {
                    assert(nav.querySelectorAll('[data-active]').length).equals(1);
                });
            });

            describe('given a page that is not the active page]', () => {
                setActiveNavItem(nav, 'items');

                it('should set the target element as the active element', () => {
                    /** @type {HTMLElement} targetEl */
                    const targetEl = nav.querySelector('[data-target="items"]');
                    assert(targetEl.dataset.active).equals('true');
                });

                it('should be the only active element', () => {
                    assert(nav.querySelectorAll('[data-active]').length).equals(1);
                });
            });
        });
    });
};
