
import { createAttrs } from '../utility/html.js';
import { directions } from './map.js';
import doorType, { lockable } from '../rooms/door.js';

// TODO differentiate between grid x, y, width, & height, and pixel x, y, width
// and height in variable names.
// TODO create svg() method.

/** @typedef {import('./map').Directions} Directions */

// -- Config -------------------------------------------------------------------

export const pxCell = 24;

const pxBorder     = 2;
const pxGridLine   = 1;
const pxTextOffset = 2;

const colorGridFill     = '#f0f0f0';
const colorGridStroke   = '#cfcfcf';
const colorLockedFill   = '#cccccc';
const colorPillarFill   = '#f9f9f9';
const colorPillarStroke = 'rgba(207, 207, 207, 0.7)';
const colorRoomFill     = 'rgba(255, 255, 255, 0.7)';
const colorRoomStroke   = '#a9a9a9';
const colorText         = '#666666';
const colorTransparent  = 'transparent';
const colorTrapFill     = 'rgba(207, 207, 207, 0.8)';

const radiusPillar = 4;
const radiusHole   = 6;

const doorInset    = 12;
const doorWidth    = 8; // TODO rename to door size

const doorSecretLabel    = 'S';
const doorConcealedLabel = 'C';

const trapLabel = 'T';

// TODO move to map.js
export const labelMinWidth  = 3;
export const labelMinHeight = 2;

const pillarThreshold = 6;
const pillarInset = 1;

const fontSizeNormal = 14;
const fontSizeSmall  = 10;

export {
    doorConcealedLabel as testDoorConcealedLabel,
    doorInset          as testDoorInset,
    doorSecretLabel    as testDoorSecretLabel,
    doorWidth          as testDoorWidth,
    pillarInset        as testPillarInset,
    pillarThreshold    as testPillarThreshold,
    pxTextOffset       as testPxTextOffset,
};

// -- Private Functions --------------------------------------------------------

/**
 * Get rectangle attributes.
 *
 * @param {object} args
 *     @param {number} args.x
 *     @param {number} args.y
 *     @param {number} args.width
 *     @param {number} args.height
 *
 * @returns {object}
 */
function getRectAttrs({ x, y, width, height }) {
    let xPx = x * pxCell;
    let yPx = y * pxCell;

    let widthPx  = width * pxCell;
    let heightPx = height * pxCell;

    return { x: xPx, y: yPx, width: widthPx, height: heightPx };
}

/**
 * Returns an SVG circle element string.
 *
 * @param {object} args
 *     @param {number} args.cx
 *     @param {number} args.cy
 *     @param {number} args.r
 *     @param {boolean} [args.stroke] // TODO move to an `options` param
 *     @param {string} args.fill
 *
 * @returns {string}
 */
function drawCircle({ cx, cy, r, stroke, fill }) {
    let attrs = createAttrs({
        cx,
        cy,
        r,
        fill,
        'shape-rendering': 'geometricPrecision',
        ...(stroke && { stroke, 'stroke-width': 2 })
    });

    return `<circle${attrs} />`;
}

/**
 * Returns an SVG line element string.
 *
 * @param {object} args
 *     @param {number} args.x1
 *     @param {number} args.y1
 *     @param {number} args.x2
 *     @param {number} args.y2
 *     @param {string} args.color
 *     @param {number} args.width
 *     @param {boolean} [args.dashed] // TODO move to an `options` param
 *
 * @returns {string}
 */
function drawLine({ x1, y1, x2, y2, color, width, dashed }) {
    let attrs = createAttrs({
        x1,
        y1,
        x2,
        y2,
        stroke: color,
        'shape-rendering': 'crispEdges',
        'stroke-linecap': 'square',
        'stroke-width': width,
        ...(dashed && { 'stroke-dasharray': 5 }),
    });

    return `<line${attrs} />`;
}

/**
 * Draws an map pillar.
 *
 * @param {object} [attrs]
 *
 * @returns {string}
 */
function drawPillar(attrs) {
    return drawCircle({
        r: radiusPillar,
        stroke: colorRoomStroke,
        fill: colorPillarFill,
        ...attrs,
    });
}

/**
 * Returns a map pillar cell.
 *
 * {[ x: number, y: number ]} cords
 *
 * @returns {string}
 */
function drawPillarCell([ x, y ]) {
    let rect = getRectAttrs({ x, y, width: 1, height: 1 });

    let cx = rect.x + (rect.width / 2);
    let cy = rect.y + (rect.height / 2);

    return drawPillar({ cx, cy, stroke: colorPillarStroke });
}

/**
 * Returns pillars for a room with x & y dimensions greater than
 * `pillarThreshold`.
 *
 * @param {object} args
 *     @param {number} args.x
 *     @param {number} args.y
 *     @param {number} args.width
 *     @param {number} args.height
 *
 * @returns {string[]}
 */
