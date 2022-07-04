// @ts-check

import { roll } from '../utility/roll.js';
import { roomTypes } from './room.js';
import { sizes } from '../attribute/size.js';

// -- Type Imports -------------------------------------------------------------

/** @typedef {import('../attribute/size').Size} Size */
/** @typedef {import('../dungeon/grid.js').Dimensions} Dimensions */
/** @typedef {import('./room.js').RoomType} RoomType */
/** @typedef {import('../utility/tools.js').Range} Range */

// -- Config -------------------------------------------------------------------

// TODO rename to not confuse "width" with x-axis
const hallLengthMin = 3;
const hallWidthMin  = 1;
const hallWidthMax  = 1;

/**
 * Dimension ranges
 *
 * @type {Readonly<{ [key in Size]: Range }>}
 */
export const roomDimensionRanges = Object.freeze({
    tiny    : { min: 2, max: 3  },
    small   : { min: 2, max: 4  },
    medium  : { min: 2, max: 5  },
    large   : { min: 3, max: 10 },
    massive : { min: 5, max: 15 },
});

/**
 * A lookup of room sizes by room types.
 *
 * Room types which are not included in the lookup can be of any size.
 *
 * TODO make into Sets?
 *
 * @type {{ [key in RoomType]?: Size[] }}
 */
const roomSizes = Object.freeze({
    ballroom  : [ 'medium', 'large', 'massive' ],
    bathhouse : [ 'small', 'medium', 'large', 'massive' ],
    dining    : [ 'small', 'medium', 'large', 'massive' ],
    dormitory : [ 'medium', 'large', 'massive' ],
    greatHall : [ 'large', 'massive' ],
    pantry    : [ 'tiny', 'small', 'medium' ],
    parlour   : [ 'tiny', 'small', 'medium' ],
    study     : [ 'tiny', 'small', 'medium' ],
    throne    : [ 'medium', 'large', 'massive' ],
    torture   : [ 'tiny', 'small', 'medium' ],
});

/**
 * A lookup of custom room dimension functions.
 *
 * @type {{
 *     hallway: (roomSize: Size, options?: { isHorizontal?: boolean }) => Dimensions
 * }}
 */
export const customDimensions = {
    hallway: (roomSize, { isHorizontal = roll() } = {}) => {
        let { min, max } = roomDimensionRanges[roomSize];

        let length = roll(Math.max(hallLengthMin, min), max);
        let width  = roll(hallWidthMin, hallWidthMax);

        let hallWidth  = isHorizontal ? length : width;
        let hallHeight = isHorizontal ? width  : length;

        return {
            width: hallWidth,
            height: hallHeight,
        };
    },
};

/**
 * Room sizes by room RoomType.
 *
 * All room sizes are returned if the room type is not limited to a sub-set of
 * sizes defined in `roomSizes`.
 *
 * Rename to `roomSizesByType` & combine with constant object
 *
 * @type {{ RoomType: Size[] }}
 */
export const roomTypeSizes = roomTypes.reduce((obj, roomType) => {
    obj[roomType] = roomSizes[roomType] || sizes;

    return obj;
}, /** @type {{ RoomType: Size[] }} */ ({}));

export {
    hallLengthMin as testHallLengthMin,
    hallWidthMax  as testHallWidthMax,
    hallWidthMin  as testHallWidthMin,
    roomSizes     as testRoomSizes,
};
