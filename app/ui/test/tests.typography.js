// @ts-check

import {
    paragraph,
    strong,
    title,
    subtitle,
    small,
    em,
} from '../typography.js';

/** @typedef {import('../../utility/element').Attributes} Attributes */

/**
 * Type
 *
 * @type {{ [key: string]: (label: string, attributes?: Attributes) => string }}
 */
const type = {
    'em'    : em,
    'h2'    : title,
    'h3'    : subtitle,
    'p'     : paragraph,
    'small' : small,
    'strong': strong,
};

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {
    Object.entries(type).forEach(([ name, func ]) => {
        describe(`${name}()`, () => {
            describe('when called', () => {
                let result = func('');

                it('should return an html element string with the correct the tag name', () => {
                    assert(result).isElementTag(name);
                });
            });

            describe('given a content string', () => {
                let contentResult = func('Gandalf');

                it('should contain the content string', () => {
                    assert(contentResult).stringIncludes('Gandalf');
                });
            });

            describe('given an `attributes` param', () => {
                let contentResult = func('Merlin', { 'data-action': 'fireball' });

                it('should contain the content string', () => {
                    assert(contentResult).stringIncludes('data-action="fireball"');
                });
            });
        });
    });
};
