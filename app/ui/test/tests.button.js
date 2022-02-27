// @ts-check

import { button, infoLabel } from '../button.js';

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {

    // -- Public Functions -----------------------------------------------------

    describe('button()', () => {
        let buttonHTML = button('click me', 'navigate');

        it('should return an html button element string', () => {
            assert(buttonHTML).isElementTag('button');
        });

        it('should have a `data-size="small"` attribute by default', () => {
            assert(buttonHTML).stringIncludes('data-size="small"');
        });

        it('should have `type="button"` attribute by default', () => {
            assert(buttonHTML).stringIncludes('type="button"');
        });

        it('should have a `data-action` attribute by default', () => {
            assert(buttonHTML).stringIncludes('data-action="navigate"');
        });

        it('should include the label', () => {
            assert(buttonHTML).stringIncludes('click me');
        });

        describe('given no `label`', () => {
            it('should throw', () => {
                // @ts-expect-error
                assert(() => button()).throws('label is required by button()');
            });
        });

        describe('given no `action`', () => {
            it('should throw', () => {
                // @ts-expect-error
                assert(() => button('click me')).throws('action is required by button()');
            });
        });

        describe('given a `label` that matches the `infoLabel`', () => {
            it('should contain a `data-info="true"` attribute', () => {
                assert(button(infoLabel, 'navigate'))
                    .stringIncludes('data-info="true"');
            });
        });

        describe('given a truthy `active` option', () => {
            it('should contain a `data-active="true"` attribute', () => {
                assert(button('Magic missile', 'toggle', { active: true }))
                    .stringIncludes('data-active="true"');
            });
        });

        describe('given an invalid `size` option', () => {
            it('should throw', () => {
                // @ts-expect-error
                assert(() => button('Magic missile', 'toggle', { size: 'invalid-size' }))
                    .throws('Invalid button size');
            });
        });

        describe('given a `target` option', () => {
            it('should contain a `data-target` attribute with the target value', () => {
                assert(button('Magic missile', 'toggle', { target: 'blueberries' }))
                    .stringIncludes('data-target="blueberries"');
            });
        });

        describe('given a `value` option', () => {
            it('should contain a `data-value` attribute with the value', () => {
                assert(button('Magic missile', 'toggle', { value: 'honeybees' }))
                    .stringIncludes('data-value="honeybees"');
            });
        });

        describe('given a `type` option', () => {
            it('should contain a `type` attribute with the type', () => {
                assert(button('Magic missile', 'toggle', { type: 'submit' }))
                    .stringIncludes('type="submit"');
            });
        });
    });

};
