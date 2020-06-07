
import { button, infoLabel } from '../button.js';

/**
 * @param {import('../../../unit/unit.js').Utility}
 */
export default ({ assert, describe, it }) => {
    describe('#button', () => {
        describe('given a label and an action', () => {
            it('should return an html button string', () => {
                let result = button('click me', 'magic-missile');
                assert(result).equals('<button data-action="magic-missile" data-size="small" type="button">click me</button>');
            });

            it('should have a `data-size="small"` attribute by default', () => {
                let result = button('click me', '');
                assert(result).stringIncludes('data-size="small"');
            });

            it('should have `type="button"` attribute by default', () => {
                let result = button('click me', '');
                assert(result).stringIncludes('type="button"');
            });
        });

        describe('given a `label` that matches the `infoLabel`', () => {
            it('should contain a `data-info="true"` attribute', () => {
                let result = button(infoLabel, '');
                assert(result).stringIncludes('data-info="true"');
            });
        });

        describe('given a truthy `active` option', () => {
            it('should contain a `data-active="true"` attribute', () => {
                let result = button('', '', { active: true });
                assert(result).stringIncludes('data-active="true"');
            });
        });

        describe('given an invalid button size', () => {
            it('should throw', () => {
                assert(() => button('fred', 'back-flip', { size: 'invalid-size' })).throws();
            });
        });

        describe('given a `target` option', () => {
            it('should contain a `data-target` attribute with the target value', () => {
                let result = button('', '', { target: 'blueberries' });
                assert(result).stringIncludes('data-target="blueberries"');
            });
        });

        describe('given a `value` option', () => {
            it('should contain a `data-value` attribute with the value', () => {
                let result = button('', '', { value: 'honeybees' });
                assert(result).stringIncludes('data-value="honeybees"');
            });
        });

        describe('given a `type` option', () => {
            it('should contain a `type` attribute with the type', () => {
                let result = button('', '', { type: 'submit' });
                assert(result).stringIncludes('type="submit"');
            });
        });
    });
};
