
import { submitButton, _getKnob } from '../form.js';
import { actions } from '../action.js';
import { typeSelect, typeNumber, typeRange } from '../../knobs.js';

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
            assert(button).isHtmlTag('button');
        });

        it('should have a `type="submit"` attribute', () => {
            assert(button).stringIncludes('type="submit"');
        });

        it(`should have a \`data-action="${actions.generate}"\` attribute`, () => {
            assert(button).stringIncludes(`data-action="${actions.generate}"`);
        });
    });

    describe('#_getKnob', () => {
        describe('given an invalid type', () => {
            it('should throw', () => {
                assert(() => _getKnob({ name: 'Tools' })).throws();
            });
        });

        describe('given a type of `typeSelect`', () => {
            it('should return an html select string', () => {
                assert(_getKnob({ type: typeSelect, values: [] })).isHtmlTag('select');
            });
        });

        describe('given a type of `typeNumber`', () => {
            it('should return an html input string', () => {
                assert(_getKnob({ type: typeNumber })).isHtmlTag('input');
            });
        });

        describe('given a type of `typeRange`', () => {
            it('should return an html input string', () => {
                assert(_getKnob({ type: typeNumber })).isHtmlTag('input');
            });
        });
    });

    describe('#_renderFields', () => {

    });
};
