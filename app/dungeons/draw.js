// @ts-check

import { directions } from './map.js';
import { element } from '../utility/element.js';
import { isRequired } from '../utility/tools.js';
import doorType, { lockable } from '../rooms/door.js';

// -- Types --------------------------------------------------------------------

/** @typedef {import('./map').Directions} Directions */
/** @typedef {import('./grid').GridCoordinates} GridCoordinates */
/** @typedef {import('./grid').Dimensions} Dimensions */
/** @typedef {import('./grid').GridRectangle} GridRectangle */
/** @typedef {import('../utility/element.js').Attributes} Attributes */

// -- Pixel Definitions --------------------------------------------------------

/**
 * @typedef PixelCoordinates
 *
 * @property {number} x
 * @property {number} y
 */

/**
 * @typedef PixelDimensions
 *
 * @property {number} width
 * @property {number} height
 */

// -- Shape Definitions --------------------------------------------------------

/**
 * @typedef Circle
 *
 * @property {number} cx
 * @property {number} cy
 * @property {number} r
 */

/**
 * @typedef Line
 *
 * @property {number} x1
 * @property {number} y1
 * @property {number} x2
 * @property {number} y2
 * @property {string} color
 * @property {number} width
 */

/**
 * @typedef {PixelCoordinates & PixelDimensions} Rectangle
 */

// -- Room Defs ----------------------------------------------------------------

/**
 * @typedef RoomText
 *
 * @property {number | string} roomNumber
 * @property {string} [roomLabel]
 */

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

const radiusPillar = 4; // TODO rename to pillarRadius & holeRadius
const radiusHole   = 6;

const doorInset    = 12; // In px?
const doorWidth    = 8; // TODO rename to door size

const doorSecretLabel    = 'S';
const doorConcealedLabel = 'C';

const trapLabel = 'T';

// TODO move to map.js
export const labelMinWidth  = 3;
export const labelMinHeight = 2;

const pillarGridThreshold = 6;
const pillarGridInset     = 1;

const fontSizeNormal = 14;
const fontSizeSmall  = 10;

const lineDashLength = 5;

export {
    colorLockedFill     as testColorLockedFill,
    colorPillarFill     as testColorPillarFill,
    colorRoomStroke     as testColorRoomStroke,
    doorConcealedLabel  as testDoorConcealedLabel,
    doorInset           as testDoorInset,
    doorSecretLabel     as testDoorSecretLabel,
    doorWidth           as testDoorWidth,
    lineDashLength      as testLineDashLength,
    pillarGridInset     as testPillarGridInset,
    pillarGridThreshold as testPillarGridThreshold,
    pxTextOffset        as testPxTextOffset,
    radiusHole          as testRadiusHole,
    radiusPillar        as testRadiusPillar,
    trapLabel           as testTrapLabel,
};

// -- Private Functions --------------------------------------------------------

/**
 * Returns an SVG circle element string.
 *
 * @private
 *
 * @param {Circle} circle
 * @param {object} [options]
 *     @param {string} [options.fill]
 *     @param {string} [options.stroke]
 *
 * @returns {string}
 */
function drawCircle({ cx, cy, r }, { fill, stroke } = {}) {
    isRequired(cx, 'cx is required by drawCircle()');
    isRequired(cy, 'cy is required by drawCircle()');
    isRequired(r,  'r is required by drawCircle()');

    let attributes = {
        cx,
        cy,
        r,
        fill,
        'shape-rendering': 'geometricPrecision',
        ...(stroke && { stroke, 'stroke-width': 2 }),
    };

    return element('circle', null, attributes);
}

/**
 * Returns an SVG line element string.
 *
 * @private
 *
 * @param {Line} args
 * @param {object} [options = {}]
 *     @param {boolean} [options.dashed]
 *
 * @returns {string}
 */
function drawLine({ x1, y1, x2, y2, color, width }, { dashed } = {}) {
    isRequired(x1,    'x1 is required by drawLine()');
    isRequired(y1,    'y1 is required by drawLine()');
    isRequired(x2,    'x2 is required by drawLine()');
    isRequired(y2,    'y2 is required by drawLine()');
    isRequired(color, 'color is required by drawLine()');
    isRequired(width, 'width is required by drawLine()');

    let attributes = {
        x1,
        y1,
        x2,
        y2,
        stroke: color,
        'shape-rendering': 'crispEdges',
        'stroke-linecap': 'square',
        'stroke-width': width,
        ...(dashed && { 'stroke-dasharray': lineDashLength }),
    };

    return element('line', null, attributes);
}

/**
 * Draws an map pillar.
 *
 * @private
 *
 * @param {Pick<Circle, "cx" | "cy">} circleCoordinates
 * @param {{ stroke?: string }} [options = {}]
 *
 * @returns {string}
 */
