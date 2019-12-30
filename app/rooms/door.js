
import { Probability } from '../utility/roll';

const door = {
    archway  : 'archway',
    concealed: 'concealed',
    hole     : 'hole',
    metal    : 'metal',
    passage  : 'passage',
    portal   : 'portal',
    secret   : 'secret',
    stone    : 'stone',
    wooden   : 'wooden',
};

export const outside = 'outside';

export const lockable = new Set([
    door.metal,
    door.stone,
    door.wooden,
]);

export const probability = new Probability([
    [ 30,  door.passage ],
    [ 50,  door.archway ],
    [ 65,  door.hole    ],
    [ 75,  door.wooden  ],
    [ 89,  door.metal   ],
    [ 99,  door.stone   ],
    [ 100, door.portal  ],
]);

export const secretProbability = new Probability([
    [ 10,  door.concealed ],
    [ 20,  door.secret ],
]);

export const list = Object.keys(door);

export default door;
