
import { button, infoLabel } from '../button.js';

/**
 * @param {import('../../unit/unit.js').Utility}
 */
export default ({ assert, describe, it }) => {
    describe('button()', () => {
        let buttonHtml = button('click me');

        it('should return an html button element string', () => {
            assert(buttonHtml).isHtmlTag('button');
        });

        it('should have a `data-size="small"` attribute by default', () => {
            assert(buttonHtml).stringIncludes('data-size="small"');
        });

        it('should have `type="button"` attribute by default', () => {
            assert(buttonHtml).stringIncludes('type="button"');
        });

        it('should include the label', () => {
            assert(buttonHtml).stringIncludes('click me');
        });

        describe('given an `action`', () => {
            it('should include the action attribute', () => {
                assert(button('click me', 'magic-missile')).stringIncludes('data-action="magic-missile"');
            });
        });

        describe('given a `label` that matches the `infoLabel`', () => {
            it('should contain a `data-info="true"` attribute', () => {
                assert(button(infoLabel, ''))
                    .stringIncludes('data-info="true"');
            });
        });

        describe('given a truthy `active` option', () => {
            it('should contain a `data-active="true"` attribute', () => {
                assert(button('', '', { active: true }))
                    .stringIncludes('data-active="true"');
            });
        });

        describe('given an invalid `size` option', () => {
            it('should throw', () => {
                assert(() => button('fred', 'back-flip', { size: 'invalid-size' }))
                    .throws('Invalid button size');
            });
        });

        describe('given a `target` option', () => {
            it('should contain a `data-target` attribute with the target value', () => {
                assert(button('', '', { target: 'blueberries' }))
                    .stringIncludes('data-target="blueberries"');
            });
        });

        describe('given a `value` option', () => {
            it('should contain a `data-value` attribute with the value', () => {
                assert(button('', '', { value: 'honeybees' }))
                    .stringIncludes('data-value="honeybees"');
            });
        });

        describe('given a `type` option', () => {
            it('should contain a `type` attribute with the type', () => {
                assert(button('', '', { type: 'submit' }))
                    .stringIncludes('type="submit"');
            });
        });
    });
};
