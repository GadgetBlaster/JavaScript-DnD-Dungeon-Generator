// @ts-check

import { nav, setActive, getActive } from '../nav.js';

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {
    describe('nav()', () => {
        it('should be a string', () => {
            assert(nav).isString();
        });
    });

    describe('getActive()', () => {
        describe('given a container with three nav buttons', () => {
            const container = document.createElement('div');
            container.innerHTML = `
                <button data-target="grog" data-active="true">Grog</button>
                <button data-target="nog">Nog</button>
                <button data-target="frog">Frog</button>
            `;

            it('should return the `data-target` value of the active element', () => {
                assert(getActive(container)).equals('grog');
            });
        });
    });

    describe('setActive()', () => {
        describe('given a container with three nav buttons', () => {
            const container = document.createElement('div');
            container.innerHTML = `
                <button data-target="grog" data-active="true">Grog</button>
                <button data-target="nog">Nog</button>
                <button data-target="frog">Frog</button>
            `;

            describe('given a target element that is the active target', () => {
                setActive(container.querySelector('[data-target="grog"]'));

                it('should remain the active element', () => {
                    /** @type {HTMLElement} targetEl */
                    const targetEl = container.querySelector('[data-target="grog"]');
                    assert(targetEl.dataset.active).equals('true');
                });

                it('should be the only active element', () => {
                    assert(container.querySelectorAll('[data-active]').length).equals(1);
                });
            });

            describe('given a target element that is not the active target', () => {
                setActive(container.querySelector('[data-target="frog"]'));

                it('should set the target element as the active element', () => {
                    /** @type {HTMLElement} targetEl */
                    const targetEl = container.querySelector('[data-target="frog"]');
                    assert(targetEl.dataset.active).equals('true');
                });

                it('should be the only active element', () => {
                    assert(container.querySelectorAll('[data-active]').length).equals(1);
                });
            });
        });
    });
};
