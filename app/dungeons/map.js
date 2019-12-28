
import { createAttrs } from '../utility/html';
import { dimensionRanges, customDimensions, roomTypeSizes } from '../rooms/dimensions';
import { knobs } from '../knobs';
import { roll, rollArrayItem } from '../utility/roll';

const debug = false;

const wallSize = 1;

const sides = {
    top   : 'top',
    right : 'right',
    bottom: 'bottom',
    left  : 'left',
};

const cellBlank = '.';
const cellWall  = 'w';

const cellPx   = 20;

const gridBackground  = '#efefef';
const gridStrokeColor = '#cfcfcf';
const roomBackground  = '#ffffff';
const roomStrokeColor = '#555555';

const getStartingPoint = ({ gridWidth, gridHeight }, { roomWidth, roomHeight }) => {
    let side = rollArrayItem(Object.values(sides));

    let minX = wallSize;
    let minY = wallSize;
    let maxX = gridWidth - roomWidth - wallSize;
    let maxY = gridHeight - roomHeight - wallSize;

    if (maxX <= minX || maxY <= minY) {
        console.log(minX, maxX, minY, maxY);
        throw 'Min max error';
    }

    let x;
    let y;

    switch (side) {
        case sides.right:
            x = maxX;
            y = roll(minY, maxY);
            break;

        case sides.bottom:
            x = roll(minX, maxX);
            y = maxY;
            break;

        case sides.left:
            x = minX;
            y = roll(minY, maxY);
            break;

        case sides.top:
        default:
            x = roll(minX, maxX);
            y = minY;
            break;
    }

    return [ x, y ];
};

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
        'stroke-width': 2
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

const drawDoor = (grid, { x, y }) => {
    // TODO add doors to grid
    let attrs = createAttrs({
        ...getRectAttrs({ x, y, width: wallSize, height: wallSize }),
        fill: roomBackground,
        stroke: roomStrokeColor,
        'stroke-width': 2
    });

    return `<rect ${attrs} />`;
};

const getDoors = (grid, room, prevRoom) => {
    if (!prevRoom) {
        let x = room.x;
        let y = room.y;

        if (x === 1) {
            x--;
        } else if (x === (grid.length - 1)) {
            x++;
        } else if (y === 1) {
            y--;
        } else if (y === (grid[0].length - 1)) {
            y++;
        }

        return [ [ [ x, y ] ] ];
    }

    let currWalls    = room.walls.map((cords) => cords.join());
    let prevWalls    = prevRoom.walls.map((cords) => cords.join());
    let intersection = currWalls.filter((value) => prevWalls.includes(value));

    intersection.shift();
    intersection.pop();

    let cords = intersection.map((xy) => xy.split(','));

    return [
        cords,
    ];
};

const drawDoors = (grid, room, prevRoom) => {
    return getDoors(grid, room, prevRoom).map((doorCells) => {
        // TODO determine cells
        let [ x, y ] = doorCells[0];
        console.log(x, y);
        return {
            rect: drawDoor(grid, { x, y }),
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
