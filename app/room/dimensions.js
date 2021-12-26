// @ts-check

import roomType, { list as roomTypes } from './room.js';
import { roll } from '../utility/roll.js';
import size, { list as sizes } from '../attribute/size.js';

// -- Types --------------------------------------------------------------------

/** @typedef {[ number, number ]} RoomDimensions */

// -- Config -------------------------------------------------------------------

// TODO rename to not confuse "width" with x-axis
const hallLengthMin = 3;
const hallWidthMin  = 1;
const hallWidthMax  = 1;

let {
    tiny,
    small,
    medium,
    large,
    massive,
} = size;

/**
 * Dimension ranges
 *
 * @type {{ [key: string]: RoomDimensions }}
 */
export const dimensionRanges = {
    [tiny]   : [ 2, 3  ],
    [small]  : [ 2, 4  ],
    [medium] : [ 2, 5  ],
    [large]  : [ 3, 10 ],
    [massive]: [ 5, 15 ],
};

/**
 * Room sizes
 *
 * TODO make into Sets?
 *
 * @type {{ [key: string]: string[] }}
 */
const roomSizes = {
    [roomType.ballroom] : [ medium, large, massive ],
    [roomType.bathhouse]: [ small, medium, large, massive ],
    [roomType.dining]   : [ small, medium, large, massive ],
    [roomType.dormitory]: [ medium, large, massive ],
    [roomType.greatHall]: [ large, massive ],
    [roomType.pantry]   : [ tiny, small, medium ],
    [roomType.parlour]  : [ tiny, small, medium ],
    [roomType.study]    : [ tiny, small, medium ],
    [roomType.throne]   : [ medium, large, massive ],
    [roomType.torture]  : [ tiny, small, medium ],
};

/**
 * Custom room dimensions
 *
 * @type {{
 *     hallway: (roomSize: string, options?: { isHorizontal?: boolean }) => RoomDimensions
 * }}
 */
export const customDimensions = {
    // TODO see below
    hallway: (roomSize, { isHorizontal = roll() } = {}) => {
        let [ min, max ] = dimensionRanges[roomSize];

        let length = roll(Math.max(hallLengthMin, min), max);
        let width  = roll(hallWidthMin, hallWidthMax);

        let roomWidth  = isHorizontal ? length : width;
        let roomHeight = isHorizontal ? width  : length;

        // TODO return an array or update RoomDimensions to object?
        return { roomWidth, roomHeight };
    },
};

/**
 * Room sizes by room roomType.
 *
 * All room sizes are returned if the room type is not limited to a sub-set of
 * sizes defined in `roomSizes`.
 *
 * Rename to `roomSizesByType` & combine with constant object
 *
 * @type {{ [key: string]: string[] }}
 */
export const roomTypeSizes = roomTypes.reduce((obj, roomType) => {
    obj[roomType] = roomSizes[roomType] || sizes;

    return obj;
}, {});

export {
    hallLengthMin as testHallLengthMin,
    hallWidthMin  as testHallWidthMin,
    hallWidthMax  as testHallWidthMax,
};
