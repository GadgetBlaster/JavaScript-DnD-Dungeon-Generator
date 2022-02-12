// @ts-check

import {
    // Config
    testCellCornerWall as cellCornerWall,
    testCellDoor       as cellDoor,
    testCellWall       as cellWall,

    // Private Functions
    testCheckForAdjacentDoor as checkForAdjacentDoor,
    testDrawRooms            as drawRooms,
    testGetDoor              as getDoor,
    testGetDoorCells         as getDoorCells,
    testGetDoorDirection     as getDoorDirection,
    testGetExtraDoors        as getExtraDoors,
    testGetRoomDimensions    as getRoomDimensions,
    testGetRoomDrawing       as getRoomDrawing,
    testGetRooms             as getRooms,
    testGetRoomWalls         as getRoomWalls,
    testMakeDoor             as makeDoor,

    // Public functions
    generateMap,
    getGridAsText,
} from '../map.js';

import { createBlankGrid, wallSize } from '../grid.js';
import { dimensionRanges } from '../../room/dimensions.js';
import { generateRooms } from '../../room/generate.js';
import { knobs } from '../../knobs.js';
import { labelMinWidth, labelMinHeight, testTrapLabel as trapLabel } from '../draw.js';
import { list as doorTypes } from '../../room/door.js';

