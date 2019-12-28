
import { Probability } from '../utility/roll';
import { random } from '../utility/random';

const type = {
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
    diningRoom: 'diningRoom',
    dormitory: 'dormitory',
    hall: 'hall',
    hallway: 'hallway',
    kitchen: 'kitchen',
    laboratory: 'laboratory',
    library: 'library',
    loft: 'loft',
    pantry: 'pantry',
    parlour: 'parlour',
    prison: 'prison',
    room: 'room',
    smithy: 'smithy',
    storeRoom: 'storeRoom',
    study: 'study',
    throneRoom: 'throneRoom',
    tortureChamber: 'tortureChamber',
    treasury: 'treasury',
};

export const probability = new Probability([
    [ 40,  type.hallway ],
    [ 65,  type.room    ],
    [ 100, random  ],
]);

export const list = Object.keys(type);

export default type;
