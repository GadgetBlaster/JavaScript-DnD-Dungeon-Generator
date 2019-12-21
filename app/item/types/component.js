
import type from '../type';

const defaults = {
    type: type.component,
};

const config = [
    { name: 'Sprig of mistletoe' },
];

export default config.map((item) => ({ ...defaults, ...item }));
