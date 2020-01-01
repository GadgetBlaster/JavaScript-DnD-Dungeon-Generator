
import { Probability } from '../utility/roll';

const door = {
    archway   : 'archway',
    brass     : 'brass',
    concealed : 'concealed',
    hole      : 'hole',
    iron      : 'iron',
    passageway: 'passageway',
    portal    : 'portal',
    portcullis: 'portcullis',
    secret    : 'secret',
    steel     : 'steel',
    stone     : 'stone',
    wooden    : 'wooden',
};

export default door;

export const list = Object.keys(door);

export const outside = 'outside';

export const appendDoorway = new Set([
    door.brass,
    door.iron,
    door.steel,
    door.stone,
    door.wooden,
]);

export const lockable = new Set([
    door.brass,
    door.iron,
    door.portcullis,
    door.steel,
    door.stone,
    door.wooden,
]);

export const probability = new Probability([
    [ 25,  door.passageway ],
    [ 45,  door.archway    ],
    [ 55,  door.hole       ],
    [ 60,  door.portcullis ],
    [ 70,  door.wooden     ],
    [ 80,  door.steel      ],
    [ 85,  door.iron       ],
    [ 90,  door.brass      ],
    [ 95,  door.stone      ],
    [ 100, door.portal     ],
]);

export const secretProbability = new Probability([
    [ 13, door.concealed ],
    [ 30, door.secret    ],
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
