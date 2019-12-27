
import { roll, rollArrayItem } from '../utility/roll';

const tempRoomCount = 2;
const tempRoomUnits = 4;

const sides = {
    top   : 'top',
    right : 'right',
    bottom: 'bottom',
    left  : 'left',
};

const gridWidth  = 50;
const gridHeight = 20;
const cellSize   = 20;

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

const createLine = ({ x1, y1, x2, y2 }) => {
    let attrs = createAttrs({
        x1, y1, x2, y2,
        stroke: gridStrokeColor,
        'stroke-width': 1,
        'shape-rendering': 'crispEdges',
    });

    return `<line ${attrs} />`;
};

const createGrid = () => {
    let lines = '';

    for (let i = 0; i <= gridHeight; i++) {
        let unit = i * cellSize;
        let x2   = gridWidth * cellSize;

        lines += createLine({ x1: 0, y1: unit, x2, y2: unit });
    }

    for (let i = 0; i <= gridWidth; i++) {
        let unit = i * cellSize;
        let y2   = gridHeight * cellSize;

        lines += createLine({ x1: unit, y1: 0, x2: unit, y2 });
    }

    return lines;
};

const createRect = ({ x, y, width = 1, height = 1, fill = roomBackground }) => {
    let attrs = createAttrs({
        x: x * cellSize,
        y: y * cellSize,
        width: width * cellSize,
        height: height * cellSize,
        fill,
        stroke: roomStrokeColor,
        'stroke-width': 2
    });

    return `<rect ${attrs} />`
};

const createRooms = (grid) => {
    let rooms = '';

    let [ x, y ] = getStartingPoint({
        roomWidth: tempRoomUnits,
        roomHeight: tempRoomUnits,
    });

    console.log(grid);

    for (let i = 0; i <= tempRoomCount; i++) {
        grid[x][y] = true;

        rooms += createRect({
            x, y,
            width: tempRoomUnits,
            height: tempRoomUnits,
        });
    }

    return rooms;
};

export const generateMap = () => {
    let grid = [ ...Array(gridWidth) ];

    grid.forEach((_, col) => {
        grid[col] = [ ...Array(gridHeight) ];
    });

    let content = createGrid() + createRooms(grid);

    let attrs = createAttrs({
        width : (gridWidth * cellSize),
        height: (gridHeight * cellSize),
        style : `background: ${gridBackground}; overflow: visible;`,
    });

    return `<svg ${attrs}>${content}</svg>`;
};
