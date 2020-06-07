
import {
    article,
    div,
    fieldset,
    section,
} from '../block.js';

/**
 * Blocks
 *
 * @type {Object<string, function>}
 */
const blocks = {
    'article' : article,
    'div'     : div,
    'fieldset': fieldset,
    'section' : section,
};

/**
 * @param {import('../../../unit/unit.js').Utility}
 */
export default ({ assert, describe, it }) => {
    describe('blocks', () => {
        Object.entries(blocks).forEach(([ name, func ]) => {
            describe(`#${name}`, () => {
                describe('when called', () => {
                    let result = func('');

                    it('should return a string', () => {
                        assert(result).isString();
                    });

                    it('should return an html string with the correct the tag name', () => {
                        assert(result).equals(`<${name}></${name}>`);
                    });
                });

                describe('given a content string', () => {
                    let contentResult = func('Gandalf');

                    it('should contain the content string', () => {
                        assert(contentResult).stringIncludes('Gandalf');
                    });
                });

                describe('given an `attrs` param', () => {
                    let contentResult = func('Merlin', { 'data-action': 'fireball' });

                    it('should contain the content string', () => {
                        assert(contentResult).stringIncludes('data-action="fireball"');
                    });
                });
            });
        });
    });
};
