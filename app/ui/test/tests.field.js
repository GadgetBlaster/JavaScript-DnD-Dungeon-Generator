// @ts-check

import {
    fieldLabel,
    input,
    select,
    slider,
} from '../field.js';

import { parseHtml } from '../../utility/element.js';

// TODO complete parseHtml() test updates

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {

    // -- Public Functions -----------------------------------------------------

    describe('fieldLabel()', () => {
        it('should return an html button element string', () => {
            assert(fieldLabel('Widget')).isElementTag('label');
        });

        it('contains the provided label', () => {
            assert(fieldLabel('Widget')).stringIncludes('Widget');
        });

        describe('given attributes', () => {
            it('includes the attributes on the element', () => {
                assert(fieldLabel('Widget', { for: 'house' })).stringIncludes('for="house"');
            });
        });
    });

    describe('input()', () => {
        describe('given a `name`', () => {
            let inputHtml = input('widget');

            it('should return an html input element string', () => {
                assert(inputHtml).isElementTag('input');
            });

            it('should contain the correct `name` attribute', () => {
                assert(inputHtml).stringIncludes('name="widget"');
            });

            it('should contain the `type="text"` attribute by default', () => {
                assert(inputHtml).stringIncludes('type="text"');
            });
        });

        describe('given a type', () => {
            it('contains a type attribute with the given type', () => {
                assert(input('widget', { type: 'number' })).stringIncludes('type="number"');
            });
        });

        describe('given a `value`', () => {
            it('should contain a `value` attribute with the given value', () => {
                assert(input('widget', { value: 15 })).stringIncludes('value="15"');
            });
        });

        describe('given an undefined attribute', () => {
            it('should not add that attribute to the html input element', () => {
                assert(input('widget', { action: undefined })).stringExcludes('action');
            });
        });

        describe('given a `name` attribute', () => {
            it('should throw', () => {
                assert(() => input('widget', { name: 'not-widget' }))
                    .throws('Input `attrs` cannot contain a name');
            });
        });
    });

    describe('select()', () => {
        const selectHTML = select('widget', [ 'one' ]);

        it('should return an HTML select element string', () => {
            assert(/<select(.*?)>(.*?)<\/select>/.test(selectHTML)).isTrue();
        });

        it('should contain the correct `name` attribute', () => {
            assert(selectHTML).stringIncludes('name="widget"');
        });

        describe('given no values', () => {
            it('throws', () => {
                // @ts-expect-error
                assert(() => select('widget')).throws('Select fields require option values');
            });
        });

        describe('given an empty array of value options', () => {
            it('throws', () => {
                assert(() => select('widget', [])).throws('Select fields require option values');
            });
        });

        describe('given 3 select values', () => {
            it('should return an HTML select element string with 3 options', () => {
                let result = select('widget', [ 'a', 'two', 'pi' ]);
                let expect = '<select name="widget">' +
                    '<option value="a">a</option>' +
                    '<option value="two">two</option>' +
                    '<option value="pi">pi</option>' +
                '</select>';

                assert(result).equals(expect);
            });

            describe('given a selectedValue', () => {
                it('marks the correct option as selected', () => {
                    let result = select('widget', [ 'a', 'two', 'pi' ], 'two');
                    assert(result).stringIncludes('<option selected="true" value="two">two</option>');
                });
            });
        });

        describe('given a camelCase option', () => {
            it('should convert the camelCase option to words on the option label', () => {
                let result = select('widget', [ 'bloodthirstyBarbarians' ]);
                let expect = '<select name="widget">' +
                    '<option value="bloodthirstyBarbarians">bloodthirsty barbarians</option>' +
                '</select>';

                assert(result).equals(expect);
            });
        });

        describe('given attributes', () => {
            it('includes the attributes on the element', () => {
                assert(select('widget', [ 'one' ], null, { for: 'house' })).stringIncludes('for="house"');
            });
        });
    });

    describe('slider()', () => {
        const inputEl = parseHtml(slider('widget')).querySelector('input');

        it('contains an HTML input element', () => {
            assert(Boolean(inputEl)).isTrue();
        });

        it('returns a string', () => {
            assert(slider('widget')).isString();
        });

        it('returns an html input element string with the given name and default attributes', () => {
            assert(Boolean(inputEl)).isTrue();
            input && assert(inputEl).hasAttributes({
                max : '100',
                min : '1',
                name: 'widget',
                type: 'range',
            });
        });

        describe('given a value', () => {
            it('contains a value attribute with the given value', () => {
                const inputWithValue = parseHtml(slider('widget', { value: 15 }));
                assert(inputWithValue.querySelector('input')).hasAttributes({ value : '15' });
            });
        });

        describe('given a `min`', () => {
            it('should include a `min` attribute with the given value', () => {
                assert(slider('widget', { min: 32 })).stringIncludes('min="32"');
            });
        });

        describe('given a `max`', () => {
            it('should include a `max` attribute with the given value', () => {
                assert(slider('widget', { max: 23 })).stringIncludes('max="23"');
            });
        });

        describe('given a `type` attribute', () => {
            it('should throw', () => {
                assert(() => slider('widget', { type: 'text' }))
                    .throws('Slider `attrs` cannot contain a type');
            });
        });

        describe('given a `min` that is not a number', () => {
            it('should throw', () => {
                assert(() => slider('widget', { min: '1' }))
                    .throws('Slider `min` must be a number');
            });
        });

        describe('given a `max` that is not a number', () => {
            it('should throw', () => {
                assert(() => slider('widget', { max: '1' }))
                    .throws('Slider `max` must be a number');
            });
        });

        describe('given a `min` the same as `max`', () => {
            it('should throw', () => {
                assert(() => slider('widget', { min: 1, max: 1 }))
                    .throws('Slider `min` must be less than `max`');
            });
        });

        describe('given a `min` greater than `max`', () => {
            it('should throw', () => {
                assert(() => slider('widget', { min: 126, max: 12 }))
                    .throws('Slider `min` must be less than `max`');
            });
        });
    });

};
