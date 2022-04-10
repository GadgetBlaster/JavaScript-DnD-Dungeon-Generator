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
        const circleEl = svgEl && [ ...parseSvg(circle).children ].pop();

        it('returns a `<circle />` element string', () => {
            assert(circle).isElementTag('circle');
        });

        it('should have the correct `cx` and `cy`, attributes', () => {
            assert(circleEl).hasAttributes({ cx: '110', cy: '210' });
        });

        describe('given a `fill` color', () => {
            it('should have a `fill` color attributes', () => {
                assert(drawCircle(circleSettings, { fill: 'pink' }))
                    .stringIncludes('fill="pink"');
            });
        });

        describe('given a `stroke` color', () => {
            it('should have `stroke` color and `stroke-width` attributes', () => {
                assert(drawCircle(circleSettings, { stroke: 'blue' }))
                    .stringIncludes('stroke-width="2"')
                    .stringIncludes('stroke="blue"');
            });
        });

        describe('invalid configuration', () => {
            Object.keys(circleSettings).forEach((required) => {
                let settings = { ...circleSettings };
                delete settings[required];

                describe(`when \`${required}\` is omitted`, () => {
                    it('should throw', () => {
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

        it('should return a `<line />` element string', () => {
            assert(line).isElementTag('line');
        });

        it('should have the correct `x1`, `y1`, `x2`, and `y2` attributes', () => {
            assert(line)
                .stringIncludes('x1="10"')
                .stringIncludes('y1="20"')
                .stringIncludes('x2="300"')
                .stringIncludes('y2="400"');
        });

        it('should have the correct `stroke` color attribute', () => {
            assert(line).stringIncludes('stroke="gray"');
        });

        it('should have the correct `stroke-width` attribute', () => {
            assert(line).stringIncludes('stroke-width="2"');
        });

        it('should not have the `stroke-dasharray` attribute', () => {
            assert(line).stringExcludes('stroke-dasharray');
        });

        describe('given a truthy `dashed` option', () => {
            it('should have the `stroke-dasharray` attribute', () => {
                assert(drawLine(lineSettings, { dashed: true }))
                    .stringIncludes(`stroke-dasharray="${dashLength}"`);
            });
        });

        describe('invalid configuration', () => {
            Object.keys(lineSettings).forEach((required) => {
                let settings = { ...lineSettings };
                delete settings[required];

                describe(`when \`${required}\` is omitted`, () => {
                    it('should throw', () => {
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
