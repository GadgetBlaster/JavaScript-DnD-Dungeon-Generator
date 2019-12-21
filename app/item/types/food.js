import type from '../type';

const defaults = {
    type: type.food,
};

const config = [
    { name: 'Rations', quantity: 100 },
];

export default config.map((item) => ({ ...defaults, ...item }));


