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
    logGrid,
    generateMap,
} from '../map.js';

import { cellDoor, cellWall, cellCornerWall, createBlankGrid, wallSize } from '../grid.js';
import { dimensionRanges } from '../../rooms/dimensions.js';
import { knobs } from '../../knobs.js';
import { labelMinWidth, labelMinHeight, testTrapLabel as trapLabel } from '../draw.js';
import { list as doorTypes } from '../../rooms/door.js';
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
            // c = cellCornerWall
            // 1 = room 1
            // 2 = room 2

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
                // c = cellCornerWall
                // 1 = room 1
                // 2 = room 2

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
            it('should throw', () => {
                // TODO [ 1, 1 ] should throw as well
                assert(() => getDoorDirection([ 0, 0 ], room)).throws('Invalid grid cell');
            });
        });
    });

    describe('getExtraDoors()', () => {
        describe('given two vertically adjacent rooms', () => {
            // w = cellWall
            // c = cellCornerWall
            // 1 = room 1
            // 2 = room 2

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

            function getRoomsForTest(connectionChance) {
                const grid  = createBlankGrid({ gridWidth: 10, gridHeight: 10 });

                const room1 = {
                    x: 4,
                    y: 2,
                    width: 3,
                    height: 2,
                    type: roomTypes.room,
                    roomNumber: 1,
                    settings: {
                        [knobs.dungeonConnections]: connectionChance,
                    },
                };

                const room2 = {
                    x: 3,
                    y: 5,
                    width: 4,
                    height: 3,
                    type: roomTypes.room,
                    roomNumber: 2,
                    settings: {
                        [knobs.dungeonConnections]: connectionChance,
                    },
                };

                const { walls: walls1 } = getRoom(grid, room1);
                const { walls: walls2 } = getRoom(grid, room2);

                const rooms = [
                    {
                        config: {
                            ...room1,
                            walls: walls1,
                            size: [ room1.width, room1.height ],
                        },
                    },
                    {
                        config: {
                            ...room2,
                            walls: walls2,
                            size: [ room2.width, room2.height ],
                        },
                    },
                ];

                return {
                    rooms,
                    grid,
                };
            }

            describe('given a 0% chance of connections', () => {
                it('should return an empty array', () => {
                    const { grid, rooms } = getRoomsForTest(0);
                    assert(getExtraDoors(grid, rooms, [])).equalsArray([]);
                });
            });

            describe('given a 100% chance of connections', () => {
                const { grid, rooms } = getRoomsForTest(100);
                const doors = getExtraDoors(grid, rooms, []);

                it('should return a array with a door config', () => {
                    assert(doors).isArray();
                    doors && assert(doors.length).equals(1);

                    const door = doors && doors.pop();
                    door && assert(door.rect).isString(); // Assert door els
                    door && assert(doorTypes.includes(door.type)).isTrue();
                    door && assert(door.locked).isBoolean();
                    door && assert(door.connections).equalsObject({
                        1: { direction: directions.south, to: 2 },
                        2: { direction: directions.north, to: 1 },
                    });
                });

                it('should update the grid with a correctly placed door cell', () => {
                    assert(grid[4][4]).equals(cellDoor);
                });
            });

            describe('given an existing connecting between the rooms', () => {
                it('should return an empty array', () => {
                    const { grid, rooms } = getRoomsForTest(100);
                    const existingDoors = getExtraDoors(grid, rooms, []);

                    assert(grid[4][4]).equals(cellDoor);
                    assert(getExtraDoors(grid, rooms, existingDoors)).equalsArray([]);
                });
            });
        });

        describe('given two horizontally adjacent rooms', () => {
            // w = cellWall
            // c = cellCornerWall
            // 1 = room 1
            // 2 = room 2

            //   0 1 2 3 4 5 6 7 8 9
            // 0 . . . . . . . . . .
            // 1 . c w w c w w w c .
            // 2 . w 1 1 w 2 2 2 w .
            // 3 . w 1 1 w 2 2 2 w .
            // 4 . c w w c 2 2 2 w .
            // 5 . . . . w 2 2 2 w .
            // 6 . . . . w 2 2 2 w .
            // 7 . . . . w 2 2 2 w .
            // 8 . . . . c w w w c .
            // 9 . . . . . . . . . .

            function getRoomsForTest(connectionChance) {
                const grid = createBlankGrid({ gridWidth: 10, gridHeight: 10 });

                const room1 = {
                    x: 2,
                    y: 2,
                    width: 2,
                    height: 2,
                    type: roomTypes.room,
                    roomNumber: 1,
                    settings: {
                        [knobs.dungeonConnections]: connectionChance,
                    },
                };

                const room2 = {
                    x: 5,
                    y: 2,
                    width: 3,
                    height: 6,
                    type: roomTypes.room,
                    roomNumber: 2,
                    settings: {
                        [knobs.dungeonConnections]: connectionChance,
                    },
                };

                const { walls: walls1 } = getRoom(grid, room1);
                const { walls: walls2 } = getRoom(grid, room2);

                const rooms = [
                    {
                        config: {
                            ...room1,
                            walls: walls1,
                            size: [ room1.width, room1.height ],
                        },
                    },
                    {
                        config: {
                            ...room2,
                            walls: walls2,
                            size: [ room2.width, room2.height ],
                        },
                    },
                ];

                return {
                    rooms,
                    grid,
                };
            }

            describe('given a 0% chance of connections', () => {
                it('should return an empty array', () => {
                    const { grid, rooms } = getRoomsForTest(0);
                    assert(getExtraDoors(grid, rooms, [])).equalsArray([]);
                });
            });

            describe('given a 100% chance of connections', () => {
                const { grid, rooms } = getRoomsForTest(100);
                const doors = getExtraDoors(grid, rooms, []);

                it('should return a array with a door config', () => {
                    assert(doors).isArray();
                    doors && assert(doors.length).equals(1);

                    const door = doors && doors.pop();
                    door && assert(door.rect).isString(); // Assert door els
                    door && assert(doorTypes.includes(door.type)).isTrue();
                    door && assert(door.locked).isBoolean();
                    door && assert(door.connections).equalsObject({
                        1: { direction: directions.east, to: 2 },
                        2: { direction: directions.west, to: 1 },
                    });
                });

                it('should update the grid with a correctly placed door cell', () => {
                    assert(grid[4][2]).equals(cellDoor);
                });
            });

            describe('given an existing connecting between the rooms', () => {
                it('should return an empty array', () => {
                    const { grid, rooms } = getRoomsForTest(100);
                    const existingDoors = getExtraDoors(grid, rooms, []);

                    assert(grid[4][2]).equals(cellDoor);
                    assert(getExtraDoors(grid, rooms, existingDoors)).equalsArray([]);
                });
            });
        });
    });

    describe('getRoom()', () => {
        describe('given a grid and a room config', () => {
            // w = cellWall
            // c = cellCornerWall
            // 7 = room 7

            //   0 1 2 3 4 5 6 7
            // 0 . . . . . . . .
            // 1 . . . . . . . .
            // 2 . . c w w w c .
            // 3 . . w 7 7 7 w .
            // 4 . . w 7 7 7 w .
            // 5 . . c w w w c .
            // 6 . . . . . . . .

            const grid = createBlankGrid({ gridWidth: 8, gridHeight: 6 });
            const room = {
                x: 3,
                y: 3,
                width: 3,
                height: 2,
                type: roomTypes.room,
                roomNumber: 7,
            };

            const expectedCords = [ [2, 3], [2, 4], [3, 2], [3, 5], [4, 2], [4, 5], [5, 2], [5, 5], [6, 3], [6, 4] ];
            const expectedCornerCords = [ [2, 2], [2, 5], [6, 2], [6, 5] ];

            describe('when the room type is `roomType.room`', () => {
                const { rect, walls } = getRoom(grid, room);

                it('should return an object with a room rect and an array of wall cells', () => {
                    assert(rect).isString();

                    const rectMatches = rect.match(/<rect(.+?) \/>/g);
                    assert(rectMatches).isArray();
                    rectMatches && assert(rectMatches.length).equals(1);
                    rectMatches && assert(rectMatches.pop()).isElementTag('rect');

                    assert(walls).isArray();

                    walls && assert(walls.length).equals(10);
                    walls && expectedCords.forEach((cords) => {
                        assert(walls.shift()).equalsArray(cords);
                    });
                });

                it('should include the room number in the room rect', () => {
                    assert(/<text(.+?)>7<\/text>/.test(rect)).isTrue();
                });

                it('should update the grid with correctly placed `cellWall` and `cellCornerWall` indicators', () => {
                    expectedCords.forEach(([ x, y ]) => {
                        assert(grid[x][y]).equals(cellWall);
                    });

                    expectedCornerCords.forEach(([ x, y ]) => {
                        assert(grid[x][y]).equals(cellCornerWall);
                    });
                });

                describe('when the width and height are at least `labelMinWidth` and `labelMinHeight`', () => {
                    it('should not include the room label in the room rect', () => {
                        const { rect: rectWithLabelDimensions } = getRoom(grid, {
                            ...room,
                            width: labelMinWidth,
                            height: labelMinHeight,
                        });

                        assert(RegExp(`<text(.+?)>${roomTypes.room}</text>`).test(rectWithLabelDimensions)).isFalse();
                    });
                });
            });

            describe('when the room type is not `roomType.room`', () => {
                const libraryRoom = {
                    ...room,
                    type: roomTypes.library,
                };

                describe('when the room width is less than or equal to `labelMinWidth`', () => {
                    it('should not include the room label in the room rect', () => {
                        const { rect } = getRoom(grid, { ...libraryRoom, width: labelMinWidth - 1 });
                        assert(RegExp(`<text(.+?)>${roomTypes.library}</text>`).test(rect)).isFalse();
                    });
                });

                describe('when the room width is less than or equal to `labelMinHeight`', () => {
                    it('should not include the room label in the room rect', () => {
                        const { rect } = getRoom(grid, { ...libraryRoom, height: labelMinHeight - 1 });
                        assert(RegExp(`<text(.+?)>${roomTypes.library}</text>`).test(rect)).isFalse();
                    });
                });

                describe('when the room width and height are less than or equal to `labelMinHeight`', () => {
                    it('should include the room label in the room rect', () => {
                        const { rect } = getRoom(grid, {
                            ...libraryRoom,
                            width: labelMinWidth,
                            height: labelMinHeight,
                        });

                        assert(RegExp(`<text(.+?)>${roomTypes.library}</text>`).test(rect)).isTrue();
                    });
                });
            });

            describe('given a truthy `hasTraps` option', () => {
                it('should include a `<text>` trap indicator in the room rect', () => {
                    const { rect } = getRoom(grid, room, { hasTraps: true });
                    assert(RegExp(`<text(.+?)>${trapLabel}</text>`).test(rect)).isTrue();
                });
            });
        });
    });

    describe('getRoomDimensions()', () => {
        const mapDimensions = { gridWidth: 10, gridHeight: 6 };

        describe('given a room config with a missing room type', () => {
            it('should throw', () => {
                assert(() => getRoomDimensions(mapDimensions, {
                    settings: { [knobs.roomSize]: size.small },
                })).throws('roomType is required in getRoomDimensions()');
            });
        });

        describe('given a room config with a missing room size', () => {
            it('should throw', () => {
                assert(() => getRoomDimensions(mapDimensions, {
                    settings: { [knobs.roomType]: roomTypes.library },
                })).throws('roomSize is required in getRoomDimensions()');
            });
        });

        describe('given a room type which requires custom dimensions', () => {
            // TODO need to inject randomization for testing
            it('should return a room width and height ', () => {
                const dimensions = getRoomDimensions(mapDimensions, {
                    settings: {
                        [knobs.roomSize]: size.small,
                        [knobs.roomType]: roomTypes.hallway,
                    },
                });

                assert(dimensions.roomWidth).isNumber();
                assert(dimensions.roomHeight).isNumber();
            });
        });

        describe('given a room type which does not require custom dimensions', () => {
            it('should return a room width and height within the range specified for the room size', () => {
                const [ minSize, maxSize ] = dimensionRanges[size.small];

                const { roomWidth, roomHeight } = getRoomDimensions(mapDimensions, {
                    settings: {
                        [knobs.roomSize]: size.small,
                        [knobs.roomType]: roomTypes.room,
                    },
                });

                assert(roomWidth >= minSize && roomWidth <= maxSize).isTrue();
                assert(roomHeight >= minSize && roomHeight <= maxSize).isTrue();
            });
        });

        describe('when the room dimensions are larger than the grid dimensions', () => {
            it('should return a room width and height no larger than the grid width minus twice the wall size', () => {
                const gridWidth  = 5;
                const gridHeight = 5;

                const miniMapDimensions = { gridWidth, gridHeight };
                const [ minSize, maxSize ] = dimensionRanges[size.massive];

                const { roomWidth, roomHeight } = getRoomDimensions(miniMapDimensions, {
                    settings: {
                        [knobs.roomSize]: size.massive,
                        [knobs.roomType]: roomTypes.room,
                    },
                });

                assert(roomWidth <= (gridWidth - (wallSize * 2))).isTrue();
                assert(roomHeight <= (gridHeight - (wallSize * 2))).isTrue();
            });
        });
    });

    describe('getRooms()', () => {

    });

    describe('makeDoor()', () => {

    });

    // -- Public Functions -----------------------------------------------------

    describe('logGrid()', () => {

    });

    describe('generateMap()', () => {

    });

};