function drawPillar({ cx, cy }, { stroke } = {}) {
    return drawCircle({
        cx,
        cy,
        r: radiusPillar,
    }, {
        fill: colorPillarFill,
        stroke: stroke || colorRoomStroke,
    });
}

/**
 * Returns a map pillar cell.
 *
 * @private
 *
 * @param {GridCoordinates} coordinates
 *
 * @returns {string}
 */
function drawPillarCell({ gridX, gridY }) {
    let rect = getRectAttrs({ gridX, gridY, gridWidth: 1, gridHeight: 1 });

    let cx = rect.x + (rect.width / 2);
    let cy = rect.y + (rect.height / 2);

    return drawPillar({ cx, cy }, { stroke: colorPillarStroke });
}

/**
 * Returns an SVG rectangle element string.
 *
 * @private
 *
 * @param {Rectangle} rectangle
 * @param {Attributes} [attributes]
 *
 * @returns {string}
 */
function drawRect({ x, y, width, height }, attributes = {}) {
    isRequired(x,      'x is required by drawRect()');
    isRequired(y,      'y is required by drawRect()');
    isRequired(width,  'width is required by drawRect()');
    isRequired(height, 'height is required by drawRect()');

    return element('rect', null, { x, y, width, height, ...attributes });
}


/**
 * Returns pillars for a room with x & y dimensions greater than
 * `pillarThreshold`.
 *
 * @private
 *
 * @param {Rectangle} rectangle
 *
 * @returns {string}
 */
function drawRoomPillars({ x, y, width, height }) {
    let pillars = '';

    if (width < pillarGridThreshold || height < pillarGridThreshold) {
        return pillars;
    }

    let innerWidth  = width  - (pillarGridInset * 2);
    let innerHeight = height - (pillarGridInset * 2);

    pillars += drawPillarCell({ gridX: (x + pillarGridInset), gridY: (y + pillarGridInset) });
    pillars += drawPillarCell({ gridX: (x + innerWidth),      gridY: (y + pillarGridInset) });
    pillars += drawPillarCell({ gridX: (x + pillarGridInset), gridY: (y + innerHeight) });
    pillars += drawPillarCell({ gridX: (x + innerWidth),      gridY: (y + innerHeight) });

    return pillars;
}

/**
 * Returns one or more SVG text element strings to label rooms on the map.
 *
 * @private
 *
 * @param {Rectangle} rectangle
 * @param {RoomText} roomText
 *
 * @returns {string}
 */
function drawRoomText({ x, y, width, height }, { roomNumber, roomLabel }) {
    let middleX = (x + (width  / 2));
    let middleY = (y + (height / 2));

    let fontSize = fontSizeNormal;
    let labelY   = roomLabel ? middleY - (fontSize / 2) : middleY;

    let text = drawText(roomNumber, { x: middleX, y: labelY }, { fontSize });

    if (roomLabel) {
        let roomLabelY = labelY + fontSize;

        text += drawText(roomLabel, { x: middleX, y: roomLabelY }, { fontSize: fontSizeSmall });
    }

    return text;
}

/**
 * Returns an SVG text element string.
 *
 * @private
 *
 * @param {string | number} text
 * @param {PixelCoordinates} coordinates
 * @param {object} [options]
 *     @param {number} [options.fontSize = 14]
 *     @param {string} [options.fill = '#666666']
 *
 * @returns {string}
 */
function drawText(text, { x, y }, { fontSize = fontSizeNormal, fill = colorText } = {}) {
    let attributes = {
        x,
        y: y + pxTextOffset,
        fill,
        'alignment-baseline': 'middle',
        'font-family': 'monospace',
        'font-size': `${fontSize}px`,
        'text-anchor': 'middle',
    };

    return element('text', text, attributes);
}

/**
 * Returns a trap label SVG text element string.
 *
 * @private
 *
 * @param {Rectangle} rect
 *
 * @returns {string}
 */
function drawTrapText({ x, y, height }) {
    let middleX = (x + (pxCell / 2));
    let middleY = (y + (height - (pxCell / 2)));

    return drawText(trapLabel, { x: middleX, y: middleY }, { fill: colorTrapFill });
}

/**
 * Get rectangle attributes.
 *
 * @private
 *
 * @param {GridRectangle} rect
 *
 * @returns {Rectangle}
 */
function getRectAttrs({ gridX, gridY, gridWidth, gridHeight }) {
    let xPx = gridX * pxCell;
    let yPx = gridY * pxCell;

    let widthPx  = gridWidth  * pxCell;
    let heightPx = gridHeight * pxCell;

    return { x: xPx, y: yPx, width: widthPx, height: heightPx };
}

