
import rarity from '../../attributes/rarity';
import type from '../type';

const defaults = { 
    rarity: rarity.abundant,
    type: type.kitchen,
};

const config = [
    { name: 'Mess kit' },
    { name: 'Pot, iron' },
    { name: 'Soap' },
];

export default config.map((item) => ({ ...defaults, ...item }));
