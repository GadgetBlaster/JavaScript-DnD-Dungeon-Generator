
import { createAttrs } from '../utility/html';

const gridLinePx = 1;
const cellPx     = 24;

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

export const drawLine = ({ x1, y1, x2, y2, color, width }) => {
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

export const drawMap = ({ gridWidth, gridHeight }, content) => {
    let attrs = createAttrs({
        width : (gridWidth * cellPx),
        height: (gridHeight * cellPx),
        style : `background: ${gridBackground}; overflow: visible;`,
    });

    return `<svg ${attrs}>${content}</svg>`;
};
