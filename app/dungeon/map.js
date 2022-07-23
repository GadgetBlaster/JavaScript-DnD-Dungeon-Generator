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
} from './draw.js';

import {
    customDimensions,
    roomDimensionRanges,
} from '../room/dimensions.js';

import {
    lockable,
    lockedChance,
    probability as doorProbability,
    secretProbability,
} from '../room/door.js';

import { roll, rollArrayItem, rollPercentile } from '../utility/roll.js';
import { isRequired, toWords } from '../utility/tools.js';

// -- Type Imports -------------------------------------------------------------

/** @typedef {import('../controller/knobs.js').DungeonConfig} DungeonConfig */
/** @typedef {import('../controller/knobs.js').RoomConfig} RoomConfig */
/** @typedef {import('../room/door.js').DoorType} DoorType */
/** @typedef {import('../room/door.js').RollDoorType} RollDoorType */
/** @typedef {import('../room/door.js').RollSecretDoorType} RollSecretDoorType */
/** @typedef {import('../room/generate.js').GeneratedRoomConfig} GeneratedRoomConfig */
/** @typedef {import('../room/generate.js').Room} Room */
/** @typedef {import('../room/room.js').RoomType} RoomType */
/** @typedef {import('./draw.js').RoomText} RoomText */
/** @typedef {import('./grid.js').CellValue} CellValue */
/** @typedef {import('./grid.js').Coordinates} Coordinates */
/** @typedef {import('./grid.js').Dimensions} Dimensions */
/** @typedef {import('./grid.js').Grid} Grid */
/** @typedef {import('./grid.js').Rectangle} Rectangle */

// -- Types --------------------------------------------------------------------

/**
 * @typedef {Room & {
 *     walls: Coordinates[];
 *     rectangle: Rectangle;
 * }} AppliedRoom
 */

/**
 * @typedef {object} AppliedRoomResults
 *
 * @prop {Door[]} doors
 * @prop {AppliedRoom[]} rooms
 * @prop {Room[]} skippedRooms
 */

/** @typedef {Map<number, { direction: Direction; to: number; }>} Connection */

/** @typedef {"north" | "east" | "south" | "west"} Direction */

/**
 * @typedef {object} Door
 *
 * @prop {Connection} connection
 * @prop {boolean} locked
 * @prop {Rectangle} rectangle
 * @prop {DoorType} type
 */

/** @typedef {{ [roomNumber: number]: Door[] }} Doors */

// -- Config -------------------------------------------------------------------

/** @type {CellValue} cellWall */
const cellWall = 'w';

/** @type {CellValue} cellDoor */
const cellDoor = 'd';

/** @type {CellValue} cellCornerWall */
const cellCornerWall = 'c';

/** Minium room width in grid cells required to show a room label. */
const labelMinRoomWidth = 3;

/** Minium room height in grid cells required to show a room label. */
const labelMinRoomHeight = 2;

/** Room number connection leading out of the dungeon. */
export const outside = 0;

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
    cellCornerWall     as testCellCornerWall,
    cellDoor           as testCellDoor,
    cellWall           as testCellWall,
    labelMinRoomWidth  as testLabelMinRoomWidth,
    labelMinRoomHeight as testLabelMinRoomHeight,
};

// -- Private Functions --------------------------------------------------------

// TODO alphabetize funcs

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
function checkForAdjacentDoor(grid, { x, y }) {
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
}

/**
 * Returns a door object for the given rectangle, door type, direction, and
 * connection.
 *
 * @private
 *
 * @param {Rectangle} rectangle
 * @param {DoorType} type
 * @param {{ direction: Direction; from: number; to: number; }} roomConnection
 * @param {number} [lockedPercentChance = 0]
 *
 * @returns {Door}
 */
function createDoor(rectangle, type, { direction, from, to }, lockedPercentChance = 0) {
    let locked = lockable.has(type) && rollPercentile(lockedPercentChance);

    return {
        rectangle,
        type,
        locked,
        connection: new Map([
            [ from, { direction, to } ],
            [ to,   { direction: directionOppositeLookup[direction], to: from } ],
        ]),
    };
}

