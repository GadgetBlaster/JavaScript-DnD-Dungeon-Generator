// @ts-check

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
    article,
    div,
    fieldset,
    section,
};

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {
    describe('blocks', () => {
        Object.entries(blocks).forEach(([ name, func ]) => {
            describe(`#${name}`, () => {
                describe('when called', () => {
                    it('should return the correct html element string', () => {
                        assert(func('')).isElementTag(name);
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
