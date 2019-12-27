
import { roll, rollArrayItem } from '../utility/roll';

const debug = false;

const tempRoomCount = 10;
const tempRoomUnits = 4;

const sides = {
    top   : 'top',
    right : 'right',
    bottom: 'bottom',
    left  : 'left',
};

const cellBlank = '.';
const cellRoom  = 'R';

const gridWidth  = 20;
const gridHeight = 20;

const cellPx   = 20;

const gridBackground  = '#efefef';
const gridStrokeColor = '#cfcfcf';
const roomBackground  = '#ffffff';
const roomStrokeColor = '#555555';

const getRoomMaxX = (roomWidth) => gridWidth - roomWidth;
const getRoomMaxY = (roomHeight) => gridHeight - roomHeight;

const createAttrs = (obj) => {
    return Object.keys(obj).map((key) => {
        return `${key}="${obj[key]}"`;
    }).join('');
};

const getStartingPoint = ({ roomWidth, roomHeight }) => {
    let side = rollArrayItem(Object.values(sides));

    let minX = 1;
    let minY = 1;
    let maxX = gridWidth - roomWidth - 1;
    let maxY = gridWidth - roomWidth - 1;

    let x;
    let y;

    switch (side) {
        case sides.right:
            x = gridWidth - roomWidth;
            y = roll(minY, maxY);
            break;

        case sides.bottom:
            x = roll(minX, maxX);
            y = gridHeight - roomHeight;
            break;

        case sides.left:
            x = 0;
            y = roll(minY, maxY);
            break;

        case sides.top:
        default:
            x = roll(minX, maxX);
            y = 0;
            break;
    }

    return [ x, y ];
};

const checkArea = (grid, { x, y, width, height }) => {
    let minX = 1;
    let minY = 1;
    let maxX = grid.length - 1;
    let maxY = grid[0].length - 1;

    for (let xCord = x; xCord < (x + width); xCord++) {
        for (let yCord = y; yCord < (y + height); yCord++) {
            if (xCord < minX || xCord >= maxX) {
                return false;
            }

            if (yCord < minY || yCord >= maxY) {
                return false;
            }

            if (grid[xCord][yCord] !== cellBlank) {
                return false;
            }
        }
    }

    return true;
};

const isCorner = ({ x, y, minX, minY, maxX, maxY }) => {
    let upperLeft  = x === minX && y === minY;
    let upperRight = x === maxX && y === minY;
    let lowerRight = x === maxX && y === maxY;
    let lowerLeft  = x === minX && y === maxY;

    return upperLeft || upperRight || lowerRight || lowerLeft;
};

const getValidRoomCords = (grid, prevRoom, { roomWidth, roomHeight }) => {
    let {
        x: prevX,
        y: prevY,
        width: prevWidth,
        height: prevHeight,
    } = prevRoom;

    let minX = prevX - roomWidth;
    let minY = prevY - roomHeight;
    let maxX = prevX + prevWidth;
    let maxY = prevY + prevHeight;

    let validCords = [];

    for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
            if (isCorner({ x, y, minX, minY, maxX, maxY })) {
                continue;
            }

            let valid = checkArea(grid, {
                x, y,
                width: roomWidth,
                height: roomHeight,
            });

            if (!valid) {
                continue;
            }

            validCords.push([ x, y ]);
        }
    }

    return validCords;
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

    let roomWidth = tempRoomUnits;
    let roomHeight = tempRoomUnits;

    let roomDimensions = { roomWidth, roomHeight };

    let [ x, y ] = getStartingPoint(roomDimensions);

    let prevRoom;

    for (let i = 0; i < tempRoomCount; i++) {
        if (prevRoom) {
            let validCords = getValidRoomCords(grid, prevRoom, roomDimensions);

            if (!validCords.length) {
                continue;
            }

            [ x, y ] = rollArrayItem(validCords);
        }

        let room = {
            x, y,
            width: roomWidth,
            height: roomHeight,
        };

        rooms += drawRect(grid, room);

        prevRoom = room;
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

    debug && logGrid(grid);

    let attrs = createAttrs({
        width : (gridWidth * cellPx),
        height: (gridHeight * cellPx),
        style : `background: ${gridBackground}; overflow: visible;`,
    });

    return `<svg ${attrs}>${content}</svg>`;
};
