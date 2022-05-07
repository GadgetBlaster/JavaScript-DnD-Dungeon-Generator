// @ts-check

import {
    // Config
    testDashLength as dashLength,

    // Public functions
    drawCircle,
    drawLine,
    drawRect,
    drawText,
} from '../shape.js';

import { parseSvg } from '../../utility/element.js';

/** @typedef {import('../shape.js').Circle} Circle */
/** @typedef {import('../shape.js').Line} Line */
/** @typedef {import('../shape.js').PixelRectangle} PixelRectangle */

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {

    // -- Public Functions -----------------------------------------------------

    describe('drawCircle()', () => {
        /** @type {Circle} */
        const circleSettings = { cx: 110, cy: 210, r: 310 };

        const doc    = parseSvg(drawCircle(circleSettings));
        const circle = doc.children.item(0);

        it('returns an single element', () => {
            assert(doc.children.length).equals(1);
        });

        it('returns an SVG circle element', () => {
            assert(circle.tagName).equals('circle');
        });

        it('has correct cx and cy attributes', () => {
            assert(circle).hasAttributes({ cx: '110', cy: '210' });
        });

        describe('given a fill color', () => {
            it('has a fill attributes', () => {
                let filledCircle = drawCircle(circleSettings, { fill: 'pink' });

                assert(parseSvg(filledCircle).children.item(0))
                    .hasAttributes({ fill: 'pink' });
            });
        });

        describe('given a stroke color', () => {
            it('has stroke color and stroke-width attributes', () => {
                let strokeCircle = drawCircle(circleSettings, { stroke: 'blue' });

                assert(parseSvg(strokeCircle).children.item(0))
                    .hasAttributes({ 'stroke-width': '2', stroke: 'blue' });
            });
        });

        describe('invalid configuration', () => {
            Object.keys(circleSettings).forEach((required) => {
                let settings = { ...circleSettings };
                delete settings[required];

                describe(`when ${required} is omitted`, () => {
                    it('throws', () => {
                        assert(() => drawCircle(settings)).throws(`${required} is required by drawCircle()`);
                    });
                });
            });
        });
    });

    describe('drawLine()', () => {
        /** @type {Line} */
        const lineSettings = {
            x1: 10,
            y1: 20,
            x2: 300,
            y2: 400,
            color: 'gray',
            width: 2,
        };

        const doc  = parseSvg(drawLine(lineSettings));
        const line = doc.children.item(0);

        it('returns an single element', () => {
            assert(doc.children.length).equals(1);
        });

        it('returns an SVG line element', () => {
            assert(line.tagName).equals('line');
        });

        it('has correct x1, y1, x2, and y2 attributes', () => {
            assert(line).hasAttributes({
                x1: '10',
                y1: '20',
                x2: '300',
                y2: '400',
            });
        });

        it('has a correct stroke attribute', () => {
            assert(line).hasAttributes({ stroke: 'gray' });
        });

        it('has a correct stroke-width attribute', () => {
            assert(line).hasAttributes({ 'stroke-width': '2' });
        });

        it('does not have a stroke-dasharray attribute', () => {
            assert(line).excludesAttributes([ 'stroke-dasharray' ]);
        });

        describe('given a truthy dashed option', () => {
            it('has a stroke-dasharray attribute', () => {
                let dashedLine = drawLine(lineSettings, { dashed: true });

                assert(parseSvg(dashedLine).children.item(0))
                    .hasAttributes({ 'stroke-dasharray': dashLength.toString() });
            });
        });

        describe('invalid configuration', () => {
            Object.keys(lineSettings).forEach((required) => {
                let settings = { ...lineSettings };
                delete settings[required];

                describe(`when ${required} is omitted`, () => {
                    it('throws', () => {
                        assert(() => drawLine(settings)).throws(`${required} is required by drawLine()`);
                    });
                });
            });
        });
    });

    describe('drawRect()', () => {
        /** @type {PixelRectangle} */
        const rectSettings = { x: 24, y: 48, width: 72, height: 96 };

        const doc  = parseSvg(drawRect(rectSettings));
        const rect = doc.children.item(0);

        it('returns an single element', () => {
            assert(doc.children.length).equals(1);
        });

        it('returns an SVG <rect /> element', () => {
            assert(rect.tagName).equals('rect');
        });

        it('has correct x, y, width, and height attributes', () => {
            assert(rect).hasAttributes({
                x     : '24',
                y     : '48',
                width : '72',
                height: '96',
            });
        });

        describe('given extra attributes', () => {
            it('includes the attributes on the element', () => {
                const styledRect = drawRect(rectSettings, { stroke: 'red', fill: 'purple' });

                assert(parseSvg(styledRect).children.item(0))
                    .hasAttributes({ stroke: 'red', fill: 'purple' });
            });
        });

        describe('invalid configuration', () => {
            Object.keys(rectSettings).forEach((required) => {
                let settings = { ...rectSettings };
                delete settings[required];

                describe(`when ${required} is omitted`, () => {
                    it('throws', () => {
                        assert(() => drawRect(settings)).throws(`${required} is required by drawRect()`);
                    });
                });
            });
        });
    });

    describe('drawText()', () => {
        const doc  = parseSvg(drawText('Wizard Tower', { x: 20, y: 20 }));
        const text = doc.children.item(0);

        it('returns an single element', () => {
            assert(doc.children.length).equals(1);
        });

        it('returns an SVG <text> element', () => {
            assert(text.tagName).equals('text');
        });

        it('has a correct x attribute', () => {
            assert(text).hasAttributes({ x: '20' });
        });

        it('has a correct y attribute including the pxTextOffset', () => {
            assert(text).hasAttributes({ y: '22' });
        });

        it('contains the text as the content', () => {
            assert(text.textContent).equals('Wizard Tower');
        });

        describe('given a fontSize option', () => {
            it('has a correct font-size attribute', () => {
                const customFontSizeTextElement = drawText(
                    'Goblin Lair',
                    { x: 0, y: 0 },
                    { fontSize: 24 }
                );

                assert(parseSvg(customFontSizeTextElement).children.item(0))
                    .hasAttributes({ 'font-size': '24px' });
            });
        });

        describe('given a fill option', () => {
            it('has a correct fill attribute', () => {
                const customFillTextElement = drawText(
                    'Goblin Zeppelin',
                    { x: 0, y: 0 },
                    { fill: 'purple' }
                );

                assert(parseSvg(customFillTextElement).children.item(0))
                    .hasAttributes({ fill: 'purple' });
            });
        });
    });
};