function drawPillars({ x, y, width, height }) {
    let pillars = [];

    if (width < pillarThreshold || height < pillarThreshold) {
        return pillars;
    }

    let innerWidth  = width - (pillarInset * 2);
    let innerHeight = height - (pillarInset * 2);

    pillars.push(drawPillarCell([ x + pillarInset, y + pillarInset ]));
    pillars.push(drawPillarCell([ x + innerWidth,  y + pillarInset ]));
    pillars.push(drawPillarCell([ x + pillarInset, y + innerHeight ]));
    pillars.push(drawPillarCell([ x + innerWidth,  y + innerHeight ]));

    return pillars;
}

/**
 * Returns an SVG rectangle element string.
 *
 * @param {object} [rectAttrs] // TODO typedef
 *
 * @returns {string}
 */
function drawRect(rectAttrs) {
    let attrs = createAttrs(rectAttrs);

    return `<rect${attrs} />`;
}

/**
 * Returns one or more SVG text element strings to label rooms on the map.
 *
 * @param {object} rectAttrs
 * @param {object} args
 *     @param {object} args.roomNumber
 *     @param {object} [args.roomLabel]
 *
 * @returns {string}
 */
function drawRoomText(rectAttrs, { roomNumber, roomLabel }) {
    let middleX = (rectAttrs.x + (rectAttrs.width  / 2));
    let middleY = (rectAttrs.y + (rectAttrs.height / 2));

    let fontSize = fontSizeNormal;
    let labelY   = roomLabel ? middleY - (fontSize / 2) : middleY;

    let text = drawText(roomNumber, [ middleX, labelY ], { fontSize });

    if (roomLabel) {
        let roomLabelY = labelY + fontSize;

        text += drawText(roomLabel, [ middleX, roomLabelY ], { fontSize: fontSizeSmall });
    }

    return text;
}

/**
 * Returns an SVG text element string.
 *
 * @param {string} text
 * @param {[ x: number, y: number ]} cords
 * @param {object} [options]
 *     @param {number} [options.fontSize = 14]
 *     @param {string} [options.fill = '#666666']
 *
 * @returns {string}
 */
function drawText(text, [ x, y ], { fontSize = fontSizeNormal, fill = colorText } = {}) {
    let attrs = createAttrs({
        x,
        y: y + pxTextOffset,
        fill,
        'alignment-baseline': 'middle',
        'font-family': 'monospace',
        'font-size': `${fontSize}px`,
        'text-anchor': 'middle',
    });

    return `<text${attrs}>${text}</text>`;
}

/**
 * Returns a trap label SVG text element string.
 *
 * @param {object} rectAttrs
 *
 * @returns {string}
 */
function drawTrapText(rectAttrs) {
    let middleX = (rectAttrs.x + (pxCell / 2));
    let middleY = (rectAttrs.y + (rectAttrs.height - (pxCell / 2)));

    return drawText(trapLabel, [ middleX, middleY ], { fill: colorTrapFill });
}

export {
    drawCircle     as testDrawCircle,
    drawLine       as testDrawLine,
    drawPillar     as testDrawPillar,
    drawPillarCell as testDrawPillarCell,
    drawPillars    as testDrawPillars,
    drawRect       as testDrawRect,
    drawRoomText   as testDrawRoomText,
    drawText       as testDrawText,
    drawTrapText   as testDrawTrapText,
    getRectAttrs   as testDetRectAttrs,
};

// -- Public Functions ---------------------------------------------------------

/**
 * Returns a door cell SVG element string for the given door type.
 *
 * @param {object} doorAttrs
 * @param {object} args
 *     @param {"north" | "east" | "south" | "west"} args.direction
 *     @param {string} args.type
 *     @param {boolean} args.locked // TODO move to options param
 *
 * @returns {string}
 */
