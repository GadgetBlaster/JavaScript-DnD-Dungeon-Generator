
import { Probability } from '../utility/roll';
import { random } from '../utility/random';

const type = {
    armory    : 'armory',
    atrium    : 'atrium',
    ballroom  : 'ballroom',
    bathhouse : 'bathhouse',
    bedroom   : 'bedroom',
    chamber   : 'chamber',
    dining    : 'dining',
    dormitory : 'dormitory',
    greatHall : 'greatHall',
    hallway   : 'hallway',
    kitchen   : 'kitchen',
    laboratory: 'laboratory',
    library   : 'library',
    pantry    : 'pantry',
    parlour   : 'parlour',
    prison    : 'prison',
    room      : 'room',
    shrine    : 'shrine',
    smithy    : 'smithy',
    storage   : 'storage',
    study     : 'study',
    throne    : 'throne',
    torture   : 'torture',
    treasury  : 'treasury',
};

export default type;

export const list = Object.keys(type);

export const appendRoomTypes = new Set([
    type.dining,
    type.shrine,
    type.storage,
    type.throne,
    type.torture,
]);

export const probability = new Probability([
    [ 40,  type.hallway ],
    [ 65,  type.room    ],
    [ 100, random  ],
]);
