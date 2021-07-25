// @ts-check

import {
    element,
    testCreateAttributes as createAttributes,
} from '../element.js';

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {

    // -- Private Functions ----------------------------------------------------

    describe('createAttributes()', () => {
        it('should return a string', () => {
            assert(createAttributes({ class: 'css-class' })).isString();
        });

        describe('given nothing', () => {
            it('should return an empty string', () => {
                assert(createAttributes()).equals('');
            });
        });

        describe('given an empty object', () => {
            it('should return an empty string', () => {
                assert(createAttributes({})).equals('');
            });
        });

        describe('given an object with a single key value pair', () => {
            it('should return the key and value formatted as an HTML attribute string', () => {
                assert(createAttributes({ role: 'presentation' })).equals(' role="presentation"');
            });
        });

        describe('given an object with a boolean value', () => {
            it('should format the value as a string', () => {
                assert(createAttributes({ hidden: true })).equals(' hidden="true"');
            });
        });

        describe('given an object with a numeric value', () => {
            it('should format the value as a string', () => {
                assert(createAttributes({ 'data-columns': 2 })).equals(' data-columns="2"');
            });
        });

        describe('given an object with multiple key value pairs', () => {
            it('should return the key and value pairs formatted as an HTML attribute string', () => {
                const object = { 'data-target': 'kitten', id: 'jet-pack', type: 'submit' };
                assert(createAttributes(object))
                    .equals(' data-target="kitten" id="jet-pack" type="submit"');
            });
        });
    });

    // -- Public Functions -----------------------------------------------------

    describe('element()', () => {
        it('should return a string', () => {
            assert(element('p')).isString();
        });

        describe('given the tag `section`', () => {
            it('should return a `section` html element string', () => {
                assert(element('section')).equals('<section></section>');
            });
        });

        describe('given a non-empty `content` string', () => {
            it('should render the content string inside the element string', () => {
                assert(element('h1', 'Howdy Partner')).equals('<h1>Howdy Partner</h1>');
            });
        });

        describe('given an `attrs` object', () => {
            it('should render the element string with correct attributes', () => {
                const el = element('div', 'Always out numbered', { 'data-type': 'ranger' });
                assert(el).equals('<div data-type="ranger">Always out numbered</div>');
            });
        });

        describe('given a self closing tag', () => {
            it('should return a self closing html element string', () => {
                assert(element('input')).equals('<input />');
            });

            describe('given an `attrs` object', () => {
                it('should render the element string with correct attributes', () => {
                    const el = element('img', null, {
                        'alt': 'Dragons of Twilight',
                        'src': 'dragons.jpg',
                    });

                    assert(el).equals('<img alt="Dragons of Twilight" src="dragons.jpg" />');
                });
            });

            describe('given content', () => {
                it('should throw', () => {
                    assert(() => element('img', 'I do not belong here'))
                        .throws('Content is not allowed in self closing elements');
                });
            });
        });
    });
};
