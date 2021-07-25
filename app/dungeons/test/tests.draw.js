// @ts-check
import {
    // Config
    pxCell,
    testColorLockedFill    as colorLockedFill,
    testDoorConcealedLabel as doorConcealedLabel,
    testDoorInset          as doorInset,
    testDoorSecretLabel    as doorSecretLabel,
    testDoorWidth          as doorWidth,
    testPillarInset        as pillarInset,
    testPillarThreshold    as pillarThreshold,
    testPxTextOffset       as pxTextOffset,
    testRadiusHole         as radiusHole,
    testRadiusPillar       as radiusPillar,
    testTrapLabel          as trapLabel,

    // Private Functions
    testDrawCircle     as drawCircle,
    testDrawLine       as drawLine,
    testDrawPillar     as drawPillar,
    testDrawPillarCell as drawPillarCell,
    testDrawPillars    as drawPillars,
    testDrawRect       as drawRect,
    testDrawRoomText   as drawRoomText,
    testDrawText       as drawText,
    testDrawTrapText   as drawTrapText,
    testGetRectAttrs   as getRectAttrs,

    // Public functions
    drawDoor,
    drawGrid,
    drawMap,
    drawRoom,
} from '../draw.js';

import { directions } from '../map.js';
import doorType from '../../rooms/door.js';

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {

    // -- Private Functions ----------------------------------------------------

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
                assert(drawLine({ ...lineSettings, dashed: true }))
                    .stringIncludes('stroke-dasharray="5"');
            });
        });
    });

    describe('drawPillar()', () => {
        const pillar = drawPillar({ cx: 114, cy: 214 });

        it('should return a `<circle />` element string', () => {
            assert(pillar).isHtmlTag('circle');
        });

        it('it should have the correct `cx` and `cy` attributes', () => {
            assert(pillar)
                .stringIncludes('cx="114"')
                .stringIncludes('cy="214"');
        });

        describe('given attributes', () => {
            it('should add to or override the default attributes', () => {
                const redPillar = drawPillar({ cx: 10, cy: 20, stroke: 'red' });
                assert(redPillar).stringIncludes('stroke="red"');
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
            width: pillarThreshold,
            height: pillarThreshold,
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

            it('should return an array of four `<circle />` element strings', () => {
                assert(pillars.length).equals(4);

                pillars.forEach((pillar) => {
                    assert(pillar).isHtmlTag('circle');
                });
            });

            it('should place a pillar in the center of each corner cell of the room, inset by `pillarInset`', () => {
                const { x, y, width, height } = roomConfig;

                const innerWidth  = width - (pillarInset * 2);
                const innerHeight = height - (pillarInset * 2);

                const xLeft   = ((x + pillarInset) * pxCell) + (pxCell / 2);
                const xRight  = ((x + innerWidth)  * pxCell) + (pxCell / 2);
                const yTop    = ((y + pillarInset) * pxCell) + (pxCell / 2);
                const yBottom = ((y + innerHeight) * pxCell) + (pxCell / 2);

                assert(pillars.shift())
                    .stringIncludes(`cx="${xLeft}"`)
                    .stringIncludes(`cy="${yTop}"`);

                assert(pillars.shift())
                    .stringIncludes(`cx="${xRight}"`)
                    .stringIncludes(`cy="${yTop}"`);

                assert(pillars.shift())
                    .stringIncludes(`cx="${xLeft}"`)
                    .stringIncludes(`cy="${yBottom}"`);

                assert(pillars.shift())
                    .stringIncludes(`cx="${xRight}"`)
                    .stringIncludes(`cy="${yBottom}"`);
            });
        });
    });

    describe('drawRect()', () => {
        const rect = drawRect({
            x: 24,
            y: 48,
            width: 72,
            height: 96,
        });

        it('should return a `<rect />` element string', () => {
            assert(rect).isHtmlTag('rect');
        });

        it('should have correct attributes', () => {
            assert(rect)
                .stringIncludes('x="24"')
                .stringIncludes('y="48"')
                .stringIncludes('width="72"')
                .stringIncludes('height="96"');
        });
    });

    describe('drawRoomText()', () => {
        const roomTextConfig = {
            x: 10,
            y: 20,
            width: 30,
            height: 50,
        };

        const roomText = drawRoomText(roomTextConfig, { roomNumber: 42 });

        it('should return a single `<text>` element string', () => {
            assert(roomText).isHtmlTag('text');
        });

        it('should contain the roomLabel as the content', () => {
            assert(/<text(.+?)>42<\/text>/.test(roomText)).isTrue();
        });

        it('the `x` coordinate should be the horizontal center of the room rect', () => {
            const x = roomTextConfig.x + (roomTextConfig.width / 2);
            assert(roomText).stringIncludes(`x="${x}"`);
        });

        it('the `y` coordinate should be the vertical center of the room rect plus the `pxTextOffset`', () => {
            const y = (roomTextConfig.y + (roomTextConfig.height / 2)) + pxTextOffset;
            assert(roomText).stringIncludes(`y="${y}"`);
        });

        describe('given a `roomLabel`', () => {
            const roomTextWithLabel = drawRoomText(roomTextConfig, {
                roomNumber: 42,
                roomLabel: 'Thar be dragons',
            });

            it('should return two `<text>` element strings', () => {
                const matches = roomTextWithLabel.match(/<text(.+?)>(.+?)<\/text>/g);

                assert(matches).isArray();
                matches && assert(matches.length).equals(2);
            });

            it('should contain the roomLabel as the content', () => {
                assert(/<text(.+?)>Thar be dragons<\/text>/.test(roomTextWithLabel)).isTrue();
            });
        });
    });

    describe('drawText()', () => {
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

        it('should contain the text as the content', () => {
            assert(/<text(.+?)>Wizard Tower<\/text>/.test(textElement)).isTrue();
        });

        describe('given a `fontSize` option', () => {
            it('should have the correct `font-size` attribute', () => {
                const customFontSizeTextElement = drawText('Goblin Lair', [ 0, 0 ], { fontSize: 24 });
                assert(customFontSizeTextElement).stringIncludes('font-size="24px"');
            });
        });

        describe('given a `fill` option', () => {
            it('should have the correct `fill` color attribute', () => {
                const customFillTextElement = drawText('Goblin Zeppelin', [ 0, 0 ], { fill: 'purple' });
                assert(customFillTextElement).stringIncludes('fill="purple"');
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

        it('should contain the trap label', () => {
            assert(RegExp(`<text(.+?)>${trapLabel}</text>`).test(trapText)).isTrue();
        });

        it('the `x` and `y` coordinates should be the center of the lower left cell of the room', () => {
            const pxHalfCell = (pxCell / 2);

            const x = 10 + pxHalfCell;
            const y = 70 - pxHalfCell + pxTextOffset;

            assert(trapText).stringIncludes(`x="${x}"`);
            assert(trapText).stringIncludes(`y="${y}"`);
        });
    });

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

    // -- Public Functions -----------------------------------------------------

    describe('drawDoor()', () => {
        const doorAttrs = { x: 10, y: 20, width: 1, height: 1 };
        const doorArgs  = {
            direction: directions.south,
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

        const northSouthDoorAttrs = { x: 10, y: 20, width: 2, height: 1 };
        const northSouthDoorArgs  = { ...doorArgs, direction: directions.north };

        const eastWestDoorAttrs = { x: 10, y: 20, width: 1, height: 2 };
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

                        const doorLines = drawDoor(northSouthDoorAttrs, northSouthDoorArgs)
                            .match(/<line(.+?) \/>/g);

                        assert(doorLines.shift())
                            .stringIncludes(`x1="${line1x}"`)
                            .stringIncludes(`y1="${y1}"`)
                            .stringIncludes(`x2="${line1x}"`)
                            .stringIncludes(`y2="${y2}"`);

                        assert(doorLines.shift())
                            .stringIncludes(`x1="${line2x}"`)
                            .stringIncludes(`y1="${y1}"`)
                            .stringIncludes(`x2="${line2x}"`)
                            .stringIncludes(`y2="${y2}"`);
                    });
                });

                describe('when the door direction is east or west', () => {
                    it('should include two horizontal wall lines with correct coordinate attributes', () => {
                        const { x, y, width, height } = eastWestDoorAttrs;

                        const x1 = x * pxCell;
                        const x2 = (x + width) * pxCell;

                        const line1y = y * pxCell;
                        const line2y = (y + height) * pxCell;

                        const doorLines = drawDoor(eastWestDoorAttrs, eastWestDoorArgs)
                            .match(/<line(.+?) \/>/g);

                        assert(doorLines.shift())
                            .stringIncludes(`x1="${x1}"`)
                            .stringIncludes(`y1="${line1y}"`)
                            .stringIncludes(`x2="${x2}"`)
                            .stringIncludes(`y2="${line1y}"`);

                        assert(doorLines.shift())
                            .stringIncludes(`x1="${x1}"`)
                            .stringIncludes(`y1="${line2y}"`)
                            .stringIncludes(`x2="${x2}"`)
                            .stringIncludes(`y2="${line2y}"`);
                    });
                });
            });

            describe('when the door type is lockable', () => {
                describe('when the door is locked', () => {
                    it('should set the door rectangle fill to `colorLockedFill`', () => {
                        const lockedDoor = drawDoor(doorAttrs, {
                            ...doorArgs,
                            locked: true,
                            type: doorType.wooden,
                        });

                        assert(RegExp(`<rect(.+?)fill="${colorLockedFill}"(.+?)>`).test(lockedDoor)).isTrue();
                    });
                });

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

                        assert(x2 > x1).isTrue();
                        assert(lockableDoor.match(/<line(.+?) \/>/g).filter((line) =>
                            line.includes(`x1="${x1}"`) &&
                            line.includes(`y1="${y1}"`) &&
                            line.includes(`x2="${x2}"`) &&
                            line.includes(`y2="${y2}"`)).length).equals(1);
                    });

                    it('should include a horizontal inset rectangle representing the door', () => {
                        const rectCenterY = (y * pxCell) + ((height * pxCell) / 2);

                        const rectX = (x * pxCell) + (doorInset / 2);
                        const rectY = rectCenterY  - (doorWidth / 2);

                        const rectW = (width * pxCell) - doorInset;
                        const rectH = doorWidth;

                        assert(rectW > rectH).isTrue();
                        assert(lockableDoor.match(/<rect(.+?) \/>/g).filter((line) =>
                            line.includes(`x="${rectX}"`) &&
                            line.includes(`y="${rectY}"`) &&
                            line.includes(`width="${rectW}"`) &&
                            line.includes(`height="${rectH}"`)).length).equals(1);
                    });
                });

                describe('when the door direction is east or west', () => {
                    const { x, y, width, height } = eastWestDoorAttrs;
                    const lockableDoor = drawDoor(eastWestDoorAttrs, {
                        ...eastWestDoorArgs,
                        type: doorType.wooden,
                    });

                    it('should include a vertical line in the center of the cell ', () => {
                        const x1 = (x + (width / 2)) * pxCell;
                        const x2 = x1;
                        const y1 = y * pxCell;
                        const y2 = (y + height) * pxCell;

                        assert(y2 > y1).isTrue();
                        assert(lockableDoor.match(/<line(.+?) \/>/g).filter((line) =>
                            line.includes(`x1="${x1}"`) &&
                            line.includes(`y1="${y1}"`) &&
                            line.includes(`x2="${x2}"`) &&
                            line.includes(`y2="${y2}"`)).length).equals(1);
                    });

                    it('should include a vertical inset rectangle representing the door', () => {
                        const rectCenterX = (x * pxCell) + ((width  * pxCell) / 2);

                        const rectX = rectCenterX  - (doorWidth / 2);
                        const rectY = (y * pxCell) + (doorInset / 2);

                        const rectW = doorWidth;
                        const rectH = (height * pxCell) - doorInset;

                        assert(rectH > rectW).isTrue();
                        assert(lockableDoor.match(/<rect(.+?) \/>/g).filter((line) =>
                            line.includes(`x="${rectX}"`) &&
                            line.includes(`y="${rectY}"`) &&
                            line.includes(`width="${rectW}"`) &&
                            line.includes(`height="${rectH}"`)).length).equals(1);
                    });
                });
            });

            describe('when the door is an archway', () => {
                describe('when the door direction is north or south', () => {
                    it('should draw two vertically centered pillars on the left and right of the cell', () => {
                        const { x, y, width, height } = northSouthDoorAttrs;
                        const archwayDoor = drawDoor(northSouthDoorAttrs, {
                            ...northSouthDoorArgs,
                            type: doorType.archway,
                        });

                        const cx1 = x * pxCell;
                        const cx2 = (x * pxCell) + (width  * pxCell);
                        const cy  = (y * pxCell) + ((height /2) * pxCell);

                        const pillars = archwayDoor.match(RegExp(`<circle(.+?)r="${radiusPillar}"(.+?) />`, 'g'));

                        assert(pillars.shift())
                            .stringIncludes(`cx="${cx1}"`)
                            .stringIncludes(`cy="${cy}"`);

                        assert(pillars.shift())
                            .stringIncludes(`cx="${cx2}"`)
                            .stringIncludes(`cy="${cy}"`);
                    });
                });

                describe('when the door direction is east or west', () => {
                    it('should draw two horizontally centered pillars at the top and bottom of the cell', () => {
                        const { x, y, width, height } = eastWestDoorAttrs;
                        const archwayDoor = drawDoor(eastWestDoorAttrs, {
                            ...eastWestDoorArgs,
                            type: doorType.archway,
                        });

                        const cx  = (x * pxCell) + ((width / 2) * pxCell);
                        const cy1 = y * pxCell;
                        const cy2 = (y * pxCell) + (height * pxCell);

                        const pillars = archwayDoor.match(RegExp(`<circle(.+?)r="${radiusPillar}"(.+?) />`, 'g'));

                        assert(pillars.shift())
                            .stringIncludes(`cx="${cx}"`)
                            .stringIncludes(`cy="${cy1}"`);

                        assert(pillars.shift())
                            .stringIncludes(`cx="${cx}"`)
                            .stringIncludes(`cy="${cy2}"`);
                    });
                });
            });

            describe('when the door is a hole', () => {
                describe('when the door direction is north or south', () => {
                    it('should draw a circle with a radius of `radiusHole` centered horizontally', () => {
                        const { x, y, width, height } = northSouthDoorAttrs;
                        const archwayDoor = drawDoor(northSouthDoorAttrs, {
                            ...northSouthDoorArgs,
                            type: doorType.hole,
                        });

                        const cx = (x + (width  / 2)) * pxCell;
                        const cy = (y + (height / 2)) * pxCell;

                        const hole = archwayDoor.match(RegExp(`<circle(.+?)r="${radiusHole}"(.+?) />`, 'g'));

                        assert(hole.length).equals(1);
                        assert(hole.shift())
                            .stringIncludes(`cx="${cx}"`)
                            .stringIncludes(`cy="${cy}"`);
                    });
                });

                describe('when the door direction is east or west', () => {
                    it('should draw a circle centered vertically', () => {
                        const { x, y, width, height } = eastWestDoorAttrs;
                        const archwayDoor = drawDoor(eastWestDoorAttrs, {
                            ...eastWestDoorArgs,
                            type: doorType.hole,
                        });

                        const cx = (x + (width  / 2)) * pxCell;
                        const cy = (y + (height / 2)) * pxCell;

                        const hole = archwayDoor.match(RegExp(`<circle(.+?)r="${radiusHole}"(.+?) />`, 'g'));

                        assert(hole.length).equals(1);
                        assert(hole.shift())
                            .stringIncludes(`cx="${cx}"`)
                            .stringIncludes(`cy="${cy}"`);
                    });
                });
            });

            describe('when the door is a secret door', () => {
                const secretDoor = drawDoor(doorAttrs, { ...doorArgs, type: doorType.secret });
                const secretDoorRect = secretDoor.slice(0, secretDoor.indexOf('/>') + 2);

                it('should have a transparent fill and stroke', () => {
                    assert(secretDoorRect)
                        .stringIncludes('fill="transparent"')
                        .stringIncludes('stroke="transparent"');
                });

                it('should include the secret door label', () => {
                    assert(RegExp(`<text(.+?)>${doorSecretLabel}</text>`, 'g').test(secretDoor)).isTrue();
                });
            });

            describe('when the door is a concealed door', () => {
                const concealedDoor = drawDoor(doorAttrs, { ...doorArgs, type: doorType.concealed });
                const concealedDoorRect = concealedDoor.slice(0, concealedDoor.indexOf('/>') + 2);

                it('should have a transparent fill and stroke', () => {
                    assert(concealedDoorRect)
                        .stringIncludes('fill="transparent"')
                        .stringIncludes('stroke="transparent"');
                });

                it('should include the concealed door label', () => {
                    assert(RegExp(`<text(.+?)>${doorConcealedLabel}</text>`, 'g').test(concealedDoor)).isTrue();
                });
            });
        });
    });

    describe('drawGrid()', () => {
        const gridWidth  = 4;
        const gridHeight = 5;

        const grid = drawGrid({ gridWidth, gridHeight });
        const lines = grid.match(/<line(.+?) \/>/g);

        it('returns the correct number of `<line />` element strings', () => {
            const lineCount = gridWidth + 1 + gridHeight + 1;
            assert(lines.length).equals(lineCount);
        });

        it('returns a vertical `<line />` element string for each horizontal grid cell and the outer edge', () => {
            const y2 = gridHeight * pxCell;

            const verticalLines = lines.filter((line) =>
                line.includes('y1="0"') && line.includes(`y2="${y2}"`));

            assert(verticalLines.length).equals(gridWidth + 1);

            verticalLines.forEach((line, xCord) => {
                const x = xCord * pxCell;

                assert(line)
                    .stringIncludes(`x1="${x}"`)
                    .stringIncludes(`x2="${x}"`);
            });
        });

        it('returns a horizontal `<line />` element string for each vertical grid cell and the outer edge', () => {
            const x2 = gridWidth * pxCell;

            const horizontalLines = lines.filter((line) =>
                line.includes('x1="0"') && line.includes(`x2="${x2}"`));

            assert(horizontalLines.length).equals(gridHeight + 1);

            horizontalLines.forEach((line, yCord) => {
                const y = yCord * pxCell;

                assert(line)
                    .stringIncludes(`y1="${y}"`)
                    .stringIncludes(`y2="${y}"`);
            });
        });
    });

    describe('drawMap()', () => {
        const dimensions = { gridWidth: 12, gridHeight: 14 };
        const map = drawMap(dimensions, '');

        it('should return an SVG element string', () => {
            assert(map).isHtmlTag('svg');
        });

        it('should have correct width and heigh attributes', () => {
            const width = dimensions.gridWidth * pxCell;
            const height = dimensions.gridHeight * pxCell;

            assert(map)
                .stringIncludes(`width="${width}"`)
                .stringIncludes(`height="${height}"`);
        });

        it('should include the content', () => {
            const content = drawRect({ x: 0, y: 0, width: 10, height: 10 });
            const mapWithContent = drawMap(dimensions, content);

            assert(RegExp(`<svg(.+?)>${content}</svg>`).test(mapWithContent)).isTrue();
        });
    });

    describe('drawRoom()', () => {
        const attrs    = { x: 1, y: 2, width: 3, height: 4 };
        const text     = { roomNumber: 11 };
        const room     = drawRoom(attrs, text);
        const roomRect = room.slice(0, room.indexOf('/>') + 2);

        it('should include a `<rect />` element string', () => {
            assert(roomRect).isHtmlTag('rect');
        });

        describe('the rect element', () => {
            it('should have correct attributes', () => {
                assert(roomRect)
                    .stringIncludes('x="24"')
                    .stringIncludes('y="48"')
                    .stringIncludes('width="72"')
                    .stringIncludes('height="96"');
            });
        });

        it('should include a <text> element string containing the room number', () => {
            assert(/<text(.+?)>11<\/text>/.test(room)).isTrue();
        });

        describe('given a room label', () => {
            it('should include a `<text>` element string containing the room number', () => {
                const roomWithLabel = drawRoom(attrs, { ...text, roomLabel: 'Goblin Cafeteria' });

                assert(/<text(.+?)>Goblin Cafeteria<\/text>/.test(roomWithLabel)).isTrue();
            });
        });

        describe('when the room\'s width and height is greater than or equal to `pillarThreshold`', () => {
            it('should include 4 pillar circles', () => {
                const width  = pillarThreshold;
                const height = pillarThreshold;

                const roomWithPillars = drawRoom({ ...attrs, width, height }, text);

                const matches = roomWithPillars.match(RegExp(`<circle(.+?)r="${radiusPillar}"(.+?) />`, 'g'));

                assert(matches).isArray();
                matches && assert(matches.length).equals(4);
            });
        });

        describe('when the room has a trap', () => {
            it('should include a `<text>` trap indicator', () => {
                const roomWithTrap = drawRoom(attrs, text, { hasTraps: true });

                assert(RegExp(`<text(.+?)>${trapLabel}</text>`).test(roomWithTrap)).isTrue();
            });
        });
    });
};