/**
 * Applies rooms to a map grid and returns the applied results.
 *
 * @private
 *
 * @param {Dimensions} gridDimensions
 * @param {Room[]} mapRooms
 * @param {Grid} grid
 * @param {object} [options]
 *     @param {AppliedRoom} [options.prevRoom]
 *     @param {boolean} [options.isFork]
 *
 * @returns {AppliedRoomResults}
 */
function applyRooms(gridDimensions, mapRooms, grid, { isFork, prevRoom } = {}) {
    /** @type {AppliedRoom[]} */
    let rooms = [];

    /** @type {Door[]} */
    let doors = [];

    /** @type {Room[]} */
    let skippedRooms = [];

    mapRooms.forEach((room) => {
        let { config, roomNumber } = room;
        let { roomType } = config;

        let roomDimensions = getRoomDimensions(gridDimensions, config);

        let x;
        let y;

        // TODO break out into private function
        if (prevRoom) {
            isRequired(prevRoom.walls, 'Previous grid room requires wall coordinates in drawRooms()');

            let validCords = getValidRoomConnections(grid, roomDimensions, prevRoom.rectangle);

            if (!validCords.length) {
                skippedRooms.push(room);
                return;
            }

            if (roomType === 'hallway') {
                // TODO remind me why the last set of cords is used for halls?
                ({ x, y } = validCords[validCords.length - 1]);
            } else {
                ({ x, y } = rollArrayItem(validCords));
            }
        } else {
            ({ x, y } = getStartingPoint(gridDimensions, roomDimensions));
        }

        let rectangle = { x, y, ...roomDimensions };
        let walls = applyRoomToGrid(grid, rectangle, roomNumber);

        let appliedRoom = {
            ...room,
            rectangle,
            walls,
        };

        doors.push(getDoor(grid, appliedRoom, prevRoom, { allowSecret: isFork }));
        rooms.push(appliedRoom);

        prevRoom = appliedRoom;
    });

    let extraDoors = getExtraDoors(grid, rooms, doors);

    return {
        doors: doors.concat(extraDoors),
        rooms,
        skippedRooms,
    };
}

/**
 * Returns a door object based on the given grid, room, and previous room.
 *
 * TODO rename to applyDoor()
 *
 * @private
 *
 * @param {Grid} grid
 * @param {AppliedRoom} room
 * @param {AppliedRoom} [prevRoom]
 * @param {object} [options = {}]
 *     @param {boolean} [options.allowSecret]
 *
 * @returns {Door}
 */
function getDoor(grid, room, prevRoom, { allowSecret } = {}) {
    let cells     = getDoorCells(grid, room, prevRoom);
    let max       = Math.min(maxDoorGridUnits, Math.ceil(cells.length / 2));
    let size      = roll(1, max);
    let remainder = cells.length - size;

    let useEdge = prevRoom
        && prevRoom.config.roomType === 'hallway'
        && room.config.roomType === 'hallway';

    let start     = useEdge ? rollArrayItem([ 0, remainder ]) : roll(0, remainder);
    let doorCells = cells.slice(start, start + size);
    let { x, y }  = doorCells[0];
    let direction = getDoorDirection({ x, y }, room.rectangle);

    let width  = 1;
    let height = 1;

    grid[x][y] = cellDoor;

    doorCells.forEach(({ x: cellX, y: cellY }) => {
        if (cellX > x || cellY > y) {
            cellX > x ? width++ : height++;
            grid[cellX][cellY] = cellDoor;
        }
    });

    let doorRectangle = { x, y, width, height };

    let from = room.roomNumber;
    let to   = prevRoom ? prevRoom.roomNumber : outside;
    let type = getDoorType(doorProbability.roll, allowSecret && secretProbability.roll);

    return createDoor(doorRectangle, type, { direction, from, to }, lockedChance);
}