export const drawDoor = (doorAttrs, { direction, type, locked }) => {
    // TODO doors should only ever be 1 wide or 1 tall depending on direction

    let rectAttrs = getRectAttrs(doorAttrs);
    let isSecret  = type === doorType.secret || type === doorType.concealed;
    let color     = isSecret ? colorTransparent : colorRoomFill;

    let attrs = createAttrs({
        ...rectAttrs,
        fill: color,
        stroke: color,
        'stroke-width': pxBorder,
    });

    let rect = `<rect${attrs} />`;

    let { x, y, width, height } = rectAttrs;

    let lineAttrs = {
        color: colorRoomStroke,
        width: pxBorder,
        dashed: isSecret,
    };

    let lineCords = [];
    let isVertical = direction === directions.north || direction === directions.south;

    let xHalf   = x + (width / 2);
    let yHalf   = y + (height / 2);
    let xRight  = x + width
    let yBottom = y + height

    // Draw walls
    if (isVertical) {
        let y2 = y + height;

        lineCords.push({ x1: x,      y1: y, x2: x,      y2: y2 });
        lineCords.push({ x1: xRight, y1: y, x2: xRight, y2: y2 });
    } else {
        let x2 = x + width;

        lineCords.push({ x1: x, y1: y,       x2: x2, y2: y });
        lineCords.push({ x1: x, y1: yBottom, x2: x2, y2: yBottom });
    }

    let details = [];

    let divisionLineCords = {
        x1: isVertical ? x      : xHalf,
        y1: isVertical ? yHalf  : y,
        x2: isVertical ? xRight : xHalf,
        y2: isVertical ? yHalf  : yBottom,
    };

    if (lockable.has(type)) {
        lineCords.push(divisionLineCords);

        let { x1, y1 } = divisionLineCords;

        let inset = isVertical ? (width - doorInset) : (height - doorInset);

        let halfInset = doorInset / 2;
        let halfWidth = doorWidth / 2;

        let rectWidth  = isVertical ? inset     : doorWidth;
        let rectHeight = isVertical ? doorWidth : inset;

        let rectX = isVertical ? (x1 + halfInset) : (x1 - halfWidth);
        let rectY = isVertical ? (y1 - halfWidth) : (y1 + halfInset);

        details.push(drawRect({
            x: rectX,
            y: rectY,
            width: rectWidth,
            height: rectHeight,
            fill: locked ? colorLockedFill : colorPillarFill,
            stroke: colorRoomStroke,
            'stroke-width': pxBorder,
        }));

    } else if (type === doorType.archway) {
        let cx  = isVertical ? x      : xHalf;
        let cy  = isVertical ? yHalf  : y;
        let cx2 = isVertical ? xRight : cx;
        let cy2 = isVertical ? cy     : yBottom;

        details.push(drawPillar({ cx, cy }));
        details.push(drawPillar({ cx: cx2, cy: cy2 }));
    } else if (type === doorType.hole) {
        lineCords.push(divisionLineCords);

        let { x1, y1 } = divisionLineCords;

        let cx = isVertical ? xHalf : x1;
        let cy = isVertical ? y1 : yHalf;

        details.push(drawCircle({ cx, cy, r: radiusHole, fill: colorPillarFill }));
    } else if (type === doorType.secret) {
        details.push(drawText(doorSecretLabel, [ xHalf, yHalf ]));
    } else if (type === doorType.concealed) {
        details.push(drawText(doorConcealedLabel, [ xHalf, yHalf ]));
    }

    let lines = lineCords.map((cords) => drawLine({ ...lineAttrs, ...cords })).join('');

    return rect + lines + details.join('');
};

/**
 * Returns horizontal and vertical grid SVG element line strings for the given
 * grid width and height.
 *
 * @param {object} args
 *     @param {number} args.gridWidth
 *     @param {number} args.gridHeight
 *
 * @returns {string}
 */
export function drawGrid({ gridWidth, gridHeight }) {
    let lines = '';

    let gridLineAttrs = {
        color: colorGridStroke,
        width: pxGridLine,
    };

    for (let i = 0; i <= gridHeight; i++) {
        let unit = i * pxCell;

        lines += drawLine({
            ...gridLineAttrs,
            x1: 0,
            y1: unit,
            x2: gridWidth * pxCell,
            y2: unit,
        });
    }

    for (let i = 0; i <= gridWidth; i++) {
        let unit = i * pxCell;

        lines += drawLine({
            ...gridLineAttrs,
            x1: unit,
            y1: 0,
            x2: unit,
            y2: gridHeight * pxCell,
        });
    }

    return lines;
};

export const drawRoom = (roomAttrs, roomTextConfig, { hasTraps } = {}) => {
    let rectAttrs = getRectAttrs(roomAttrs);

    let attrs = {
        ...rectAttrs,
        fill: colorRoomFill,
        stroke: colorRoomStroke,
        'shape-rendering': 'crispEdges',
        'stroke-width': pxBorder,
    };

    let rect    = drawRect(attrs);
    let pillars = drawPillars(roomAttrs) || [];
    let text    = drawRoomText(rectAttrs, roomTextConfig);
    let trap    = hasTraps ? drawTrapText(rectAttrs) : '';

    return rect + pillars.join('') + text + trap;
};

export const drawMap = ({ gridWidth, gridHeight }, content) => {
    let attrs = createAttrs({
        width : (gridWidth * pxCell),
        height: (gridHeight * pxCell),
        style : `background: ${colorGridFill}; overflow: visible;`,
    });

    return `<svg ${attrs}>${content}</svg>`;
};
