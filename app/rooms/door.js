
import { Probability } from '../utility/roll';

const door = {
    archway   : 'archway',
    brass     : 'brass',
    concealed : 'concealed',
    hole      : 'hole',
    iron      : 'iron',
    passageway: 'passageway',
    portal    : 'portal',
    secret    : 'secret',
    steel     : 'steel',
    stone     : 'stone',
    wooden    : 'wooden',
};

export default door;

export const list = Object.keys(door);

export const outside = 'outside';

export const lockable = new Set([
    door.brass,
    door.iron,
    door.metal,
    door.steel,
    door.stone,
    door.wooden,
]);

export const probability = new Probability([
    [ 30,  door.passageway ],
    [ 50,  door.archway    ],
    [ 65,  door.hole       ],
    [ 75,  door.wooden     ],
    [ 89,  door.metal      ],
    [ 99,  door.stone      ],
    [ 100, door.portal     ],
]);

export const secretProbability = new Probability([
    [ 13,  door.concealed ],
    [ 30,  door.secret ],
]);

export const createDoorLookup = (doors) => {
    let lookup = {};

    doors.forEach((door) => {
        Object.keys(door.connections).forEach((roomNumber) => {
            if (!lookup[roomNumber]) {
                lookup[roomNumber] = [];
            }

            let roomDoor = {
                ...door,
                connection: door.connections[roomNumber],
            };

            lookup[roomNumber].push(roomDoor);
        });
    });

    return lookup;
};
