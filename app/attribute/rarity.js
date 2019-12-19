
import { lookup } from '/app/utility/config';

export const rarities = [
    'abundant',
    'common',
    'uncommon',
    'average',
    'rare',
    'exotic',
    'legendary',
];

export const rarity = lookup(rarities);
