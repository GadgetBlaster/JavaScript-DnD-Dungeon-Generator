
import { lookup } from '/app/utility/config';

export const conditions = [
    'decaying',
    'busted',
    'poor',
    'average',
    'good',
    'exquisite',
];

export const condition = lookup(conditions);
