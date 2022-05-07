// @ts-check

import {
    // Private Functions
    testCreateAttributes as createAttributes,

    // Public Functions
    element,
    parseHtml,
    parseSvg,
} from '../element.js';

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {

    // -- Private Functions ----------------------------------------------------

    describe('createAttributes()', () => {
        it('returns a string', () => {
            assert(createAttributes({ class: 'css-class' })).isString();
        });

        describe('given nothing', () => {
            it('returns an empty string', () => {
                assert(createAttributes()).equals('');
            });
        });

        describe('given an empty object', () => {
            it('returns an empty string', () => {
                assert(createAttributes({})).equals('');
            });
        });

        describe('given an object with a single key value pair', () => {
            it('returns the key and value formatted as an HTML attribute string', () => {
                assert(createAttributes({ role: 'presentation' })).equals(' role="presentation"');
            });
        });

        describe('given an object with a boolean value', () => {
            it('formats the value as a string', () => {
                assert(createAttributes({ hidden: true })).equals(' hidden="true"');
            });
        });

        describe('given an object with a numeric value', () => {
            it('formats the value as a string', () => {
                assert(createAttributes({ 'data-columns': 2 })).equals(' data-columns="2"');
            });
        });

        describe('given an object with multiple key value pairs', () => {
            it('returns the key and value pairs formatted as an HTML attribute string', () => {
                const object = { 'data-target': 'kitten', id: 'jet-pack', type: 'submit' };
                assert(createAttributes(object))
                    .equals(' data-target="kitten" id="jet-pack" type="submit"');
            });
        });
    });

    // -- Public Functions -----------------------------------------------------

    // TODO update to use parseHtml()
    describe('element()', () => {
        it('returns a string', () => {
            assert(element('p')).isString();
        });

        describe('given the tag "section"', () => {
            it('returns a `<section>` html element string', () => {
                assert(element('section')).equals('<section></section>');
            });
        });

        describe('given a non-empty content string', () => {
            it('renders the content inside the element string', () => {
                assert(element('h1', 'Howdy Partner')).equals('<h1>Howdy Partner</h1>');
            });
        });

        describe('given an attributes object', () => {
            it('renders the element string with correct attributes', () => {
                const el = element('div', 'Always out numbered', { 'data-type': 'ranger' });
                assert(el).equals('<div data-type="ranger">Always out numbered</div>');
            });
        });

        describe('given a self closing tag', () => {
            it('returns a self closing html element string', () => {
                assert(element('input')).equals('<input />');
            });

            describe('given an attributes object', () => {
                it('renders the element string with correct attributes', () => {
                    const el = element('img', null, {
                        'alt': 'Dragons of Twilight',
                        'src': 'dragons.jpg',
                    });

                    assert(el).equals('<img alt="Dragons of Twilight" src="dragons.jpg" />');
                });
            });

            describe('given content', () => {
                it('throws', () => {
                    assert(() => element('img', 'I do not belong here'))
                        .throws('Content is not allowed in self closing elements');
                });
            });
        });
    });

    describe('parseHtml()', () => {
        describe('given a valid HTML string', () => {
            it('returns the string parsed as an HTMLDocument', () => {
                const doc = parseHtml('<main><h1>Monsters and Monoliths</h1></main>');

                assert(doc instanceof HTMLBodyElement).isTrue();
                assert(doc.querySelector('h1').textContent).equals('Monsters and Monoliths');
            });
        });

        describe('given plain text', () => {
            it('returns the string parsed as an HTMLDocument', () => {
                const doc = parseHtml('Just Monsters, no Monoliths');

                assert(doc instanceof HTMLBodyElement).isTrue();
                assert(doc.textContent).equals('Just Monsters, no Monoliths');
            });
        });

        describe('given plain text and HTML', () => {
            it('returns the string parsed as an HTMLDocument', () => {
                const doc = parseHtml('Just Monsters, <em>some</em> Monoliths');

                assert(doc instanceof HTMLBodyElement).isTrue();
                assert(doc.textContent).equals('Just Monsters, some Monoliths');
                assert(Boolean(doc.querySelector('em'))).isTrue();
            });
        });

        describe('given an invalid type', () => {
            it('throws', () => {
                // @ts-expect-error
                assert(() => parseHtml(true))
                    .throws('A string is required in parseHtml()');
            });
        });

        describe('given an invalid HTML string', () => {
            it('throws', () => {
                assert(() => parseHtml('<beware bad HTML'))
                    .throws('Invalid HTML string "<beware bad HTML"');
            });
        });
    });

    describe('parseSvg()', () => {
        describe('given a valid SVG string', () => {
            it('returns the string parsed as an XMLDocument', () => {
                const doc = parseSvg('<svg><rect x="288" y="210" width="216" height="240"></rect><text x="396" y="410">Happiness</text></svg>');

                assert(doc instanceof XMLDocument).isTrue();
                assert(Boolean(doc.querySelector('rect'))).isTrue();
                assert(doc.querySelector('rect').getAttribute('x')).equals('288');
                assert(doc.querySelector('rect').getAttribute('y')).equals('210');
                assert(doc.querySelector('rect').getAttribute('width')).equals('216');
                assert(doc.querySelector('rect').getAttribute('height')).equals('240');

                assert(Boolean(doc.querySelector('text'))).isTrue();
                assert(doc.querySelector('text').getAttribute('x')).equals('396');
                assert(doc.querySelector('text').getAttribute('y')).equals('410');
                assert(doc.querySelector('text').textContent).equals('Happiness');
            });
        });

        describe('given an invalid type', () => {
            it('throws', () => {
                // @ts-expect-error
                assert(() => parseSvg([]))
                    .throws('A string is required in parseSvg()');
            });
        });

        describe('given an invalid SVG string', () => {
            it('throws', () => {
                assert(() => parseSvg('<svg><text>beware bad SVG'))
                    .throws('Invalid SVG string "<svg><text>beware bad SVG"');
            });
        });
    });
};
