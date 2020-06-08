
import { submitButton } from '../form.js';
import { actions } from '../action.js';

/**
 * @param {import('../../../unit/unit.js').Utility}
 */
export default ({ assert, describe, it }) => {
    describe('#submitButton', () => {
        const button = submitButton;

        it('should be a string', () => {
            assert(button).isString();
        });

        it('should be an html button string', () => {
            assert(Boolean(button.match(/<button[^>]+>/g))).isTrue();
            assert(button).stringIncludes('</button>');
        });

        it('should have a `type="submit"` attribute', () => {
            assert(button).stringIncludes('type="submit"');
        });

        it(`should have a \`data-action="${actions.generate}"\` attribute`, () => {
            assert(button).stringIncludes(`data-action="${actions.generate}"`);
        });
    });
};
