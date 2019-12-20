
import rarity from '../attribute/rarity';

const defaults = { 
    rarity: rarity.abundant,
};

const config = [
    { name: 'Clothes, common' },
    { name: 'Clothes, costume' },
    { name: 'Clothes, fine' },
    { name: 'Clothes, traveler’s' },
];

export default config.map((item) => ({ ...defaults, ...item }));
