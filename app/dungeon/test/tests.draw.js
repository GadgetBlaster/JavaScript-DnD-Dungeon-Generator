// @ts-check

import {
    // Config
    testColorLockedFill     as colorLockedFill,
    testColorPillarFill     as colorPillarFill,
    testColorRoomStroke     as colorRoomStroke,
    testDoorConcealedLabel  as doorConcealedLabel,
    testDoorInset           as doorInset,
    testDoorSecretLabel     as doorSecretLabel,
    testDoorWidth           as doorWidth,
    testHoleRadiusRatio     as holeRadiusRatio,
    testPillarGridInset     as pillarGridInset,
    testPillarGridThreshold as pillarGridThreshold,
    testPillarRadiusRatio   as pillarRadiusRatio,
    testPxCell              as pxCell,
    testTrapLabel           as trapLabel,

    // Private Functions
    testDrawPillar              as drawPillar,
    testDrawPillarCell          as drawPillarCell,
    testDrawRoomPillars         as drawRoomPillars,
    testDrawRoomText            as drawRoomText,
    testDrawTrapText            as drawTrapText,
    testGetDirectionOrientation as getDirectionOrientation,
    testGetDoorOrientation      as getDoorOrientation,
    testGetRectAttrs            as getRectAttrs,

    // Public functions
    drawDoor,
    drawGrid,
    drawMap,
    drawRoom,
} from '../draw.js';

import {
    testPxTextOffset as pxTextOffset,
    testDashLength   as dashLength,
    drawRect,
} from '../../utility/shape.js';

import { element, parseSvg } from '../../utility/element.js';

/** @typedef {import('../../utility/shape.js').Circle} Circle */
/** @typedef {import('../draw.js').RoomText} RoomText */
/** @typedef {import('../map.js').Rectangle} Rectangle */
/** @typedef {import('../map.js').Door} Door */