/** @typedef {import('../map.js').GridRoom} GridRoom */
/** @typedef {import('../../room/room.js').RoomType} RoomType */

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {

    // -- Private Functions ----------------------------------------------------

    describe('checkForAdjacentDoor()', () => {
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
                    const grid = createBlankGrid({ width: 3, height: 3 });

                    grid[x][y] = cellDoor;

                    assert(checkForAdjacentDoor(grid, { x: 1, y: 1 })).isTrue();
                });
            });
        });

        describe('given coordinates which are not adjacent to a door', () => {
            it('returns true', () => {
                const grid = createBlankGrid({ width: 3, height: 3 });
                assert(checkForAdjacentDoor(grid, { x: 1, y: 1 })).isFalse();
            });
        });
    });

    describe('drawRooms()', () => {
        const gridDimensions = { width: 12, height: 12 };

        it('should return an AppliedRoomResults object', () => {
            const grid = createBlankGrid(gridDimensions);
            const room = {
                settings: {
                    [knobs.roomType]: 'room',
                    [knobs.roomSize]: 'tiny',
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
                        [knobs.roomType]: 'room',
                        [knobs.roomSize]: 'small',
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
                        [knobs.roomType]: 'room',
                        [knobs.roomSize]: 'massive',
                    },
                };

                const result = drawRooms(gridDimensions, [ room, room ], grid, 1);

                assert(result.skipped.length).equals(1);
            });
        });

        describe('given a previous room', () => {
            describe('when the previous room has no wall cells', () => {
                it('should throw', () => {
                    const grid = createBlankGrid(gridDimensions);
                    const room = {
                        settings: {
                            [knobs.roomType]: 'room',
                            [knobs.roomSize]: 'tiny',
                        },
                    };

                    assert(() => drawRooms(gridDimensions, [ room ], grid, 1, room))
                        .throws('Previous room requires wall cells');
                });
            });

            describe('when connecting to a room', () => {
                it('should connect the rooms', () => {
                    const grid = createBlankGrid(gridDimensions);
                    let prevRect = {
                        x: 1,
                        y: 1,
                        width: 2,
                        height: 3,
                    };

                    const prevGridRoom = {
                        rect: prevRect,
                        roomNumber: 1,
                        type: 'room',
                        walls: getRoomWalls(grid, prevRect, 1),
                    };

                    const room = {
                        roomNumber: 2,
                        settings: {
                            [knobs.roomType]: 'room',
                            [knobs.roomSize]: 'medium',
                        },
                    };

                    const result = drawRooms(gridDimensions, [ room ], grid, 1, prevGridRoom);

                    assert(result.doors).isArray();

                    // TODO door.size is undefined in this test, require missing
                    // size
                    const door = result.doors.pop();
                    assert(door.type).isString();
                    assert(door.connections).isObject();

                    const connection = door.connections[1];
                    assert(connection).isObject();
                    assert(connection.direction).isString();
                    assert(connection.to).equals(1);
                });
            });

            describe('when connecting a hallway to a room', () => {
                it('should connect the hallway to the previous room', () => {
                    const grid = createBlankGrid(gridDimensions);
                    const prevRect = {
                        x: 1,
                        y: 1,
                        width: 2,
                        height: 3,
                    };

                    const prevGridRoom = {
                        rect: prevRect,
                        roomNumber: 1,
                        type: 'room',
                        walls: getRoomWalls(grid, prevRect, 1)
                    };

                    const hallway = {
                        roomNumber: 2,
                        settings: {
                            [knobs.roomType]: 'hallway',
                            [knobs.roomSize]: 'small',
                        },
                    };

                    const result = drawRooms(gridDimensions, [ hallway ], grid, 1, prevGridRoom);

                    assert(result.doors).isArray();

                    const door = result.doors.pop();
                    assert(door.type).isString();
                    assert(door.connections).isObject();

                    const connection = door.connections[1];
                    assert(connection).isObject();
                    assert(connection.direction).isString();
                    assert(connection.to).equals(1);
                });
            });
        });
    });

    describe('getDoor()', () => {
        // TODO needs test w/o previous room
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

            const grid = createBlankGrid({ width: 10, height: 10 });

            const prevRect = {
                x: 2,
                y: 2,
                width: 2,
                height: 2,
            };

            const prevGridRoom = {
                rect: prevRect,
                roomNumber: 1,
                type: /** @type {RoomType} */ ('room'),
                walls: getRoomWalls(grid, prevRect, 1),
            };

            const rect = {
                x: 2,
                y: 5,
                width: 2,
                height: 2,
            };

            const gridRoom = {
                rect,
                roomNumber: 2,
                type: /** @type {RoomType} */ ('room'),
                walls: getRoomWalls(grid, rect, 2),
            };

            const door = getDoor(grid, gridRoom, prevGridRoom);

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
            const roomNumber = 1;
            const rectConfig = {
                x: 0,
                y: 0,
                width: 2,
                height: 2,
            };

            const gridRoomConfig = {
                rect: rectConfig,
                roomNumber,
                type: /** @type {RoomType} */ ('room'),
            };

            describe('when the room is adjacent to the north edge', () => {
                it('should return connections to the north edge', () => {
                    const grid = createBlankGrid({ width: 10, height: 10 });
                    const rect = {
                        ...rectConfig,
                        x: 3,
                        y: 1, // y - 1 = north edge
                    };

                    const gridRoom = {
                        ...gridRoomConfig,
                        rect,
                        walls: getRoomWalls(grid, rect, roomNumber),
                    };

                    const cells = getDoorCells(grid, gridRoom);

                    assert(cells).isArray();
                    cells && assert(cells.shift()).equalsObject({ x: 3, y: 0 });
                    cells && assert(cells.shift()).equalsObject({ x: 4, y: 0 });
                });
            });

            describe('when the room is adjacent to the east edge', () => {
                it('should return connections to the east edge', () => {
                    const grid = createBlankGrid({ width: 10, height: 10 });
                    const rect = {
                        ...rectConfig,
                        x: 7, // x + room width = east edge
                        y: 3,
                    };

                    const gridRoom = {
                        ...gridRoomConfig,
                        rect,
                        walls: getRoomWalls(grid, rect, roomNumber),
                    };

                    const cells = getDoorCells(grid, gridRoom);

                    assert(cells).isArray();
                    cells && assert(cells.shift()).equalsObject({ x: 9, y: 3 });
                    cells && assert(cells.shift()).equalsObject({ x: 9, y: 4 });
                });
            });

            describe('when the room is adjacent to the south edge', () => {
                it('should return connections to the south edge', () => {
                    const grid = createBlankGrid({ width: 10, height: 10 });
                    const rect = {
                        ...rectConfig,
                        x: 2,
                        y: 7, // y + room height = south edge
                    };

                    const gridRoom = {
                        ...gridRoomConfig,
                        rect,
                        walls: getRoomWalls(grid, rect, roomNumber),
                    };

                    const cells = getDoorCells(grid, gridRoom);

                    assert(cells).isArray();
                    cells && assert(cells.shift()).equalsObject({ x: 2, y: 9 });
                    cells && assert(cells.shift()).equalsObject({ x: 3, y: 9 });
                });
            });

            describe('when the room is adjacent to the west edge', () => {
                it('should return connections to the west edge', () => {
                    const grid = createBlankGrid({ width: 10, height: 10 });
                    const rect = {
                        ...rectConfig,
                        x: 1, // x - 1 = west edge
                        y: 5,
                    };

                    const gridRoom = {
                        ...gridRoomConfig,
                        rect,
                        walls: getRoomWalls(grid, rect, roomNumber),
                    };

                    const cells = getDoorCells(grid, gridRoom);

                    assert(cells).isArray();
                    cells && assert(cells.shift()).equalsObject({ x: 0, y: 5 });
                    cells && assert(cells.shift()).equalsObject({ x: 0, y: 6 });
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

                const grid = createBlankGrid({ width: 10, height: 10 });
                const rect1 = {
                    x: 4,
                    y: 2,
                    width: 3,
                    height: 2,
                };

                const gridRoom1 = {
                    rect: rect1,
                    roomNumber: 1,
                    type: /** @type {RoomType} */ ('room'),
                    walls: getRoomWalls(grid, rect1, 1),
                };

                const rect2 = {
                    x: 3,
                    y: 5,
                    width: 4,
                    height: 3,
                };

                const gridRoom2 = {
                    rect: rect2,
                    roomNumber: 2,
                    type: /** @type {RoomType} */ ('room'),
                    walls: getRoomWalls(grid, rect2, 2),
                };

                const cells = getDoorCells(grid, gridRoom2, gridRoom1);

                assert(cells).isArray();
                cells && assert(cells.shift()).equalsObject({ x: 4, y: 4 });
                cells && assert(cells.shift()).equalsObject({ x: 5, y: 4 });
                cells && assert(cells.shift()).equalsObject({ x: 6, y: 4 });
            });
        });
    });

    describe('getDoorDirection()', () => {
        const roomRect = {
            x: 2,
            y: 2,
            width: 2,
            height: 2,
        };

        describe('given a grid cell on the north side of a room', () => {
            it('should return "north"', () => {
                assert(getDoorDirection({ x: 2, y: 1 }, roomRect)).equals('north');
            });
        });

        describe('given a grid cell on the east side of a room', () => {
            it('should return "east', () => {
                assert(getDoorDirection({ x: 4, y: 2 }, roomRect)).equals('east');
            });
        });

        describe('given a grid cell on the south side of a room', () => {
            it('should return "south"', () => {
                assert(getDoorDirection({ x: 2, y: 4 }, roomRect)).equals('south');
            });
        });

        describe('given a grid cell on the south side of a room', () => {
            it('should return "west"', () => {
                assert(getDoorDirection({ x: 1, y: 2 }, roomRect)).equals('west');
            });
        });

        describe('given an invalid cell', () => {
            it('should throw', () => {
                // TODO [ 1, 1 ] should throw as well
                assert(() => getDoorDirection({ x: 0, y: 0 }, roomRect))
                    .throws('Invalid door coordinates in getDoorDirection()');
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
                const grid  = createBlankGrid({ width: 10, height: 10 });

                const rect1 = {
                    x: 4,
                    y: 2,
                    width: 3,
                    height: 2,
                };

                const room1 = {
                    ...rect1,
                    type: 'room',
                    roomNumber: 1,
                    settings: {
                        [knobs.dungeonConnections]: connectionChance,
                    },
                };

                const rect2 = {
                    x: 3,
                    y: 5,
                    width: 4,
                    height: 3,
                };

                const room2 = {
                    ...rect2,
                    type: 'room',
                    roomNumber: 2,
                    settings: {
                        [knobs.dungeonConnections]: connectionChance,
                    },
                };

                const walls1 = getRoomWalls(grid, rect1, room1.roomNumber);
                const walls2 = getRoomWalls(grid, rect2, room2.roomNumber);

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
                        1: { direction: 'south', to: 2 },
                        2: { direction: 'north', to: 1 },
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
                const grid = createBlankGrid({ width: 10, height: 10 });

                const rect1 = {
                    x: 2,
                    y: 2,
                    width: 2,
                    height: 2,
                };

                const room1 = {
                    ...rect1,
                    type: 'room',
                    roomNumber: 1,
                    settings: {
                        [knobs.dungeonConnections]: connectionChance,
                    },
                };

                const rect2 = {
                    x: 5,
                    y: 2,
                    width: 3,
                    height: 6,
                };

                const room2 = {
                    ...rect2,
                    type: 'room',
                    roomNumber: 2,
                    settings: {
                        [knobs.dungeonConnections]: connectionChance,
                    },
                };

                const walls1 = getRoomWalls(grid, rect1, room1.roomNumber);
                const walls2 = getRoomWalls(grid, rect2, room2.roomNumber);

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
                        1: { direction: 'east', to: 2 },
                        2: { direction: 'west', to: 1 },
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

    describe('getRoomWalls()', () => {
        describe('given a room config without a roomNumber', () => {
            it('should throw', () => {
                const grid = createBlankGrid({ width: 8, height: 6 });

                // @ts-expect-error
                assert(() => getRoomWalls(grid, { x: 1, y:1, width: 1, height: 1 }))
                    .throws('roomNumber is required in getRoomWalls()');
            });
        });

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

            const grid = createBlankGrid({ width: 8, height: 6 });
            const rect = {
                x: 3,
                y: 3,
                width: 3,
                height: 2,
            };

            const expectedCords = [ [2, 3], [2, 4], [3, 2], [3, 5], [4, 2], [4, 5], [5, 2], [5, 5], [6, 3], [6, 4] ];
            const expectedCornerCords = [ [2, 2], [2, 5], [6, 2], [6, 5] ];

            describe('when the room type is "room"', () => {
                const walls = getRoomWalls(grid, rect, 7);

                it('should return an array of wall cells', () => {
                    assert(walls).isArray();

                    walls && assert(walls.length).equals(10);
                    walls && expectedCords.forEach((cords) => {
                        assert(walls.shift()).equalsArray(cords);
                    });
                });

                it('should update the grid with correctly placed `cellWall` and `cellCornerWall` indicators', () => {
                    expectedCords.forEach(([ x, y ]) => {
                        assert(grid[x][y]).equals(cellWall);
                    });

                    expectedCornerCords.forEach(([ x, y ]) => {
                        assert(grid[x][y]).equals(cellCornerWall);
                    });
                });
            });
        });
    });

    describe('getRoomDrawing()', () => {
        const grid = createBlankGrid({ width: 8, height: 6 });
        const rect = { x: 3, y: 3, width: 3, height: 2 };

        /** @type {GridRoom} gridRoom */
        const gridRoom = {
            rect,
            type: 'room',
            roomNumber: 7,
            walls: getRoomWalls(grid, rect, 7),
        };

        describe('when the room type is "room"', () => {
            const drawing = getRoomDrawing(gridRoom);

            it('should return an SVG element rect for the room rect', () => {
                assert(drawing).isString();

                const rectMatches = drawing.match(/<rect(.+?) \/>/g);
                assert(rectMatches).isArray();
                rectMatches && assert(rectMatches.length).equals(1);
                rectMatches && assert(rectMatches.pop()).isElementTag('rect');
            });

            it('should include the room number in the room rect', () => {
                assert(/<text(.+?)>7<\/text>/.test(drawing)).isTrue();
            });
        });

        describe('when the width and height are at least `labelMinWidth` and `labelMinHeight`', () => {
            it('should not include the room label in the room rect', () => {
                const rectWithLabelDimensions = getRoomDrawing({
                    ...gridRoom,
                    rect: {
                        ...gridRoom.rect,
                        width: labelMinWidth,
                        height: labelMinHeight,
                    },
                });

                assert(RegExp('<text(.+?)>room</text>').test(rectWithLabelDimensions)).isFalse();
            });
        });

        describe('when the room type is not "room"', () => {
            /** @type {GridRoom} libraryGridRoom */
            const libraryGridRoom = {
                ...gridRoom,
                type: 'library',
            };

            describe('when the room width is less than or equal to `labelMinWidth`', () => {
                it('should not include the room label in the room rect', () => {
                    const libraryDrawing = getRoomDrawing({
                        ...libraryGridRoom,
                        rect: {
                            ...libraryGridRoom.rect,
                            width: labelMinWidth - 1,
                            height: labelMinWidth,
                        },
                    });

                    assert(RegExp('<text(.+?)>library</text>').test(libraryDrawing)).isFalse();
                });
            });

            describe('when the room width is less than or equal to `labelMinHeight`', () => {
                it('should not include the room label in the room rect', () => {
                    const libraryDrawing = getRoomDrawing({
                        ...libraryGridRoom,
                        rect: {
                            ...libraryGridRoom.rect,
                            width: labelMinHeight,
                            height: labelMinHeight - 1,
                        },
                    });

                    assert(RegExp('<text(.+?)>library</text>').test(libraryDrawing)).isFalse();
                });
            });

            describe('when the room width and height are less than or equal to `labelMinHeight`', () => {
                it('should include the room label in the room rect', () => {
                    const libraryDrawing = getRoomDrawing({
                        ...libraryGridRoom,
                        rect: {
                            ...libraryGridRoom.rect,
                            width: labelMinWidth,
                            height: labelMinHeight,
                        },
                    });

                    assert(RegExp('<text(.+?)>library</text>').test(libraryDrawing)).isTrue();
                });
            });
        });

        describe('given a truthy `hasTraps` option', () => {
            it('should include a `<text>` trap indicator in the room rect', () => {
                const trappedRoomDrawing = getRoomDrawing(gridRoom, { hasTraps: true });
                assert(RegExp(`<text(.+?)>${trapLabel}</text>`).test(trappedRoomDrawing)).isTrue();
            });
        });
    });

    describe('getRoomDimensions()', () => {
        const gridDimensions = { width: 10, height: 6 };

        describe('given a room config with a missing room type', () => {
            it('should throw', () => {
                assert(() => getRoomDimensions(gridDimensions, {
                    settings: { [knobs.roomSize]: 'small' },
                })).throws('roomType is required in getRoomDimensions()');
            });
        });

        describe('given a room config with a missing room size', () => {
            it('should throw', () => {
                assert(() => getRoomDimensions(gridDimensions, {
                    settings: { [knobs.roomType]: 'library' },
                })).throws('roomSize is required in getRoomDimensions()');
            });
        });

        describe('given a room type which requires custom dimensions', () => {
            // TODO need to inject randomization for testing
            it('should return a room width and height ', () => {
                const dimensions = getRoomDimensions(gridDimensions, {
                    settings: {
                        [knobs.roomSize]: 'small',
                        [knobs.roomType]: 'hallway',
                    },
                });

                assert(dimensions.width).isNumber();
                assert(dimensions.height).isNumber();
            });
        });

        describe('given a room type which does not require custom dimensions', () => {
            it('should return a room width and height within the range specified for the room size', () => {
                const [ minSize, maxSize ] = dimensionRanges.small;

                const { width, height } = getRoomDimensions(gridDimensions, {
                    settings: {
                        [knobs.roomSize]: 'small',
                        [knobs.roomType]: 'room',
                    },
                });

                assert(width >= minSize && width <= maxSize).isTrue();
                assert(height >= minSize && height <= maxSize).isTrue();
            });
        });

        describe('when the room dimensions are larger than the grid dimensions', () => {
            it('should return a room width and height no larger than the grid width minus twice the wall size', () => {
                const gridWidth  = 5;
                const gridHeight = 5;

                const miniMapDimensions = { width: gridWidth, height: gridHeight };

                const { width, height } = getRoomDimensions(miniMapDimensions, {
                    settings: {
                        [knobs.roomSize]: 'massive',
                        [knobs.roomType]: 'room',
                    },
                });

                assert(width <= (gridWidth - (wallSize * 2))).isTrue();
                assert(height <= (gridHeight - (wallSize * 2))).isTrue();
            });
        });
    });

    describe('getRooms()', () => {
        describe('given three rooms configs', () => {
            const gridWidth  = 20;
            const gridHeight = 24;

            const grid = createBlankGrid({ width: gridWidth, height: gridHeight });
            const room = {
                x: 1,
                y: 1,
                width: 3,
                height: 2,
                type: 'room',
                roomNumber: 1,
                settings: {
                    [knobs.roomSize]: 'small',
                    [knobs.roomType]: 'room',
                },
            };

            it('should return an object containing rooms and doors', () => {
                const { rooms, doors } = getRooms({
                    width: gridWidth,
                    height: gridHeight,
                }, [
                    { ...room },
                    { ...room, x: 5, y: 1, roomNumber: 2 },
                    { ...room, x: 1, y: 4, roomNumber: 3 },
                ],
                grid);

                assert(rooms).isArray();
                rooms && assert(rooms.length).equals(3);
                rooms && rooms.forEach((roomConfig) => {
                    assert(roomConfig).isObject();
                    roomConfig && assert(roomConfig.config).isObject();
                    roomConfig && assert(roomConfig.rect).isString();
                });

                assert(doors).isArray();
                doors && assert(doors.length).equals(3);

                doors && doors.forEach((doorConfig) => {
                    assert(doorConfig).isObject();
                    doorConfig && assert(doorConfig.connections).isObject();
                    doorConfig && assert(doorConfig.locked).isBoolean();
                    doorConfig && assert(doorConfig.rect).isString();
                    doorConfig && assert(doorTypes.includes(doorConfig.type)).isTrue();
                });
            });
        });
    });

    describe('makeDoor()', () => {
        it('should return a door config', () => {
            const door = makeDoor({
                x: 1,
                y: 2,
                width: 4,
                height: 3,
            }, {
                from: 1,
                to: 2,
                direction: 'south',
                type: 'library',
            });

            assert(door).isObject();
            assert(door.rect).isString();
            assert(door.type).equals('library');
            assert(door.locked).isBoolean();
            assert(door.connections).equalsObject({
                1: { direction: 'south', to: 2 },
                2: { direction: 'north', to: 1 },
            });
        });
    });

    // -- Public Functions -----------------------------------------------------

    describe('generateMap()', () => {
        it('should generate a map, rooms, and doors', () => {
            const { map, rooms, doors } = generateMap({ width: 30, height: 24 }, generateRooms({
                [knobs.itemCondition]: 'average',
                [knobs.itemQuantity] : 'one',
                [knobs.itemRarity]   : 'average',
                [knobs.itemType]     : 'miscellaneous',
                [knobs.roomSize]     : 'medium',
                [knobs.roomCount]    : 34,
                [knobs.roomType]     : 'room',
                [knobs.roomCondition]: 'average',
            }));

            assert(map).isString();

            assert(rooms).isArray();
            rooms && rooms.forEach((room, i) => {
                assert(room.roomNumber).equals(i + 1);
            });

            assert(doors).isArray();
            doors && doors.forEach((door) => {
                assert(doorTypes.includes(door.type)).isTrue();
            });
        });
    });

    describe('getGridAsText()', () => {
        describe('given a blank grid', () => {
            it('should return an string representing the grid', () => {
                const grid = createBlankGrid({ width: 3, height: 3 });
                assert(getGridAsText(grid)).equals('. . .\n. . .\n. . .');
            });
        });

        describe('given a grid with a room on it', () => {
            it('should return an string containing the walls, corners, room number, and blank cells', () => {
                const grid = createBlankGrid({ width: 5, height: 5 });

                grid[1][1] = cellCornerWall;
                grid[2][1] = cellWall;
                grid[3][1] = cellWall;
                grid[4][1] = cellCornerWall;

                grid[1][2] = cellWall;
                grid[2][2] = '1';
                grid[3][2] = '1';
                grid[4][2] = cellWall;

                grid[1][3] = cellCornerWall;
                grid[2][3] = cellWall;
                grid[3][3] = cellWall;
                grid[4][3] = cellCornerWall;

                assert(getGridAsText(grid)).equals(
                    '. . . . .\n' +
                    '. c w w c\n' +
                    '. w 1 1 w\n' +
                    '. c w w c\n' +
                    '. . . . .'
                );
            });
        });

        describe('given dimensions for a horizontal rectangle grid', () => {
            it('should return an string representing the grid', () => {
                const grid = createBlankGrid({ width: 7, height: 4 });
                assert(getGridAsText(grid)).equals(
                    '. . . . . . .\n' +
                    '. . . . . . .\n' +
                    '. . . . . . .\n' +
                    '. . . . . . .'
                );
            });
        });

        describe('given dimensions for a vertical rectangle grid', () => {
            it('should return an string representing the grid', () => {
                const grid = createBlankGrid({ width: 3, height: 5 });
                assert(getGridAsText(grid)).equals(
                    '. . .\n' +
                    '. . .\n' +
                    '. . .\n' +
                    '. . .\n' +
                    '. . .'
                );
            });
        });
    });

};