/**
 * Returns an array of grid cells which are valid spaces for a door.
 *
 * @private
 *
 * @param {Grid} grid
 * @param {AppliedRoom} room
 * @param {AppliedRoom} [prevGridRoom]
 *
 * @returns {Coordinates[]}
 */
function getDoorCells(grid, room, prevGridRoom) {
    /** @type {Coordinates[]} prevWalls */
    let prevWalls = [];

    if (prevGridRoom) {
        // TODO require rooms share an edge
        prevWalls = prevGridRoom.walls;
    } else {
        // TODO get grid dimensions helper?
        let gridWidth  = grid.length - 1;
        let gridHeight = grid[0].length - 1;

        let { x, y, width, height } = room.rectangle;

        /** @type {Direction[]} doorDirections */
        let doorDirections = [
            y === wallSize              ? 'north' : undefined,
            x === (gridWidth - width)   ? 'east'  : undefined,
            y === (gridHeight - height) ? 'south' : undefined,
            x === wallSize              ? 'west'  : undefined,
        ];

        // TODO require room is against a grid edge

        let direction = rollArrayItem(doorDirections.filter(Boolean));
        let dimension = (direction === 'north' || direction === 'south') ? gridWidth : gridHeight;

        for (let i = 0; i <= dimension; i++) {
            switch (direction) {
                case 'north':
                    prevWalls.push({ x: i, y: 0 });
                    break;

                case 'east':
                    prevWalls.push({ x: gridWidth, y: i });
                    break;

                case 'south':
                    prevWalls.push({ x: i, y: gridHeight });
                    break;

                case 'west':
                    prevWalls.push({ x: 0, y: i });
                    break;
            }
        }
    }

    let roomWalls     = room.walls.map(({ x, y }) => `${x},${y}`);
    let prevRoomWalls = prevWalls.map(({ x, y }) => `${x},${y}`);
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
}

/**
 * Returns a door's direction for a given wall coordinate.
 *
 * @private
 * @throws
 *
 * @param {Coordinates} doorCoordinates
 * @param {Rectangle} roomRect
 *
 * @returns {Direction}
 */
function getDoorDirection({ x, y }, roomRect) {
    // TODO return early and drop elses
    // TODO Remove number casting
    // TODO check x & y, e.g. the corner of the room is an invalid door cell
    if (Number(y) === (roomRect.y - 1)) {
        return 'north';
    }

    if (Number(x) === (roomRect.x + roomRect.width)) {
        return 'east';
    }

    if (Number(y) === (roomRect.y + roomRect.height)) {
        return 'south';
    }

    if (Number(x) === (roomRect.x - 1)) {
        return 'west';
    }

    throw new TypeError('Invalid door coordinates in getDoorDirection()');
}

/**
 * Returns a door type using the provided probability roll functions.
 *
 * @param {RollDoorType} rollDoorType
 * @param {RollSecretDoorType} [rollSecretDoorType]
 *
 * @returns {DoorType}
 */
function getDoorType(rollDoorType, rollSecretDoorType) {
    if (rollSecretDoorType) {
        let secretDoorType = rollSecretDoorType();

        if (secretDoorType) {
            return secretDoorType;
        }
    }

    return rollDoorType();
}

/**
 * Returns randomized room dimensions for the given room type.
 *
 * TODO rename to rollRoomDimensions
 *
 * @private
 *
 * @param {Dimensions} gridDimensions
 * @param {GeneratedRoomConfig} roomConfig
 *
 * @returns {Dimensions}
 */
function getRoomDimensions(gridDimensions, roomConfig) {
    let { roomSize, roomType } = roomConfig;

    isRequired(roomSize, 'roomSize is required in getRoomDimensions()');
    isRequired(roomType, 'roomType is required in getRoomDimensions()');

    let { width: gridWidth, height: gridHeight } = gridDimensions;

    let roomWidth;
    let roomHeight;

    if (customDimensions[roomType]) {
        ({ width: roomWidth, height: roomHeight } = customDimensions[roomType](roomSize));
    } else {
        let { min, max } = roomDimensionRanges[roomSize];

        roomWidth  = roll(min, max);
        roomHeight = roll(min, max);
    }

    // TODO replace - 2 with - (wallSize * 2)
    let width  = Math.min(gridWidth - 2, roomWidth);
    let height = Math.min(gridHeight - 2, roomHeight);

    return { width, height };
}

