
import rarity from '../../attributes/rarity';
import type from '../type';

let { legendary } = rarity;

const defaults = {
    rarity: legendary,
    type  : type.treasure,
};

const config = [
    { name: 'Treasure' },
];

export default config.map((item) => ({ ...defaults, ...item }));
