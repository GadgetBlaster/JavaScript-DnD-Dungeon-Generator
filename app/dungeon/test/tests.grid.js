// @ts-check

import {
    // Config
    testCellEmpty as cellEmpty,
    wallSize,

    // Private Functions
    testGetRandomPoint as getRandomPoint,
    testIsEmptyCell    as isEmptyCell,
    testIsRoomCorner   as isRoomCorner,

    // Public functions
    createBlankGrid,
    getGridDimensions,
    getStartingPoint,
    getValidRoomConnections,
} from '../grid.js';

import {
    testCellCornerWall as cellCornerWall,
    testCellWall       as cellWall,
} from '../map.js';

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {

    // -- Private Functions ----------------------------------------------------

    describe('getRandomPoint()', () => {
        describe('given a direction of "north"', () => {
            it('returns an x coordinate within the minX & maxX, and the minY coordinate', () => {
                assert(getRandomPoint('north', { minX: 5, minY: 2, maxX: 5, maxY: 9 }))
                    .equalsObject({ x: 5, y: 2 });
            });

            describe('when minX and maxX has a rage', () => {
                it('returns an x coordinate within the range', () => {
                    let { x } = getRandomPoint('north', { minX: 5, minY: 2, maxX: 9, maxY: 2 });
                    assert(x >= 5 && x <= 9 ).isTrue();
                });
            });
        });

        describe('given a direction of "east"', () => {
            it('returns the maxX coordinate, and a y coordinate within the minY & maxY coordinate', () => {
                assert(getRandomPoint('east', { minX: 2, minY: 3, maxX: 5, maxY: 3 }))
                    .equalsObject({ x: 5, y: 3 });
            });

            describe('when minX and maxX has a rage', () => {
                it('returns a y coordinate within the range', () => {
                    let { y } = getRandomPoint('east', { minX: 5, minY: 2, maxX: 5, maxY: 8 });
                    assert(y >= 2 && y <= 8 ).isTrue();
                });
            });
        });

        describe('given a direction of "south"', () => {
            it('returns an x coordinate within the minX & maxX, and the maxY coordinate', () => {
                assert(getRandomPoint('south', { minX: 5, minY: 2, maxX: 5, maxY: 9 }))
                    .equalsObject({ x: 5, y: 9 });
            });

            describe('when minX and maxX has a rage', () => {
                it('returns an x coordinate within the range', () => {
                    let { x } = getRandomPoint('south', { minX: 5, minY: 2, maxX: 9, maxY: 2 });
                    assert(x >= 5 && x <= 9 ).isTrue();
                });
            });
        });

        describe('given a direction of "west"', () => {
            it('returns the minX coordinate, and a y coordinate within the minY & maxY coordinate', () => {
                assert(getRandomPoint('west', { minX: 2, minY: 3, maxX: 5, maxY: 3 }))
                    .equalsObject({ x: 2, y: 3 });
            });

            describe('when minX and maxX has a rage', () => {
                it('returns a y coordinate within the range', () => {
                    let { y } = getRandomPoint('west', { minX: 5, minY: 2, maxX: 5, maxY: 8 });
                    assert(y >= 2 && y <= 8 ).isTrue();
                });
            });
        });

        describe('given an invalid direction', () => {
            it('throws', () => {
                // @ts-expect-error
                assert(() => getRandomPoint('junk', { minX: 1, minY: 1, maxX: 2, maxY: 2}))
                    .throws('Invalid direction in getRandomPoint()');
            });
        });
    });

    describe('isEmptyCell()', () => {
        describe('given a 4 x 5 grid', () => {
            const gridWidth  = 4;
            const gridHeight = 5;

            const grid = createBlankGrid({ width: gridWidth, height: gridHeight });
            const rect = {
                x: 1,
                y: 1,
                width: 1,
                height: 1,
            };

            describe('given a 1 x 1 rectangle', () => {
                describe('when the rectangle is in bounds', () => {
                    it('returns true', () => {
                        assert(isEmptyCell(grid, rect)).isTrue();
                    });
                });

                describe('when the cell is out of bounds', () => {
                    [
                        { x: 0 },
                        { x: gridWidth - 1 },
                        { y: 0 },
                        { y: gridHeight - 1 },
                    ].forEach((rectCord) => {
                        it('returns false', () => {
                            assert(isEmptyCell(grid, { ...rect, ...rectCord })).isFalse();
                        });
                    });
                });

                describe('when the rectangle overlaps an occupied cell', () => {
                    it('returns false', () => {
                        const populatedGrid = createBlankGrid({ width: gridWidth, height: gridHeight });
                        populatedGrid[1][1] = cellWall;

                        assert(isEmptyCell(populatedGrid, rect)).isFalse();
                    });
                });
            });

            describe('given a 2 x 3 rectangle', () => {
                const rect2 = {
                    ...rect,
                    width: 2,
                    height: 3,
                };

                describe('when the rectangle is in bounds', () => {
                    it('returns true', () => {
                        assert(isEmptyCell(grid, rect2)).isTrue();
                    });
                });

                describe('when the cell is out of bounds', () => {
                    [
                        { x: 0 },
                        { x: gridWidth - 1 },
                        { y: 0 },
                        { y: gridHeight - 1 },
                    ].forEach((rectCord) => {
                        it('returns false', () => {
                            assert(isEmptyCell(grid, { ...rect2, ...rectCord })).isFalse();
                        });
                    });
                });

                describe('when the rectangle overlaps an occupied cell', () => {
                    it('returns false', () => {
                        const populatedGrid = createBlankGrid({ width: gridWidth, height: gridHeight });
                        populatedGrid[2][3] = cellWall;

                        assert(isEmptyCell(populatedGrid, rect2)).isFalse();
                    });
                });
            });
        });
    });

    describe('isRoomCorner()', () => {
        const minMax = {
            minX: 1,
            minY: 1,
            maxX: 20,
            maxY: 20,
        };

        describe('given coordinates that are the upper left corner wall', () => {
            it('returns true', () => {
                assert(isRoomCorner({
                    ...minMax,
                    x: minMax.minX + wallSize,
                    y: minMax.minY + wallSize,
                })).isTrue();
            });
        });

        describe('given coordinates that are the upper right corner wall', () => {
            it('returns true', () => {
                assert(isRoomCorner({
                    ...minMax,
                    x: minMax.maxX - wallSize,
                    y: minMax.minY + wallSize,
                })).isTrue();
            });
        });

        describe('given coordinates that are the lower right corner wall', () => {
            it('returns true', () => {
                assert(isRoomCorner({
                    ...minMax,
                    x: minMax.maxX - wallSize,
                    y: minMax.maxY - wallSize,
                })).isTrue();
            });
        });

        describe('given coordinates that are the lower left corner wall', () => {
            it('returns true', () => {
                assert(isRoomCorner({
                    ...minMax,
                    x: minMax.minX + wallSize,
                    y: minMax.maxY - wallSize,
                })).isTrue();
            });
        });

        describe('given coordinates that are not a corner', () => {
            it('returns false', () => {
                assert(isRoomCorner({
                    ...minMax,
                    x: 10,
                    y: 10,
                })).isFalse();
            });
        });
    });

    // -- Public Functions -----------------------------------------------------

    describe('createBlankGrid()', () => {
        describe('given a gridWidth and gridHeight', () => {
            it('returns a multidimensional array of empty grid cells for the given dimensions', () => {
                const grid = createBlankGrid({ width: 4, height: 3 });

                assert(grid).isArray();

                assert(grid.length).equals(4);

                grid.forEach((col) => {
                    assert(col).isArray();
                    col && assert(col.length).equals(3);
                });

                assert(grid.toString()).equals([
                    [ cellEmpty, cellEmpty, cellEmpty ],
                    [ cellEmpty, cellEmpty, cellEmpty ],
                    [ cellEmpty, cellEmpty, cellEmpty ],
                    [ cellEmpty, cellEmpty, cellEmpty ],
                ].toString());
            });
        });
    });

    describe('getGridDimensions()', () => {
        describe('given a 4 x 6 grid', () => {
            it('returns the correct dimensions', () => {
                assert(getGridDimensions(createBlankGrid({ width: 4, height: 6 })))
                    .equalsObject({ width: 4, height: 6 });
            });
        });
    });

    describe('getStartingPoint()', () => {
        const gridWidth  = 4;
        const gridHeight = 5;
        const grid = { width: gridWidth, height: gridHeight };

        describe('given a room that does not fit in the inset grid content area horizontally', () => {
            it('throws', () => {
                const room = {
                    // Inset grid width is `gridWidth - (wallSize * 2)` so a
                    // room with a `gridWidth - wallSize` width is too large.
                    width:  gridWidth - wallSize,
                    height: gridHeight - (wallSize * 2),
                };

                assert(() => getStartingPoint(grid, room))
                    .throws('Invalid gridWidth "4" in getStartingPoint()');
            });
        });

        describe('given a room that does not fit in the inset grid content area vertically', () => {
            it('throws', () => {
                const room = {
                    width:  gridWidth - (wallSize * 2),
                    // Inset grid height is `gridHeight - (wallSize * 2)` so a
                    // room with a `gridHeight - wallSize` height is too large.
                    height: gridHeight - wallSize,
                };

                assert(() => getStartingPoint(grid, room))
                    .throws('Invalid gridHeight "5" in getStartingPoint()');
            });
        });

        describe('given a room that fits in the inset grid content area', () => {
            it('returns grid coordinates along the edge of a wall', () => {
                const { x, y } = getStartingPoint(grid, { width: 1, height: 1 });

                assert(x).isNumber();
                assert(y).isNumber();

                assert(x >= wallSize && x <= (gridWidth  - wallSize));
                assert(y >= wallSize && y <= (gridHeight - wallSize));
            });
        });
    });

    describe('getValidRoomConnections()', () => {
        describe('given a 10 x 10 grid and two 1 x 1 rooms', () => {
            const grid           = createBlankGrid({ width: 10, height: 10 });
            const prevRoomRect   = { x: 4, y: 4, width: 1, height: 1 };
            const roomDimensions = { width: 1, height: 1 };

            // TODO use `addRoomToGrid()`
            grid[4][4] = 1;
            grid[3][3] = cellCornerWall;
            grid[4][3] = cellWall;
            grid[5][3] = cellCornerWall;
            grid[3][4] = cellWall;
            grid[5][4] = cellWall;
            grid[3][5] = cellCornerWall;
            grid[4][5] = cellWall;
            grid[5][5] = cellCornerWall;

            // v = validRoomConnection
            // w = cellWall
            // w = cellCornerWall
            // 1 = room

            //   0 1 2 3 4 5 6 7 8 9
            // 0 . . . . . . . . . .
            // 1 . . . . . . . . . .
            // 2 . . . . v . . . . .
            // 3 . . . c w c . . . .
            // 4 . . v w 1 w v . . .
            // 5 . . . c w c . . . .
            // 6 . . . . v . . . . .
            // 7 . . . . . . . . . .
            // 8 . . . . . . . . . .
            // 9 . . . . . . . . . .

            const expectedCords  = [
                { x: 2, y: 4 },
                { x: 4, y: 2 },
                { x: 4, y: 6 },
                { x: 6, y: 4 },
            ];

            it('returns an array of valid room connection coordinates', () => {
                const validCords = getValidRoomConnections(grid, roomDimensions, prevRoomRect);

                assert(validCords).isArray();

                assert(validCords.length).equals(expectedCords.length);
                validCords.forEach((cords, i) => {
                    assert(expectedCords[i]).isObject();
                    assert(cords).equalsObject(expectedCords[i]);
                });
            });
        });

        describe('given a 12 x 13 grid and 2 x 3 rooms', () => {
            const grid           = createBlankGrid({ width: 12, height: 13 });
            const prevRoomRect   = { x: 4, y: 5, width: 2, height: 3 };
            const roomDimensions = { width: 2, height: 3 };

            // TODO use `addRoomToGrid()`
            grid[4][5] = 1;
            grid[4][6] = 1;
            grid[4][7] = 1;
            grid[5][5] = 1;
            grid[5][6] = 1;
            grid[5][7] = 1;
            grid[3][4] = cellCornerWall;
            grid[4][4] = cellWall;
            grid[5][4] = cellWall;
            grid[6][4] = cellCornerWall;
            grid[3][5] = cellWall;
            grid[6][6] = cellWall;
            grid[3][6] = cellWall;
            grid[6][6] = cellWall;
            grid[3][7] = cellWall;
            grid[6][7] = cellWall;
            grid[3][8] = cellCornerWall;
            grid[4][8] = cellWall;
            grid[5][8] = cellWall;
            grid[6][8] = cellCornerWall;

            // v = validRoomConnection
            // w = cellWall
            // w = cellCornerWall
            // 1 = room

            //                      1 2 1
            //    0 1 2 3 4 5 6 7 8 9 0 1
            //  0 . . . . . . . . . . . .
            //  1 . . . v v v . . . . . .
            //  2 . . . . . . . . . . . .
            //  3 . v . . . . . v . . . .
            //  4 . v . c w w c v . . . .
            //  5 . v . w 1 1 w v . . . .
            //  6 . v . w 1 1 w v . . . .
            //  7 . v . w 1 1 w v . . . .
            //  8 . . . c w w c . . . . .
            //  9 . . . v v v . . . . . .
            // 10 . . . . . . . . . . . .
            // 11 . . . . . . . . . . . .
            // 12 . . . . . . . . . . . .

            const expectedCords  = [
                { x: 1, y: 3 },
                { x: 1, y: 4 },
                { x: 1, y: 5 },
                { x: 1, y: 6 },
                { x: 1, y: 7 },
                { x: 3, y: 1 },
                { x: 3, y: 9 },
                { x: 4, y: 1 },
                { x: 4, y: 9 },
                { x: 5, y: 1 },
                { x: 5, y: 9 },
                { x: 7, y: 3 },
                { x: 7, y: 4 },
                { x: 7, y: 5 },
                { x: 7, y: 6 },
                { x: 7, y: 7 },
            ];

            it('returns an array of valid room connection coordinates', () => {
                const validCords = getValidRoomConnections(grid, roomDimensions, prevRoomRect);

                assert(validCords).isArray();

                assert(validCords.length).equals(expectedCords.length);
                validCords.forEach((cords, i) => {
                    assert(expectedCords[i]).isObject();
                    assert(cords).equalsObject(expectedCords[i]);
                });
            });
        });

        describe('when a room is near the edges', () => {
            const grid           = createBlankGrid({ width: 10, height: 10 });
            const prevRoomRect   = { x: 3, y: 3, width: 2, height: 3 };
            const roomDimensions = { width: 3, height: 2 };

            // TODO use `addRoomToGrid()`
            grid[3][3] = 1;
            grid[4][3] = 1;
            grid[3][4] = 1;
            grid[4][4] = 1;
            grid[3][5] = 1;
            grid[4][5] = 1;
            grid[2][2] = cellCornerWall;
            grid[3][2] = cellWall;
            grid[4][2] = cellWall;
            grid[5][2] = cellCornerWall;
            grid[2][3] = cellWall;
            grid[5][3] = cellWall;
            grid[2][4] = cellWall;
            grid[5][4] = cellWall;
            grid[2][5] = cellWall;
            grid[5][5] = cellWall;
            grid[2][6] = cellCornerWall;
            grid[3][6] = cellWall;
            grid[4][6] = cellWall;
            grid[5][6] = cellCornerWall;

            // v = validRoomConnection
            // w = cellWall
            // w = cellCornerWall
            // 1 = room

            //
            //    0 1 2 3 4 5 6 7 8 9
            //  0 . . . . . . . . . .
            //  1 . . . . . . . . . .
            //  2 . . c w w c v . . .
            //  3 . . w 1 1 w v . . .
            //  4 . . w 1 1 w v . . .
            //  5 . . w 1 1 w v . . .
            //  6 . . c w w c . . . .
            //  7 . v v v v . . . . .
            //  8 . . . . . . . . . .
            //  9 . . . . . . . . . .

            const expectedCords  = [
                { x: 1, y: 7 },
                { x: 2, y: 7 },
                { x: 3, y: 7 },
                { x: 4, y: 7 },
                { x: 6, y: 2 },
                { x: 6, y: 3 },
                { x: 6, y: 4 },
                { x: 6, y: 5 },
            ];

            it('returns an array of valid room connection coordinates that account for the grid edges', () => {
                const validCords = getValidRoomConnections(grid, roomDimensions, prevRoomRect);

                assert(validCords).isArray();

                assert(validCords.length).equals(expectedCords.length);
                validCords.forEach((cords, i) => {
                    assert(expectedCords[i]).isObject();
                    assert(cords).equalsObject(expectedCords[i]);
                });
            });
        });
    });
};
