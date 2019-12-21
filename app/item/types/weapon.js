
import type from '../type';

const defaults = {
    type: type.weapon,
};

const config = [
    { name: 'Caltrops', quantity: 20 },
];

export default config.map((item) => ({ ...defaults, ...item }));
