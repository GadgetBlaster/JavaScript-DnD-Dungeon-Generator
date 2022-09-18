// @ts-check

import { defaultFontSize, drawCircle, drawLine, drawRect, drawText } from '../utility/shape.js';
import { element } from '../utility/element.js';
import { lockable } from '../room/door.js';
import { toss } from '../utility/tools.js';

// -- Type Imports -------------------------------------------------------------

/** @typedef {import('../room/door').DoorType} DoorType */
/** @typedef {import('../utility/shape.js').Circle} Circle */
/** @typedef {import('../utility/shape.js').PixelRectangle} PixelRectangle */
/** @typedef {import('./grid').Coordinates} Coordinates */
/** @typedef {import('./grid').Dimensions} Dimensions */
/** @typedef {import('./grid').Rectangle} Rectangle */
/** @typedef {import('./map').Connection} Connection */
/** @typedef {import('./map').Direction} Direction */
/** @typedef {import('./map').Door} Door */

// -- Types -------------------------------------------------------------

/**
 * @typedef RoomText
 *
 * @prop {string} roomNumber
 * @prop {string} [roomLabel]
 */

// -- Config -------------------------------------------------------------------

const pxCell = 24;

const pxBorder     = 2;
const pxGridLine   = 1;

const colorGridFill     = '#f0f0f0';
const colorGridStroke   = '#cfcfcf';
const colorLockedFill   = '#cccccc';
const colorPillarFill   = '#f9f9f9';
const colorPillarStroke = 'rgba(207, 207, 207, 0.7)';
const colorRoomFill     = 'rgba(255, 255, 255, 0.7)';
const colorRoomStroke   = '#a9a9a9';
const colorTransparent  = 'transparent';
const colorTrapFill     = 'rgba(207, 207, 207, 0.8)';

const pillarRadiusRatio = 0.18; // % of pxCell
const holeRadiusRatio   = 0.25; // % of pxCell

const doorInset    = 12; // In px?
const doorWidth    = 8; // TODO rename to door size

const doorSecretLabel    = 'S';
const doorConcealedLabel = 'C';

const trapLabel = 'T';

const pillarGridThreshold = 6;
const pillarGridInset     = 1;

const fontSizeSmall = 10;

export {
    colorLockedFill     as testColorLockedFill,
    colorPillarFill     as testColorPillarFill,
    colorRoomStroke     as testColorRoomStroke,
    doorConcealedLabel  as testDoorConcealedLabel,
    doorInset           as testDoorInset,
    doorSecretLabel     as testDoorSecretLabel,
    doorWidth           as testDoorWidth,
    holeRadiusRatio     as testHoleRadiusRatio,
    pillarGridInset     as testPillarGridInset,
    pillarGridThreshold as testPillarGridThreshold,
    pillarRadiusRatio   as testPillarRadiusRatio,
    pxCell              as testPxCell,
    trapLabel           as testTrapLabel,
};

// -- Private Functions --------------------------------------------------------

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
        r: Math.round(pxCell * pillarRadiusRatio),
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
 * @param {Coordinates} coordinates
 *
 * @returns {string}
 */
function drawPillarCell({ x, y }) {
    let rect = getRectAttrs({ x, y, width: 1, height: 1 });

    let cx = rect.x + (rect.width / 2);
    let cy = rect.y + (rect.height / 2);

    return drawPillar({ cx, cy }, { stroke: colorPillarStroke });
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

    pillars += drawPillarCell({ x: (x + pillarGridInset), y: (y + pillarGridInset) });
    pillars += drawPillarCell({ x: (x + innerWidth),      y: (y + pillarGridInset) });
    pillars += drawPillarCell({ x: (x + pillarGridInset), y: (y + innerHeight) });
    pillars += drawPillarCell({ x: (x + innerWidth),      y: (y + innerHeight) });

    return pillars;
}

/**
 * Returns one or more SVG text element strings to label rooms on the map.
 *
 * @private
 *
 * @param {PixelRectangle} rectangle
 * @param {RoomText} roomText
 *
 * @returns {string}
 */
function drawRoomText({ x, y, width, height }, { roomNumber, roomLabel }) {
    let middleX = (x + (width  / 2));
    let middleY = (y + (height / 2));

    let fontSize = defaultFontSize;
    let labelY   = roomLabel ? middleY - (fontSize / 2) : middleY;

    let text = drawText(roomNumber, { x: middleX, y: labelY }, { fontSize });

    if (roomLabel) {
        let roomLabelY = labelY + fontSize;

        text += drawText(roomLabel, { x: middleX, y: roomLabelY }, { fontSize: fontSizeSmall });
    }

    return text;
}

/**
 * Returns a trap label SVG text element string.
 *
 * @private
 *
 * @param {PixelRectangle} rect
 *
 * @returns {string}
 */
function drawTrapText({ x, y, height }) {
    let middleX = (x + (pxCell / 2));
    let middleY = (y + (height - (pxCell / 2)));

    return drawText(trapLabel, { x: middleX, y: middleY }, { fill: colorTrapFill });
}

/**
 * Determines a direction orientation, returning "horizontal" or "vertical".
 *
 * @private
 *
 * @param {Direction} direction
 *
 * @returns {"horizontal" | "vertical"}
 */
