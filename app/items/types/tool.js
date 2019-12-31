
import rarity from '../../attributes/rarity';
import size from '../../attributes/size';
import type from '../type';

let { large } = size;
let { uncommon, rare } = rarity;

const defaults = {
    type: type.tool,
};

const config = [
    { name: 'Ball bearings', quantity: 1000 },
    { name: 'Block and tackle' },
    { name: 'Chain' },
    { name: 'Crowbar' },
    { name: 'Grappling hook', rarity: uncommon },
    { name: 'Hammer, sledge', size: large },
    { name: 'Hammer' },
    { name: 'Healer’s kit', rarity: rare },
    { name: 'Ladder (10-foot)', size: large, variants: [ 'stepping', '5 foot', '10 foot', '20 foot' ] },
    { name: 'Lantern, bullseye' },
    { name: 'Lantern, hooded' },
    { name: 'Lock', variants: [ 'door', 'bolt', 'combination' ] },
    { name: 'Magnifying glass', rarity: rare },
    { name: 'Mirror, steel', rarity: uncommon },
    { name: 'Pick, miner’s', size: large },
    { name: 'Pole, 1 foot' },
    { name: 'Pole', size: large, variants: [ '5 foot', '10 foot', '20 foot' ] },
    { name: 'Ram, portable', size: large },
    { name: 'Rope, hempen', size: large, variants: [ '10 feet', '25 feet', '50 feet', '100 feet' ] },
    { name: 'Rope, silk', size: large, variants: [ '10 feet', '25 feet', '50 feet', '100 feet' ] },
    { name: 'Shovel', size: large },
    { name: 'Spikes, iron', quantity: 100 },
    { name: 'Spyglass', rarity: rare },
    { name: 'Whetstone', rarity: uncommon },
    { name: 'Wooden staff', size: large },
];

export default config.map((item) => ({ ...defaults, ...item }));
