// @ts-check

import {
    createBlankGrid,
    getStartingPoint,
    getValidRoomConnections,
    wallSize,
} from './grid.js';

import {
    drawDoor,
    drawGrid,
    drawMap,
    drawRoom,
    labelMinHeight,
    labelMinWidth,
} from './draw.js';

import { dimensionRanges, customDimensions } from '../room/dimensions.js';
import {
    lockable,
    lockedChance,
    outside,
    probability as doorProbability,
    secretProbability,
} from '../room/door.js';

import { knobs } from '../knobs.js';
import { roll, rollArrayItem, rollPercentile } from '../utility/roll.js';
import { isRequired, toWords } from '../utility/tools.js';

// -- Types --------------------------------------------------------------------

/** @typedef {import('../knobs.js').DungeonConfig} DungeonConfig */
/** @typedef {import('../knobs.js').RoomConfig} RoomConfig */

/** @typedef {import('../room/generate.js').Room} Room */

/** @typedef {import('./grid.js').CellValue} CellValue */
/** @typedef {import('./grid.js').Coordinates} Coordinates */
/** @typedef {import('./grid.js').Dimensions} Dimensions */
/** @typedef {import('./grid.js').Grid} Grid */
/** @typedef {import('./grid.js').Rectangle} Rectangle */

/**
 * @typedef {object} Connection
 *
 * @prop {Direction} direction
 * @prop {number | string} to - Room number or "outside"
 */

/**
 * Direction
 *
 * @typedef {"north" | "east" | "south" | "west"} Direction
 */

/**
 * @typedef {object} Door
 *
 * @prop {string} rect
 * @prop {string} type
 * @prop {boolean} locked
 * @prop {{ [roomNumber: number]: Connection }} connections
 * @prop {Connection} connection
 * @prop {number} size
 */

/**
 * @typedef {object} AppliedRoomResults
 *
 * @prop {Room[]} rooms
 *     All rooms which have been generated for the map grid.
 *
 * @prop {Door[]} doors
 *     Doors which are associated to rooms which have been applied to the grid.
 *
 * @prop {GridRoom[]} gridRooms
 *     Room configs which have been applied to the grid.
 *
 * @prop {Room[]} skipped
 *     Room configs which have not been applied to the grid.
 *
 * @prop {number} roomNumber
 *     The room's ID.
 */

/**
 * @typedef {object} MapConfig
 */

// -- Config -------------------------------------------------------------------

/** @type {CellValue} cellWall */
const cellWall = 'w';

/** @type {CellValue} cellDoor */
const cellDoor = 'd';

/** @type {CellValue} cellCornerWall */
const cellCornerWall = 'c';

/**
 * Directions.
 *
 * @type {readonly Direction[]}
 */
export const directions = Object.freeze([ 'north', 'east', 'south', 'west' ]);

/**
 * Opposite direction lookup.
 *
 * @type {{ [direction in Direction]: Direction }}
 */
const directionOppositeLookup = Object.freeze({
    north: 'south',
    east : 'west',
    south: 'north',
    west : 'east',
});

/**
 * Maximum number of grid units a door can be wide or tall.
 */
const maxDoorGridUnits = 4;

export {
    cellCornerWall as testCellCornerWall,
    cellDoor       as testCellDoor,
    cellWall       as testCellWall,
};

// -- Private Functions --------------------------------------------------------

/**
 * Checks if there is an adjacent door to the given cell.
 *
 * @private
 *
 * @param {Grid} grid
 * @param {Coordinates} coordinates
 *
 * @returns {boolean}
 */
