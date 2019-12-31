
import { capacity } from './container';
import rarity from '../../attributes/rarity';
import size from '../../attributes/size';
import type from '../type';

const defaults = {
    rarity: rarity.abundant,
    size: size.medium,
    type: type.furnishing,
};

const defaultCapacity = capacity[size.medium];

const config = [
    { name: 'Bed', variants: [ 'single', 'double', 'queen', 'king', 'bedroll', 'cot', 'rag pile' ] },
    { name: 'Bench', variants: [ 'wood', 'cushioned', 'stone' ] },
    { name: 'Bookcase', defaultCapacity, variants: [ 'wood', 'metal' ] },
    { name: 'Chair', variants: [ 'wood', 'cushioned', 'stone', 'stool' ] },
    { name: 'Desk', capacity: defaultCapacity, variants: [ 'wood', 'stone', 'metal' ] },
    { name: 'Fire pit' },
    { name: 'Fireplace' },
    { name: 'Lamp' },
    { name: 'Mess kit' },
    { name: 'Rack', defaultCapacity, variants: [ 'wood', 'metal' ] },
    { name: 'Table', defaultCapacity, variants: [ 'wood', 'stone', 'metal' ] },
    { name: 'Wardrobe', defaultCapacity },
    { name: 'Workbench', defaultCapacity, variants: [ 'wood', 'stone', 'metal' ] },
];

export default config.map((item) => ({ ...defaults, ...item }));
