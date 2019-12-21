
import rarity from '../../attributes/rarity';
import type from '../type';

const defaults = { 
    rarity: rarity.abundant,
    type: type.furnishing,
};

const config = [
    { name: 'Lamp' },
    { name: 'Mess kit' },
];

export default config.map((item) => ({ ...defaults, ...item }));
