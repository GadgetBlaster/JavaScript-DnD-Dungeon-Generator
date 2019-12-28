
import { Probability } from '../utility/roll';
import { random } from '../utility/random';

const type = {
    armory: 'armory',
    atrium: 'atrium',
    ballroom: 'ballroom',
    bathhouse: 'bathhouse',
    bedroom: 'bedroom',
    chamber: 'chamber',
    diningRoom: 'diningRoom',
    dormitory: 'dormitory',
    greatHall: 'greatHall',
    hallway: 'hallway',
    kitchen: 'kitchen',
    laboratory: 'laboratory',
    library: 'library',
    loft: 'loft',
    pantry: 'pantry',
    parlour: 'parlour',
    prison: 'prison',
    room: 'room',
    shrineRoom: 'shrineRoom',
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
