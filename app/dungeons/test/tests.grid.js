// @ts-check

import {
    // Config
    cellBlank,
    cellCornerWall,
    cellWall,
    wallSize,

    // Private Functions
    testIsRoomCorner as isRoomCorner,
    testCheckArea as checkArea,

    // Public functions
    createBlankGrid,
    getStartingPoint,
    getValidRoomCords,
} from '../grid.js';

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {

    // -- Private Functions ----------------------------------------------------

    describe('isRoomCorner()', () => {
        const minMax = {
            minX: 1,
            minY: 1,
            maxX: 20,
            maxY: 20,
        };

        describe('given coordinates that are the upper left corner wall', () => {
            it('should return true', () => {
                assert(isRoomCorner({
                    ...minMax,
                    x: minMax.minX + wallSize,
                    y: minMax.minY + wallSize,
                })).isTrue();
            });
        });

        describe('given coordinates that are the upper right corner wall', () => {
            it('should return true', () => {
                assert(isRoomCorner({
                    ...minMax,
                    x: minMax.maxX - wallSize,
                    y: minMax.minY + wallSize,
                })).isTrue();
            });
        });

        describe('given coordinates that are the lower right corner wall', () => {
            it('should return true', () => {
                assert(isRoomCorner({
                    ...minMax,
                    x: minMax.maxX - wallSize,
                    y: minMax.maxY - wallSize,
                })).isTrue();
            });
        });

        describe('given coordinates that are the lower left corner wall', () => {
            it('should return true', () => {
                assert(isRoomCorner({
                    ...minMax,
                    x: minMax.minX + wallSize,
                    y: minMax.maxY - wallSize,
                })).isTrue();
            });
        });

        describe('given coordinates that are not a corner', () => {
            it('should return false', () => {
                assert(isRoomCorner({
                    ...minMax,
                    x: 10,
                    y: 10,
                })).isFalse();
            });
        });
    });

    describe('checkArea()', () => {
        describe('given a 4 x 5 grid', () => {
            const gridWidth  = 4;
            const gridHeight = 5;

            const grid = createBlankGrid({ gridWidth, gridHeight });
            const rect = {
                x: 1,
                y: 1,
                width: 1,
                height: 1,
            };

            describe('given a 1 x 1 rectangle', () => {
                describe('when the rectangle is in bounds', () => {
                    it('should return true', () => {
                        assert(checkArea(grid, rect)).isTrue();
                    });
                });

                describe('when the cell is out of bounds', () => {
                    [
                        { x: 0 },
                        { x: gridWidth - 1 },
                        { y: 0 },
                        { y: gridHeight - 1 },
                    ].forEach((rectCord) => {
                        it('should return false', () => {
                            assert(checkArea(grid, { ...rect, ...rectCord })).isFalse();
                        });
                    });
                });

                describe('when the rectangle overlaps an occupied cell', () => {
                    it('should return false', () => {
                        const populatedGrid = createBlankGrid({ gridWidth, gridHeight });
                        populatedGrid[1][1] = cellWall;

                        assert(checkArea(populatedGrid, rect)).isFalse();
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
                    it('should return true', () => {
                        assert(checkArea(grid, rect2)).isTrue();
                    });
                });

                describe('when the cell is out of bounds', () => {
                    [
                        { x: 0 },
                        { x: gridWidth - 1 },
                        { y: 0 },
                        { y: gridHeight - 1 },
                    ].forEach((rectCord) => {
                        it('should return false', () => {
                            assert(checkArea(grid, { ...rect2, ...rectCord })).isFalse();
                        });
                    });
                });

                describe('when the rectangle overlaps an occupied cell', () => {
                    it('should return false', () => {
                        const populatedGrid = createBlankGrid({ gridWidth, gridHeight });
                        populatedGrid[2][3] = cellWall;

                        assert(checkArea(populatedGrid, rect2)).isFalse();
                    });
                });
            });
        });
    });

    // -- Public Functions -----------------------------------------------------

    describe('createBlankGrid()', () => {
        describe('given a gridWidth and gridHeight', () => {
            it('returns a multidimensional array of empty grid cells for the given dimensions', () => {
                const grid = createBlankGrid({ gridWidth: 4, gridHeight: 3 });

                assert(grid).isArray();

                grid && assert(grid.length).equals(4);

                grid && grid.forEach((col) => {
                    assert(col).isArray();
                    col && assert(col.length).equals(3);
                });

                grid && assert(grid.toString()).equals([
                    [ cellBlank, cellBlank, cellBlank ],
                    [ cellBlank, cellBlank, cellBlank ],
                    [ cellBlank, cellBlank, cellBlank ],
                    [ cellBlank, cellBlank, cellBlank ],
                ].toString());
            });
        });
    });

    describe('getStartingPoint()', () => {
        const gridWidth  = 4;
        const gridHeight = 5;

        describe('given a room that does not fit in the inset grid content area', () => {
            it('should throw', () => {
                const grid = { gridWidth, gridHeight };
                const room = {
                    roomWidth:  gridWidth  - wallSize,
                    roomHeight: gridHeight - wallSize,
                };

                assert(() => getStartingPoint(grid, room)).throws('Invalid min or max');
            });
        });

        describe('given a room that fits in the inset grid content area', () => {
            it('should return grid coordinates along the edge of a wall', () => {
                const grid = { gridWidth, gridHeight };
                const room = { roomWidth: 1, roomHeight: 1 };

                const [ x, y ] = getStartingPoint(grid, room);

                assert(x).isNumber();
                assert(y).isNumber();

                assert(x === wallSize || x === (gridWidth  - wallSize));
                assert(y === wallSize || y === (gridHeight - wallSize));
            });
        });
    });

    describe('getValidRoomCords()', () => {
        describe('given a 10 x 10 grid and 1 x 1 rooms', () => {
            const grid           = createBlankGrid({ gridWidth: 10, gridHeight: 10 });
            const prevRoom       = { x: 4, y: 4, width: 1, height: 1 };
            const roomDimensions = { roomWidth: 1, roomHeight: 1 };

            // TODO use `addRoomToGrid()`
            grid[4][4] = '1';
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
                [ 2, 4 ],
                [ 4, 2 ],
                [ 4, 6 ],
                [ 6, 4 ],
            ];

            it('should return an array of valid room connection coordinates', () => {
                const validCords = getValidRoomCords(grid, prevRoom, roomDimensions);

                assert(validCords).isArray();

                validCords && assert(validCords.length).equals(expectedCords.length);
                validCords && validCords.forEach((cords, i) => {
                    assert(expectedCords[i]).isArray();
                    expectedCords[i] && assert(cords).equalsArray(expectedCords[i]);
                });
            });
        });

        describe('given a 12 x 13 grid and 2 x 3 rooms', () => {
            const grid           = createBlankGrid({ gridWidth: 12, gridHeight: 13 });
            const prevRoom       = { x: 4, y: 5, width: 2, height: 3 };
            const roomDimensions = { roomWidth: 2, roomHeight: 3 };

            // TODO use `addRoomToGrid()`
            grid[4][5] = '1';
            grid[4][6] = '1';
            grid[4][7] = '1';
            grid[5][5] = '1';
            grid[5][6] = '1';
            grid[5][7] = '1';
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
                [ 1, 3 ],
                [ 1, 4 ],
                [ 1, 5 ],
                [ 1, 6 ],
                [ 1, 7 ],
                [ 3, 1 ],
                [ 3, 9 ],
                [ 4, 1 ],
                [ 4, 9 ],
                [ 5, 1 ],
                [ 5, 9 ],
                [ 7, 3 ],
                [ 7, 4 ],
                [ 7, 5 ],
                [ 7, 6 ],
                [ 7, 7 ],
            ];

            it('should return an array of valid room connection coordinates', () => {
                const validCords = getValidRoomCords(grid, prevRoom, roomDimensions);

                assert(validCords).isArray();

                validCords && assert(validCords.length).equals(expectedCords.length);
                validCords && validCords.forEach((cords, i) => {
                    assert(expectedCords[i]).isArray();
                    expectedCords[i] && assert(cords).equalsArray(expectedCords[i]);
                });
            });
        });

        describe('when a room is near the edges', () => {
            const grid           = createBlankGrid({ gridWidth: 10, gridHeight: 10 });
            const prevRoom       = { x: 3, y: 3, width: 2, height: 3 };
            const roomDimensions = { roomWidth: 3, roomHeight: 2 };

            // TODO use `addRoomToGrid()`
            grid[3][3] = '1';
            grid[4][3] = '1';
            grid[3][4] = '1';
            grid[4][4] = '1';
            grid[3][5] = '1';
            grid[4][5] = '1';
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
                [ 1, 7 ],
                [ 2, 7 ],
                [ 3, 7 ],
                [ 4, 7 ],
                [ 6, 2 ],
                [ 6, 3 ],
                [ 6, 4 ],
                [ 6, 5 ],
            ];

            it('should return an array of valid room connection coordinates that account for the grid edges', () => {
                const validCords = getValidRoomCords(grid, prevRoom, roomDimensions);

                assert(validCords).isArray();

                validCords && assert(validCords.length).equals(expectedCords.length);
                validCords && validCords.forEach((cords, i) => {
                    assert(expectedCords[i]).isArray();
                    expectedCords[i] && assert(cords).equalsArray(expectedCords[i]);
                });
            });
        });
    });
};