const checkForAdjacentDoor = (grid, { x, y }) => {
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

/**
 * Draws rooms to a map grid and returns the results.
 *
 * TODO rename, not a draw method
 * @private
 *
 * @param {Dimensions} gridDimensions
 * @param {Room[]} mapRooms
 * @param {Grid} grid
 * @param {number} [roomNumber = 1] // TODO make required?
 * @param {{
 *   x: number;
 *   y: number;
 *   width: number;
 *   height: number;
 *   type: number;
 *   walls: [number, number][];
 * }} [prevRoom]
 *
 * @returns {AppliedRoomResults}
 */
function drawRooms(gridDimensions, mapRooms, grid, roomNumber = 1, prevRoom) {
    let rooms     = [];
    let doors     = [];
    let skipped   = [];
    let gridRooms = [];
    let isFork    = roomNumber === 1 ? false : true;

    mapRooms.forEach((roomConfig) => {
        let { [knobs.roomType]: type } = roomConfig.settings;

        let roomDimensions = getRoomDimensions(gridDimensions, roomConfig);

        let x;
        let y;

        // TODO break out into private function
        if (prevRoom) {
            isRequired(prevRoom.walls, 'Previous room requires wall cells');

            let validCords = getValidRoomConnections(grid, prevRoom, roomDimensions);

            if (!validCords.length) {
                skipped.push(roomConfig);
                return;
            }

            if (type === 'hallway') {
                // TODO remind me why the last set of cords is used for halls?
                ({ x, y } = validCords[validCords.length - 1]);
            } else {
                ({ x, y } = rollArrayItem(validCords));
            }
        } else {
            ({ x, y } = getStartingPoint(gridDimensions, roomDimensions));
        }

        let room = {
            ...roomDimensions,
            roomNumber,
            type,
            x,
            y,
        };

        let { rect, walls } = getRoom(grid, room, { hasTraps: Boolean(roomConfig.traps) });

        room.walls = walls;

        gridRooms.push(room);

        doors.push(getDoor(grid, room, prevRoom, { allowSecret: isFork }));

        rooms.push({
            rect,
            config: {
                ...roomConfig,
                walls,
                roomNumber,
                size: [ roomDimensions.width, roomDimensions.height ], // TODO rename to dimensions
            },
        });

        roomNumber++;

        prevRoom = room;
    });

    let extraDoors = getExtraDoors(grid, rooms, doors);

    return {
        rooms,
        doors: doors.concat(extraDoors),
        gridRooms,
        skipped,
        roomNumber,
    };
};

/**
 * Returns a door object based on the given grid, room, and previous room.
 *
 * @private
 *
 * @param {Grid} grid
 * @param {Room} room
 * @param {Room} prevRoom
 * @param {object} [options = {}]
 *     @param {boolean} [options.allowSecret]
 *
 * @returns {Door}
 */
const getDoor = (grid, room, prevRoom, { allowSecret } = {}) => {
    let cells     = getDoorCells(grid, room, prevRoom);
    let useEdge   = prevRoom && prevRoom.roomType === 'hallway' && room.roomType === 'hallway';
    let max       = Math.min(maxDoorGridUnits, Math.ceil(cells.length / 2));
    let size      = roll(1, max);
    let remainder = cells.length - size;
    let start     = useEdge ? rollArrayItem([ 0, remainder ]) : roll(0, remainder);
    let doorCells = cells.slice(start, start + size);
    let { x, y }  = doorCells[0];
    let direction = getDoorDirection({ x, y }, room);

    let width  = 1;
    let height = 1;

    grid[x][y] = cellDoor;

    doorCells.forEach(({ x: cellX, y: cellY }) => {
        if (cellX > x || cellY > y) {
            cellX > x ? width++ : height++;
            grid[cellX][cellY] = cellDoor;
        }
    });

    /** @type {Rectangle} doorRectangle */
    let doorRectangle = { x, y, width, height }; // TODO string vs number
    let from       = room.roomNumber;
    let to         = prevRoom ? prevRoom.roomNumber : outside;
    let type       = allowSecret && secretProbability.roll();

    return makeDoor(doorRectangle, { from, to, direction, type });
};

/**
 * Returns an array of grid cells which are valid spaces for a door.
 *
 * @private
 *
 * @param {Grid} grid
 * @param {Room} room
 * @param {Room} prevRoom
 *
 * @returns {Coordinates[]}
 */
const getDoorCells = (grid, room, prevRoom) => {
    let prevWalls = [];

    if (prevRoom) {
        // TODO require rooms share an edge
        prevWalls = prevRoom.walls;
    } else {
        // TODO get grid dimensions helper?
        let gridWidth  = grid.length - 1;
        let gridHeight = grid[0].length - 1;

        /** @type {Direction[]} doorDirections */
        let doorDirections = [
            room.y === wallSize                   ? 'north' : undefined,
            room.x === (gridWidth - room.width)   ? 'east'  : undefined,
            room.y === (gridHeight - room.height) ? 'south' : undefined,
            room.x === wallSize                   ? 'west'  : undefined,
        ];

        // TODO require room is against a grid edge

        let direction = rollArrayItem(doorDirections.filter(Boolean));
        let dimension = (direction === 'north' || direction === 'south') ? gridWidth : gridHeight;

        for (let i = 0; i <= dimension; i++) {
            switch (direction) {
                case 'north':
                    prevWalls.push([ i, 0 ]);
                    break;

                case 'east':
                    prevWalls.push([ gridWidth, i ]);
                    break;

                case 'south':
                    prevWalls.push([ i, gridHeight ]);
                    break;

                case 'west':
                    prevWalls.push([ 0, i ]);
                    break;
            }
        }
    }

    let roomWalls     = room.walls.map((cords) => cords.join());
    let prevRoomWalls = prevWalls.map((cords) => cords.join());
    let intersection  = roomWalls.filter((value) => prevRoomWalls.includes(value));

    /** @type {Coordinates[]} validDoorCells */
    let validDoorCells = intersection.map((xy) => {
        let [ x, y ] = xy.split(',');

        return {
            x: Number(x),
            y: Number(y),
        };
    });

    return validDoorCells;
};

/**
 * Returns a door's direction for a given wall coordinate.
 *
 * @private
 * @throws
 *
 * @param {Coordinates} doorCoordinates
 * @param {Room} room
 *
 * @returns {Direction}
 */
function getDoorDirection({ x, y }, room) {
    // TODO return early and drop elses
    // TODO Remove number casting
    // TODO check x & y, e.g. the corner of the room is an invalid door cell
    if (Number(y) === (room.y - 1)) {
        return 'north';
    }

    if (Number(x) === (room.x + room.width)) {
        return 'east';
    }

    if (Number(y) === (room.y + room.height)) {
        return 'south';
    }

    if (Number(x) === (room.x - 1)) {
        return 'west';
    }

    throw new TypeError('Invalid door coordinates in getDoorDirection()');
}

/**
 * Returns randomized room dimensions for the given room type.
 *
 * @private
 *
 * @param {Dimensions} gridDimensions
 * @param {RoomConfig | DungeonConfig} roomConfig
 *
 * @returns {Dimensions}
 */
function getRoomDimensions(gridDimensions, roomConfig) {
    // TODO just pass settings
    let {
        settings: {
            [knobs.roomSize]: roomSize,
            [knobs.roomType]: roomType,
        },
    } = roomConfig;

    isRequired(roomSize, 'roomSize is required in getRoomDimensions()');
    isRequired(roomType, 'roomType is required in getRoomDimensions()');

    let { width: gridWidth, height: gridHeight } = gridDimensions;

    let roomWidth;
    let roomHeight;

    if (customDimensions[roomType]) {
        // TODO should return an array?
        ({ roomWidth, roomHeight } = customDimensions[roomType](roomSize));
    } else {
        let [ min, max ] = dimensionRanges[roomSize];

        roomWidth  = roll(min, max);
        roomHeight = roll(min, max);
    }

    // TODO replace - 2 with - (wallSize * 2)
    let width  = Math.min(gridWidth - 2, roomWidth);
    let height = Math.min(gridHeight - 2, roomHeight);

    return { width, height };
}

/**
 * Returns a room rectangle and an array of wall coordinates.
 *
 * TODO rename to `getRoomWalls()`
 * TODO refactor so it only returns walls, then call `drawRoom` in the parent
 * function.
 *
 * @private
 *
 * @param {Grid} grid
 * @param {Room} room // TODO not a room
 * @param {object} [options]
 *     @param {boolean} [options.hasTraps]
 *
 * @returns {{
 *     rect: string;
 *     walls: string[][]; // TODO GridCoordinates[]
 * }}
 */
const getRoom = (grid, room, { hasTraps } = {}) => {
    let { x, y, width, height, type, roomNumber } = room;

    isRequired(roomNumber, 'roomNumber is required in getRoom()');
    isRequired(type, 'room type is required in getRoom()');

    let walls = [];

    // TODO refactor out into `addRoomToGrid()`
    // TODO refactor out to create room w/ walls separate from applying to grid
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

    /** @type {Rectangle} roomRectangle */
    let roomRectangle = { x, y, width, height };
    let showRoomLabel = type !== 'room' && width >= labelMinWidth && height >= labelMinHeight;
    let roomLabel     = showRoomLabel && toWords(type);

    let rect = drawRoom(roomRectangle, { roomNumber, roomLabel }, { hasTraps });

    return {
        rect, // TODO rename to roomElements?
        walls,
    };
};

/**
 * Returns a door config.
 *
 * TODO rename to createDoor()
 *
 * @private
 *
 * @param {Rectangle} doorRectangle
 * @param {{
 *     from: number;
 *     to: number;
 *     direction: Direction;
 *     type: RoomType;
 * }} args
 *
 * @returns {Door}
 */
const makeDoor = (doorRectangle, { from, to, direction, type }) => {
    if (!type) {
        // TODO inject probability
        type = doorProbability.roll();
    }

    // TODO inject probability
    let locked = lockable.has(type) && rollPercentile(lockedChance);

    return {
        rect: drawDoor(doorRectangle, { direction, type, locked }),
        type,
        locked,
        connections: {
            [from]: { direction, to },
            [to]  : { direction: directionOppositeLookup[direction], to: from },
        },
        // TODO size is returning NaN, likely unused?
        size: Math.max(doorRectangle.width, doorRectangle.height),
    };
};

/**
 * Returns an array of Door configs for the additional connections to the given
 * Room, if any.
 *
 * @private
 *
 * @param {Grid} grid
 * @param {Room[]} rooms
 * @param {Door[]} existingDoors
 *
 * @returns {Door[]}
 */
const getExtraDoors = (grid, rooms, existingDoors) => {
    let doors = [];

    rooms.forEach((room) => {
        let { roomNumber, settings } = room.config;
        let { [knobs.dungeonConnections ]: connectionChance } = settings;

        let chance = Number(connectionChance)

        if (!chance) {
            return;
        }

        let connectedTo = new Set();

        [ ...existingDoors, ...doors ].forEach((door) => {
            let connection = door.connections[roomNumber];

            if (connection) {
                connectedTo.add(connection.to);
            }
        });

        room.config.walls.forEach(([ x, y ]) => {
            let cell = grid[x][y];

            if (cell !== cellWall) {
                return;
            }

            if (checkForAdjacentDoor(grid, { x, y })) {
                return;
            }

            [ -1, 1 ].forEach((adjust) => {
                /** @type {Rectangle} doorRectangle */
                let doorRectangle = { x, y, width: wallSize, height: wallSize };

                let xAdjust = x + adjust;
                let yAdjust = y + adjust;

                let xCell = grid[xAdjust] && grid[xAdjust][y];
                let yCell = grid[x] && grid[x][yAdjust];

                let xConnect    = xCell && Number.isInteger(xCell) && xCell;
                let canConnectX = xConnect && xConnect !== roomNumber && !connectedTo.has(xConnect);

                if (canConnectX && rollPercentile(chance)) {
                    grid[x][y] = cellDoor;

                    connectedTo.add(xConnect);

                    /** @type {Direction} direction */
                    let direction = adjust === -1 ? 'west' : 'east';
                    let type      = secretProbability.roll(); // TODO inject `secretProbability`

                    doors.push(makeDoor(doorRectangle, { from: roomNumber, to: xConnect, direction, type }));
                }

                let yConnect    = yCell && Number.isInteger(yCell) && yCell;
                let canConnectY = yConnect && yConnect !== roomNumber && !connectedTo.has(yConnect);

                if (canConnectY && rollPercentile(chance)) {
                    grid[x][y] = cellDoor;

                    connectedTo.add(yConnect);

                    /** @type {Direction} direction */
                    let direction = adjust === -1 ? 'north' : 'south';
                    let type      = secretProbability.roll(); // TODO inject `secretProbability`

                    doors.push(makeDoor(doorRectangle, { from: roomNumber, to: yConnect, direction, type }));
                }
            });
        });
    });

    return doors;
};

/**
 * Returns an array of rooms and an array of doors.
 *
 * TODO rename.
 *
 * @private
 *
 * @param {Dimensions} gridDimensions
 * @param {Room[]} roomConfigs
 * @param {Grid} grid
 *
 * @returns {{
 *     rooms: Room[];
 *     doors: Door[];
 * }}
 */
function getRooms(gridDimensions, roomConfigs, grid) {
    let { rooms, doors, skipped, roomNumber, gridRooms } = drawRooms(gridDimensions, roomConfigs, grid);

    let lastRoomNumber = roomNumber;
    let lastSkipped    = skipped;

    gridRooms.forEach((gridRoom) => {
        let fork = drawRooms(gridDimensions, lastSkipped, grid, lastRoomNumber, gridRoom);

        if (fork.rooms.length && fork.doors.length) {
            lastRoomNumber = fork.roomNumber;
            lastSkipped    = fork.skipped;

            rooms.push(...fork.rooms);
            doors.push(...fork.doors);
        }
    });

    return {
        rooms,
        doors,
    };
}

export {
    checkForAdjacentDoor as testCheckForAdjacentDoor,
    drawRooms            as testDrawRooms,
    getDoor              as testGetDoor,
    getDoorCells         as testGetDoorCells,
    getDoorDirection     as testGetDoorDirection,
    getExtraDoors        as testGetExtraDoors,
    getRoom              as testGetRoom,
    getRoomDimensions    as testGetRoomDimensions,
    getRooms             as testGetRooms,
    makeDoor             as testMakeDoor,
};

// -- Public Functions ---------------------------------------------------------

/**
 * Generates a dungeon map.
 *
 * @param {Dimensions} gridDimensions
 * @param {Room[]} roomConfigs
 *
 * @returns {TODO}
 */
export function generateMap(gridDimensions, roomConfigs) {
    let grid = createBlankGrid(gridDimensions);

    let { rooms, doors } = getRooms(gridDimensions, roomConfigs, grid);

    if (roomConfigs.length <= rooms.length) {
        console.warn('Not enough rooms generated', roomConfigs.length, rooms.length);
    }

    let roomRects = rooms.map((room) => room.rect).join('');
    let doorRects = doors.map(({ rect }) => rect).join('');
    let gridLines = drawGrid(gridDimensions);
    let content   = gridLines + roomRects + doorRects;

    return {
        map  : drawMap(gridDimensions, content),
        rooms: rooms.map(({ config }) => config),
        doors: doors.map(({ rect, ...door }) => door),
    };
}

/**
 * Returns a text representation of a grid which can be logged to the console.
 *
 * @param {Grid} grid
 *
 * @returns {string}
 */
 export const getGridAsText = (grid) => {
    let rows = [];

    for (let y = 0; y <= grid[0].length; y++) {
        let row = [];

        for (let x = 0; x <= grid.length; x++) {
            grid[x] && grid[x][y] && row.push(grid[x][y]);
        }

        rows.push(row);
    }

    return rows.map((cols) => cols.join(' ')).join('\n').trim();
};
