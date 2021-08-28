// @ts-check

import {
    // Config
    directions,

    // Private Functions
    testCheckAdjacentDoor as checkAdjacentDoor,
    testDrawRooms         as drawRooms,
    testGetDoor           as getDoor,
    testGetDoorCells      as getDoorCells,
    testGetDoorDirection  as getDoorDirection,
    testGetExtraDoors     as getExtraDoors,
    testGetRoom           as getRoom,
    testGetRoomDimensions as getRoomDimensions,
    testGetRooms          as getRooms,
    testMakeDoor          as makeDoor,

    // Public functions
} from '../map.js';

import { cellDoor, createBlankGrid } from '../grid.js';
import { knobs } from '../../knobs.js';
import roomTypes from '../../rooms/type.js';
import size from '../../attributes/size.js';

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {

    // -- Private Functions ----------------------------------------------------

    describe('checkAdjacentDoor()', () => {
        describe('given coordinates which are adjacent to a door', () => {
            // d = cellDoor
            // x = checked cell

            //   0 1 2
            // 0 . d .
            // 1 d x d
            // 2 . d .

            [
                [ 1, 0 ],
                [ 2, 1 ],
                [ 1, 2 ],
                [ 0, 1 ],
            ].forEach((doorCords) => {
                it('returns false', () => {
                    const [ x, y ] = doorCords;
                    const grid = createBlankGrid({ gridWidth: 3, gridHeight: 3 });

                    grid[x][y] = cellDoor;

                    assert(checkAdjacentDoor(grid, [ 1, 1 ])).isTrue();
                });
            });
        });

        describe('given coordinates which are not adjacent to a door', () => {
            it('returns true', () => {
                const grid = createBlankGrid({ gridWidth: 3, gridHeight: 3 });
                assert(checkAdjacentDoor(grid, [ 1, 1 ])).isFalse();
            });
        });
    });

    describe('drawRooms()', () => {
        const gridDimensions = { gridWidth: 10, gridHeight: 10 };

        it('should return an AppliedRoomResults object', () => {
            const grid = createBlankGrid(gridDimensions);
            const room = {
                settings: {
                    [knobs.roomType]: roomTypes.room,
                    [knobs.roomSize]: size.tiny,
                },
            };

            const result = drawRooms(gridDimensions, [ room ], grid, 1);

            assert(result).isObject();
            assert(result.doors).isArray();
            assert(result.gridRooms).isArray();
            assert(result.rooms).isArray();
            assert(result.skipped).isArray();
            assert(result.roomNumber).equals(2);

            result.doors     && assert(result.doors.length).equals(1);
            result.gridRooms && assert(result.gridRooms.length).equals(1);
            result.rooms     && assert(result.rooms.length).equals(1);
            result.skipped   && assert(result.skipped.length).equals(0);
        });

        describe('the first room', () => {
            it('should be connected to an edge of the map', () => {
                const grid = createBlankGrid(gridDimensions);
                const room = {
                    settings: {
                        [knobs.roomType]: roomTypes.room,
                        [knobs.roomSize]: size.small,
                    },
                };

                const result = drawRooms(gridDimensions, [ room, room ], grid, 1);
                const firstDoor = result.doors.shift();

                assert(Boolean(firstDoor.connections.outside)).isTrue();
            });
        });

        describe('when a room cannot be placed on the grid', () => {
            it('should return the room in the skipped param', () => {
                const grid = createBlankGrid(gridDimensions);
                const room = {
                    settings: {
                        [knobs.roomType]: roomTypes.room,
                        [knobs.roomSize]: size.massive,
                    },
                };

                const result = drawRooms(gridDimensions, [ room, room ], grid, 1);

                assert(result.skipped.length).equals(1);
            });
        });
    });

    describe('getDoor()', () => {
        it('should return a Door object', () => {
            // w = cellWall
            // w = cellCornerWall
            // 1 = room

            //   0 1 2 3 4 5 6 7 8 9
            // 0 . . . . . . . . . .
            // 1 . c w w c . . . . .
            // 2 . w 1 1 w . . . . .
            // 3 . w 1 1 w . . . . .
            // 4 . c w w c . . . . .
            // 5 . w 2 2 w . . . . .
            // 6 . w 2 2 w . . . . .
            // 7 . c w w c . . . . .
            // 8 . . . . . . . . . .
            // 9 . . . . . . . . . .

            const grid = createBlankGrid({ gridWidth: 10, gridHeight: 10 });

            const prevRoom = {
                x: 2,
                y: 2,
                width: 2,
                height: 2,
                type: roomTypes.room,
                roomNumber: 1,
            };

            const { walls: prevWalls } = getRoom(grid, prevRoom);

            prevRoom.walls = prevWalls;

            const room = {
                x: 2,
                y: 5,
                width: 2,
                height: 2,
                type: roomTypes.room,
                roomNumber: 2,
            };

            const { walls } = getRoom(grid, room);

            room.walls = walls;

            const door = getDoor(grid, room, prevRoom);

            assert(door).isObject();
            assert(door.connections).equalsObject({
                1: { direction: 'south', to: 2 },
                2: { direction: 'north', to: 1 },
            });

            assert(door.locked).isBoolean();
            assert(door.rect).isString();
            assert(door.type).isString();
        });
    });

    describe('getDoorCells()', () => {
        describe('given no previous room', () => {
            const roomConfig = {
                x: 0,
                y: 0,
                width: 2,
                height: 2,
                type: roomTypes.room,
                roomNumber: 1,
            };

            describe('when the room is adjacent to the north edge', () => {
                it('should return connections to the north edge', () => {
                    const grid = createBlankGrid({ gridWidth: 10, gridHeight: 10 });
                    const room = {
                        ...roomConfig,
                        x: 3,
                        y: 1, // y - 1 = north edge
                    };

                    const { walls } = getRoom(grid, room);

                    room.walls = walls;

                    const cells = getDoorCells(grid, room);

                    assert(cells).isArray();
                    cells && assert(cells.shift()).equalsArray([ '3', '0' ]);
                    cells && assert(cells.shift()).equalsArray([ '4', '0' ]);
                });
            });

            describe('when the room is adjacent to the east edge', () => {
                it('should return connections to the east edge', () => {
                    const grid = createBlankGrid({ gridWidth: 10, gridHeight: 10 });
                    const room = {
                        ...roomConfig,
                        x: 7, // x + room width = east edge
                        y: 3,
                    };

                    const { walls } = getRoom(grid, room);

                    room.walls = walls;

                    const cells = getDoorCells(grid, room);

                    assert(cells).isArray();
                    cells && assert(cells.shift()).equalsArray([ '9', '3' ]);
                    cells && assert(cells.shift()).equalsArray([ '9', '4' ]);
                });
            });

            describe('when the room is adjacent to the south edge', () => {
                it('should return connections to the south edge', () => {
                    const grid = createBlankGrid({ gridWidth: 10, gridHeight: 10 });
                    const room = {
                        ...roomConfig,
                        x: 2,
                        y: 7, // y + room height = south edge
                    };

                    const { walls } = getRoom(grid, room);

                    room.walls = walls;

                    const cells = getDoorCells(grid, room);

                    assert(cells).isArray();
                    cells && assert(cells.shift()).equalsArray([ '2', '9' ]);
                    cells && assert(cells.shift()).equalsArray([ '3', '9' ]);
                });
            });

            describe('when the room is adjacent to the west edge', () => {
                it('should return connections to the west edge', () => {
                    const grid = createBlankGrid({ gridWidth: 10, gridHeight: 10 });
                    const room = {
                        ...roomConfig,
                        x: 1, // x - 1 = west edge
                        y: 5,
                    };

                    const { walls } = getRoom(grid, room);

                    room.walls = walls;

                    const cells = getDoorCells(grid, room);

                    assert(cells).isArray();
                    cells && assert(cells.shift()).equalsArray([ '0', '5' ]);
                    cells && assert(cells.shift()).equalsArray([ '0', '6' ]);
                });
            });
        });

        describe('given a previous room', () => {
            it('should return connections to the previous room', () => {
                // w = cellWall
                // w = cellCornerWall
                // 1 = room

                //   0 1 2 3 4 5 6 7 8 9
                // 0 . . . . . . . . . .
                // 1 . . . c w w w c . .
                // 2 . . . w 1 1 1 w . .
                // 3 . . . w 1 1 1 w . .
                // 4 . . c w w w w c . .
                // 5 . . w 2 2 2 2 w . .
                // 6 . . w 2 2 2 2 w . .
                // 7 . . w 2 2 2 2 w . .
                // 8 . . c w w w w c . .
                // 9 . . . . . . . . . .

                const grid = createBlankGrid({ gridWidth: 10, gridHeight: 10 });
                const room1 = {
                    x: 4,
                    y: 2,
                    width: 3,
                    height: 2,
                    type: roomTypes.room,
                    roomNumber: 1,
                };

                const room2 = {
                    x: 3,
                    y: 5,
                    width: 4,
                    height: 3,
                    type: roomTypes.room,
                    roomNumber: 2,
                };

                const { walls: walls1 } = getRoom(grid, room1);
                const { walls: walls2 } = getRoom(grid, room2);

                room1.walls = walls1;
                room2.walls = walls2;

                const cells = getDoorCells(grid, room2, room1);

                assert(cells).isArray();
                cells && assert(cells.shift()).equalsArray([ '4', '4' ]);
                cells && assert(cells.shift()).equalsArray([ '5', '4' ]);
                cells && assert(cells.shift()).equalsArray([ '6', '4' ]);
            });
        });
    });

    describe('getDoorDirection()', () => {
        const room = {
            x: 2,
            y: 2,
            width: 2,
            height: 2,
            type: roomTypes.room,
            roomNumber: 1,
        };

        describe('given a grid cell on the north side of a room', () => {
            it('should return `directions.north`', () => {
                assert(getDoorDirection([ 2, 1 ], room)).equals(directions.north);
            });
        });

        describe('given a grid cell on the east side of a room', () => {
            it('should return `directions.north`', () => {
                assert(getDoorDirection([ 4, 2 ], room)).equals(directions.east);
            });
        });

        describe('given a grid cell on the south side of a room', () => {
            it('should return `directions.north`', () => {
                assert(getDoorDirection([ 2, 4 ], room)).equals(directions.south);
            });
        });

        describe('given a grid cell on the south side of a room', () => {
            it('should return `directions.north`', () => {
                assert(getDoorDirection([ 1, 2 ], room)).equals(directions.west);
            });
        });

        describe('given an invalid cell', () => {
            it('should return throw', () => {
                // TODO [ 1, 1 ] should throw as well
                assert(() => getDoorDirection([ 0, 0 ], room)).throws('Invalid grid cell');
            });
        });
    });

    describe('getExtraDoors()', () => {

    });

    describe('getRoom()', () => {

    });

    describe('getRoomDimensions()', () => {

    });

    describe('getRooms()', () => {

    });

    describe('makeDoor()', () => {

    });
};
