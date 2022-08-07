// @ts-check

import { capitalize } from '../../utility/tools.js';
import { parseHtml } from '../../utility/element.js';
import { generators } from '../../controller/controller.js';
import {
    // Public Functions
    getNav,
    setActiveNavItem,
} from '../nav.js';

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {

    // -- Public Functions -----------------------------------------------------

    describe('getNav()', () => {
        const body = parseHtml(getNav('maps'));

        it('returns valid HTML', () => {
            assert(Boolean(body)).isTrue();
        });

        it('contains a nav link for each generator', () => {
            Object.entries(generators).forEach(([ route, generator ]) => {
                const link = body.querySelector(`[href="${route}"]`);

                assert(link).isElementTag('a');
                assert(link).hasTextContent(capitalize(generator));
            });
        });

        it('sets the correct active item', () => {
            assert(body.querySelector('a[href="/maps"]'))
                .hasAttributes({ 'data-active': '' });
        });
    });

    describe('setActiveNavItem()', () => {
        describe('given a container with three nav buttons', () => {
            const nav = document.createElement('div');
            nav.innerHTML = `
                <a href="/maps" data-active>Frog</button>
                <a href="/rooms">Grog</button>
                <a href="/items">Nog</button>
            `;

            describe('given a generator which is already active', () => {
                setActiveNavItem(nav, 'maps');

                it('remains the active element', () => {
                    const targetEl = nav.querySelector('[href="/maps"]');
                    assert(targetEl).hasAttributes({ 'data-active': '' });
                });

                it('is the only active element', () => {
                    assert(nav.querySelectorAll('[data-active]').length).equals(1);
                });
            });

            describe('given a generator that is not the active generator', () => {
                setActiveNavItem(nav, 'items');

                it('sets the target element as the active element', () => {
                    const targetEl = nav.querySelector('[href="/items"]');
                    assert(targetEl).hasAttributes({ 'data-active': '' });
                });

                it('is the only active element', () => {
                    assert(nav.querySelectorAll('[data-active]').length).equals(1);
                });
            });
        });
    });

};
