
import { roll, rollArrayItem } from '../utility/roll';

export const wallSize = 1;

const sides = {
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

    if (maxX <= minX || maxY <= minY) {
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

export const getDoorStartingPoint = (grid, { x, y, width, height }) => {
    if (x === 1) {
        x--;
    } else if (x + width === (grid.length - 1)) {
        x += width;
    } else if (y === 1) {
        y--;
    } else if (y + height === (grid[0].length - 1)) {
        y += height;
    }

    return [ x, y ];
};