/**
 * Applies a room to the grid and returns an array of wall coordinates.
 *
 * @private
 *
 * @param {Grid} grid
 * @param {Rectangle} rectangle
 * @param {number} roomNumber
 *
 * @returns {Coordinates[]}
 */
function applyRoomToGrid(grid, rectangle, roomNumber) {
    isRequired(roomNumber, 'roomNumber is required in applyRoomToGrid()');

    let { x, y, width, height } = rectangle;

    /** @type {Coordinates[]} */
    let walls = [];

    for (let w = -wallSize; w < (width + wallSize); w++) {
        for (let h = -wallSize; h < (height + wallSize); h++) {
            let xCord = x + w;
            let yCord = y + h;

            if (!grid[xCord] || !grid[xCord][yCord]) {
                // TODO throw?
                console.error('Hey there, looks like you tried to iterate into oblivion');
                continue;
            }

            let isCornerWall = (w === -wallSize && h === -wallSize) ||
                               (w === -wallSize && h === height) ||
                               (w === width && h === -wallSize) ||
                               (w === width && h === height);

            let isWall = !isCornerWall && (
                w === -wallSize || w === width ||
                h === -wallSize || h === height
            );

            if (isWall) {
                walls.push({ x: xCord, y: yCord });
            }

            /** @type {CellValue} cell */
            let cell = roomNumber;

            if (isWall) {
                cell = cellWall;
            } else if (isCornerWall) {
                cell = cellCornerWall;
            }

            grid[xCord][yCord] = cell;
        }
    }

    return walls;
}

/**
 * Returns a room's text config.
 *
 * @param {AppliedRoom} room
 *
 * @returns {RoomText}
 */
function getRoomText(room) {
    let { rectangle, config, roomNumber } = room;
    let { roomType } = config;
    let { width, height } = rectangle;

    let showRoomLabel = roomType !== 'room'
        && width >= labelMinRoomWidth
        && height >= labelMinRoomHeight;

    let roomLabel = showRoomLabel ? toWords(roomType) : undefined;

    return { roomNumber: roomNumber.toString(), roomLabel };
}

/**
 * Returns an array of Door configs for additional connections to the given
 * Room, if any.
 *
 * @private
 *
 * @param {Grid} grid
 * @param {AppliedRoom[]} rooms
 * @param {Door[]} existingDoors
 *
 * @returns {Door[]}
 */
function getExtraDoors(grid, rooms, existingDoors) {
    let doors = [];

    rooms.forEach((room) => {
        let { roomNumber, config } = room;
        let { dungeonConnections } = config;

        let chance = Number(dungeonConnections);

        if (!chance) {
            return;
        }

        let connectedTo = new Set();

        [ ...existingDoors, ...doors ].forEach((/** @type {Door} */ door) => {
            let connection = door.connection.get(roomNumber);

            if (connection) {
                connectedTo.add(connection.to);
            }
        });

        room.walls.forEach(({ x, y }) => {
            let cell = grid[x][y];

            if (cell !== cellWall) {
                return;
            }

            if (checkForAdjacentDoor(grid, { x, y })) {
                return;
            }

            [ -1, 1 ].forEach((adjust) => {
                /** @type {Rectangle} */
                let doorRectangle = { x, y, width: wallSize, height: wallSize };

                let xAdjust = x + adjust;
                let yAdjust = y + adjust;

                let xCell = grid[xAdjust] && grid[xAdjust][y];
                let yCell = grid[x] && grid[x][yAdjust];

                let xConnect    = xCell && Number.isInteger(xCell) && Number(xCell);
                let canConnectX = xConnect && xConnect !== roomNumber && !connectedTo.has(xConnect);

                if (canConnectX && rollPercentile(chance)) {
                    grid[x][y] = cellDoor;

                    connectedTo.add(xConnect);

                    /** @type {Direction} */
                    let direction  = adjust === -1 ? 'west' : 'east';
                    let type       = getDoorType(doorProbability.roll, secretProbability.roll);
                    let connection = {
                        direction,
                        from: roomNumber,
                        to  : xConnect,
                    };

                    doors.push(createDoor(doorRectangle, type, connection, lockedChance));
                }

                let yConnect    = yCell && Number.isInteger(yCell) && Number(yCell);
                let canConnectY = yConnect && yConnect !== roomNumber && !connectedTo.has(yConnect);

                if (canConnectY && rollPercentile(chance)) {
                    grid[x][y] = cellDoor;

                    connectedTo.add(yConnect);

                    /** @type {Direction} */
                    let direction  = adjust === -1 ? 'north' : 'south';
                    let type       = getDoorType(doorProbability.roll, secretProbability.roll);
                    let connection = {
                        direction,
                        from: roomNumber,
                        to  : yConnect,
                    };

                    doors.push(createDoor(doorRectangle, type, connection, lockedChance));
                }
            });
        });
    });

    return doors;
}

