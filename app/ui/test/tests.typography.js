
import {
    paragraph,
    strong,
    title,
    subTitle,
    small,
    em,
} from '../typography.js';

/**
 * Type
 *
 * @type {Object<string, function>}
 */
const type = {
    'em'    : em,
    'h2'    : title,
    'h3'    : subTitle,
    'p'     : paragraph,
    'small' : small,
    'strong': strong,
};

/**
 * @param {import('../../../unit/unit.js').Utility}
 */
export default ({ assert, describe, it }) => {
    describe('type', () => {
        Object.entries(type).forEach(([ name, func ]) => {
            describe(`#${name}`, () => {
                describe('when called', () => {
                    let result = func('');

                    it('should return a string', () => {
                        assert(result).isString();
                    });

                    it('should return an html string with the correct the tag name', () => {
                        assert(result).isHtmlTag(name);
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