export {
    drawCircle      as testDrawCircle,
    drawLine        as testDrawLine,
    drawPillar      as testDrawPillar,
    drawPillarCell  as testDrawPillarCell,
    drawRect        as testDrawRect,
    drawRoomPillars as testDrawRoomPillars,
    drawRoomText    as testDrawRoomText,
    drawText        as testDrawText,
    drawTrapText    as testDrawTrapText,
    getRectAttrs    as testGetRectAttrs,
};

// -- Public Functions ---------------------------------------------------------

/**
 * Returns a door SVG element strings for the given door type and dimensions.
 *
 * @param {GridRectangle} gridRectangle
 * @param {object} args
 *     @param {"north" | "east" | "south" | "west"} args.direction // TODO reusable type
 *     @param {string} args.type
 *     @param {boolean} [args.locked] // TODO move to options param
 *
 * @returns {string}
 */
export function drawDoor(gridRectangle, { direction, type, locked }) {
    // TODO doors should only ever be 1 wide or 1 tall depending on direction

    let rectAttributes = getRectAttrs(gridRectangle);
    let isSecret  = type === doorType.secret || type === doorType.concealed;
    let color     = isSecret ? colorTransparent : colorRoomFill;

    let attributes = {
        ...rectAttributes,
        fill: color,
        stroke: color,
        'stroke-width': pxBorder,
    };

    let { x, y, width, height } = rectAttributes;

    let lineCords = [];
    let isVertical = direction === directions.north || direction === directions.south;

    let xHalf   = x + (width / 2);
    let yHalf   = y + (height / 2);
    let xRight  = x + width;
    let yBottom = y + height;

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
        }, {
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

        details.push(drawCircle({ cx, cy, r: radiusHole }, { fill: colorPillarFill }));
    } else if (type === doorType.secret) {
        details.push(drawText(doorSecretLabel, { x: xHalf, y: yHalf }));
    } else if (type === doorType.concealed) {
        details.push(drawText(doorConcealedLabel, { x: xHalf, y: yHalf }));
    }

    let lineAttrs   = { color: colorRoomStroke, width: pxBorder };
    let lineOptions = { dashed: isSecret };
    let lines       = lineCords.map((cords) => drawLine({ ...cords, ...lineAttrs }, lineOptions)).join('');

    return element('rect', null, attributes) + lines + details.join('');
}

/**
 * Returns a grid of horizontal and vertical SVG element line strings for the
 * given width and height.
 *
 * @param {Dimensions} dimensions
 *
 * @returns {string}
 */
export function drawGrid({ width, height }) {
    let lines = '';

    let gridLineAttrs = {
        color: colorGridStroke,
        width: pxGridLine,
    };

    for (let i = 0; i <= height; i++) {
        let unit = i * pxCell;

        lines += drawLine({
            x1: 0,
            y1: unit,
            x2: width * pxCell,
            y2: unit,
            ...gridLineAttrs,
        });
    }

    for (let i = 0; i <= width; i++) {
        let unit = i * pxCell;

        lines += drawLine({
            x1: unit,
            y1: 0,
            x2: unit,
            y2: height * pxCell,
            ...gridLineAttrs,
        });
    }

    return lines;
};

/**
 * Returns map SVG content wrapped in an SVG element with the given dimensions.
 *
 * @param {Dimensions} gridDimensions
 * @param {string} content
 *
 * @returns {string}
 */
export function drawMap({ width, height }, content) {
    let attributes = {
        width : (width * pxCell),
        height: (height * pxCell),
        style : `background: ${colorGridFill}; overflow: visible;`,
    };

    return element('svg', content, attributes);
}

/**
 * Returns a room's SVG element strings for the given room configs.
 *
 * TODO audit callers for new `gridRectangle` shape
 *
 * @param {GridRectangle} gridRectangle
 * @param {RoomText} roomTextConfig
 * @param {object} [options]
 *     @param {boolean} [options.hasTraps]
 *
 * @returns {string}
 *
 */
export function drawRoom(gridRectangle, roomTextConfig, { hasTraps } = {}) {
    let rectAttrs = getRectAttrs(gridRectangle);

    let rect = drawRect(rectAttrs, {
        fill: colorRoomFill,
        stroke: colorRoomStroke,
        'shape-rendering': 'crispEdges',
        'stroke-width': pxBorder,
    });

    let pillars = drawRoomPillars({ x: gridRectangle.gridX, y: gridRectangle.gridY, width: gridRectangle.gridWidth, height: gridRectangle.gridHeight });
    let text    = drawRoomText(rectAttrs, roomTextConfig);
    let trap    = hasTraps ? drawTrapText(rectAttrs) : '';

    return rect + pillars + text + trap;
}
