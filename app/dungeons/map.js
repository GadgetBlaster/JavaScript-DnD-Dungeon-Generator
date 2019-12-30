
import {
    cellBlank,
    cellCornerWall,
    cellDoor,
    cellWall,
    getStartingPoint,
    getValidRoomCords,
    sides,
    wallSize,
} from './grid';

import {
    drawDoor,
    drawGrid,
    drawMap,
    drawPillarCell,
    drawRoom,
} from './draw';

import { dimensionRanges, customDimensions } from '../rooms/dimensions';
import { knobs } from '../knobs';
import { roll, rollArrayItem } from '../utility/roll';
import { toWords } from '../utility/tools';
import doorType, { probability as doorProbability, outside } from '../rooms/door';
import type from '../rooms/type';

const debug = true;

const maxDoorWidth = 4;

const labelMinWidth  = 3;
const labelMinHeight = 2;

const chanceToConnectRooms = 10;

export const directions = {
    north: 'north',
    east : 'east',
    south: 'south',
    west : 'west',
};

export const oppositeDirection = {
    [directions.north]: directions.south,
    [directions.east] : directions.west,
    [directions.south]: directions.north,
    [directions.west] : directions.east,
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

const getRoom = (grid, room) => {
    let { x, y, width, height, roomType, roomNumber } = room;

    let walls = [];

    for (let w = -wallSize; w < (width + wallSize); w++) {
        for (let h = -wallSize; h < (height + wallSize); h++) {
            let xCord = x + w;
            let yCord = y + h;

            if (!grid[xCord] || !grid[xCord][yCord]) {
                continue;
            }

            let isCornerWall = (w === -wallSize && h === -wallSize) ||
                               (w === -wallSize && h === height) ||
                               (w === width && h === -wallSize) ||
                               (w === width && h === height);

            let isWall = !isCornerWall && (
                         w === -wallSize || w === width ||
                         h === -wallSize || h === height);

            if (isWall) {
                walls.push([ xCord, yCord ]);
            }

            let cell = roomNumber;

            if (isWall) {
                cell = cellWall;
            } else if (isCornerWall) {
                cell = cellCornerWall;
            }

            grid[xCord][yCord] = cell;
        }
    }

    let roomAttrs     = { x, y, width, height };
    let showRoomLabel = roomType !== type.room && width >= labelMinWidth && height >= labelMinHeight;
    let roomLabel     = showRoomLabel && toWords(roomType);

    let rect = drawRoom(roomAttrs, { roomNumber, roomLabel });

    return {
        rect,
        walls,
    };
};

const getDoorCells = (grid, room, prevRoom) => {
    let prevWalls = [];

    if (prevRoom) {
        prevWalls = prevRoom.walls;
    } else {
        let gridWidth  = grid.length - 1;
        let gridHeight = grid[0].length - 1;

        let startTop    = room.y === wallSize && sides.top;
        let startRight  = room.x === (gridWidth - room.width) && sides.right;
        let startBottom = room.y === (gridHeight - room.height) && sides.bottom;
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

    // Removed when wall corner detection was added to getRoom
    // intersection.shift();
    // intersection.pop();

    let cells = intersection.map((xy) => xy.split(','));

    return cells;
};

const getDoorDirection = ([ x, y ], room) => {
    if (Number(y) === (room.y - 1)) {
        return directions.north;
    } else if (Number(x) === (room.x + room.width)) {
        return directions.east;
    } else if (Number(y) === (room.y + room.height)) {
        return directions.south;
    } else if (Number(x) === (room.x - 1)) {
        return directions.west;
    } else {
        throw 'Invalid direction';
    }
};

const getDoor = (grid, room, prevRoom) => {
    let cells     = getDoorCells(grid, room, prevRoom);
    let useEdge   = prevRoom && prevRoom.roomType === type.hallway && room.roomType === type.hallway;
    let max       = Math.min(maxDoorWidth, Math.ceil(cells.length / 2));
    let size      = roll(1, max);
    let remainder = cells.length - size;
    let start     = useEdge ? rollArrayItem([ 0, remainder ]) : roll(0, remainder);
    let doorCells = cells.slice(start, start + size);
    let [ x, y ]  = doorCells[0];
    let direction = getDoorDirection([ x, y ], room);

    let width  = 1;
    let height = 1;

    grid[x][y] = cellDoor;

    doorCells.forEach(([ cellX, cellY ]) => {
        if (cellX > x || cellY > y) {
            cellX > x ? width++ : height++;
            grid[cellX][cellY] = cellDoor;
        }
    });

    let doorType   = doorProbability.roll();
    let doorAttrs  = { x, y, width, height };
    let connection = prevRoom ? prevRoom.roomNumber : outside;

    return {
        rect: drawDoor(doorAttrs, { direction, type: doorType }),
        type: doorType,
        connections: {
            [room.roomNumber]: { direction, to: connection },
            [connection]     : { direction: oppositeDirection[direction], to: room.roomNumber },
        },
        size: Math.max(width, height),
    };
};

const checkAdjacentDoor = (grid, [ x, y ]) => {
    return [ -1, 1 ].some((adjust) => {
        let xAdjust = x + adjust;
        let yAdjust = y + adjust;

        let xCell = grid[xAdjust] && grid[xAdjust][y];
        let yCell = grid[x] && grid[x][yAdjust];

        if (xCell === cellDoor || yCell === cellDoor) {
            return true;
        }

        return false;
    });
};

const getExtraDoors = (grid, rooms) => {
    let collisions = [];

    rooms.forEach((room) => {
        let { roomNumber } = room.config;

        room.config.walls.forEach(([ x, y ]) => {
            let cell = grid[x][y];

            if (cell !== cellWall) {
                return;
            }

            if (checkAdjacentDoor(grid, [ x, y ])) {
                return;
            }

            [ -1, 1 ].forEach((adjust) => {
                let xAdjust = x + adjust;
                let yAdjust = y + adjust;

                let xCell = grid[xAdjust] && grid[xAdjust][y];
                let yCell = grid[x] && grid[x][yAdjust];

                if (xCell && Number.isInteger(xCell) && xCell !== roomNumber) {
                    collisions.push([ x, y ]);
                }

                if (yCell && Number.isInteger(yCell) && yCell !== roomNumber) {
                    collisions.push([ x, y ]);
                }
            });
        });
    });

    let doors = [];

    collisions.forEach(([ x, y ]) => {
        let type = doorType.hole;
        let size = 1;

        doors.push({
            // rect: drawDoor({ x, y, width: size, height: size }, { direction, doorType: type }),
            rect: drawPillarCell([ x, y ]),
            connection: 'test',
            type,
            connections: {},
            size,
        });
    });

    return doors;
};

const getRooms = (mapSettings, grid) => {
    let roomNumber = 1;
    let rooms      = [];
    let doors      = [];

    let prevRoom;

    mapSettings.rooms.forEach((roomConfig) => {
        let { [knobs.roomType]: roomType } = roomConfig.settings;

        let roomDimensions = getRoomDimensions(mapSettings, roomConfig);

        let x;
        let y;

        if (prevRoom) {
            let validCords = getValidRoomCords(grid, prevRoom, roomDimensions);

            if (!validCords.length) {
                return;
            }

            if (roomType === type.hallway) {
                [ x, y ] = validCords[validCords.length - 1];
            } else {
                [ x, y ] = rollArrayItem(validCords);
            }
        } else {
            [ x, y ] = getStartingPoint(mapSettings, roomDimensions);
        }

        let room = {
            x, y,
            width: roomDimensions.roomWidth,
            height: roomDimensions.roomHeight,
            roomType,
            roomNumber,
        };

        let { rect, walls } = getRoom(grid, room);

        room.walls = walls;

        doors.push(getDoor(grid, room, prevRoom));

        rooms.push({
            rect,
            config: {
                ...roomConfig,
                walls,
                roomNumber,
            },
        });

        roomNumber++;

        prevRoom = room;
    });

    let extraDoors = getExtraDoors(grid, rooms);

    return {
        rooms,
        doors: doors.concat(extraDoors),
    };
};

const logGrid = (grid) => {
    let rows = [];

    grid.forEach((column, x) => {
        let cols = [];

        column.forEach((_, y) => {
            grid[y] && grid[y][x] && cols.push(grid[y][x]);
        });

        cols.length && rows.push(cols);
    });

    let ascii = rows.map((cols) => {
        return cols.join(' ');
    }).join("\n");

    console.log(ascii);
};

export const generateMap = (mapSettings) => {
    let { gridWidth, gridHeight } = mapSettings;

    let grid = [ ...Array(gridWidth) ].fill(cellBlank);

    grid.forEach((_, col) => {
        grid[col] = [ ...Array(gridHeight) ].fill(cellBlank);
    });

    let { rooms, doors } = getRooms(mapSettings, grid);

    let roomRects = rooms.map((room) => room.rect).join('');
    let doorRects = doors.map(({ rect }) => rect).join('');
    let gridLines = drawGrid(mapSettings);
    let content   = gridLines + roomRects + doorRects;

    debug && logGrid(grid);

    return {
        map: drawMap(mapSettings, content),
        rooms: rooms.map(({ config }) => config),
        doors: doors.map(({ rect, ...door }) => door),
    };
};
