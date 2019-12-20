
import rarity from '../attribute/rarity';

let { uncommon } = rarity;

const receptacles = [
    'Barrel',
    'Beaker',
    'Bottle',
    'Flask',
    'Jar',
    'Jug',
    'Tankard',
    'Vat',
    'Vial',
];

const defaults = {
    receptacles,
    rarity: uncommon,
};

const config = [
    { name: 'Acid' },
    { name: 'Alchemist’s fire' },
    { name: 'Antitoxin' },
];

export default config.map((item) => ({ ...defaults, ...item }));
