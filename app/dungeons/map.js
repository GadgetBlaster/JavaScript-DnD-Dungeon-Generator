
import { createAttrs } from '../utility/html';
import { knobs } from '../knobs';
import { roll, rollArrayItem } from '../utility/roll';

const debug = false;

const tempRoomUnits = 4;

const sides = {
    top   : 'top',
    right : 'right',
    bottom: 'bottom',
    left  : 'left',
};

const cellBlank = '.';
const cellRoom  = 'R';

const cellPx   = 20;

const gridBackground  = '#efefef';
const gridStrokeColor = '#cfcfcf';
const roomBackground  = '#ffffff';
const roomStrokeColor = '#555555';

const getStartingPoint = ({ gridWidth, gridHeight }, { roomWidth, roomHeight }) => {
    let side = rollArrayItem(Object.values(sides));

    let minX = 1;
    let minY = 1;
    let maxX = gridWidth - roomWidth - 1;
    let maxY = gridHeight - roomWidth - 1;

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

const drawText = (text, { x, y }) => {
    let attrs = createAttrs({
        x, y,
        'alignment-baseline': 'middle',
        'font-family': 'sans-serif',
        'font-size': '20px',
        'text-anchor': 'middle',
    });

    return `<text ${attrs}>${text}</text>`;
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

const drawGrid = ({ gridWidth, gridHeight }) => {
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

const drawRoom = (grid, { x, y, width, height }, label) => {
    for (let w = 0; w < width; w++) {
        for (let h = 0; h < height; h++) {
            let xCord = x + w;
            let yCord = y + h;

            grid[xCord][yCord] = cellRoom;
        }
    }

    let xPx = x * cellPx;
    let yPx = y * cellPx;

    let widthPx  = width * cellPx;
    let heightPx = height * cellPx;

    let attrs = createAttrs({
        x: xPx,
        y: yPx,
        width: widthPx,
        height: heightPx,
        fill: roomBackground,
        stroke: roomStrokeColor,
        'stroke-width': 2
    });

    let text = drawText(label, {
        x: (xPx + widthPx / 2),
        y: (yPx + heightPx / 2),
    });

    return `<rect ${attrs} />` + text;
};

const drawDungeon = (mapSettings, grid) => {
    let rooms = [];

    let roomWidth  = tempRoomUnits;
    let roomHeight = tempRoomUnits;

    let roomDimensions = { roomWidth, roomHeight };

    let [ x, y ] = getStartingPoint(mapSettings, roomDimensions);

    let prevRoom;

    mapSettings.rooms.forEach((roomConfig, i) => {
        if (prevRoom) {
            let validCords = getValidRoomCords(grid, prevRoom, roomDimensions);

            if (!validCords.length) {
                return;
            }

            [ x, y ] = rollArrayItem(validCords);
        }

        let room = {
            x, y,
            width: roomWidth,
            height: roomHeight,
        };

        rooms.push(drawRoom(grid, room, i + 1));

        prevRoom = room;
    });

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


export const generateMap = (mapSettings) => {
    let { gridWidth, gridHeight } = mapSettings;

    let grid = [ ...Array(gridWidth) ].fill(cellBlank);

    grid.forEach((_, col) => {
        grid[col] = [ ...Array(gridHeight) ].fill(cellBlank);
    });

    let rooms = drawDungeon(mapSettings, grid);

    let content = drawGrid(mapSettings) + rooms.join('');

    debug && logGrid(grid);

    let attrs = createAttrs({
        width : (gridWidth * cellPx),
        height: (gridHeight * cellPx),
        style : `background: ${gridBackground}; overflow: visible;`,
    });

    return {
        map: `<svg ${attrs}>${content}</svg>`,
        roomCount: rooms.length,
    };
};
