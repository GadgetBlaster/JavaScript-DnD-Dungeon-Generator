
import size from '../attributes/size';
import type, { list as roomTypes } from './type';

let {
    tiny,
    small,
    medium,
    large,
    massive,
} = size;

export const dimensions = {
    [tiny]   : [ 1, 2 ],
    [small]  : [ 1, 4 ],
    [medium] : [ 2, 5 ],
    [large]  : [ 3, 8 ],
    [massive]: [ 4, 10 ],
};

armory: 'armory',
atrium: 'atrium',
attic: 'attic',
ballroom: 'ballroom',
bathhouse: 'bathhouse',
bedroom: 'bedroom',
chamber: 'chamber',
chapel: 'chapel',
classroom: 'classroom',
closet: 'closet',
diningRoom: 'dining room',
dormitory: 'dormitory',
hall: 'hall',
hallway: 'hallway',
kitchen: 'kitchen',
laboratory: 'laboratory',
library: 'library',
loft: 'loft',
pantry: 'pantry',
parlour: 'parlour',
prisonCell: 'prison cell',
room: 'room',
smithy: 'smithy',
store: 'store',
study: 'study',
throneRoom: 'throne room',
tortureChamber: 'torture chamber',
treasury: 'treasury',