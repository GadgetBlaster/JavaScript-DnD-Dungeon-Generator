
import size, { list as sizes } from '../attributes/size';
import type, { list as roomTypes } from './type';

let {
    tiny,
    small,
    medium,
    large,
    massive,
} = size;

export const dimensionRanges = {
    [tiny]   : [ 1, 2 ],
    [small]  : [ 1, 4 ],
    [medium] : [ 2, 5 ],
    [large]  : [ 3, 8 ],
    [massive]: [ 4, 10 ],
};

const roomSizes = {
    ballroom      : [ medium, large, massive ],
    bathhouse     : [ small, medium, large, massive ],
    chapel        : [ small, medium, large, massive ],
    classroom     : [ small, medium, large ],
    closet        : [ tiny, small ],
    diningRoom    : [ small, medium, large, massive ],
    dormitory     : [ medium, large, massive ],
    hallway       : [ tiny, small, medium ],
    pantry        : [ tiny, small, medium ],
    parlour       : [ tiny, small, medium ],
    study         : [ tiny, small, medium ],
    throneRoom    : [ medium, large, massive ],
    tortureChamber: [ tiny, small, medium ],
};

const customDimensions = {
    // hallway: (size) => size,
};

export const roomTypeSizes = roomTypes.reduce((obj, type) => {
    let validSizes = roomSizes[type] || sizes;

    obj[type] = validSizes;

    return obj;
}, {});
