
const defaults = {};

const config = [
    { name: 'Sprig of mistletoe' },
];

export default config.map((item) => ({ ...defaults, ...item }));
