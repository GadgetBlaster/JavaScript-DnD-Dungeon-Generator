
import { describe, it, assert } from '../../../unit/unit.js';

import {
    createAttrs,
    element,
} from '../html.js';

describe('html', () => {
    describe('#createAttrs', () => {
        it('should return a string', () => {
            assert(createAttrs({ class: 'css-class' })).isString();
        });

        describe('given an object with a single key value pair', () => {
            it('should return the key and value formatted as an HTML attribute string', () => {
                assert(createAttrs({ role: 'presentation' })).equals('role="presentation"');
            });
        });

        describe('given an object with a boolean value', () => {
            it('should format the value as a string', () => {
                assert(createAttrs({ hidden: true })).equals('hidden="true"');
            });
        });

        describe('given an object with a numeric value', () => {
            it('should format the value as a string', () => {
                assert(createAttrs({ 'data-columns': 2 })).equals('data-columns="2"');
            });
        });

        describe('given an object with multiple key value pairs', () => {
            it('should return the key and value pairs formatted as an HTML attribute string', () => {
                let object = { 'data-target': 'kitten', id: 'jet-pack', type: 'submit' };
                let expect = 'data-target="kitten" id="jet-pack" type="submit"';

                assert(createAttrs(object)).equals(expect);
            });
        });
    });

    describe('#element', () => {
        it('should return a string', () => {
            assert(element('p', '')).isString();
        });

        describe('given the tag `section`', () => {
            it('should return a section HTML element string', () => {
                assert(element('section', '')).equals('<section></section>');
            });
        });

        describe('given a non-empty `content` string', () => {
            it('should render the content string inside the element string', () => {
                assert(element('h1', 'howdy partner')).equals('<h1>howdy partner</h1>');
            });
        });

        describe('given an `attrs` object', () => {
            it('should render the element string with correct attributes', () => {
                let el     = element('div', 'Always out numbered', { 'data-type': 'ranger' });
                let expect = '<div data-type="ranger">Always out numbered</div>';

                assert(el).equals(expect);
            });
        });
    });
});
