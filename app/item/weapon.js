
const defaults = {};

const config = [
    { name: 'Caltrops', quantity: 20 },
];

export default config.map((item) => ({ ...defaults, ...item }));
