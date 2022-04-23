// @ts-check

import {
    // Config
    directions,
    outside,
    testCellCornerWall     as cellCornerWall,
    testCellDoor           as cellDoor,
    testCellWall           as cellWall,
    testLabelMinRoomHeight as labelMinRoomHeight,
    testLabelMinRoomWidth  as labelMinRoomWidth,

    // Private Functions
    testApplyRooms             as applyRooms,
    testApplyRoomToGrid        as applyRoomToGrid,
    testCheckForAdjacentDoor   as checkForAdjacentDoor,
    testCreateDoor             as createDoor,
    testGetDoor                as getDoor,
    testGetDoorCells           as getDoorCells,
    testGetDoorDirection       as getDoorDirection,
    testGetDoorType            as getDoorType,
    testGetExtraDoors          as getExtraDoors,
    testGetRoomDimensions      as getRoomDimensions,
    testGetRoomText            as getRoomText,
    testProcedurallyApplyRooms as procedurallyApplyRooms,

    // Public functions
    generateMap,
    getGridAsText,
} from '../map.js';

import { createBlankGrid, wallSize } from '../grid.js';
import { roomDimensionRanges } from '../../room/dimensions.js';
import { generateRooms } from '../../room/generate.js';
import { testTrapLabel as trapLabel } from '../draw.js';
import {
    doorTypes,
    probability as doorProbability,
} from '../../room/door.js';

/** @typedef {import('../../attribute/size.js').Size} Size */
/** @typedef {import('../../room/generate.js').GeneratedRoomConfig} GeneratedRoomConfig */
/** @typedef {import('../../room/generate.js').Room} Room */
/** @typedef {import('../../room/room.js').RoomType} RoomType */
/** @typedef {import('../grid.js').Dimensions} Dimensions */
/** @typedef {import('../grid.js').Grid} Grid */
/** @typedef {import('../grid.js').Rectangle} Rectangle */
/** @typedef {import('../map.js').AppliedRoom} AppliedRoom */

