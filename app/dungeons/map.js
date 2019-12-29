
import {
    cellBlank,
    cellDoor,
    cellWall,
    getStartingPoint,
    getValidRoomCords,
    sides,
    wallSize,
} from './grid';

import {
    drawGrid,
    drawDoor,
    drawMap,
    drawRoom,
} from './draw';

import { dimensionRanges, customDimensions } from '../rooms/dimensions';
import { knobs } from '../knobs';
import { roll, rollArrayItem, rollPercentile } from '../utility/roll';
import type from '../rooms/type';
import { toWords } from '../utility/tools';
import { probability as doorProbability, outside } from '../rooms/door';

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

            let isWall = w === -wallSize || w === width ||
                         h === -wallSize || h === height;

            if (isWall) {
                walls.push([ xCord, yCord ]);
            }

            let cell = isWall ? cellWall : roomNumber;

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

    let cells = intersection.map((xy) => xy.split(','));

    return cells;
};

// const getDoorConnection = (grid, [ x, y ], room, direction) => {
//     switch (direction) {
//         case directions.north:
//             return grid[x][y + room.height + 1];
//         case directions.east:
//             x = room.x - 1;
//             return grid[x] && grid[x][y];
//         case directions.south:
//             return grid[x][y - 1];
//         case directions.west:
//             x = room.x + room.width + 1;
//             return grid[x] && grid[x][y];
//         default:
//             throw 'Invalid direction';
//     }
// };

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

    let doorType  = doorProbability.roll();
    let doorAttrs = { x, y, width, height };

    return {
        rect: drawDoor(doorAttrs, { direction, type: doorType }),
        type: doorType,
        connection: prevRoom ? prevRoom.roomNumber : outside,
        size: Math.max(width, height),
        direction,
    };
};

const getDoors = (grid, room, prevRoom) => {
    let defaultDoor = getDoor(grid, room, prevRoom);
    let doors = [ defaultDoor ];
    return doors;
    // WIP
    room.walls.forEach(([ x, y ]) => {
        let connect = false;

        [ 1, -1 ].forEach((adjust) => {
            let xAdjust = x + adjust;
            let yAdjust = y + adjust;

            let xCollision = grid[xAdjust] && grid[xAdjust][y];
            let yCollision = grid[x] && grid[x][yAdjust];

            if (xCollision && Number.isInteger(xCollision) && xCollision !== room.roomNumber) {
                // console.log(xCollision);
            }

            // if (grid[xAdjust] && grid[xAdjust][y] ===  )
        });

        // console.log(grid[x][y]);
        let isWall = grid[x][y] === cellWall;
        // && rollPercentile(chanceToConnectRooms)
        if (isWall) {
            // console.log('hit wall');
            // let direction = getDoorDirection([ x, y ], room);
            // console.log(x, y, direction);
        }
    });

    return doors;
};

const getRooms = (mapSettings, grid) => {
    let roomNumber = 1;
    let rooms      = [];

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

        let doors       = getDoors(grid, room, prevRoom);
        let doorRects   = [];
        let doorConfigs = [];

        doors.forEach((door) => {
            let {
                rect,
                ...settings
            } = door;

            doorRects.push(rect);
            doorConfigs.push(settings);
        });

        rooms.push({
            rect,
            doorRects,
            room: {
                ...roomConfig,
                doors: doorConfigs,
            },
        });

        roomNumber++;

        prevRoom = room;
    });

    return rooms;
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

    let rooms     = getRooms(mapSettings, grid);
    let roomRects = rooms.map((room) => room.rect).join('');
    let doorRects = rooms.map((room) => room.doorRects.map((rect) => rect).join('')).join('');
    let gridLines = drawGrid(mapSettings);
    let content   = gridLines + roomRects + doorRects;

    debug && logGrid(grid);

    return {
        map: drawMap(mapSettings, content),
        rooms: rooms.map(({ room }) => room),
    };
};
