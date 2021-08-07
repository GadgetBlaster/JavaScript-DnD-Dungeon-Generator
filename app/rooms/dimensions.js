// @ts-check

import { list as roomTypes } from './type.js';
import { roll } from '../utility/roll.js';
import size, { list as sizes } from '../attributes/size.js';
import type from './type.js';

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
    [type.ballroom] : [ medium, large, massive ],
    [type.bathhouse]: [ small, medium, large, massive ],
    [type.dining]   : [ small, medium, large, massive ],
    [type.dormitory]: [ medium, large, massive ],
    [type.greatHall]: [ large, massive ],
    [type.pantry]   : [ tiny, small, medium ],
    [type.parlour]  : [ tiny, small, medium ],
    [type.study]    : [ tiny, small, medium ],
    [type.throne]   : [ medium, large, massive ],
    [type.torture]  : [ tiny, small, medium ],
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
 * Room sizes by room type.
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
