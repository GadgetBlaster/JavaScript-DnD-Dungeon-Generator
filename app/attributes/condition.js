
import { Probability } from '../utility/roll';

const condition = {
    decaying: 'decaying',
    busted: 'busted',
    poor: 'poor',
    average: 'average',
    good: 'good',
    exquisite: 'exquisite',
};

let {
    decaying,
    busted,
    poor,
    average,
    good,
    exquisite,
} = condition;

export const list = Object.keys(condition);

export const probability = new Probability([
    [ 50,  average   ],
    [ 60,  good      ],
    [ 75,  poor      ],
    [ 85,  busted    ],
    [ 95,  decaying  ],
    [ 100, exquisite ],
]);

export default condition;
