// @ts-check

import { roll, rollArrayItem } from '../utility/roll.js';

// -- Types --------------------------------------------------------------------

/**
 * A multidimensional array of grid cells, procedurally populated with rooms
 * connected by doors.
 *
 * @typedef {string[][]} Grid
 */

/**
 * @typedef GridCoordinates
 *
 * @property {number} gridX
 * @property {number} gridY
 */

/**
 * @typedef GridDimensions
 *
 * @property {number} gridWidth
 * @property {number} gridHeight
 */

/**
 * @typedef {GridCoordinates & GridDimensions} GridRectangle
 */

// -- Config -------------------------------------------------------------------

export const wallSize = 1;

// TODO mve to map.js?
export const cellBlank      = '.'; // TODO rename to cellEmpty
export const cellWall       = 'w';
export const cellDoor       = 'd';
export const cellCornerWall = 'c';

export const cellFeet = 5;

// TODO replace with directions
export const sides = {
    top   : 'top',
    right : 'right',
    bottom: 'bottom',
    left  : 'left',
};

// -- Private Functions --------------------------------------------------------

/**
 * Checks if the given coordinates are the corner wall of the previous room?
 *
 * @private
 *
 * @param {object} param // TODO
 *
 * @returns {boolean}
 */
function isRoomCorner({ x, y, minX, minY, maxX, maxY }) {
    let minLeft   = minX + wallSize;
    let minTop    = minY + wallSize;
    let minBottom = maxY - wallSize;
    let minRight  = maxX - wallSize;

    let upperLeft  = x <= minLeft  && y <= minTop;
    let upperRight = x >= minRight && y <= minTop;
    let lowerRight = x >= minRight && y >= minBottom;
    let lowerLeft  = x <= minLeft  && y >= minBottom;

    return upperLeft || upperRight || lowerRight || lowerLeft;
}

/**
 * Checks if a grid cell can become part of a room shape.
 *
 * TODO rename isEmptyGridCell()
 *
 * @private
 *
 * @param {Grid} grid
 * @param {GridRectangle} rectangle // TODO fix params
 *
 * @returns boolean
 */
function checkArea(grid, { x, y, width, height }) {
    let minX = wallSize;
    let minY = wallSize;
    let maxX = grid.length - wallSize;
    let maxY = grid[0].length - wallSize;

    for (let xCord = x; xCord < (x + width); xCord++) {
        for (let yCord = y; yCord < (y + height); yCord++) {
            if (xCord < minX || xCord >= maxX) {
                return false;
            }

            if (yCord < minY || yCord >= maxY) {
                return false;
            }

            if (grid[xCord][yCord] !== cellBlank) {
                return false;
            }
        }
    }

    return true;
}

export {
    isRoomCorner as testIsRoomCorner,
    checkArea    as testCheckArea,
};

// -- Public Functions ---------------------------------------------------------

/**
 * Returns a multi dimensional array of empty grid cells for the given grid
 * dimensions.
 *
 * @param {GridDimensions} gridDimensions
 *
 * @returns {Grid}
 */
export const createBlankGrid = ({ gridWidth, gridHeight }) =>
    Array(gridWidth).fill(null).map(() =>
        Array(gridHeight).fill(cellBlank));

/**
 * Returns a random starting point for the dungeon door along one of the grid
 * edges.
 *
 * @param {GridDimensions} gridDimensions
 * @param {GridDimensions} roomDimensions
 *
 * @returns {number[]} // TODO GridCoordinates
 */
export function getStartingPoint({ gridWidth, gridHeight }, { roomWidth, roomHeight }) {
    let minX = wallSize;
    let minY = wallSize;
    let maxX = gridWidth  - roomWidth  - wallSize;
    let maxY = gridHeight - roomHeight - wallSize;

    if (maxX < minX || maxY < minY) {
        throw new TypeError('Invalid min or max');
    }

    let x;
    let y;

    // TODO inject randomization
    let side = rollArrayItem(Object.values(sides));

    switch (side) {
        case sides.right:
            x = maxX;
            y = roll(minY, maxY);
            break;

        case sides.bottom:
            x = roll(minX, maxX);
            y = maxY;
            break;

        case sides.left:
            x = minX;
            y = roll(minY, maxY);
            break;

        case sides.top:
        default:
            x = roll(minX, maxX);
            y = minY;
            break;
    }

    return [ x, y ];
}

/**
 * Returns valid room coordinates.
 *
 * TODO rename getValidRoomConnectionCords
 *
 * @param {Grid} grid
 * @param {GridRectangle} prevRoom
 * @param {GridDimensions} roomDimensions // RooMDimensions
 *
 * @returns {number[][]} // TODO GridCoordinates[]
 */
export function getValidRoomCords(grid, prevRoom, { roomWidth, roomHeight }) {
    let {
        x: prevX,
        y: prevY,
        width: prevWidth,
        height: prevHeight,
    } = prevRoom;

    let minX = prevX - roomWidth - wallSize;
    let minY = prevY - roomHeight - wallSize;
    let maxX = prevX + prevWidth + wallSize;
    let maxY = prevY + prevHeight + wallSize;

    let validCords = [];

    for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
            if (isRoomCorner({ x, y, minX, minY, maxX, maxY })) {
                continue;
            }

            let valid = checkArea(grid, {
                x, y,
                width: roomWidth,
                height: roomHeight,
            });

            if (!valid) {
                continue;
            }

            validCords.push([ x, y ]);
        }
    }

    return validCords;
}
