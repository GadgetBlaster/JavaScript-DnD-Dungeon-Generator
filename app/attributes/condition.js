
import { createProbability } from '../utility/roll.js';

const condition = {
    decaying : 'decaying',
    busted   : 'busted',
    poor     : 'poor',
    average  : 'average',
    good     : 'good',
    exquisite: 'exquisite',
};

export default condition;

export const list = Object.keys(condition);

let {
    decaying,
    busted,
    poor,
    average,
    good,
    exquisite,
} = condition;

export const probability = createProbability([
    [ 50,  average   ],
    [ 60,  good      ],
    [ 75,  poor      ],
    [ 85,  busted    ],
    [ 95,  decaying  ],
    [ 100, exquisite ],
]);
