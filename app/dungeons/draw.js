
import { createAttrs } from '../utility/html';
import { directions } from './map';

const gridLinePx = 1;
const cellPx     = 24;
const borderPx   = 2;

const roomStrokeColor = '#a9a9a9';
const roomBackground  = 'rgba(255, 255, 255, 0.7)';
const gridBackground  = '#f0f0f0';
const textColor       = '#666666';
const gridStrokeColor = '#cfcfcf';

export const getRectAttrs = ({ x, y, width, height }) => {
    let xPx = x * cellPx;
    let yPx = y * cellPx;

    let widthPx  = width * cellPx;
    let heightPx = height * cellPx;

    return { x: xPx, y: yPx, width: widthPx, height: heightPx }
};

export const drawText = (text, [ x, y ], { fontSize }) => {
    let attrs = createAttrs({
        x, y: y + 2,
        fill: textColor,
        'alignment-baseline': 'middle',
        'font-family': 'monospace',
        'font-size': `${fontSize}px`,
        'text-anchor': 'middle',
    });

    return `<text ${attrs}>${text}</text>`;
};

const drawLine = ({ x1, y1, x2, y2, color, width }) => {
    let attrs = createAttrs({
        x1, y1, x2, y2,
        stroke: color,
        'stroke-width': width,
        'shape-rendering': 'crispEdges',
        'stroke-linecap': 'square',
    });

    return `<line ${attrs} />`;
};

export const drawGrid = ({ gridWidth, gridHeight }) => {
    let lines = '';

    let gridLineAttrs = {
        color: gridStrokeColor,
        width: gridLinePx,
    };

    for (let i = 0; i <= gridHeight; i++) {
        let unit = i * cellPx;

        lines += drawLine({
            ...gridLineAttrs,
            x1: 0,
            y1: unit,
            x2: gridWidth * cellPx,
            y2: unit,

        });
    }

    for (let i = 0; i <= gridWidth; i++) {
        let unit = i * cellPx;

        lines += drawLine({
            ...gridLineAttrs,
            x1: unit,
            y1: 0,
            x2: unit,
            y2: gridHeight * cellPx,
        });
    }

    return lines;
};

export const drawRoom = (rectAttrs) => {
    let attrs = createAttrs({
        ...rectAttrs,
        fill: roomBackground,
        stroke: roomStrokeColor,
        'stroke-width': borderPx,
    });

    return `<rect ${attrs} />`;
};

export const drawDoor = (rectConfig) => {
    let direction = rectConfig.direction;
    let rectAttrs = getRectAttrs(rectConfig)

    let attrs = createAttrs({
        ...rectAttrs,
        fill: roomBackground,
        stroke: roomBackground,
        'stroke-width': borderPx,
    });

    let { x, y, width, height } = rectAttrs;

    let lineAttrs = {
        color: roomStrokeColor,
        width: borderPx,
    };

    let lines = [];

    let x1 = x;
    let y1 = y;
    let x2 = x;
    let y2 = y;

    if (direction === directions.north || direction === directions.south) {
            y2     = y + height;
        let xRight = x + width
        let yHalf  = y + (height / 2);

        lines.push(
            drawLine({ ...lineAttrs, x1, y1, x2, y2 }),
            drawLine({ ...lineAttrs, x1: xRight, y1, x2: xRight, y2 }),
            drawLine({ ...lineAttrs, x1, y1: yHalf, x2: xRight, y2: yHalf }),
        );
    } else {
            x2      = x + width;
        let yBottom = y + height
        let xHalf   = x + (width / 2);

        lines.push(
            drawLine({ ...lineAttrs, x1, y1, x2, y2 }),
            drawLine({ ...lineAttrs, x1, y1: yBottom, x2, y2: yBottom }),
            drawLine({ ...lineAttrs, x1: xHalf, y1, x2: xHalf, y2: yBottom }),
        );
    }

    return `<rect ${attrs} />${lines.join('')}`;
};

export const drawMap = ({ gridWidth, gridHeight }, content) => {
    let attrs = createAttrs({
        width : (gridWidth * cellPx),
        height: (gridHeight * cellPx),
        style : `background: ${gridBackground}; overflow: visible;`,
    });

    return `<svg ${attrs}>${content}</svg>`;
};
