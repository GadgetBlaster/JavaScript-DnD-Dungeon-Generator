
import type from '../type';

const defaults = {
    quantity: 200,
    type: type.ammo,
};

const config = [
    { name: 'Arrow, set' },
    { name: 'Blowgun needles' },
    { name: 'Crossbow bolts' },
    { name: 'Sling bullets' },
];

export default config.map((item) => ({ ...defaults, ...item }));
