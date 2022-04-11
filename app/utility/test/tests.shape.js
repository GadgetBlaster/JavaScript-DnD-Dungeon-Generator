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

        const circle   = drawCircle(circleSettings);
        const circleEl = parseSvg(circle).querySelector('circle');

        it('returns a `<circle />` element string', () => {
            assert(circle).isElementTag('circle');
        });

        it('has the correct `cx` and `cy` attributes', () => {
            assert(circleEl).hasAttributes({ cx: '110', cy: '210' });
        });

        describe('given a `fill` color', () => {
            it('has a `fill` color attributes', () => {
                let filledCircle = drawCircle(circleSettings, { fill: 'pink' });

                assert(parseSvg(filledCircle).querySelector('circle'))
                    .hasAttributes({ fill: 'pink' });
            });
        });

        describe('given a `stroke` color', () => {
            it('has `stroke` color and `stroke-width` attributes', () => {
                let strokeCircle = drawCircle(circleSettings, { stroke: 'blue' });

                assert(parseSvg(strokeCircle).querySelector('circle'))
                    .hasAttributes({ 'stroke-width': '2', stroke: 'blue' });
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

        const line   = drawLine(lineSettings);
        const lineEl = parseSvg(line).querySelector('line');

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
            it('has the `stroke-dasharray` attribute', () => {
                let dashedLine = drawLine(lineSettings, { dashed: true });

                assert(parseSvg(dashedLine).querySelector('line'))
                    .hasAttributes({ 'stroke-dasharray': dashLength.toString() });
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

        const rect   = drawRect(rectSettings);
        const rectEl = parseSvg(rect).querySelector('rect');

        it('returns a `<rect />` element string', () => {
            assert(rect).isElementTag('rect');
        });

        it('has correct attributes', () => {
            assert(rectEl).hasAttributes({
                x     : '24',
                y     : '48',
                width : '72',
                height: '96',
            });
        });

        describe('given extra attributes', () => {
            it('includes the attributes on the element', () => {
                const styledRect = drawRect(rectSettings, { stroke: 'red', fill: 'purple' });
                assert(parseSvg(styledRect).querySelector('rect'))
                    .hasAttributes({ stroke: 'red', fill: 'purple' });
            });
        });

        describe('invalid configuration', () => {
            Object.keys(rectSettings).forEach((required) => {
                let settings = { ...rectSettings };
                delete settings[required];

                describe(`when \`${required}\` is omitted`, () => {
                    it('throws', () => {
                        assert(() => drawRect(settings)).throws(`${required} is required by drawRect()`);
                    });
                });
            });
        });
    });

    describe('drawText()', () => {
        const text   = drawText('Wizard Tower', { x: 20, y: 20 });
        const textEl = parseSvg(text).querySelector('text');

        it('returns a `<text>` element string', () => {
            assert(text).isElementTag('text');
        });

        it('has the correct `x` attribute', () => {
            assert(textEl).hasAttributes({ x: '20' });
        });

        it('has the correct `y` attribute including the `pxTextOffset`', () => {
            assert(textEl).hasAttributes({ y: '22' });
        });

        it('contains the text as the content', () => {
            assert(textEl.textContent).equals('Wizard Tower')
        });

        describe('given a `fontSize` option', () => {
            it('has the correct `font-size` attribute', () => {
                const customFontSizeTextElement = drawText('Goblin Lair', { x: 0, y: 0 }, { fontSize: 24 });
                assert(parseSvg(customFontSizeTextElement).querySelector('text'))
                    .hasAttributes({ 'font-size': '24px' });
            });
        });

        describe('given a `fill` option', () => {
            it('has the correct `fill` color attribute', () => {
                const customFillTextElement = drawText('Goblin Zeppelin', { x: 0, y: 0 }, { fill: 'purple' });
                assert(parseSvg(customFillTextElement).querySelector('text'))
                    .hasAttributes({ fill: 'purple' });
            });
        });
    });
};
