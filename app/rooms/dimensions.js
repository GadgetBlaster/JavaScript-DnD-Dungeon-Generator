
import { list as roomTypes } from './type';
import { roll } from '../utility/roll';
import size, { list as sizes } from '../attributes/size';
import type from './type';

let {
    tiny,
    small,
    medium,
    large,
    massive,
} = size;

const hallLengthMin = 3;
const hallWidthMin  = 1;
const hallWidthMax  = 1;

export const dimensionRanges = {
    [tiny]   : [ 2, 3  ],
    [small]  : [ 2, 4  ],
    [medium] : [ 2, 5  ],
    [large]  : [ 3, 10 ],
    [massive]: [ 5, 18 ],
};

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

export const customDimensions = {
    hallway: (roomSize) => {
        let [ min, max ] = dimensionRanges[roomSize];

        let isHorizontal = roll();

        let length = roll(Math.max(hallLengthMin, min), max);
        let width  = roll(hallWidthMin, hallWidthMax);

        let roomWidth  = isHorizontal ? length : width;
        let roomHeight = isHorizontal ? width  : length;

        return { roomWidth, roomHeight };
    },
};

export const roomTypeSizes = roomTypes.reduce((obj, type) => {
    let validSizes = roomSizes[type] || sizes;

    obj[type] = validSizes;

    return obj;
}, {});
