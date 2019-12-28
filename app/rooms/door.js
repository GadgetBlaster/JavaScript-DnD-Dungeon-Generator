
import { Probability } from '../utility/roll';

const door = {
    archway: 'archway',
    hole   : 'hole',
    metal  : 'metal',
    opening: 'opening',
    portal : 'portal',
    stone  : 'stone',
    wood   : 'wood',
};

export const lockable = new Set([
    door.metal,
    door.stone,
    door.wood,
]);

export const probability = new Probability([
    [ 30,  door.opening ],
    [ 50,  door.archway ],
    [ 65,  door.hole    ],
    [ 75,  door.wood    ],
    [ 89,  door.metal   ],
    [ 99,  door.stone   ],
    [ 100, door.portal  ],
]);

export const list = Object.keys(door);

export default door;
