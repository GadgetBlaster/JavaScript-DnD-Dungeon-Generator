
import rarity from '../../attributes/rarity';
import type from '../type';

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
    { name: 'Hammer, sledge' },
    { name: 'Hammer' },
    { name: 'Healer’s kit', rarity: rare },
    { name: 'Ladder (10-foot)', variants: [ 'stepping', '5 foot', '10 foot', '20 foot' ] },
    { name: 'Lantern, bullseye' },
    { name: 'Lantern, hooded' },
    { name: 'Lock', variants: [ 'door', 'bolt', 'combination' ] },
    { name: 'Magnifying glass', rarity: rare },
    { name: 'Mirror, steel', rarity: uncommon },
    { name: 'Pick, miner’s' },
    { name: 'Pole', variants: [ '1 foot', '5 foot', '10 foot', '20 foot' ] },
    { name: 'Ram, portable' },
    { name: 'Rope, hempen', variants: [ '10 feet', '25 feet', '50 feet', '100 feet' ] },
    { name: 'Rope, silk', variants: [ '10 feet', '25 feet', '50 feet', '100 feet' ] },
    { name: 'Shovel' },
    { name: 'Spikes, iron', quantity: 100 },
    { name: 'Spyglass', rarity: rare },
    { name: 'Whetstone', rarity: uncommon },
    { name: 'Wooden staff' },
];

export default config.map((item) => ({ ...defaults, ...item }));