/** @type {GeneratedRoomConfig} */
const generatedRoomConfig = {
    itemCondition: 'average',
    itemQuantity: 'zero',
    itemRarity: 'average',
    itemType: 'random',
    roomSize: 'small',
    roomType: 'room',
    roomCondition: 'average',
    roomCount: 1,
    roomFurnitureQuantity: 'average',
};

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


    describe('createDoor()', () => {
        // TODO test locked, test locked types
        it('returns a door config', () => {
            const door = createDoor({
                x: 1,
                y: 2,
                width: 4,
                height: 3,
            }, 'stone', {
                direction: 'south',
                from: 1,
                to: 2,
            });

            assert(door).isObject();
            assert(door.rectangle).isObject();
            assert(door.type).equals('stone');
            assert(door.locked).isBoolean();
            assert(door.connections).equalsObject({
                1: { direction: 'south', to: 2 },
                2: { direction: 'north', to: 1 },
            });
        });
    });

    describe('applyRooms()', () => {
        // TODO, missing `isFork` tests

        const gridDimensions = { width: 12, height: 12 };
        const itemSet = { items: [], containers: [] };

        it('returns an AppliedRoomResults object', () => {
            const grid = createBlankGrid(gridDimensions);
            const room = { config: generatedRoomConfig, itemSet, roomNumber: 1 };
            const result = applyRooms(gridDimensions, [ room ], grid);

            assert(result).isObject();
            assert(result.doors).isArray();
            assert(result.rooms).isArray();
            assert(result.skippedRooms).isArray();

            result.doors        && assert(result.doors.length).equals(1);
            result.rooms        && assert(result.rooms.length).equals(1);
            result.skippedRooms && assert(result.skippedRooms.length).equals(0);
        });

        describe('the first room', () => {
            it('is connected to an edge of the map', () => {
                const grid = createBlankGrid(gridDimensions);
                const room = { config: generatedRoomConfig, itemSet, roomNumber: 1 };
                const result = applyRooms(gridDimensions, [ room, room ], grid);
                const firstDoor = result.doors.shift();

                assert(Boolean(firstDoor.connections[outside])).isTrue();
            });
        });

        describe('when a room cannot be placed on the grid', () => {
            it('returns the room in the skippedRooms property', () => {
                const grid = createBlankGrid(gridDimensions);
                const room = {
                    config: {
                        ...generatedRoomConfig,
                        roomSize: /** @type {Size} */ ('massive'),
                    },
                    itemSet,
                    roomNumber: 1,
                };

                const result = applyRooms(gridDimensions, [ room, room ], grid);

                assert(result.skippedRooms.length).equals(1);
            });
        });

        describe('given a previous room', () => {
            describe('when the previous room has no wall cells', () => {
                it('throws', () => {
                    const grid = createBlankGrid(gridDimensions);
                    const room = {
                        config: {
                            ...generatedRoomConfig,
                            roomSize: /** @type {Size} */ ('tiny'),
                        },
                        itemSet,
                        roomNumber: 1,
                    };

                    const prevRoom = {
                        config: generatedRoomConfig,
                        itemSet,
                        rectangle: { x: 1, y: 1, width: 1, height: 1 },
                        roomNumber: 1,
                    };

                    // @ts-expect-error
                    assert(() => applyRooms(gridDimensions, [ room ], grid, { prevRoom }))
                        .throws('Previous grid room requires wall coordinates in drawRooms()');
                });
            });

            describe('when connecting to a room', () => {
                it('connects the rooms', () => {
                    const grid = createBlankGrid(gridDimensions);
                    let prevRect = {
                        x: 1,
                        y: 1,
                        width: 2,
                        height: 3,
                    };

                    const prevRoom = {
                        config: generatedRoomConfig,
                        itemSet,
                        rectangle: prevRect,
                        roomNumber: 1,
                        walls: applyRoomToGrid(grid, prevRect, 1),
                    };

                    const room = {
                        config: generatedRoomConfig,
                        itemSet,
                        roomNumber: 2,
                    };

                    const result = applyRooms(gridDimensions, [ room ], grid, { prevRoom });
                    assert(result.doors).isArray();

                    const door = result.doors.pop();
                    assert(door.type).isInArray(doorTypes);
                    assert(door.connections).isObject();

                    const connection1 = door.connections[1];
                    assert(connection1).isObject();
                    assert(connection1.direction).isInArray(directions);
                    assert(connection1.to).equals(2);

                    const connection2 = door.connections[2];
                    assert(connection2).isObject();
                    assert(connection2.direction).isInArray(directions);
                    assert(connection2.to).equals(1);
                });
            });

            describe('when connecting a hallway to a room', () => {
                it('connects the hallway to the previous room', () => {
                    const grid = createBlankGrid(gridDimensions);
                    const prevRect = {
                        x: 1,
                        y: 1,
                        width: 2,
                        height: 3,
                    };

                    const prevRoom = {
                        config: generatedRoomConfig,
                        itemSet,
                        rectangle: prevRect,
                        roomNumber: 1,
                        walls: applyRoomToGrid(grid, prevRect, 1),
                    };

                    const hallway = {
                        config: {
                            ...generatedRoomConfig,
                            roomType: /** @type {RoomType} */ ('hallway'),
                        },
                        itemSet,
                        roomNumber: 2,
                    };

                    const result = applyRooms(gridDimensions, [ hallway ], grid, { prevRoom });
                    assert(result.doors).isArray();

                    const door = result.doors.pop();
                    assert(door.type).isString();
                    assert(door.connections).isObject();

                    const connection1 = door.connections[1];
                    assert(connection1).isObject();
                    assert(connection1.direction).isString();
                    assert(connection1.to).equals(2);

                    const connection2 = door.connections[2];
                    assert(connection2).isObject();
                    assert(connection2.direction).isString();
                    assert(connection2.to).equals(1);
                });
            });
        });
    });

    describe('getDoor()', () => {
        // TODO needs test w/o previous room
        it('returns a Door object', () => {
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

            const prevRoom = {
                config: generatedRoomConfig,
                itemSet: { items: [], containers: [] },
                rectangle: prevRect,
                roomNumber: 1,
                walls: applyRoomToGrid(grid, prevRect, 1),
            };

            const rect = {
                x: 2,
                y: 5,
                width: 2,
                height: 2,
            };

            const room = {
                config: generatedRoomConfig,
                itemSet: { items: [], containers: [] },
                rectangle: rect,
                roomNumber: 2,
                walls: applyRoomToGrid(grid, rect, 2),
            };

            const door = getDoor(grid, room, prevRoom);

            assert(door).isObject();
            assert(door.connections).equalsObject({
                1: { direction: 'south', to: 2 },
                2: { direction: 'north', to: 1 },
            });
            assert(door.locked).isBoolean();
            assert(door.rectangle).isObject();
            assert(door.type).isInArray(doorTypes);
            assert(door.direction).equals('north');
        });
    });

    describe('getDoorCells()', () => {
        describe('given no previous room', () => {
            const grid = createBlankGrid({ width: 10, height: 10 });
            const roomNumber = 1;
            const rectangle = {
                x: 0,
                y: 0,
                width: 2,
                height: 2,
            };

            const appliedRoom = {
                config: generatedRoomConfig,
                itemSet: { items: [], containers: [] },
                rectangle,
                roomNumber: 1,
                walls: applyRoomToGrid(grid, rectangle, roomNumber),
            };

            describe('when the room is adjacent to the north edge', () => {
                it('returns connections to the north edge', () => {
                    const rect = {
                        ...rectangle,
                        x: 3,
                        y: 1, // y - 1 = north edge
                    };

                    const room = {
                        ...appliedRoom,
                        rectangle: rect,
                        walls: applyRoomToGrid(grid, rect, roomNumber),
                    };

                    const cells = getDoorCells(grid, room);

                    assert(cells).isArray();
                    cells && assert(cells.shift()).equalsObject({ x: 3, y: 0 });
                    cells && assert(cells.shift()).equalsObject({ x: 4, y: 0 });
                });
            });

            describe('when the room is adjacent to the east edge', () => {
                it('returns connections to the east edge', () => {
                    const rect = {
                        ...rectangle,
                        x: 7, // x + room width = east edge
                        y: 3,
                    };

                    const room = {
                        ...appliedRoom,
                        rectangle: rect,
                        walls: applyRoomToGrid(grid, rect, roomNumber),
                    };

                    const cells = getDoorCells(grid, room);

                    assert(cells).isArray();
                    cells && assert(cells.shift()).equalsObject({ x: 9, y: 3 });
                    cells && assert(cells.shift()).equalsObject({ x: 9, y: 4 });
                });
            });

            describe('when the room is adjacent to the south edge', () => {
                it('returns connections to the south edge', () => {
                    const rect = {
                        ...rectangle,
                        x: 2,
                        y: 7, // y + room height = south edge
                    };

                    const room = {
                        ...appliedRoom,
                        rectangle: rect,
                        walls: applyRoomToGrid(grid, rect, roomNumber),
                    };

                    const cells = getDoorCells(grid, room);

                    assert(cells).isArray();
                    cells && assert(cells.shift()).equalsObject({ x: 2, y: 9 });
                    cells && assert(cells.shift()).equalsObject({ x: 3, y: 9 });
                });
            });

            describe('when the room is adjacent to the west edge', () => {
                it('returns connections to the west edge', () => {
                    const rect = {
                        ...rectangle,
                        x: 1, // x - 1 = west edge
                        y: 5,
                    };

                    const room = {
                        ...appliedRoom,
                        rectangle: rect,
                        walls: applyRoomToGrid(grid, rect, roomNumber),
                    };

                    const cells = getDoorCells(grid, room);

                    assert(cells).isArray();
                    cells && assert(cells.shift()).equalsObject({ x: 0, y: 5 });
                    cells && assert(cells.shift()).equalsObject({ x: 0, y: 6 });
                });
            });
        });

        describe('given a previous room', () => {
            it('returns connections to the previous room', () => {
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

                const room1 = {
                    config: generatedRoomConfig,
                    itemSet: { items: [], containers: [] },
                    rectangle: rect1,
                    roomNumber: 1,
                    walls: applyRoomToGrid(grid, rect1, 1),
                };

                const rect2 = {
                    x: 3,
                    y: 5,
                    width: 4,
                    height: 3,
                };

                const room2 = {
                    config: generatedRoomConfig,
                    itemSet: { items: [], containers: [] },
                    rectangle: rect2,
                    roomNumber: 2,
                    walls: applyRoomToGrid(grid, rect2, 2),
                };

                const cells = getDoorCells(grid, room2, room1);

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
            it('returns "north"', () => {
                assert(getDoorDirection({ x: 2, y: 1 }, roomRect)).equals('north');
            });
        });

        describe('given a grid cell on the east side of a room', () => {
            it('returns "east', () => {
                assert(getDoorDirection({ x: 4, y: 2 }, roomRect)).equals('east');
            });
        });

        describe('given a grid cell on the south side of a room', () => {
            it('returns "south"', () => {
                assert(getDoorDirection({ x: 2, y: 4 }, roomRect)).equals('south');
            });
        });

        describe('given a grid cell on the south side of a room', () => {
            it('returns "west"', () => {
                assert(getDoorDirection({ x: 1, y: 2 }, roomRect)).equals('west');
            });
        });

        describe('given an invalid cell', () => {
            it('throws', () => {
                // TODO [ 1, 1 ] should throw as well
                assert(() => getDoorDirection({ x: 0, y: 0 }, roomRect))
                    .throws('Invalid door coordinates in getDoorDirection()');
            });
        });
    });

    describe('getDoorType()', () => {
        it('returns a door type', () => {
            assert(getDoorType(doorProbability.roll)).isInArray(doorTypes);
        });

        describe('given a rollSecretDoorType function', () => {
            describe('when a secret door type is not rolled', () => {
                it('returns a door type', () => {
                    assert(getDoorType(doorProbability.roll, () => undefined))
                        .isInArray(doorTypes);
                });
            });

            describe('when a secret door type is rolled', () => {
                it('returns the secret door type', () => {
                    assert(getDoorType(doorProbability.roll, () => 'concealed'))
                        .equals('concealed');
                });
            });
        });
    });

    describe('getExtraDoors()', () => {
        /**
         * Returns a blank grid and an array of mocked rooms.
         *
         * @param {Rectangle[]} rects
         * @param {object} [options]
         *     @param {number} [options.connectionChance = 0]
         *     @param {Dimensions} [options.gridDimensions = { width: 10, height: 10 }]
         *
         * @returns {{ grid: Grid; rooms: AppliedRoom[] }}
         */
        function getRoomsForTest(rects, {
            connectionChance = 0,
            gridDimensions = { width: 10, height: 10 },
        } = {}) {
            const grid  = createBlankGrid(gridDimensions);

            const rooms = rects.map((rect, i) => {
                let roomNumber = i + 1;

                /** @type {AppliedRoom} */
                const room = {
                    config: {
                        ...generatedRoomConfig,
                        dungeonConnections: connectionChance,
                    },
                    itemSet: { items: [], containers: [] },
                    roomNumber,
                    rectangle: rect,
                    walls: applyRoomToGrid(grid, rect, roomNumber),
                };


                return room;
            });

            return {
                rooms,
                grid,
            };
        }

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

            const rect1 = {
                x: 4,
                y: 2,
                width: 3,
                height: 2,
            };

            const rect2 = {
                x: 3,
                y: 5,
                width: 4,
                height: 3,
            };

            describe('given a 0% chance of connections', () => {
                it('returns an empty array', () => {
                    const { grid, rooms } = getRoomsForTest([ rect1, rect2 ]);
                    assert(getExtraDoors(grid, rooms, [])).equalsArray([]);
                });
            });

            describe('given a 100% chance of connections', () => {
                const { grid, rooms } = getRoomsForTest([ rect1, rect2 ], { connectionChance: 100 });
                const doors = getExtraDoors(grid, rooms, []);

                it('returns a array with a door config', () => {
                    assert(doors).isArray();
                    doors && assert(doors.length).equals(1);

                    const door = doors && doors.pop();
                    door && assert(door.rectangle).isObject();
                    door && assert(door.type).isInArray(doorTypes);
                    door && assert(door.locked).isBoolean();
                    door && assert(door.connections).equalsObject({
                        1: { direction: 'south', to: 2 },
                        2: { direction: 'north', to: 1 },
                    });
                });

                it('updates the grid with a correctly placed door cell', () => {
                    assert(grid[4][4]).equals(cellDoor);
                });
            });

            describe('given an existing connecting between the rooms', () => {
                it('returns an empty array', () => {
                    const { grid, rooms } = getRoomsForTest([ rect1, rect2 ], { connectionChance: 100 })
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

            const rect1 = {
                x: 2,
                y: 2,
                width: 2,
                height: 2,
            };

            const rect2 = {
                x: 5,
                y: 2,
                width: 3,
                height: 6,
            };

            describe('given a 0% chance of connections', () => {
                it('returns an empty array', () => {
                    const { grid, rooms } = getRoomsForTest([ rect1, rect2 ]);
                    assert(getExtraDoors(grid, rooms, [])).equalsArray([]);
                });
            });

            describe('given a 100% chance of connections', () => {
                const { grid, rooms } = getRoomsForTest([ rect1, rect2 ], { connectionChance: 100 });
                const doors = getExtraDoors(grid, rooms, []);

                it('returns a array with a door config', () => {
                    assert(doors).isArray();
                    doors && assert(doors.length).equals(1);

                    const door = doors && doors.pop();
                    door && assert(door.rectangle).isObject();
                    door && assert(door.type).isInArray(doorTypes);
                    door && assert(door.locked).isBoolean();
                    door && assert(door.connections).equalsObject({
                        1: { direction: 'east', to: 2 },
                        2: { direction: 'west', to: 1 },
                    });
                });

                it('updates the grid with a correctly placed door cell', () => {
                    assert(grid[4][2]).equals(cellDoor);
                });
            });

            describe('given an existing connecting between the rooms', () => {
                it('returns an empty array', () => {
                    const { grid, rooms } = getRoomsForTest([ rect1, rect2 ], { connectionChance: 100 });
                    const existingDoors = getExtraDoors(grid, rooms, []);

                    assert(grid[4][2]).equals(cellDoor);
                    assert(getExtraDoors(grid, rooms, existingDoors)).equalsArray([]);
                });
            });
        });
    });

    describe('applyRoomToGrid()', () => {
        describe('given a room config without a roomNumber', () => {
            it('throws', () => {
                const grid = createBlankGrid({ width: 8, height: 6 });

                // @ts-expect-error
                assert(() => applyRoomToGrid(grid, { x: 1, y:1, width: 1, height: 1 }))
                    .throws('roomNumber is required in applyRoomToGrid()');
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

            const expectedCords = [
                { x: 2, y: 3 },
                { x: 2, y: 4 },
                { x: 3, y: 2 },
                { x: 3, y: 5 },
                { x: 4, y: 2 },
                { x: 4, y: 5 },
                { x: 5, y: 2 },
                { x: 5, y: 5 },
                { x: 6, y: 3 },
                { x: 6, y: 4 },
            ];

            const expectedCornerCords = [
                { x: 2, y: 2 },
                { x: 2, y: 5 },
                { x: 6, y: 2 },
                { x: 6, y: 5 },
            ];

            describe('when the room type is "room"', () => {
                const walls = applyRoomToGrid(grid, rect, 7);

                it('returns an array of wall cells', () => {
                    assert(walls).isArray();

                    walls && assert(walls.length).equals(10);
                    walls && expectedCords.forEach((cords) => {
                        assert(walls.shift()).equalsObject(cords);
                    });
                });

                it('updates the grid with correctly placed `cellWall` and `cellCornerWall` indicators', () => {
                    expectedCords.forEach(({ x, y }) => {
                        assert(grid[x][y]).equals(cellWall);
                    });

                    expectedCornerCords.forEach(({ x, y }) => {
                        assert(grid[x][y]).equals(cellCornerWall);
                    });
                });
            });
        });
    });

    describe('getRoomText()', () => {
        const rectangle = { x: 3, y: 3, width: 3, height: 2 };

        /** @type {AppliedRoom} */
        const room = {
            config: generatedRoomConfig,
            itemSet: { items: [], containers: [] },
            rectangle,
            roomNumber: 7,
            walls: [],
        };

        it('returns the room number', () => {
            assert(getRoomText(room).roomNumber).equals('7');
        });

        describe('when the room type is "room"', () => {
            it('the room label is undefined', () => {
                assert(getRoomText(room).roomLabel).isUndefined();
            });

            describe('when the width and height are at least `labelMinRoomWidth` & `labelMinRoomHeight`', () => {
                it('the room label is undefined', () => {
                    const roomTextWithLabelDimensions = getRoomText({
                        ...room,
                        rectangle: {
                            ...room.rectangle,
                            width: labelMinRoomWidth,
                            height: labelMinRoomHeight,
                        },
                    });

                    assert(roomTextWithLabelDimensions.roomLabel).isUndefined();
                });
            });
        });

        describe('when the room type is not "room"', () => {
            const libraryRoom = {
                ...room,
                config: {
                    ...room.config,
                    roomType: /** @type {RoomType} */ ('library'),
                },
            };

            describe('when the room width is less than `labelMinRoomWidth`', () => {
                it('the room label is undefined', () => {
                    const libraryRoomText = getRoomText({
                        ...libraryRoom,
                        rectangle: {
                            ...libraryRoom.rectangle,
                            width: labelMinRoomWidth - 1,
                            height: labelMinRoomHeight,
                        },
                    });

                    assert(libraryRoomText.roomLabel).isUndefined();
                });
            });

            describe('when the room height is less than `labelMinRoomHeight`', () => {
                it('the room label is undefined', () => {
                    const libraryRoomText = getRoomText({
                        ...libraryRoom,
                        rectangle: {
                            ...libraryRoom.rectangle,
                            width: labelMinRoomWidth,
                            height: labelMinRoomHeight - 1,
                        },
                    });

                    assert(libraryRoomText.roomLabel).isUndefined();
                });
            });

            describe('when the room width and height are equal to `labelMinRoomWidth` & `labelMinRoomHeight`', () => {
                it('the room label is included with the room rect', () => {
                    const libraryRoomText = getRoomText({
                        ...libraryRoom,
                        rectangle: {
                            ...libraryRoom.rectangle,
                            width: labelMinRoomWidth,
                            height: labelMinRoomHeight,
                        },
                    });

                    assert(libraryRoomText.roomLabel).equals('library');
                });
            });
        });
    });

    describe('getRoomDimensions()', () => {
        const gridDimensions = { width: 10, height: 6 };

        describe('given a room config with a missing room type', () => {
            it('throws', () => {
                // @ts-expect-error
                assert(() => getRoomDimensions(gridDimensions, { roomSize: 'small' }))
                    .throws('roomType is required in getRoomDimensions()');
            });
        });

        describe('given a room config with a missing room size', () => {
            it('throws', () => {
                // @ts-expect-error
                assert(() => getRoomDimensions(gridDimensions, { roomType: 'library' }))
                    .throws('roomSize is required in getRoomDimensions()');
            });
        });

        describe('given a room type which requires custom dimensions', () => {
            // TODO need to inject randomization for testing
            it('returns a room width and height ', () => {
                const dimensions = getRoomDimensions(gridDimensions, {
                    ...generatedRoomConfig,
                    roomType: 'hallway',
                });

                assert(dimensions.width).isNumber();
                assert(dimensions.height).isNumber();
            });
        });

        describe('given a room type which does not require custom dimensions', () => {
            it('returns a room width and height within the range specified for the room size', () => {
                const { min, max } = roomDimensionRanges.small;

                const { width, height } = getRoomDimensions(gridDimensions, {
                    ...generatedRoomConfig,
                    roomSize: 'small',
                });

                assert(width >= min && width <= max).isTrue();
                assert(height >= min && height <= max).isTrue();
            });
        });

        describe('when the room dimensions are larger than the grid dimensions', () => {
            it('returns a room width and height no larger than the grid width minus twice the wall size', () => {
                const gridWidth  = 5;
                const gridHeight = 5;

                const miniMapDimensions = { width: gridWidth, height: gridHeight };

                const { width, height } = getRoomDimensions(miniMapDimensions, {
                    ...generatedRoomConfig,
                    roomSize: 'massive',
                });

                assert(width <= (gridWidth - (wallSize * 2))).isTrue();
                assert(height <= (gridHeight - (wallSize * 2))).isTrue();
            });
        });
    });

    describe('procedurallyApplyRooms()', () => {
        describe('given three room configs', () => {
            const gridWidth  = 20;
            const gridHeight = 24;

            const grid = createBlankGrid({ width: gridWidth, height: gridHeight });

            /** @type {Room} */
            const room = {
                config: {
                    ...generatedRoomConfig,
                    roomSize: 'small',
                    roomType: 'room',
                },
                itemSet: { items: [], containers: [] },
                roomNumber: 1,
            };

            it('returns an object containing rooms and doors', () => {
                const { rooms, doors } = procedurallyApplyRooms(
                    {
                        width: gridWidth,
                        height: gridHeight,
                    }, [
                        { ...room },
                        { ...room, roomNumber: 2 },
                        { ...room, roomNumber: 3 },
                    ],
                    grid
                );

                assert(rooms).isArray();
                rooms && assert(rooms.length).equals(3);
                rooms && rooms.forEach((roomConfig) => {
                    assert(roomConfig).isObject();
                    roomConfig && assert(roomConfig.config).isObject();
                    roomConfig && assert(roomConfig.itemSet).isObject();
                    roomConfig && assert(roomConfig.rectangle).isObject();
                    roomConfig && assert(roomConfig.roomNumber).isNumber();
                    roomConfig && assert(roomConfig.walls).isArray();
                });

                assert(doors).isArray();
                doors && assert(doors.length).equals(3);

                doors && doors.forEach((doorConfig) => {
                    assert(doorConfig).isObject();
                    doorConfig && assert(doorConfig.connections).isObject();
                    doorConfig && assert(doorConfig.direction).isInArray(directions);
                    doorConfig && assert(doorConfig.locked).isBoolean();
                    doorConfig && assert(doorConfig.rectangle).isObject();
                    doorConfig && assert(doorConfig.type).isInArray(doorTypes);
                });
            });
        });
    });

    // -- Public Functions -----------------------------------------------------

    describe('generateMap()', () => {
        it('generates a map, rooms, and doors', () => {
            /** @type {GeneratedRoomConfig} */
            const roomConfig = {
                itemCondition        : 'average',
                itemQuantity         : 'one',
                itemRarity           : 'average',
                itemType             : 'miscellaneous',
                roomCondition        : 'average',
                roomCount            : 34,
                roomFurnitureQuantity: 'average',
                roomSize             : 'medium',
                roomType             : 'room',
            };

            const { map, rooms, doors } = generateMap({ width: 30, height: 24 }, generateRooms(roomConfig));

            assert(map).isString();
            assert(rooms).isArray();

            let lastRoomNumber = 0;

            rooms && rooms.forEach((room) => {
                assert(room.config).isObject();
                assert(room.itemSet).isObject();
                assert(room.rectangle).isObject();
                assert(room.roomNumber > lastRoomNumber).isTrue();
                assert(room.walls).isArray();
            });

            assert(doors).isArray();
            doors && doors.forEach((door) => {
                assert(door.type).isInArray(doorTypes);
            });
        });
    });

    describe('getGridAsText()', () => {
        describe('given a blank grid', () => {
            it('returns an string representing the grid', () => {
                const grid = createBlankGrid({ width: 3, height: 3 });
                assert(getGridAsText(grid)).equals('. . .\n. . .\n. . .');
            });
        });

        describe('given a grid with a room on it', () => {
            it('returns an string containing the walls, corners, room number, and blank cells', () => {
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
            it('returns an string representing the grid', () => {
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
            it('returns an string representing the grid', () => {
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
