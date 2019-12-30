
import { createAttrs } from '../utility/html';
import { directions } from './map';
import { wallSize } from './grid';
import doorType, { lockable } from '../rooms/door';

const pxBorder   = 2;
const pxCell     = 24;
const pxGridLine = 1;

const colorGridFill    = '#f0f0f0';
const colorGridStroke  = '#cfcfcf';
const colorRoomFill    = 'rgba(255, 255, 255, 0.7)';
const colorRoomStroke  = '#a9a9a9';
const colorText        = '#666666';
const colorPillarFill  = '#f9f9f9';
const colorTransparent = 'transparent';

const radiusPillar = 4;
const radiusHole   = 6;

const doorWidth    = 8;
const doorInset    = 12;

const doorSecretLabel    = 'S';
const doorConcealedLabel = 'C';

const labelRoomNumberFontSize = 14;
const labelRoomTypeFontSize   = 10;

const drawText = (text, [ x, y ], { fontSize = labelRoomNumberFontSize } = {}) => {
    let attrs = createAttrs({
        x, y: y + 2,
        fill: colorText,
        'alignment-baseline': 'middle',
        'font-family': 'monospace',
        'font-size': `${fontSize}px`,
        'text-anchor': 'middle',
    });

    return `<text ${attrs}>${text}</text>`;
};

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
}

const drawPillar = (attrs) => {
    return drawCircle({
        ...attrs,
        r: radiusPillar,
        stroke: colorRoomStroke,
        fill: colorPillarFill,
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
    let middleX = (rectAttrs.x + rectAttrs.width  / 2);
    let middleY = (rectAttrs.y + rectAttrs.height / 2);

    let fontSize = labelRoomNumberFontSize;
    let labelY   = roomLabel ? middleY - (fontSize / 2) : middleY;

    let text = drawText(roomNumber, [ middleX, labelY ], { fontSize });

    if (roomLabel) {
        let roomLabelY = labelY + fontSize;

        text += drawText(roomLabel, [ middleX, roomLabelY ], { fontSize: labelRoomTypeFontSize });
    }

    return text;
};

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

// TODO apply to large rooms
export const drawPillarCell = ([ x, y ]) => {
    let px = getRectAttrs({ x, y, width: wallSize, height: wallSize });
    let cx = px.x + (px.width / 2);
    let cy = px.y + (px.height / 2);

    return drawPillar({ cx, cy });
};

export const drawRoom = (roomAttrs, roomTextConfig) => {
    let rectAttrs = getRectAttrs(roomAttrs);

    let attrs = {
        ...rectAttrs,
        fill: colorRoomFill,
        stroke: colorRoomStroke,
        'shape-rendering': 'crispEdges',
        'stroke-width': pxBorder,
    };

    let rect = drawRect(attrs);
    let text = drawRoomText(rectAttrs, roomTextConfig);

    return rect + text;
};

export const drawDoor = (doorAttrs, { direction, type }) => {
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
            fill: colorPillarFill,
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
