// @ts-check

import {
    fieldLabel,
    input,
    select,
    slider,
} from '../field.js';

import { parseHtml } from '../../utility/element.js';

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {

    // -- Public Functions -----------------------------------------------------

    describe('fieldLabel()', () => {
        const result  = fieldLabel('Widget', { for: 'house' });
        const body    = parseHtml(result);
        const element = body.children.item(0);

        it('returns an single element string', () => {
            assert(result).isString();
            assert(body.children.length).equals(1);
            assert(Boolean(element)).isTrue();
        });

        it('returns an html label element', () => {
            assert(element).isElementTag('label');
        });

        it('contains the provided label', () => {
            assert((element || {}).textContent).equals('Widget');
        });

        it('has the given attributes', () => {
            assert(element).hasAttributes({ for: 'house' });
        });
    });

    describe('input()', () => {
        describe('given a `name`', () => {
            const result  = input('widget');
            const body    = parseHtml(result);
            const inputEl = body.children.item(0);

            it('returns an single element', () => {
                assert(result).isString();
                assert(body.children.length).equals(1);
                assert(Boolean(inputEl)).isTrue();
            });

            it('returns an html input element', () => {
                assert(inputEl).isElementTag('input');
            });

            it('contains the correct `name` attribute', () => {
                assert(inputEl).hasAttributes({ name: 'widget' });
            });

            it('has a `type="text"` attribute by default', () => {
                assert(inputEl).hasAttributes({ type: 'text' });
            });
        });

        describe('given a type', () => {
            it('has a type attribute with the given type', () => {
                const inputEl = parseHtml(input('widget', { type: 'number' })).children.item(0);
                assert(inputEl).hasAttributes({ type: 'number' });
            });
        });

        describe('given a `value`', () => {
            it('contains a `value` attribute with the given value', () => {
                const inputEl = parseHtml(input('widget', { value: 15 })).children.item(0);
                assert(inputEl).hasAttributes({ value: '15' });
            });
        });

        describe('given an undefined attribute', () => {
            it('does not contain that attribute', () => {
                /** @ts-expect-error */
                const inputEl = parseHtml(input('widget', { action: undefined })).children.item(0);
                assert(inputEl).excludesAttributes([ 'action' ]);
            });
        });

        describe('given a `name` attribute', () => {
            it('throws', () => {
                assert(() => input('widget', { name: 'not-widget' }))
                    .throws('Input `attrs` cannot contain a name');
            });
        });
    });

    describe('select()', () => {
        const result   = select('widget', [ 'one' ]);
        const body     = parseHtml(result);
        const selectEl = body.children.item(0);

        it('returns an single element', () => {
            assert(result).isString();
            assert(body.children.length).equals(1);
            assert(Boolean(selectEl)).isTrue();
        });

        it('returns an html select element', () => {
            assert(selectEl).isElementTag('select');
        });

        it('contains the correct `name` attribute', () => {
            assert(selectEl).hasAttributes({ name: 'widget' });
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
            it('returns an html select element string with the 3 given options', () => {
                assert(select('widget', [ 'a', 'two', 'pi' ])).equals(
                    '<select name="widget">' +
                        '<option value="a">a</option>' +
                        '<option value="two">two</option>' +
                        '<option value="pi">pi</option>' +
                    '</select>'
                );
            });

            describe('given a `selectedValue`', () => {
                it('marks the correct option as selected', () => {
                    const bodyEl          = parseHtml(select('widget', [ 'a', 'two', 'pi' ], 'two'));
                    const selectWithValue = /** @type {HTMLSelectElement} */ (bodyEl.children.item(0));
                    const optionEl        = selectWithValue && selectWithValue.querySelector('option[selected]');

                    assert(Boolean(selectWithValue)).isTrue();
                    assert(Boolean(optionEl)).isTrue();

                    optionEl && assert(optionEl.textContent).equals('two');
                    selectWithValue && assert(selectWithValue.value).equals('two');
                });
            });
        });

        describe('given a camelCase option', () => {
            it('converts the camelCase option to words as the option label', () => {
                const bodyEl   = parseHtml(select('widget', [ 'bloodthirstyBarbarians' ]));
                const optionEl = bodyEl.querySelector('option');

                assert(Boolean(optionEl)).isTrue();
                optionEl && assert(optionEl.value).equals('bloodthirstyBarbarians');
                optionEl && assert(optionEl.textContent).equals('bloodthirsty barbarians');
            });
        });

        describe('given attributes', () => {
            it('includes the attributes on the element', () => {
                const selectWithAttrs = parseHtml(select('widget', [ 'one' ], undefined, { for: 'house' })).children.item(0);
                assert(selectWithAttrs).hasAttributes({ for: 'house' });
            });
        });
    });

    describe('slider()', () => {
        const result  = slider('widget');
        const body    = parseHtml(result);
        const inputEl = body.children.item(0);

        it('returns an single element', () => {
            assert(result).isString();
            assert(body.children.length).equals(1);
            assert(Boolean(inputEl)).isTrue();
        });


        it('returns an html input element', () => {
            assert(inputEl).isElementTag('input');
        });

        it('has the given name and default attributes', () => {
            assert(inputEl).hasAttributes({
                max : '100',
                min : '1',
                name: 'widget',
                type: 'range',
            });
        });

        describe('given a value', () => {
            it('has the correct value attribute', () => {
                const inputWithValue = parseHtml(slider('widget', { value: 15 })).children.item(0);
                assert(inputWithValue).hasAttributes({ value : '15' });
            });
        });

        describe('given a `min`', () => {
            it('should include a `min` attribute with the given value', () => {
                const inputWithMin = parseHtml(slider('widget', { min: 32 })).children.item(0);
                assert(inputWithMin).hasAttributes({ min: '32' });
            });
        });

        describe('given a `max`', () => {
            it('should include a `max` attribute with the given value', () => {
                const inputWithMax = parseHtml(slider('widget', { max: 23 })).children.item(0);
                assert(inputWithMax).hasAttributes({ max: '23' });
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
