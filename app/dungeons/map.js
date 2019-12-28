
import { createAttrs } from '../utility/html';
import { dimensionRanges, customDimensions } from '../rooms/dimensions';
import { knobs } from '../knobs';
import { roll, rollArrayItem } from '../utility/roll';
import { toWords } from '../utility/tools';
import type from '../rooms/type';

import {
    cellBlank,
    getStartingPoint,
    getValidRoomCords,
    sides,
    wallSize,
} from './grid';

const debug = false;

const cellWall = 'w';
const cellDoor = 'd';

const cellPx     = 24;
const borderPx   = 2;
const gridLinePx = 1;

const maxDoorWidth = 4;

const gridBackground  = '#efefef';
const gridStrokeColor = '#cfcfcf';
const roomBackground  = '#ffffff';
const roomStrokeColor = '#a9a9a9';
const textColor       = '#666666';

const labelMinWidth  = 3;
const labelMinHeight = 2;
const labelRoomNumberSize = 14;
const labelRoomTypeSize   = 10;

const directions = {
    north: 'north',
    east : 'east',
    south: 'south',
    west : 'west',
};

const drawText = (text, [ x, y ], { fontSize }) => {
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

const getRoomDimensions = (mapSettings, roomConfig) => {
    let { settings: {
        [knobs.roomSize]: roomSize,
        [knobs.roomType]: roomType,
    } } = roomConfig;

    let { gridWidth, gridHeight } = mapSettings;

    let roomWidth;
    let roomHeight;

    if (customDimensions[roomType]) {
        ({ roomWidth, roomHeight } = customDimensions[roomType](roomSize));
    } else {
        let [ min, max ] = dimensionRanges[roomSize];

        roomWidth  = roll(min, max);
        roomHeight = roll(min, max);
    }

    let width  = Math.min(gridWidth - 2, roomWidth);
    let height = Math.min(gridHeight - 2, roomHeight);

    return { roomWidth: width, roomHeight: height };
};

const drawRoom = (grid, room, roomConfig, roomNumber) => {
    let { x, y, width, height } = room;

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

            let cell = isWall ? cellWall : roomNumber;

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

    let roomType      = roomConfig.settings[knobs.roomType];
    let showRoomLabel = roomType !== type.room && width >= labelMinWidth && height >= labelMinHeight;

    let middleX = (px.x + px.width  / 2);
    let middleY = (px.y + px.height / 2);

    let labelY = showRoomLabel ? middleY - (labelRoomNumberSize / 2) : middleY;

    let text = drawText(roomNumber, [ middleX, labelY ], { fontSize: labelRoomNumberSize });

    if (showRoomLabel) {
        let roomLabel  = toWords(roomType);
        let roomLabelY = labelY + labelRoomNumberSize;

        text += drawText(roomLabel, [ middleX, roomLabelY ], { fontSize: labelRoomTypeSize });
    }

    return {
        rect: `<rect ${attrs} />${text}`,
        walls,
    };
};

const drawDoor = (rectConfig) => {
    let direction = rectConfig.direction;
    let rectAttrs = getRectAttrs(rectConfig)

    let attrs = createAttrs({
        ...rectAttrs,
        fill: roomBackground,
        stroke: '#ffffff',
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

const getDoors = (grid, room, prevRoom) => {
    let prevWalls = [];

    if (prevRoom) {
        prevWalls = prevRoom.walls;
    } else {
        let gridWidth  = grid.length - 1;
        let gridHeight = grid[0].length - 1;

        let startTop    = room.y === wallSize && sides.top;
        let startRight  = room.x === gridWidth - room.width && sides.right;
        let startBottom = room.y === gridHeight - room.height && sides.bottom;
        let startLeft   = room.x === wallSize && sides.left;

        let side = rollArrayItem([ startTop, startRight, startBottom, startLeft ].filter(Boolean));
        let dimension = (side === sides.top || side === sides.bottom) ? gridWidth : gridHeight;

        for (let i = 0; i <= dimension; i++) {
            switch (side) {
                case sides.top:
                    prevWalls.push([ i, 0 ]);
                    break;
                case sides.right:
                    prevWalls.push([ gridWidth, i ]);
                    break;
                case sides.bottom:
                    prevWalls.push([ i, gridHeight ]);
                    break;
                case sides.left:
                    prevWalls.push([ 0, i ]);
                    break;
            }
        }
    }

    let roomWalls     = room.walls.map((cords) => cords.join());
    let prevRoomWalls = prevWalls.map((cords) => cords.join())
    let intersection  = roomWalls.filter((value) => prevRoomWalls.includes(value));

    intersection.shift();
    intersection.pop();

    let cords = intersection.map((xy) => xy.split(','));

    if (!cords.length) {
        console.log('cords', cords);
        console.log('roomWalls', roomWalls);
        console.log('prevRoomWalls',prevRoomWalls);
    }

    return [
        cords,
    ];
};

const drawDoors = (grid, room, prevRoom) => {
    return getDoors(grid, room, prevRoom).map((cells) => {
        let max       = Math.min(maxDoorWidth, Math.ceil(cells.length / 2));
        // console.log(max);
        let size      = roll(1, max);
        let remainder = cells.length - size;
        let start     = roll(0, remainder);

        let doorCells = cells.slice(start, start + size);

        let [ x, y ] = doorCells[0];

        let direction;

        if (Number(y) === (room.y - 1)) {
            direction = directions.north;
        } else if (Number(x) === (room.x + room.width)) {
            direction = directions.east;
        } else if (Number(y) === (room.y + room.height)) {
            direction = directions.south;
        } else if (Number(x) === (room.x - 1)) {
            direction = directions.west;
        }

        let width  = 1;
        let height = 1;

        grid[x][y] = cellDoor;

        doorCells.forEach(([ cellX, cellY ]) => {
            if (cellX > x || cellY > y) {
                cellX > x ? width++ : height++;
                grid[cellX][cellY] = cellDoor;
            }
        });

        return {
            rect: drawDoor({ x, y, width, height, direction }),
            type: 'Door', // TODO door type
        };
    });
};

const drawDungeon = (mapSettings, grid) => {
    let roomNumber = 1;
    let rooms      = [];

    let prevRoom;

    mapSettings.rooms.forEach((roomConfig) => {
        let roomDimensions = getRoomDimensions(mapSettings, roomConfig);

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

        let { rect, walls } = drawRoom(grid, room, roomConfig, roomNumber);

        room.walls = walls;

        let doors = drawDoors(grid, room, prevRoom);

        rooms.push({
            rect,
            room: roomConfig,
            doors: doors, // TODO desc
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
