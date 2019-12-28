
import { createAttrs } from '../utility/html';
import { dimensionRanges, customDimensions, roomTypeSizes } from '../rooms/dimensions';
import { getStartingPoint, wallSize } from './grid';
import { knobs } from '../knobs';
import { roll, rollArrayItem } from '../utility/roll';

const debug = false;

const cellBlank = '.';
const cellWall  = 'w';

const cellPx     = 20;
const borderPx   = 2;
const gridLinePx = 1;

const maxDoorWidth = 4;

const gridBackground  = '#efefef';
const gridStrokeColor = '#cfcfcf';
const roomBackground  = '#ffffff';
const roomStrokeColor = '#555555';


const checkArea = (grid, { x, y, width, height }) => {
    let minX = wallSize;
    let minY = wallSize;
    let maxX = grid.length - wallSize;
    let maxY = grid[0].length - wallSize;

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
    let minLeft   = minX + wallSize;
    let minTop    = minY + wallSize;
    let minBottom = maxY - wallSize;
    let minRight  = maxX - wallSize;

    let upperLeft  = x <= minLeft  && y <= minTop;
    let upperRight = x >= minRight && y <= minTop;
    let lowerRight = x >= minRight && y >= minBottom;
    let lowerLeft  = x <= minLeft  && y >= minBottom;

    return upperLeft || upperRight || lowerRight || lowerLeft;
};

