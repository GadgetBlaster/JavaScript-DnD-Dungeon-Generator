
import { roll, rollArrayItem } from '../utility/roll';

const tempRoomCount = 2;
const tempRoomUnits = 4;

const sides = {
    top   : 'top',
    right : 'right',
    bottom: 'bottom',
    left  : 'left',
};

const cellBlank = '.';
const cellRoom  = 'R';

const gridWidth  = 10;
const gridHeight = 10;

const cellPx   = 20;

const gridBackground  = '#efefef';
const gridStrokeColor = '#cfcfcf';
const roomBackground  = '#ffffff';
const roomStrokeColor = '#555555';

const getRoomMaxX = (roomWidth) => gridWidth - roomWidth;
const getRoomMaxY = (roomHeight) => gridHeight - roomHeight;

const getStartingPoint = ({ roomWidth = 1, roomHeight = 1 } = {}) => {
    let side = rollArrayItem(Object.values(sides));

    let x;
    let y;

    switch (side) {
        case sides.right:
            x = gridWidth - roomWidth;
            y = roll(0, getRoomMaxY(roomHeight));
            break;

        case sides.bottom:
            x = roll(0, getRoomMaxX(roomWidth));
            y = gridHeight - roomHeight;
            break;

        case sides.left:
            x = 0;
            y = roll(0, getRoomMaxY(roomHeight));
            break;

        case sides.top:
        default:
            x = roll(0, getRoomMaxX(roomWidth));
            y = 0;
            break;
    }

    return [ x, y ];
};

const createAttrs = (obj) => {
    return Object.keys(obj).map((key) => {
        return `${key}="${obj[key]}"`;
    }).join('');
};

const drawLine = ({ x1, y1, x2, y2 }) => {
    let attrs = createAttrs({
        x1, y1, x2, y2,
        stroke: gridStrokeColor,
        'stroke-width': 1,
        'shape-rendering': 'crispEdges',
    });

    return `<line ${attrs} />`;
};

const drawGrid = () => {
    let lines = '';

    for (let i = 0; i <= gridHeight; i++) {
        let unit = i * cellPx;
        let x2   = gridWidth * cellPx;

        lines += drawLine({ x1: 0, y1: unit, x2, y2: unit });
    }

    for (let i = 0; i <= gridWidth; i++) {
        let unit = i * cellPx;
        let y2   = gridHeight * cellPx;

        lines += drawLine({ x1: unit, y1: 0, x2: unit, y2 });
    }

    return lines;
};

const drawRect = (grid, { x, y, width = 1, height = 1, fill = roomBackground }) => {
    for (let w = 0; w < width; w++) {
        for (let h = 0; h < height; h++) {
            let xCord = x + w;
            let yCord = y + h;

            grid[xCord][yCord] = cellRoom;
        }
    }

    let attrs = createAttrs({
        x: x * cellPx,
        y: y * cellPx,
        width: width * cellPx,
        height: height * cellPx,
        fill,
        stroke: roomStrokeColor,
        'stroke-width': 2
    });

    return `<rect ${attrs} />`
};

const drawDungeon = (grid) => {
    let rooms = '';

    let [ x, y ] = getStartingPoint({
        roomWidth: tempRoomUnits,
        roomHeight: tempRoomUnits,
    });

    for (let i = 0; i <= tempRoomCount; i++) {
        rooms += drawRect(grid, {
            x: 1, y: 0,
            width: tempRoomUnits,
            height: tempRoomUnits,
        });
    }

    return rooms;
};

const logGrid = (grid) => {
    let cols = [];

    grid.forEach((column, x) => {
        let row = [];

        column.forEach((_, y) => {
            row.push(grid[y][x]);
        });

        cols.push(row);
    });

    console.table(cols);
};

export const generateMap = () => {
    let grid = [ ...Array(gridWidth) ].fill(cellBlank);

    grid.forEach((_, col) => {
        grid[col] = [ ...Array(gridHeight) ].fill(cellBlank);
    });

    let content = drawGrid() + drawDungeon(grid);

    logGrid(grid);

    let attrs = createAttrs({
        width : (gridWidth * cellPx),
        height: (gridHeight * cellPx),
        style : `background: ${gridBackground}; overflow: visible;`,
    });

    return `<svg ${attrs}>${content}</svg>`;
};