/**
 * Procedurally applies rooms to a grid, returning arrays of rooms and doors.
 *
 * TODO infer gridDimension from grid
 *
 * @private
 *
 * @param {Dimensions} gridDimensions
 * @param {Room[]} rooms
 * @param {Grid} grid
 *
 * @returns {{
 *     rooms: AppliedRoom[];
 *     doors: Door[];
 * }}
 */
function procedurallyApplyRooms(gridDimensions, rooms, grid) {
    let {
        rooms: initialRooms,
        doors,
        skippedRooms,
    } = applyRooms(gridDimensions, rooms, grid);

    // TODO Aggregate skipped rooms?
    let lastSkipped = skippedRooms;

    let appliedRooms = [ ...initialRooms ];

    initialRooms.forEach((room) => {
        let fork = applyRooms(gridDimensions, lastSkipped, grid, { isFork: true, prevRoom: room });

        if (fork.rooms.length && fork.doors.length) {
            lastSkipped = fork.skippedRooms;

            appliedRooms.push(...fork.rooms);
            doors.push(...fork.doors);
        }
    });

    return {
        rooms: appliedRooms,
        doors,
    };
}

export {
    applyRooms             as testApplyRooms,
    applyRoomToGrid        as testApplyRoomToGrid,
    checkForAdjacentDoor   as testCheckForAdjacentDoor,
    createDoor             as testCreateDoor,
    getDoor                as testGetDoor,
    getDoorCells           as testGetDoorCells,
    getDoorDirection       as testGetDoorDirection,
    getDoorType            as testGetDoorType,
    getExtraDoors          as testGetExtraDoors,
    getRoomDimensions      as testGetRoomDimensions,
    getRoomText            as testGetRoomText,
    procedurallyApplyRooms as testProcedurallyApplyRooms,
};

// -- Public Functions ---------------------------------------------------------

/**
 * Generates a dungeon map.
 *
 * @param {Dimensions} gridDimensions
 * @param {Room[]} roomConfigs
 *
 * @returns {{
 *     map: string;
 *     rooms: AppliedRoom[];
 *     doors: Door[];
 * }}
 */
export function generateMap(gridDimensions, roomConfigs) {
    let grid = createBlankGrid(gridDimensions);

    let { rooms, doors } = procedurallyApplyRooms(gridDimensions, roomConfigs, grid);

    if (roomConfigs.length <= rooms.length) {
        console.warn('Not enough rooms generated in generateMap()');
    }

    let roomRects = rooms.map((room) => {
        let { rectangle, traps } = room;

        return drawRoom(rectangle, getRoomText(room), {
            hasTraps: Boolean(traps && traps.length),
        });
    }).join('');

    let doorRects = doors.map((door) => drawDoor(door)).join('');

    let gridLines = drawGrid(gridDimensions);

    let content = gridLines + roomRects + doorRects;

    return {
        doors,
        map: drawMap(gridDimensions, content),
        rooms,
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
