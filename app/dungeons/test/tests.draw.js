// @ts-check
import {
    // Config
    pxCell,
    testDoorInset       as doorInset,
    testDoorWidth       as doorWidth,
    testPillarInset     as pillarInset,
    testPillarThreshold as pillarThreshold,
    testPxTextOffset    as pxTextOffset,

    // Private Functions
    testDetRectAttrs   as getRectAttrs,
    testDrawCircle     as drawCircle,
    testDrawLine       as drawLine,
    testDrawPillar     as drawPillar,
    testDrawPillarCell as drawPillarCell,
    testDrawPillars    as drawPillars,
    testDrawRect       as drawRect,
    testDrawRoomText   as drawRoomText,
    testDrawText       as drawText,
    testDrawTrapText   as drawTrapText,

    // Public functions
    drawDoor,
    drawGrid,
} from '../draw.js';

import { directions } from '../map.js';
import doorType from '../../rooms/door.js';

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {

    // -- Private Functions ----------------------------------------------------

    describe('getRectAttrs()', () => {
        it('should return each value multiplied by `pxCell`', () => {
            const { x, y, width, height } = getRectAttrs({
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

    describe('drawCircle()', () => {
        const circleSettings = {
            cx: 110,
            cy: 210,
            r: 310,
            fill: 'pink',
            width: 2,
        };

        const circle = drawCircle(circleSettings);

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

    describe('drawLine()', () => {
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

    describe('drawPillar()', () => {
        it('should return a `<circle />` element string', () => {
            assert(drawPillar()).isHtmlTag('circle');
        });

        it('it should have the correct `cx` and `cy` attributes', () => {
            const pillar = drawPillar({ cx: 114, cy: 214 });

            assert(pillar)
                .stringIncludes('cx="114"')
                .stringIncludes('cy="214"');
        });

        describe('given attributes', () => {
            it('should add to or override the default attributes', () => {
                const pillar = drawPillar({
                    cx: 10,
                    cy: 20,
                    stroke: 'red',
                });

                assert(pillar).stringIncludes('stroke="red"');
            });
        });
    });

    describe('drawPillarCell()', () => {
        const pillarCell = drawPillarCell([ 15, 25 ]);

        it('should return a `<circle />` element string', () => {
            assert(pillarCell).isHtmlTag('circle');
        });

        describe('given attributes', () => {
            it('it should have `cx` and `cy` attributes in the center of the cell', () => {
                const pxHalfCell = (pxCell / 2);
                const cx = (15 * pxCell) + pxHalfCell;
                const cy = (25 * pxCell) + pxHalfCell;

                assert(pillarCell)
                    .stringIncludes(`cx="${cx}"`)
                    .stringIncludes(`cy="${cy}"`);
            });
        });
    });

    describe('drawPillars()', () => {
        const roomConfig = {
            x: 10,
            y: 10,
            width: 10,
            height: 10,
        };

        describe('given a room `width` less than `pillarThreshold`', () => {
            it('should return an empty array', () => {
                const pillars = drawPillars({
                    ...roomConfig,
                    width: pillarThreshold - 1,
                });

                assert(pillars).isArray();
                assert(pillars.length).equals(0);
            });
        });

        describe('given a room `height` less than `pillarThreshold`', () => {
            it('should return an empty array', () => {
                const pillars = drawPillars({
                    ...roomConfig,
                    height: pillarThreshold - 1,
                });

                assert(pillars).isArray();
                assert(pillars.length).equals(0);
            });
        });

        describe('given a room `width` and `height` of at least `pillarThreshold`', () => {
            const pillars = drawPillars(roomConfig);

            it('should an array of four `<circle />` element strings', () => {
                assert(pillars.length).equals(4);
                pillars.forEach((pillar) => {
                    assert(pillar).isHtmlTag('circle');
                });
            });

            it('should place pillar in the center of each inset corner cell of the room', () => {
                const { x, y, width, height } = roomConfig;

                const innerWidth  = width - (pillarInset * 2);
                const innerHeight = height - (pillarInset * 2);

                const xLeft   = ((x + pillarInset) * pxCell) + (pxCell / 2);
                const xRight  = ((x + innerWidth)  * pxCell) + (pxCell / 2);
                const yTop    = ((y + pillarInset) * pxCell) + (pxCell / 2);
                const yBottom = ((y + innerHeight) * pxCell) + (pxCell / 2);

                assert(pillars.join(''))
                    .stringIncludes(`cx="${xLeft}" cy="${yTop}"`)
                    .stringIncludes(`cx="${xRight}" cy="${yTop}"`)
                    .stringIncludes(`cx="${xLeft}" cy="${yBottom}"`)
                    .stringIncludes(`cx="${xRight}" cy="${yBottom}"`);
            });
        });
    });

    describe('drawRect()', () => {
        it('should return a `<rect />` element string', () => {
            assert(drawRect()).isHtmlTag('rect');
        });

        describe('given attributes', () => {
            it('should have the correct attributes', () => {
                const rect = drawRect({
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

    describe('drawRoomText()', () => {
        const roomText = drawRoomText({
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
            const y = 45 + pxTextOffset;
            assert(roomText).stringIncludes(`y="${y}"`);
        });

        describe('given a `roomLabel`', () => {
            const roomTextWithLabel = drawRoomText({
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

    describe('drawText()', () => {
        describe('given text and coordinates', () => {
            const textElement = drawText('Wizard Tower', [ 20, 20 ]);

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
                const textElement = drawText('Goblin Lair', [ 0, 0 ], { fontSize: 24 });
                assert(textElement).stringIncludes('font-size="24px"');
            });
        });

        describe('given a `fill` option', () => {
            it('should have the correct `fill` color attribute', () => {
                const textElement = drawText('Goblin Zeppelin', [ 0, 0 ], { fill: 'purple' });
                assert(textElement).stringIncludes('fill="purple"');
            });
        });
    });

    describe('drawTrapText()', () => {
        const trapText = drawTrapText({
            x: 10,
            y: 10,
            width: 40,
            height: 60,
        });

        it('should return a `<text>` element string', () => {
            assert(trapText).isHtmlTag('text');
        });

        it('the `x` and `y` coordinates should be the center of the lower left cell of the room', () => {
            const pxHalfCell = (pxCell / 2);
            const x = 10 + pxHalfCell;
            const y = 70 - pxHalfCell + pxTextOffset;

            assert(trapText).stringIncludes(`x="${x}"`);
            assert(trapText).stringIncludes(`y="${y}"`);
        });
    });

    // -- Public Functions -----------------------------------------------------

    describe('drawDoor()', () => {
        const doorAttrs = { x: 10, y: 20, width: 1, height: 1 };
        const doorArgs  = {
            direction: directions.north,
            locked: false,
            type: doorType.passageway,
        };

        const door     = drawDoor(doorAttrs, doorArgs);
        const doorRect = door.slice(0, door.indexOf('/>') + 2);

        it('should return a string starting with a `<rect />` element string', () => {
            assert(doorRect).isHtmlTag('rect');
        });

        it('the `<rect />` should have the correct `x` and `y` attributes', () => {
            const { x, y } = doorAttrs;

            assert(doorRect)
                .stringIncludes(`x="${x * pxCell}"`)
                .stringIncludes(`y="${y * pxCell}"`);
        });

        it('the `<rect />` should have the correct `width` and `height` attributes', () => {
            const { width, height } = doorAttrs;

            assert(doorRect)
                .stringIncludes(`width="${width * pxCell}"`)
                .stringIncludes(`height="${height * pxCell}"`);
        });

        const northSouthDoorAttrs = { x: 10, y: 20, width: 1, height: 2 };
        const northSouthDoorArgs  = { ...doorArgs, direction: directions.north};

        const eastWestDoorAttrs = { x: 10, y: 20, width: 2, height: 1 };
        const eastWestDoorArgs  = { ...doorArgs, direction: directions.east };

        describe('door orientations', () => {
            describe('door wall lines', () => {
                describe('when the door direction is north or south', () => {
                    it('should include two horizontal wall lines with correct coordinate attributes', () => {
                        const { x, y, width, height } = northSouthDoorAttrs;

                        const line1x = x * pxCell;
                        const line2x = (x + width) * pxCell;

                        const y1 = y * pxCell;
                        const y2 = (y + height) * pxCell;

                        assert(drawDoor(northSouthDoorAttrs, northSouthDoorArgs))
                            .stringIncludes(`<line x1="${line1x}" y1="${y1}" x2="${line1x}" y2="${y2}"`)
                            .stringIncludes(`<line x1="${line2x}" y1="${y1}" x2="${line2x}" y2="${y2}"`);
                    });
                });

                describe('when the door direction is east or west', () => {
                    it('should include two horizontal wall lines with correct coordinate attributes', () => {
                        const { x, y, width, height } = eastWestDoorAttrs;

                        const x1 = x * pxCell;
                        const x2 = (x + width) * pxCell;

                        const line1y = y * pxCell;
                        const line2y = (y + height) * pxCell;

                        assert(drawDoor(eastWestDoorAttrs, eastWestDoorArgs))
                            .stringIncludes(`<line x1="${x1}" y1="${line1y}" x2="${x2}" y2="${line1y}"`)
                            .stringIncludes(`<line x1="${x1}" y1="${line2y}" x2="${x2}" y2="${line2y}"`);
                    });
                });
            });

            describe('when the door type is lockable', () => {
                describe('when the door direction is north or south', () => {
                    const { x, y, width, height } = northSouthDoorAttrs;
                    const lockableDoor = drawDoor(northSouthDoorAttrs, {
                        ...northSouthDoorArgs,
                        type: doorType.wooden,
                    });

                    it('should include a horizontal line in the center of the cell ', () => {
                        const x1 = x * pxCell;
                        const x2 = (x + width) * pxCell;
                        const y1 = (y + (height / 2)) * pxCell;
                        const y2 = y1;

                        assert(lockableDoor)
                            .stringIncludes(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"`);
                    });

                    it('should include a horizontal inset rectangle representing the door', () => {
                        const rectCenterX = (x * pxCell) + ((width  * pxCell) / 2);
                        const rectCenterY = (y * pxCell) + ((height * pxCell) / 2);

                        const rectX = rectCenterX - (doorInset / 2);
                        const rectY = rectCenterY - (doorWidth / 2);

                        const rectW = (width * pxCell) - doorInset;
                        const rectH = doorWidth;

                        assert(rectW > rectH).isTrue();
                        assert(lockableDoor)
                            .stringIncludes(`<rect x="${rectX}" y="${rectY}" width="${rectW}" height="${rectH}"`);
                    });
                });

                describe('when the door direction is east or west', () => {
                    const { x, y, width, height } = eastWestDoorAttrs;
                    const lockableDoor = drawDoor(eastWestDoorAttrs, {
                        ...eastWestDoorArgs,
                        type: doorType.wooden,
                    });

                    it('should include a horizontal line in the center of the cell ', () => {
                        const x1 = (x + (width / 2)) * pxCell;
                        const x2 = x1;
                        const y1 = y * pxCell;
                        const y2 = (y + height) * pxCell;

                        assert(lockableDoor)
                            .stringIncludes(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"`);
                    });

                    it('should include a vertical inset rectangle representing the door', () => {
                        const rectCenterX = (x * pxCell) + ((width  * pxCell) / 2);
                        const rectCenterY = (y * pxCell) + ((height * pxCell) / 2);

                        const rectX = rectCenterX - (doorWidth / 2);
                        const rectY = rectCenterY - (doorInset / 2);

                        const rectW = doorWidth;
                        const rectH = (height * pxCell) - doorInset;

                        assert(rectH > rectW).isTrue();
                        assert(lockableDoor)
                            .stringIncludes(`<rect x="${rectX}" y="${rectY}" width="${rectW}" height="${rectH}"`);
                    });
                });
            });

            describe('when the door is an archway', () => {
                describe('when the door direction is north or south', () => {
                    it('should draw two vertically centered pillars on the left and right of the cell', () => {
                        const { x, y, width, height } = northSouthDoorAttrs;
                        const archwayDoor = drawDoor(northSouthDoorAttrs, {
                            ...northSouthDoorArgs,
                            type: doorType.archway
                        });

                        const cx1 = x * pxCell;
                        const cx2 = (x * pxCell) + (width  * pxCell);
                        const cy  = (y * pxCell) + ((height /2) * pxCell);

                        assert(archwayDoor)
                            .stringIncludes(`<circle cx="${cx1}" cy="${cy}"`)
                            .stringIncludes(`<circle cx="${cx2}" cy="${cy}"`);
                    });
                });

                describe('when the door direction is east or west', () => {
                    it('should draw two horizontally centered pillars at the top and bottom of the cell', () => {
                        const { x, y, width, height } = eastWestDoorAttrs;
                        const archwayDoor = drawDoor(eastWestDoorAttrs, {
                            ...eastWestDoorArgs,
                            type: doorType.archway
                        });

                        const cx  = (x * pxCell) + ((width / 2) * pxCell);
                        const cy1 = y * pxCell;
                        const cy2 = (y * pxCell) + (height * pxCell);

                        assert(archwayDoor)
                            .stringIncludes(`<circle cx="${cx}" cy="${cy1}"`)
                            .stringIncludes(`<circle cx="${cx}" cy="${cy2}"`);
                    });
                });
            });
        });
    });

    describe('drawGrid()', () => {
        let gridWidth  = 4;
        let gridHeight = 5;

        let grid = drawGrid({ gridWidth, gridHeight });

        it('returns the correct number of `<line />` element strings', () => {
            let lineCount = gridWidth + 1 + gridHeight + 1;
            assert(grid.match(/<line/g).length).equals(lineCount);
            assert(grid.match(/\/>/g).length).equals(lineCount);
        });

        it('returns a vertical `<line />` element string for each horizontal grid cell and the outer edge', () => {
            let y2 = gridHeight * pxCell;

            [ ...Array(gridWidth + 1).keys() ].forEach((xCord) => {
                let x = xCord * pxCell;
                assert(grid).stringIncludes(`x1="${x}" y1="0" x2="${x}" y2="${y2}"`);
            });
        });

        it('returns a horizontal `<line />` element string for each vertical grid cell and the outer edge', () => {
            let x2 = gridWidth * pxCell;

            [ ...Array(gridHeight + 1).keys() ].forEach((yCord) => {
                let y = yCord * pxCell;
                assert(grid).stringIncludes(`x1="0" y1="${y}" x2="${x2}" y2="${y}"`);
            });
        });
    });

};
