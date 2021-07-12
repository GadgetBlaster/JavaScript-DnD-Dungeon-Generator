
import { createAttrs } from '../utility/html.js';
import { directions } from './map.js';
import { wallSize } from './grid.js';
import doorType, { lockable } from '../rooms/door.js';

// -- Config -------------------------------------------------------------------

export const pxBorder   = 2;
export const pxCell     = 24;
export const pxGridLine = 1;

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

const doorWidth    = 8;
const doorInset    = 12;

const doorSecretLabel    = 'S';
const doorConcealedLabel = 'C';

const trapLabel = 'T';

export const labelMinWidth  = 3;
export const labelMinHeight = 2;

const pillarThreshold = 6;

const fontSizeNormal = 14;
const fontSizeSmall  = 10;

// -- Private Functions --------------------------------------------------------

/**
 * Draw text SVG element
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
        y: y + 2,
        fill,
        'alignment-baseline': 'middle',
        'font-family': 'monospace',
        'font-size': `${fontSize}px`,
        'text-anchor': 'middle',
    });

    return `<text ${attrs}>${text}</text>`;
}

const drawLine = ({ x1, y1, x2, y2, color, width, dashed }) => {
    let attrs = createAttrs({
        x1, y1, x2, y2,
        stroke: color,
        'shape-rendering': 'crispEdges',
        'stroke-linecap': 'square',
        'stroke-width': width,
        ...(dashed && { 'stroke-dasharray': 5 }),
    });

    return `<line ${attrs} />`;
};

const drawCircle = ({ cx, cy, r, stroke, fill }) => {
    let attrs = createAttrs({
        cx, cy, r,
        fill,
        'shape-rendering': 'geometricPrecision',
        ...(stroke && { stroke, 'stroke-width': 2 })
    });

    return `<circle ${attrs} />`;
};

const drawRect = (rectAttrs) => {
    let attrs = createAttrs(rectAttrs);

    return `<rect ${attrs} />`;
};

const drawPillar = (attrs) => {
    return drawCircle({
        r: radiusPillar,
        stroke: colorRoomStroke,
        fill: colorPillarFill,
        ...attrs,
    });
};

const getRectAttrs = ({ x, y, width, height }) => {
    let xPx = x * pxCell;
    let yPx = y * pxCell;

    let widthPx  = width * pxCell;
    let heightPx = height * pxCell;

    return { x: xPx, y: yPx, width: widthPx, height: heightPx }
};

const drawRoomText = (rectAttrs, { roomNumber, roomLabel }) => {
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
};

const drawTrapText = (rectAttrs) => {
    let middleX = (rectAttrs.x + (pxCell  / 2));
    let middleY = (rectAttrs.y + (rectAttrs.height - (pxCell / 2)));

    return drawText(trapLabel, [ middleX, middleY ], { fill: colorTrapFill });
};

const drawPillarCell = ([ x, y ]) => {
    let px = getRectAttrs({ x, y, width: wallSize, height: wallSize });
    let cx = px.x + (px.width / 2);
    let cy = px.y + (px.height / 2);

    return drawPillar({ cx, cy, stroke: colorPillarStroke });
};

const drawPillars = ({ x, y, width, height }) => {
    let pillars = [];

    if (width < pillarThreshold || height < pillarThreshold) {
        return pillars;
    }

    let innerWidth  = width - 2;
    let innerHeight = height - 2;

    pillars.push(drawPillarCell([ x + 1, y + 1 ]));
    pillars.push(drawPillarCell([ x + innerWidth, y + 1 ]));
    pillars.push(drawPillarCell([ x + 1, y + innerHeight ]));
    pillars.push(drawPillarCell([ x + innerWidth, y + innerHeight ]));

    return pillars;
};

export {
    drawText as testDrawText,
    drawLine as testDrawLine,
    drawCircle as testDrawCircle,
    drawRect as testDrawRect,
    drawPillar as testDrawPillar,
    getRectAttrs as testDetRectAttrs,
    drawRoomText as testDrawRoomText,
    drawTrapText as testDrawTrapText,
    drawPillarCell as testDrawPillarCell,
    drawPillars as testDrawPillars,
};

// -- Public Functions ---------------------------------------------------------

export const drawGrid = ({ gridWidth, gridHeight }) => {
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

export const drawDoor = (doorAttrs, { direction, type, locked }) => {
    let rectAttrs = getRectAttrs(doorAttrs);
    let isSecret  = type === doorType.secret || type === doorType.concealed;
    let color     = isSecret ? colorTransparent : colorRoomFill;

    let attrs = createAttrs({
        ...rectAttrs,
        fill: color,
        stroke: color,
        'stroke-width': pxBorder,
    });

    let rect = `<rect ${attrs} />`;

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

        let rectWidth  = isVertical ? inset : doorWidth;
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

    return rect + lines + details.join();
};

export const drawMap = ({ gridWidth, gridHeight }, content) => {
    let attrs = createAttrs({
        width : (gridWidth * pxCell),
        height: (gridHeight * pxCell),
        style : `background: ${colorGridFill}; overflow: visible;`,
    });

    return `<svg ${attrs}>${content}</svg>`;
};
