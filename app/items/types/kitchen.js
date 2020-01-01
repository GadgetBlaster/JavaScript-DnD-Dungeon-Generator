
import rarity from '../../attributes/rarity';
import type from '../type';

let { abundant, common, uncommon } = rarity;

const defaults = {
    rarity: abundant,
    type  : type.kitchen,
};

const config = [
    { name: 'Cutting board' },
    { name: 'Fork' },
    { name: 'Kitchen knife' },
    { name: 'Ladle', rarity: common },
    { name: 'Mess kit' },
    { name: 'Pan, iron' },
    { name: 'Pot, iron' },
    { name: 'Soap', rarity: uncommon },
    { name: 'Spoon' },
    { name: 'Steak knife' },
];

export default config.map((item) => ({ ...defaults, ...item }));