const getDirectionOrientation = (direction) => direction === 'north' || direction === 'south'
    ? 'vertical'
    : 'horizontal';

/**
 * Determines a door orientation, returning "horizontal" or "vertical".
 *
 * @private
 * @throws
 *
 * @param {Connection} connection
 *
 * @returns {"horizontal" | "vertical"}
 */
function getDoorOrientation(connection) {
    let connections = Object.values(connection);

    if (!connections.length || connections.length > 2) {
        toss('Invalid number of connections in getDoorOrientation()');
    }

    let [ first, second ] = connections.map(({ direction }) => direction);

    if (!second) {
        // Out of the dungeon
        return getDirectionOrientation(first);
    }

    let isInvalid = (first === 'north' && second !== 'south')
        || (first === 'east' && second !== 'west')
        || (first === 'south' && second !== 'north')
        || (first === 'west' && second !== 'east');

    if (isInvalid) {
        toss('Invalid connection directions in getDoorOrientation()');
    }

    return getDirectionOrientation(first);
}

/**
 * Get rectangle attributes.
 *
 * @private
 *
 * @param {Rectangle} rectangle
 *
 * @returns {PixelRectangle}
 */
function getRectAttrs({ x, y, width, height }) {
    let xPx = x * pxCell;
    let yPx = y * pxCell;

    let widthPx  = width  * pxCell;
    let heightPx = height * pxCell;

    return {
        x: xPx,
        y: yPx,
        width: widthPx,
        height: heightPx,
    };
}

export {
    drawCircle              as testDrawCircle,
    drawLine                as testDrawLine,
    drawPillar              as testDrawPillar,
    drawPillarCell          as testDrawPillarCell,
    drawRect                as testDrawRect,
    drawRoomPillars         as testDrawRoomPillars,
    drawRoomText            as testDrawRoomText,
    drawText                as testDrawText,
    drawTrapText            as testDrawTrapText,
    getDirectionOrientation as testGetDirectionOrientation,
    getDoorOrientation      as testGetDoorOrientation,
    getRectAttrs            as testGetRectAttrs,
};

// -- Public Functions ---------------------------------------------------------

/**
 * Returns a door SVG element strings for the given door.
 *
 * @param {Door} door
 *
 * @returns {string}
 */
export function drawDoor(door) {
    // TODO doors should only ever be 1 wide or 1 tall depending on direction

    let {
        connect: connection,
        rectangle,
        type,
        locked,
    } = door;

    let rectAttributes = getRectAttrs(rectangle);
    let isSecret  = type === 'secret' || type === 'concealed';
    let color     = isSecret ? colorTransparent : colorRoomFill;

    let attributes = {
        ...rectAttributes,
        fill: color,
        stroke: color,
        'stroke-width': pxBorder,
    };

    let { x, y, width, height } = rectAttributes;

    let lineCords  = [];
    let isVertical = getDoorOrientation(connection) === 'vertical';

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

    } else if (type === 'archway') {
        let cx  = isVertical ? x      : xHalf;
        let cy  = isVertical ? yHalf  : y;
        let cx2 = isVertical ? xRight : cx;
        let cy2 = isVertical ? cy     : yBottom;

        details.push(drawPillar({ cx, cy }));
        details.push(drawPillar({ cx: cx2, cy: cy2 }));
    } else if (type === 'hole') {
        lineCords.push(divisionLineCords);

        let { x1, y1 } = divisionLineCords;

        let cx = isVertical ? xHalf : x1;
        let cy = isVertical ? y1 : yHalf;

        details.push(drawCircle({ cx, cy, r: Math.round(pxCell * holeRadiusRatio) }, { fill: colorPillarFill }));
    } else if (type === 'secret') {
        details.push(drawText(doorSecretLabel, { x: xHalf, y: yHalf }));
    } else if (type === 'concealed') {
        details.push(drawText(doorConcealedLabel, { x: xHalf, y: yHalf }));
    }

    let lineAttrs   = { color: colorRoomStroke, width: pxBorder };
    let lineOptions = { dashed: isSecret };
    let lines       = lineCords.map((cords) => drawLine({ ...cords, ...lineAttrs }, lineOptions)).join('');

    // TODO use `drawRect()`
    return element('rect', undefined, attributes) + lines + details.join('');
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
}

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
 * @param {Rectangle} rectangle
 * @param {RoomText} roomTextConfig
 * @param {object} options
 *     @param {boolean} [options.hasTraps]
 *
 * @returns {string}
 *
 */
export function drawRoom(rectangle, roomTextConfig, { hasTraps } = {}) {
    let rectAttrs = getRectAttrs(rectangle);

    let rect = drawRect(rectAttrs, {
        fill: colorRoomFill,
        stroke: colorRoomStroke,
        'shape-rendering': 'crispEdges',
        'stroke-width': pxBorder,
    });

    let pillars = drawRoomPillars(rectangle);
    let text    = drawRoomText(rectAttrs, roomTextConfig);
    let trap    = hasTraps ? drawTrapText(rectAttrs) : '';

    return rect + pillars + text + trap;
}
