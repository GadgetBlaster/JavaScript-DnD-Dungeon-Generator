
import rarity from '../../attributes/rarity';
import type from '../type';

const defaults = {
    rarity: rarity.rare,
    type  : type.potion,
};

const config = [
    { name: 'Potion of healing' },
];

export default config.map((item) => ({ ...defaults, ...item }));
