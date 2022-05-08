// @ts-check

import { button, infoLabel } from '../button.js';
import { parseHtml } from '../../utility/element.js';

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {

    // -- Public Functions -----------------------------------------------------

    describe('button()', () => {
        const body    = parseHtml(button('click me', 'navigate'));
        const element = body.children.item(0);

        it('returns an single element', () => {
            assert(body.children.length).equals(1);
        });

        it('returns an HTML button element', () => {
            assert(element.tagName).equals('BUTTON');
        });

        it('has a data-size="small" attribute by default', () => {
            assert(element).hasAttributes({ 'data-size': 'small' });
        });

        it('has a type="button" attribute by default', () => {
            assert(element).hasAttributes({ 'type': 'button' });
        });

        it('has a data-action attribute by default', () => {
            assert(element).hasAttributes({ 'data-action': 'navigate' });
        });

        it('includes the label', () => {
            assert(element.textContent).equals('click me');
        });

        describe('given no label', () => {
            it('throws', () => {
                // @ts-expect-error
                assert(() => button()).throws('label is required by button()');
            });
        });

        describe('given no action', () => {
            it('throws', () => {
                // @ts-expect-error
                assert(() => button('click me')).throws('action is required by button()');
            });
        });

        describe('given a label that matches the infoLabel', () => {
            it('contains a data-info attribute', () => {
                assert(parseHtml(button(infoLabel, 'navigate')).children.item(0))
                    .hasAttributes({ 'data-info': '' });
            });
        });

        describe('given a truthy active option', () => {
            it('contains a data-active="true" attribute', () => {
                const html = button('Magic missile', 'toggle', { active: true });

                assert(parseHtml(html).children.item(0))
                    .hasAttributes({ 'data-active': 'true' });
            });
        });

        describe('given an invalid size option', () => {
            it('throws', () => {
                // @ts-expect-error
                assert(() => button('Magic missile', 'toggle', { size: 'invalid-size' }))
                    .throws('Invalid button size');
            });
        });

        describe('given a target option', () => {
            it('contains a data-target attribute with the target value', () => {
                const html = button('Magic missile', 'toggle', { target: 'blueberries' });

                assert(parseHtml(html).children.item(0))
                    .hasAttributes({ 'data-target': 'blueberries' });
            });
        });

        describe('given a value option', () => {
            it('contains a data-value attribute with the value', () => {
                const html = button('Magic missile', 'toggle', { value: 'honeybees' });

                assert(parseHtml(html).children.item(0))
                    .hasAttributes({ 'data-value': 'honeybees' });
            });
        });

        describe('given a type option', () => {
            it('contains a type attribute with the type', () => {
                const html = button('Magic missile', 'toggle', { type: 'submit' });

                assert(parseHtml(html).children.item(0))
                    .hasAttributes({ type: 'submit' });
            });
        });

        describe('given an ariaLabel option', () => {
            it('contains an aria-label attribute with the given value', () => {
                const html = button('Magic missile', 'toggle', { ariaLabel: 'Magic button' });

                assert(parseHtml(html).children.item(0))
                    .hasAttributes({ 'aria-label': 'Magic button' });
            });
        });
    });

};
