
import {
    pxCell,
    pxTextOffset,
    pillarThreshold,
    pillarInset,

    // Private Functions
    testDrawText as drawText,
    testDrawLine as drawLine,
    testDrawCircle as drawCircle,
    testDrawRect as drawRect,
    testDrawPillar as drawPillar,
    testDetRectAttrs as getRectAttrs,
    testDrawRoomText as drawRoomText,
    testDrawTrapText as drawTrapText,
    testDrawPillarCell as drawPillarCell,
    testDrawPillars as drawPillars,

    // Public functions
} from '../draw.js';

/**
 * @param {import('../../unit/state.js').Utility}
 */
export default ({ assert, describe, it }) => {

    // -- Private Functions ----------------------------------------------------

    describe('drawText()', () => {
        describe('given text and coordinates', () => {
            let textElement = drawText('Wizard Tower', [ 20, 20 ]);

            it('should return a `<text>` element string', () => {
                assert(textElement).isHtmlTag('text');
            });

            it('should have the correct `x` attribute', () => {
                assert(textElement).stringIncludes('x="20"');
            });

            it('should have the correct `y` attribute including the `pxTextOffset`', () => {
                assert(textElement).stringIncludes('y="22"');
            });
        });

        describe('given a `fontSize` option', () => {
            it('should have the correct `font-size` attribute', () => {
                let textElement = drawText('Goblin Lair', [ 0, 0 ], { fontSize: 24 });
                assert(textElement).stringIncludes('font-size="24px"');
            });
        });

        describe('given a `fill` option', () => {
            it('should have the correct `fill` color attribute', () => {
                let textElement = drawText('Goblin Zeppelin', [ 0, 0 ], { fill: 'purple' });
                assert(textElement).stringIncludes('fill="purple"');
            });
        });
    });

    describe('drawLine()', () => {
        let lineSettings = {
            x1: 10,
            y1: 20,
            x2: 300,
            y2: 400,
            color: 'gray',
            width: 2,
        };

        let line = drawLine(lineSettings);

        it('should return a `<line />` element string', () => {
            assert(line).isHtmlTag('line');
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
                assert(drawLine({
                    ...lineSettings,
                    dashed: true,
                })).stringIncludes('stroke-dasharray="5"');
            });
        });
    });

    describe('drawCircle()', () => {
        let circleSettings = {
            cx: 110,
            cy: 210,
            r: 310,
            fill: 'pink',
            width: 2,
        };

        let circle = drawCircle(circleSettings);

        it('should return a `<circle />` element string', () => {
            assert(circle).isHtmlTag('circle');
        });

        it('should have the correct `cx` and `cy`, attributes', () => {
            assert(circle)
                .stringIncludes('cx="110"')
                .stringIncludes('cy="210"');
        });

        it('should have the correct `fill` color attribute', () => {
            assert(circle).stringIncludes('fill="pink"');
        });

        describe('given a truthy `stroke` option', () => {
            it('should have the `stroke-width` attribute', () => {
                assert(drawCircle({
                    ...circleSettings,
                    stroke: true,
                })).stringIncludes('stroke-width="2"');
            });
        });
    });

    describe('drawRect()', () => {
        it('should return a `<rect />` element string', () => {
            assert(drawRect()).isHtmlTag('rect');
        });

        describe('given attributes', () => {
            it('should have the correct attributes', () => {
                let rect = drawRect({
                    x: 14,
                    y: 24,
                    width: 34,
                    height: 44,
                });

                assert(rect)
                    .stringIncludes('x="14"')
                    .stringIncludes('y="24"')
                    .stringIncludes('width="34"')
                    .stringIncludes('height="44"');
            });
        });
    });

    describe('drawPillar()', () => {
        it('should return a `<circle />` element string', () => {
            assert(drawPillar()).isHtmlTag('circle');
        });

        it('it should have the correct `cx` and `cy` attributes', () => {
            let pillar = drawPillar({ cx: 114, cy: 214 });

            assert(pillar)
                .stringIncludes('cx="114"')
                .stringIncludes('cy="214"')
        });

        describe('given attributes', () => {
            it('should add to or override the default attributes', () => {
                let pillar = drawPillar({
                    cx: 10,
                    cy: 20,
                    stroke: 'red',
                });

                assert(pillar).stringIncludes('stroke="red"');
            });
        });
    });

    describe('getRectAttrs()', () => {
        it('should return each value multiplied by `pxCell`', () => {
            let { x, y, width, height } = getRectAttrs({
                x: 12,
                y: 13,
                width: 444,
                height: 555,
            });

            assert(x).equals(12 * pxCell);
            assert(y).equals(13 * pxCell);
            assert(width).equals(444 * pxCell);
            assert(height).equals(555 * pxCell);
        });
    });

    describe('drawRoomText()', () => {
        let roomText = drawRoomText({
            x: 10,
            y: 20,
            width: 30,
            height: 50,
        }, {
            roomNumber: 42,
        });

        it('should return a single `<text>` element string', () => {
            assert(roomText).isHtmlTag('text');
            assert(roomText.match(/<text/g).length).equals(1);
            assert(roomText.match(/<\/text>/g).length).equals(1);
        });

        it('should contain the room number as the content', () => {
            assert(roomText).stringIncludes('>42<');
        });

        it('the `x` coordinate should be the horizontal center of the room rect', () => {
            assert(roomText).stringIncludes('x="25"');
        });

        it('the `y` coordinate should be the vertical center of the room rect plus the `pxTextOffset`', () => {
            let y = 45 + pxTextOffset;
            assert(roomText).stringIncludes(`y="${y}"`);
        });

        describe('given a `roomLabel`', () => {
            let roomTextWithLabel = drawRoomText({
                x: 10,
                y: 20,
                width: 30,
                height: 50,
            }, {
                roomNumber: 42,
                roomLabel: 'Thar be dragons',
            });

            it('should return two `<text>` element strings', () => {
                assert(roomTextWithLabel.match(/<text/g).length).equals(2);
                assert(roomTextWithLabel.match(/<\/text>/g).length).equals(2);
            });

            it('should contain the roomLabel as the content', () => {
                assert(roomTextWithLabel).stringIncludes('>Thar be dragons<');
            });
        });
    });

    describe('drawTrapText()', () => {
        let trapText = drawTrapText({
            x: 10,
            y: 10,
            width: 40,
            height: 60,
        });

        it('should return a `<text>` element string', () => {
            assert(trapText).isHtmlTag('text');
        });

        it('the `x` and `y` coordinates should be the center of the lower left cell of the room', () => {
            let pxHalfCell = (pxCell / 2);
            let x = 10 + pxHalfCell;
            let y = 70 - pxHalfCell + pxTextOffset;

            assert(trapText).stringIncludes(`x="${x}"`);
            assert(trapText).stringIncludes(`y="${y}"`);
        });
    });

    describe('drawPillarCell()', () => {
        let pillarCell = drawPillarCell([ 15, 25 ]);

        it('should return a `<circle />` element string', () => {
            assert(pillarCell).isHtmlTag('circle');
        });

        describe('given attributes', () => {
            it('it should have `cx` and `cy` attributes in the center of the cell', () => {
                let pxHalfCell = (pxCell / 2);
                let cx = (15 * pxCell) + pxHalfCell;
                let cy = (25 * pxCell) + pxHalfCell;

                assert(pillarCell)
                    .stringIncludes(`cx="${cx}"`)
                    .stringIncludes(`cy="${cy}"`);
            });
        });
    });

    describe('drawPillars()', () => {
        let roomConfig = {
            x: 10,
            y: 10,
            width: 10,
            height: 10,
        };

        describe('given a room `width` less than `pillarThreshold`', () => {
            it('should return an empty array', () => {
                let pillars = drawPillars({
                    ...roomConfig,
                    width: pillarThreshold - 1,
                });

                assert(pillars).isArray();
                assert(pillars.length).equals(0);
            });
        });

        describe('given a room `height` less than `pillarThreshold`', () => {
            it('should return an empty array', () => {
                let pillars = drawPillars({
                    ...roomConfig,
                    height: pillarThreshold - 1,
                });

                assert(pillars).isArray();
                assert(pillars.length).equals(0);
            });
        });

        describe('given a room `width` and `height` of at least `pillarThreshold`', () => {
            let pillars = drawPillars(roomConfig);

            it('should an array of four `<circle />` element strings', () => {
                assert(pillars.length).equals(4);
                pillars.forEach((pillar) => {
                    assert(pillar).isHtmlTag('circle');
                });
            });

            it('should place pillar in the center of each inset corner cell of the room', () => {
                let { x, y, width, height } = roomConfig;

                let innerWidth  = width - (pillarInset * 2);
                let innerHeight = height - (pillarInset * 2);

                let xLeft   = ((x + pillarInset) * pxCell) + (pxCell / 2);
                let xRight  = ((x + innerWidth)  * pxCell) + (pxCell / 2);
                let yTop    = ((y + pillarInset) * pxCell) + (pxCell / 2);
                let yBottom = ((y + innerHeight) * pxCell) + (pxCell / 2);

                assert(pillars.join(''))
                    .stringIncludes(`cx="${xLeft}" cy="${yTop}"`)
                    .stringIncludes(`cx="${xRight}" cy="${yTop}"`)
                    .stringIncludes(`cx="${xLeft}" cy="${yBottom}"`)
                    .stringIncludes(`cx="${xRight}" cy="${yBottom}"`);
            });
        });
    });

    // -- Public Functions -----------------------------------------------------

};