const getValidRoomCords = (grid, prevRoom, { roomWidth, roomHeight }) => {
    let {
        x: prevX,
        y: prevY,
        width: prevWidth,
        height: prevHeight,
    } = prevRoom;

    let minX = prevX - roomWidth - wallSize;
    let minY = prevY - roomHeight - wallSize;
    let maxX = prevX + prevWidth + wallSize;
    let maxY = prevY + prevHeight + wallSize;

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

const drawLine = ({ x1, y1, x2, y2, color, width }) => {
    let attrs = createAttrs({
        x1, y1, x2, y2,
        stroke: color,
        'stroke-width': width,
        'shape-rendering': 'crispEdges',
    });

    return `<line ${attrs} />`;
};

const drawGrid = ({ gridWidth, gridHeight }) => {
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

const getRectAttrs = ({ x, y, width, height }) => {
    let xPx = x * cellPx;
    let yPx = y * cellPx;

    let widthPx  = width * cellPx;
    let heightPx = height * cellPx;

    return { x: xPx, y: yPx, width: widthPx, height: heightPx }
};

const getRoomDimensions = (roomType, roomSize) => {
    if (customDimensions[roomType]) {
        return customDimensions[roomType](roomSize);
    }

    let [ min, max ] = dimensionRanges[roomSize];

    let roomWidth  = roll(min, max);
    let roomHeight = roll(min, max);

    return { roomWidth, roomHeight };
};

const drawRoom = (grid, { x, y, width, height }, roomNumber) => {
    let walls = [];

    for (let w = -wallSize; w < (width + wallSize); w++) {
        for (let h = -wallSize; h < (height + wallSize); h++) {
            let xCord = x + w;
            let yCord = y + h;

            if (!grid[xCord] || !grid[xCord][yCord]) {
                continue;
            }

            let isWall = w === -wallSize || w === width ||
                         h === -wallSize || h === height;

            if (isWall) {
                walls.push([ xCord, yCord ]);
            }

            let cell = isWall ?  cellWall : roomNumber;

            grid[xCord][yCord] = cell;
        }
    }

    let px = getRectAttrs({ x, y, width, height });

    let attrs = createAttrs({
        ...px,
        fill: roomBackground,
        stroke: roomStrokeColor,
        'stroke-width': borderPx,
    });

    let text = drawText(roomNumber, {
        x: (px.x + px.width  / 2),
        y: (px.y + px.height / 2),
    });

    return {
        rect: `<rect ${attrs} />${text}`,
        walls,
    };
};

const drawDoor = (grid, { x, y, width, height }) => {
    // TODO add doors to grid
    let attrs = createAttrs({
        ...getRectAttrs({ x, y, width, height }),
        fill: roomBackground,
        stroke: '#ffffff',
        'stroke-width': borderPx,
    });

    return `<rect ${attrs} />`;
};

const getDoors = (grid, room, prevRoom) => {
    let prevWalls = [];

    if (prevRoom) {
        prevWalls = prevRoom.walls;
    } else {
        let gridWidth  = grid.length - 1;
        let gridHeight = grid[0].length - 1;

        for (let i = 0; i <= gridHeight; i++) {
            prevWalls.push([ 0, i ]);
            prevWalls.push([ gridWidth, i ]);
        }

        for (let i = 0; i <= gridWidth; i++) {
            prevWalls.push([ i, 0 ]);
            prevWalls.push([ i, gridHeight ]);
        }
    }

    let roomWalls = room.walls.map((cords) => cords.join());
    let prevRoomWalls = prevWalls.map((cords) => cords.join())

    let intersection = roomWalls.filter((value) => prevRoomWalls.includes(value));

    intersection.shift();
    intersection.pop();

    let cords = intersection.map((xy) => xy.split(','));

    return [
        cords,
    ];
};

const drawDoors = (grid, room, prevRoom) => {
    return getDoors(grid, room, prevRoom).map((cells) => {
        let max       = Math.min(maxDoorWidth, Math.ceil(cells.length / 2));
        let size      = roll(1, max);
        let remainder = cells.length - size;
        let start     = roll(0, remainder);

        let doorCells = cells.slice(start, start + size);

        let [ x, y ] = doorCells[0];

        let width  = 1;
        let height = 1;

        doorCells.forEach(([ cellX, cellY ]) => {
            if (cellX > x) {
                width++;
            }

            if (cellY > y) {
                height++;
            }
        });

        return {
            rect: drawDoor(grid, { x, y, width, height }),
            type: 'Door', // TODO
        };
    });
};

const drawDungeon = (mapSettings, grid) => {
    let rooms = [];
    let prevRoom;

    let roomNumber = 1;

    mapSettings.rooms.forEach((roomConfig) => {
        let { settings: {
            [knobs.roomSize]: roomSize,
            [knobs.roomType]: roomType,
        } } = roomConfig;

        let roomDimensions = getRoomDimensions(roomType, roomSize);

        let x;
        let y;

        if (prevRoom) {
            let validCords = getValidRoomCords(grid, prevRoom, roomDimensions);

            if (!validCords.length) {
                return;
            }

            [ x, y ] = rollArrayItem(validCords);
        } else {
            [ x, y ] = getStartingPoint(mapSettings, roomDimensions);
        }

        let room = {
            x, y,
            width: roomDimensions.roomWidth,
            height: roomDimensions.roomHeight,
        };

        let { rect, walls } = drawRoom(grid, room, roomNumber);

        room.walls = walls;

        let doors = drawDoors(grid, room, prevRoom);
        // doors
        rooms.push({
            rect,
            room: roomConfig,
            doors: doors, // TODO rects
        });

        roomNumber++;

        prevRoom = room;
    });

    return rooms;
};

const logGrid = (grid) => {
    let cols = [];

    grid.forEach((column, x) => {
        let rows = [];

        column.forEach((_, y) => {
            grid[y] && grid[y][x] && rows.push(grid[y][x]);
        });

        rows.length && cols.push(rows);
    });

    console.log(cols);
};

export const generateMap = (mapSettings) => {
    let { gridWidth, gridHeight } = mapSettings;

    let grid = [ ...Array(gridWidth) ].fill(cellBlank);

    grid.forEach((_, col) => {
        grid[col] = [ ...Array(gridHeight) ].fill(cellBlank);
    });

    let rooms     = drawDungeon(mapSettings, grid);
    let roomRects = rooms.map((room) => room.rect).join('');
    let doorRects = rooms.map((room) => room.doors.map((door) => door.rect).join('')).join('');
    let gridLines = drawGrid(mapSettings);
    let content   = gridLines + roomRects + doorRects;

    debug && logGrid(grid);

    let attrs = createAttrs({
        width : (gridWidth * cellPx),
        height: (gridHeight * cellPx),
        style : `background: ${gridBackground}; overflow: visible;`,
    });

    return {
        map: `<svg ${attrs}>${content}</svg>`,
        rooms,
    };
};