// TODO update tests to use `parseSvg()`

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {

    // -- Private Functions ----------------------------------------------------

    describe('drawPillar()', () => {
        const result = drawPillar({ cx: 114, cy: 214 });
        const doc    = parseSvg(result);
        const pillar = doc.children.item(0);

        it('returns a single svg string', () => {
            assert(result).isString();
            assert(doc.children.length).equals(1);
            assert(Boolean(pillar)).isTrue();
        });

        it('returns a circle element', () => {
            assert(pillar).isElementTag('circle');
        });

        it('has the correct `cx` and `cy` attributes', () => {
            assert(pillar).hasAttributes({ cx: '114', cy: '214' });
        });

        it('has the pillar fill color', () => {
            assert(pillar).hasAttributes({ fill: colorPillarFill });
        });

        it('has the room stroke color by default', () => {
            assert(pillar).hasAttributes({ stroke: colorRoomStroke });
        });

        describe('given a stroke option', () => {
            it('overrides the default attributes', () => {
                const redPillar = parseSvg(drawPillar({ cx: 114, cy: 214 }, { stroke: 'red' })).children.item(0);
                assert(redPillar).hasAttributes({ stroke: 'red' });
            });
        });
    });

    describe('drawPillarCell()', () => {
        const result     = drawPillarCell({ x: 15, y: 25 });
        const doc        = parseSvg(result);
        const pillarCell = doc.children.item(0);

        it('returns a single svg string', () => {
            assert(result).isString();
            assert(doc.children.length).equals(1);
            assert(Boolean(pillarCell)).isTrue();
        });

        it('returns a circle element', () => {
            assert(pillarCell).isElementTag('circle');
        });

        it('has `cx` and `cy` attributes in the center of the given cell coordinates', () => {
            const pxHalfCell = (pxCell / 2);

            const cx = (15 * pxCell) + pxHalfCell;
            const cy = (25 * pxCell) + pxHalfCell;

            assert(pillarCell).hasAttributes({
                cx: cx.toString(),
                cy: cy.toString(),
            });
        });
    });

    describe('drawRoomPillars()', () => {
        /** @type {Rectangle} */
        const roomRectangle = {
            x: 10,
            y: 10,
            width: pillarGridThreshold,
            height: pillarGridThreshold,
        };

        describe('given a room `width` less than `pillarThreshold`', () => {
            it('returns an empty string', () => {
                const pillars = drawRoomPillars({
                    ...roomRectangle,
                    width: pillarGridThreshold - 1,
                });

                assert(pillars).equals('');
            });
        });

        describe('given a room `height` less than `pillarThreshold`', () => {
            it('returns an empty string', () => {
                const pillars = drawRoomPillars({
                    ...roomRectangle,
                    height: pillarGridThreshold - 1,
                });

                assert(pillars).equals('');
            });
        });

        describe('given a room `width` and `height` of at least `pillarThreshold`', () => {
            const result  = drawRoomPillars(roomRectangle);
            const doc     = parseSvg(`<svg>${result}</svg>`);
            const pillars = [ ...doc.querySelectorAll('circle') ];

            it('returns an svg string that parses', () => {
                assert(result).isString();
                assert(doc.children.length).equals(1);
            });

            it('contains four circle svg element strings', () => {
                assert(pillars).isArray();
                assert(pillars.length).equals(4);
            });

            it('places a pillar in the center of each corner cell of the room, inset by `pillarInset`', () => {
                const { x, y, width, height } = roomRectangle;

                const innerWidth  = width  - (pillarGridInset * 2);
                const innerHeight = height - (pillarGridInset * 2);

                const halfPxCell = pxCell / 2;

                const xLeft   = ((x + pillarGridInset) * pxCell) + halfPxCell;
                const xRight  = ((x + innerWidth)      * pxCell) + halfPxCell;
                const yTop    = ((y + pillarGridInset) * pxCell) + halfPxCell;
                const yBottom = ((y + innerHeight)     * pxCell) + halfPxCell;

                assert(pillars.shift()).hasAttributes({
                    cx: xLeft.toString(),
                    cy: yTop.toString(),
                });

                assert(pillars.shift()).hasAttributes({
                    cx: xRight.toString(),
                    cy: yTop.toString(),
                });

                assert(pillars.shift()).hasAttributes({
                    cx: xLeft.toString(),
                    cy: yBottom.toString(),
                });

                assert(pillars.shift()).hasAttributes({
                    cx: xRight.toString(),
                    cy: yBottom.toString(),
                });
            });
        });
    });

    describe('drawRoomText()', () => {
        /** @type {Rectangle} */
        const roomTextConfig = {
            x: 10,
            y: 20,
            width: 30,
            height: 50,
        };

        const result   = drawRoomText(roomTextConfig, { roomNumber: '42' });
        const doc      = parseSvg(result);
        const roomText = doc.children.item(0);

        it('returns a single svg string', () => {
            assert(result).isString();
            assert(doc.children.length).equals(1);
            assert(Boolean(roomText)).isTrue();
        });

        it('returns a single text svg element string', () => {
            assert(roomText).isElementTag('text');
        });

        it('contains the `roomNumber` as the content', () => {
            roomText && assert(roomText.textContent).equals('42');
        });

        it('the `x` coordinate is at the horizontal center of the room rect', () => {
            const x = roomTextConfig.x + (roomTextConfig.width / 2);
            assert(roomText).hasAttributes({ x: x.toString() });
        });

        it('the `y` coordinate is at the vertical center of the room rect plus the `pxTextOffset`', () => {
            const y = (roomTextConfig.y + (roomTextConfig.height / 2)) + pxTextOffset;
            assert(roomText).hasAttributes({ y: y.toString() });
        });

        describe('given a `roomLabel`', () => {
            const docRoomTextWithLabel = parseSvg(element('svg', drawRoomText(roomTextConfig, {
                roomNumber: '42',
                roomLabel: 'Thar be dragons',
            })));

            const matches = [ ...docRoomTextWithLabel.querySelectorAll('text') ];

            it('returns two text svg element strings', () => {
                assert(matches).isArray();
                assert(matches.length).equals(2);
            });

            it('contains the `roomLabel` as the content', () => {
                assert(matches.filter(({ textContent }) => textContent === 'Thar be dragons').length)
                    .equals(1);
            });
        });
    });

    describe('drawTrapText()', () => {
        const result = drawTrapText({
            x: 10,
            y: 10,
            width: 40,
            height: 60,
        });

        const doc      = parseSvg(result);
        const trapText = doc.children.item(0);

        it('returns a single svg string', () => {
            assert(result).isString();
            assert(doc.children.length).equals(1);
            assert(Boolean(trapText)).isTrue();
        });

        it('returns a text svg element string', () => {
            assert(trapText).isElementTag('text');
        });

        it('contains the trap label', () => {
            trapText && assert(trapText.textContent).equals(trapLabel);
        });

        it('the `x` and `y` coordinates are at the center of the lower left cell of the room', () => {
            const pxHalfCell = (pxCell / 2);

            const x = 10 + pxHalfCell;
            const y = 70 - pxHalfCell + pxTextOffset;

            assert(trapText).hasAttributes({
                x: x.toString(),
                y: y.toString(),
            });
        });
    });

    describe('getDirectionOrientation()', () => {
        describe('given "north"', () => {
            it('returns "vertical"', () => {
                assert(getDirectionOrientation('north')).equals('vertical');
            });
        });

        describe('given "east"', () => {
            it('returns "horizontal"', () => {
                assert(getDirectionOrientation('east')).equals('horizontal');
            });
        });

        describe('given "south"', () => {
            it('returns "vertical"', () => {
                assert(getDirectionOrientation('south')).equals('vertical');
            });
        });

        describe('given "west"', () => {
            it('returns "horizontal"', () => {
                assert(getDirectionOrientation('west')).equals('horizontal');
            });
        });

    });

    describe('getDoorOrientation()', () => {
        describe('given no connection', () => {
            it('throws', () => {
                assert(() => getDoorOrientation({}))
                    .throws('Invalid number of connections in getDoorOrientation()');
            });
        });

        describe('given a connection with too may items', () => {
            it('throws', () => {
                assert(() => getDoorOrientation({
                    1: { direction: 'east', to: 2 },
                    2: { direction: 'east', to: 1 },
                    3: { direction: 'east', to: 2 },
                })).throws('Invalid number of connections in getDoorOrientation()');
            });
        });

        describe('given a connection with the same directions', () => {
            it('throws', () => {
                assert(() => getDoorOrientation({
                    1: { direction: 'east', to: 2 },
                    2: { direction: 'east', to: 1 },
                })).throws('Invalid connection directions in getDoorOrientation()');
            });
        });

        describe('given a connection with conflicting directions', () => {
            it('throws', () => {
                assert(() => getDoorOrientation({
                    1: { direction: 'north', to: 2 },
                    2: { direction: 'east', to: 1 },
                })).throws('Invalid connection directions in getDoorOrientation()');
            });
        });

        describe('given a connection with a single item', () => {
            it('returns the connection orientation', () => {
                assert(getDoorOrientation({
                    1: { direction: 'east', to: 0 },
                })).equals('horizontal');
            });
        });

        describe('given a vertical connection', () => {
            it('returns "vertical"', () => {
                assert(getDoorOrientation({
                    1: { direction: 'north', to: 2 },
                    2: { direction: 'south', to: 1 },
                })).equals('vertical');
            });
        });

        describe('given a horizontal connection', () => {
            it('returns "horizontal"', () => {
                assert(getDoorOrientation({
                    1: { direction: 'east', to: 2 },
                    2: { direction: 'west', to: 1 },
                })).equals('horizontal');
            });
        });
    });

    describe('getRectAttrs()', () => {
        it('returns each value multiplied by `pxCell`', () => {
            /** @type {Rectangle} */
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
        /** @type {Door} */
        const doorConfig = {
            connect: {
                1: { direction: 'north', to: 2 },
                2: { direction: 'south', to: 1 },
            },
            locked: false,
            rectangle: { x: 10, y: 20, width: 1, height: 1 },
            type: 'passageway',
        };

        const result   = drawDoor(doorConfig);
        const doc      = parseSvg(element('svg', result));
        const doorRect = doc.querySelector('rect');

        it('returns an svg string that parses', () => {
            assert(result).isString();
            assert(doc.children.length).equals(1);
        });

        it('contains a rect svg element string', () => {
            assert(doorRect).isElementTag('rect');
        });

        it('the rect has correct `x` and `y` attributes', () => {
            const { x, y } = doorConfig.rectangle;

            assert(doorRect).hasAttributes({
                x: (x * pxCell).toString(),
                y: (y * pxCell).toString(),
            });
        });

        it('the rect has correct `width` and `height` attributes', () => {
            const { width, height } = doorConfig.rectangle;

            assert(doorRect).hasAttributes({
                width : (width * pxCell).toString(),
                height: (height * pxCell).toString(),
            });
        });

        /** @type {Door} */
        const northSouthDoor = {
            ...doorConfig,
            rectangle: { x: 10, y: 20, width: 2, height: 1 },
        };

        /** @type {Door} */
        const eastWestDoor = {
            ...doorConfig,
            connect: {
                1: { direction: 'east', to: 2 },
                2: { direction: 'west', to: 1 },
            },
            rectangle: { x: 10, y: 20, width: 1, height: 2 },
        };

        describe('door orientations', () => {
            describe('door wall lines', () => {
                describe('when the door direction is north or south', () => {
                    it('contains two vertical wall lines with correct coordinate attributes', () => {
                        const { x, y, width, height } = northSouthDoor.rectangle;

                        const line1x = x * pxCell;
                        const line2x = (x + width) * pxCell;

                        const y1 = y * pxCell;
                        const y2 = (y + height) * pxCell;

                        const doorLines = [ ...parseSvg(element('svg', drawDoor(northSouthDoor)))
                            .querySelectorAll('line') ];

                        assert(doorLines).isArray();
                        assert(doorLines.length).equals(2);

                        assert(doorLines.shift()).hasAttributes({
                            x1: line1x.toString(),
                            y1: y1.toString(),
                            x2: line1x.toString(),
                            y2: y2.toString(),
                        });

                        assert(doorLines.shift()).hasAttributes({
                            x1: line2x.toString(),
                            y1: y1.toString(),
                            x2: line2x.toString(),
                            y2: y2.toString(),
                        });
                    });
                });

                describe('when the door direction is east or west', () => {
                    it('contains two horizontal wall lines with correct coordinate attributes', () => {
                        const { x, y, width, height } = eastWestDoor.rectangle;

                        const x1 = x * pxCell;
                        const x2 = (x + width) * pxCell;

                        const line1y = y * pxCell;
                        const line2y = (y + height) * pxCell;

                        const doorLines = [ ...parseSvg(element('svg', drawDoor(eastWestDoor)))
                            .querySelectorAll('line') ];

                        assert(doorLines).isArray();
                        assert(doorLines.length).equals(2);

                        assert(doorLines.shift()).hasAttributes({
                            x1: x1.toString(),
                            y1: line1y.toString(),
                            x2: x2.toString(),
                            y2: line1y.toString(),
                        });

                        assert(doorLines.shift()).hasAttributes({
                            x1: x1.toString(),
                            y1: line2y.toString(),
                            x2: x2.toString(),
                            y2: line2y.toString(),
                        });
                    });
                });
            });

            describe('when the door type is lockable', () => {
                describe('when the door is locked', () => {
                    it('sets the door rectangle fill to `colorLockedFill`', () => {
                        const lockedDoorDoc = parseSvg(element('svg', drawDoor({
                            ...doorConfig,
                            locked: true,
                            type: 'wooden',
                        })));

                        assert(Boolean(lockedDoorDoc.querySelector(`rect[fill="${colorLockedFill}"]`))).isTrue();
                    });
                });

                describe('when the door direction is north or south', () => {
                    const { x, y, width, height } = northSouthDoor.rectangle;
                    const lockableDoorDoc = parseSvg(element('svg', drawDoor({
                        ...northSouthDoor,
                        type: 'wooden',
                    })));

                    it('contains a horizontal line in the center of the cell ', () => {
                        const x1 = x * pxCell;
                        const x2 = (x + width) * pxCell;
                        const y1 = (y + (height / 2)) * pxCell;
                        const y2 = y1;

                        assert(x2 > x1).isTrue();

                        const selector = `line[x1="${x1}"][x2="${x2}"][y1="${y1}"][y2="${y2}"]`;

                        assert(Boolean(lockableDoorDoc.querySelector(selector))).isTrue();
                    });

                    it('contains a horizontal inset rectangle representing the door', () => {
                        const rectCenterY = (y * pxCell) + ((height * pxCell) / 2);

                        const rectX = (x * pxCell) + (doorInset / 2);
                        const rectY = rectCenterY - (doorWidth / 2);

                        const rectW = (width * pxCell) - doorInset;
                        const rectH = doorWidth;

                        const selector = `rect[x="${rectX}"][y="${rectY}"][width="${rectW}"][height="${rectH}"]`;

                        assert(rectW > rectH).isTrue();
                        assert(Boolean(lockableDoorDoc.querySelector(selector))).isTrue();
                    });
                });

                describe('when the door direction is east or west', () => {
                    const { x, y, width, height } = eastWestDoor.rectangle;
                    const lockableDoorDoc = parseSvg(element('svg', drawDoor({
                        ...eastWestDoor,
                        type: 'wooden',
                    })));

                    it('contains a vertical line in the center of the cell ', () => {
                        const x1 = (x + (width / 2)) * pxCell;
                        const x2 = x1;
                        const y1 = y * pxCell;
                        const y2 = (y + height) * pxCell;

                        const selector = `line[x1="${x1}"][x2="${x2}"][y1="${y1}"][y2="${y2}"]`;

                        assert(y2 > y1).isTrue();
                        assert(Boolean(lockableDoorDoc.querySelector(selector))).isTrue();
                    });

                    it('contains a vertical inset rectangle representing the door', () => {
                        const rectCenterX = (x * pxCell) + ((width  * pxCell) / 2);

                        const rectX = rectCenterX  - (doorWidth / 2);
                        const rectY = (y * pxCell) + (doorInset / 2);

                        const rectW = doorWidth;
                        const rectH = (height * pxCell) - doorInset;

                        const selector = `rect[x="${rectX}"][y="${rectY}"][width="${rectW}"][height="${rectH}"]`;

                        assert(rectH > rectW).isTrue();
                        assert(Boolean(lockableDoorDoc.querySelector(selector))).isTrue();
                    });
                });
            });

            describe('when the door is an archway', () => {
                const pillarRadius = Math.round(pxCell * pillarRadiusRatio);

                describe('when the door direction is north or south', () => {
                    it('draws two vertically centered pillars on the left and right of the cell', () => {
                        const { x, y, width, height } = northSouthDoor.rectangle;
                        const archwayDoorDoc = parseSvg(element('svg', drawDoor({
                            ...northSouthDoor,
                            type: 'archway',
                        })));

                        const cx1 = x * pxCell;
                        const cx2 = (x * pxCell) + (width  * pxCell);
                        const cy  = (y * pxCell) + ((height /2) * pxCell);

                        const pillars = [ ...archwayDoorDoc.querySelectorAll(`circle[r="${pillarRadius}"]`) ];

                        assert(pillars.length).equals(2);

                        assert(pillars.shift()).hasAttributes({
                            cx: cx1.toString(),
                            cy: cy.toString(),
                        });

                        assert(pillars.shift()).hasAttributes({
                            cx: cx2.toString(),
                            cy: cy.toString(),
                        });
                    });
                });

                describe('when the door direction is east or west', () => {
                    it('draws two horizontally centered pillars at the top and bottom of the cell', () => {
                        const { x, y, width, height } = eastWestDoor.rectangle;
                        const archwayDoorDoc = parseSvg(element('svg', drawDoor({
                            ...eastWestDoor,
                            type: 'archway',
                        })));

                        const cx  = (x * pxCell) + ((width / 2) * pxCell);
                        const cy1 = y * pxCell;
                        const cy2 = (y * pxCell) + (height * pxCell);

                        const pillars = [ ...archwayDoorDoc.querySelectorAll(`circle[r="${pillarRadius}"]`) ];

                        assert(pillars.length).equals(2);

                        assert(pillars.shift()).hasAttributes({
                            cx: cx.toString(),
                            cy: cy1.toString(),
                        });

                        assert(pillars.shift()).hasAttributes({
                            cx: cx.toString(),
                            cy: cy2.toString(),
                        });
                    });
                });
            });

            describe('when the door is a hole', () => {
                const holeRadius = Math.round(pxCell * holeRadiusRatio);

                describe('when the door direction is north or south', () => {
                    it('draws a circle with the correct radius, centered horizontally', () => {
                        const { x, y, width, height } = northSouthDoor.rectangle;
                        const holeDoorDoc = parseSvg(element('svg', drawDoor({
                            ...northSouthDoor,
                            type: 'hole',
                        })));

                        const cx = (x + (width  / 2)) * pxCell;
                        const cy = (y + (height / 2)) * pxCell;

                        const hole = holeDoorDoc.querySelector(`circle[r="${holeRadius}"]`);

                        assert(Boolean(hole)).isTrue();
                        assert(hole).hasAttributes({
                            cx: cx.toString(),
                            cy: cy.toString(),
                        });
                    });
                });

                describe('when the door direction is east or west', () => {
                    it('draws a circle centered vertically', () => {
                        const { x, y, width, height } = eastWestDoor.rectangle;
                        const holeDoorDoc = parseSvg(element('svg', drawDoor({
                            ...eastWestDoor,
                            type: 'hole',
                        })));

                        const cx = (x + (width  / 2)) * pxCell;
                        const cy = (y + (height / 2)) * pxCell;

                        const hole = holeDoorDoc.querySelector(`circle[r="${holeRadius}"]`);

                        assert(Boolean(hole)).isTrue();
                        assert(hole).hasAttributes({
                            cx: cx.toString(),
                            cy: cy.toString(),
                        });
                    });
                });
            });

            describe('when the door is a secret door', () => {
                const secretDoorDoc  = parseSvg(element('svg', drawDoor({ ...doorConfig, type: 'secret' })));
                const secretDoorRect = secretDoorDoc.querySelector('rect');

                it('has a transparent fill and stroke', () => {
                    assert(secretDoorRect).hasAttributes({
                        fill  : 'transparent',
                        stroke: 'transparent',
                    });
                });

                it('contains a secret door label', () => {
                    const secretDoorText = secretDoorDoc.querySelector('text');

                    assert(Boolean(secretDoorText)).isTrue();
                    secretDoorText && assert(secretDoorText.textContent).equals(doorSecretLabel);
                });

                it('has dashed lines for the walls', () => {
                    const lines = secretDoorDoc.querySelectorAll('line');

                    assert(lines.length).equals(2);
                    lines.forEach((line) => {
                        assert(line).hasAttributes({
                            'stroke-dasharray': dashLength.toString(),
                        });
                    });
                });
            });

            describe('when the door is a concealed door', () => {
                const concealedDoorDoc  = parseSvg(element('svg', drawDoor({ ...doorConfig, type: 'concealed' })));
                const concealedDoorRect = concealedDoorDoc.querySelector('rect');

                it('has a transparent fill and stroke', () => {
                    assert(concealedDoorRect).hasAttributes({
                        fill  : 'transparent',
                        stroke: 'transparent',
                    });
                });

                it('contains a concealed door label', () => {
                    const concealedDoorText = concealedDoorDoc.querySelector('text');

                    assert(Boolean(concealedDoorText)).isTrue();
                    concealedDoorText && assert(concealedDoorText.textContent).equals(doorConcealedLabel);
                });
            });
        });
    });

    describe('drawGrid()', () => {
        const width  = 4;
        const height = 5;

        const gridDoc = parseSvg(element('svg', drawGrid({ width, height })));
        const lines   = [ ...gridDoc.querySelectorAll('line') ];

        it('returns the correct number of svg line elements', () => {
            assert(lines.length).equals(width + 1 + height + 1);
        });

        it('contains a vertical line svg element for each horizontal grid cell and the outer edge', () => {
            const y2 = height * pxCell;

            const verticalLines = lines.filter((line) =>
                line.getAttribute('y1') === '0' && line.getAttribute('y2') === y2.toString());

            assert(verticalLines.length).equals(width + 1);

            verticalLines.forEach((line, xCord) => {
                const x = xCord * pxCell;

                assert(line).hasAttributes({
                    x1: x.toString(),
                    x2: x.toString(),
                });
            });
        });

        it('contains a horizontal line svg element for each vertical grid cell and the outer edge', () => {
            const x2 = width * pxCell;

            const horizontalLines = lines.filter((line) =>
                line.getAttribute('x1') === '0' && line.getAttribute('x2') === x2.toString());

            assert(horizontalLines.length).equals(height + 1);

            horizontalLines.forEach((line, yCord) => {
                const y = yCord * pxCell;

                assert(line).hasAttributes({
                    y1: y.toString(),
                    y2: y.toString(),
                });
            });
        });
    });

    describe('drawMap()', () => {
        const dimensions = { width: 12, height: 14 };
        const mapDoc      = parseSvg(drawMap(dimensions, '')).children.item(0);

        it('returns an SVG element string', () => {
            assert(mapDoc).isElementTag('svg');
        });

        it('has correct width and heigh attributes', () => {
            const pxWidth = dimensions.width * pxCell;
            const pxHeight = dimensions.height * pxCell;

            assert(mapDoc).hasAttributes({
                width: pxWidth.toString(),
                height: pxHeight.toString(),
            });
        });

        it('contains the content', () => {
            const content = drawRect({ x: 0, y: 0, width: 10, height: 10 });
            const mapWithContent = drawMap(dimensions, content);

            assert(mapWithContent).stringIncludes(content);
        });
    });

    describe('drawRoom()', () => {
        /** @type {Rectangle} rectangle */
        const rectangle = { x: 1, y: 2, width: 3, height: 4 };

        /** @type {RoomText} */
        const roomText = { roomNumber: '11' };

        const roomDoc  = parseSvg(element('svg', drawRoom(rectangle, roomText)));
        const roomRect = roomDoc.querySelector('rect');

        it('contains a rect svg element with correct attributes', () => {
            assert(Boolean(roomRect)).isTrue();
            assert(roomRect).hasAttributes({
                x: (rectangle.x * pxCell).toString(),
                y: (rectangle.y * pxCell).toString(),
                width: (rectangle.width * pxCell).toString(),
                height: (rectangle.height * pxCell).toString(),
            });
        });

        it('contains a text svg element containing the room number', () => {
            const text = roomDoc.querySelector('text');

            assert(Boolean(text)).isTrue();
            text && assert(text.textContent).equals('11');
        });

        describe('given a room label', () => {
            it('contains a text svg element with the room label', () => {
                const roomWithLabelDoc = parseSvg(element('svg', drawRoom(rectangle, {
                    ...roomText,
                    roomLabel: 'Goblin Cafeteria',
                })));

                const texts = [ ...roomWithLabelDoc.querySelectorAll('text') ];

                assert(texts.length).equals(2);
                assert(texts.filter((text) => text.textContent === 'Goblin Cafeteria').length).equals(1);
            });
        });

        describe('when the room\'s width and height is greater than or equal to `pillarThreshold`', () => {
            it('contains 4 pillar circles', () => {
                const width  = pillarGridThreshold;
                const height = pillarGridThreshold;

                const roomWithPillarsDoc = parseSvg(element('svg', drawRoom({ ...rectangle, width, height }, roomText)));

                const pillars = roomWithPillarsDoc.querySelectorAll(`circle[r="${Math.round(pxCell * pillarRadiusRatio)}"]`);

                assert(pillars.length).equals(4);
            });
        });

        describe('when the room has a trap', () => {
            it('contains a text svg element as tha trap indicator', () => {
                const roomWithTrapDoc = parseSvg(element('svg', drawRoom(rectangle, roomText, { hasTraps: true })));

                const texts = [ ...roomWithTrapDoc.querySelectorAll('text') ];

                assert(texts.length).equals(2);
                assert(texts.filter((text) => text.textContent === trapLabel).length).equals(1);
            });
        });
    });
};
