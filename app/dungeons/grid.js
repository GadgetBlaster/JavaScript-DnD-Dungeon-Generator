
import { roll, rollArrayItem } from '../utility/roll';

export const wallSize = 1;

export const cellBlank = '.';
export const cellWall  = 'w';
export const cellDoor  = 'd';

export const sides = {
    top   : 'top',
    right : 'right',
    bottom: 'bottom',
    left  : 'left',
};

export const getStartingPoint = ({ gridWidth, gridHeight }, { roomWidth, roomHeight }) => {
    let side = rollArrayItem(Object.values(sides));

    let minX = wallSize;
    let minY = wallSize;
    let maxX = gridWidth - roomWidth - wallSize;
    let maxY = gridHeight - roomHeight - wallSize;

    if (maxX < minX || maxY < minY) {
        console.log(minX, maxX, minY, maxY);
        throw 'Min max error in getStartingPoint';
    }

    let x;
    let y;

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
};

const checkArea = (grid, { x, y, width, height }) => {
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
};

const isRoomCorner = ({ x, y, minX, minY, maxX, maxY }) => {
    let minLeft   = minX + wallSize;
    let minTop    = minY + wallSize;
    let minBottom = maxY - wallSize;
    let minRight  = maxX - wallSize;

    let upperLeft  = x <= minLeft  && y <= minTop;
    let upperRight = x >= minRight && y <= minTop;
    let lowerRight = x >= minRight && y >= minBottom;
    let lowerLeft  = x <= minLeft  && y >= minBottom;

    return upperLeft || upperRight || lowerRight || lowerLeft;
};

export const getValidRoomCords = (grid, prevRoom, { roomWidth, roomHeight }) => {
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
};
