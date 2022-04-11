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
        const circle = drawCircle(circleSettings);
        const svgEl = parseSvg(circle);
        const circleEl = svgEl && svgEl.querySelector('circle');

        it('returns a `<circle />` element string', () => {
            assert(circle).isElementTag('circle');
        });

        it('has the correct `cx` and `cy` attributes', () => {
            assert(circleEl).hasAttributes({ cx: '110', cy: '210' });
        });

        describe('given a `fill` color', () => {
            it('has a `fill` color attributes', () => {
                let filledCircleSvg = parseSvg(drawCircle(circleSettings, { fill: 'pink' }));
                let filledCircleEl  = filledCircleSvg && filledCircleSvg.querySelector('circle');

                assert(filledCircleEl).hasAttributes({ fill: 'pink' });
            });
        });

        describe('given a `stroke` color', () => {
            it('has `stroke` color and `stroke-width` attributes', () => {
                let strokeCircleSvg = parseSvg(drawCircle(circleSettings, { stroke: 'blue' }));
                let strokeCircleEl  = strokeCircleSvg && strokeCircleSvg.querySelector('circle');

                assert(strokeCircleEl).hasAttributes({
                    'stroke-width': '2',
                    stroke: 'blue',
                });
            });
        });

        describe('invalid configuration', () => {
            Object.keys(circleSettings).forEach((required) => {
                let settings = { ...circleSettings };
                delete settings[required];

                describe(`when \`${required}\` is omitted`, () => {
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

        const line = drawLine(lineSettings);
        const svgEl = parseSvg(line);
        const lineEl = svgEl && svgEl.querySelector('line');

        it('returns a `<line />` element string', () => {
            assert(line).isElementTag('line');
        });

        it('has correct `x1`, `y1`, `x2`, and `y2` attributes', () => {
            assert(lineEl).hasAttributes({
                x1: '10',
                y1: '20',
                x2: '300',
                y2: '400',
            });
        });

        it('has correct `stroke` color attribute', () => {
            assert(lineEl).hasAttributes({ stroke: 'gray' });
        });

        it('has correct `stroke-width` attribute', () => {
            assert(lineEl).hasAttributes({ 'stroke-width': '2' });
        });

        it('does not have the `stroke-dasharray` attribute', () => {
            assert(lineEl).excludesAttributes([ 'stroke-dasharray' ]);
        });

        describe('given a truthy `dashed` option', () => {
            it('should have the `stroke-dasharray` attribute', () => {
                let dashedLineSvgEl = parseSvg(drawLine(lineSettings, { dashed: true }));
                let dashedLineEl = dashedLineSvgEl && dashedLineSvgEl.querySelector('line');

                assert(dashedLineEl).hasAttributes({
                    'stroke-dasharray': dashLength.toString(),
                });
            });
        });

        describe('invalid configuration', () => {
            Object.keys(lineSettings).forEach((required) => {
                let settings = { ...lineSettings };
                delete settings[required];

                describe(`when "${required}" is omitted`, () => {
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
        const rect = drawRect(rectSettings);

        it('should return a `<rect />` element string', () => {
            assert(rect).isElementTag('rect');
        });

        it('should have correct attributes', () => {
            assert(rect)
                .stringIncludes('x="24"')
                .stringIncludes('y="48"')
                .stringIncludes('width="72"')
                .stringIncludes('height="96"');
        });

        describe('given extra attributes', () => {
            it('should include the attributes on the element', () => {
                assert(drawRect(rectSettings, { stroke: 'red', fill: 'purple' }))
                    .stringIncludes('stroke="red"')
                    .stringIncludes('fill="purple"');
            });
        });

        describe('invalid configuration', () => {
            Object.keys(rectSettings).forEach((required) => {
                let settings = { ...rectSettings };
                delete settings[required];

                describe(`when \`${required}\` is omitted`, () => {
                    it('should throw', () => {
                        assert(() => drawRect(settings)).throws(`${required} is required by drawRect()`);
                    });
                });
            });
        });
    });

    describe('drawText()', () => {
        const textElement = drawText('Wizard Tower', { x: 20, y: 20 });

        it('should return a `<text>` element string', () => {
            assert(textElement).isElementTag('text');
        });

        it('should have the correct `x` attribute', () => {
            assert(textElement).stringIncludes('x="20"');
        });

        it('should have the correct `y` attribute including the `pxTextOffset`', () => {
            assert(textElement).stringIncludes('y="22"');
        });

        it('should contain the text as the content', () => {
            assert(/<text(.+?)>Wizard Tower<\/text>/.test(textElement)).isTrue();
        });

        describe('given a `fontSize` option', () => {
            it('should have the correct `font-size` attribute', () => {
                const customFontSizeTextElement = drawText('Goblin Lair', { x: 0, y: 0 }, { fontSize: 24 });
                assert(customFontSizeTextElement).stringIncludes('font-size="24px"');
            });
        });

        describe('given a `fill` option', () => {
            it('should have the correct `fill` color attribute', () => {
                const customFillTextElement = drawText('Goblin Zeppelin', { x: 0, y: 0 }, { fill: 'purple' });
                assert(customFillTextElement).stringIncludes('fill="purple"');
            });
        });
    });
};
