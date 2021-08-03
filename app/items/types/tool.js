// @ts-check

import rarity from '../../attributes/rarity.js';
import size from '../../attributes/size.js';
import type from '../type.js';

let { tiny, medium, large } = size;
let { common, uncommon, rare } = rarity;

const defaults = {
    type: type.tool,
};

const config = [
    { name: 'Alchemist’s supplies', rarity: rare },
    { name: 'Ball bearings', quantity: 100 },
    { name: 'Block and tackle', size: medium },
    { name: 'Brewer’s supplies', rarity: uncommon },
    { name: 'Calligrapher’s supplies', rarity: rare },
    { name: 'Carpenter’s tools', rarity: common },
    { name: 'Cartographer’s tools', rarity: rare },
    { name: 'Chain', variants: [ 'heavy', 'light' ] },
    { name: 'Cobbler’s tools' },
    { name: 'Compass', rarity: rare, size: tiny },
    { name: 'Cook’s utensils' },
    { name: 'Crowbar', size: medium },
    { name: 'Dice set' },
    { name: 'Disguise kit', rarity: rare },
    { name: 'Dragonchess set', rarity: rare },
    { name: 'Forgery kit', rarity: rare },
    { name: 'Glassblower’s tools', rarity: rare },
    { name: 'Grappling hook', rarity: uncommon },
    { name: 'Hammer, sledge', size: large },
    { name: 'Hammer' },
    { name: 'Healer’s kit', rarity: rare },
    { name: 'Herbalism kit', rarity: rare },
    { name: 'Jeweler’s tools', rarity: rare },
    { name: 'Ladder', size: large, variants: [ 'stepping', '5 foot', '10 foot', '20 foot' ] },
    { name: 'Lantern, bullseye' },
    { name: 'Lantern, hooded' },
    { name: 'Leatherworker’s tools' },
    { name: 'Lock', variants: [ 'door', 'bolt', 'combination' ] },
    { name: 'Magnifying glass', rarity: rare },
    { name: 'Mason’s tools' },
    { name: 'Mirror, steel', rarity: uncommon },
    { name: 'Navigator’s tools', rarity: uncommon },
    { name: 'Painter’s supplies' },
    { name: 'Pick, miner’s', size: medium },
    { name: 'Playing card set' },
    { name: 'Poisoner’s kit', rarity: rare },
    { name: 'Pole, 1 foot' },
    { name: 'Pole', size: large, variants: [ '5 foot', '10 foot', '20 foot' ] },
    { name: 'Potter’s tools' },
    { name: 'Ram, portable', size: large },
    { name: 'Rope, hempen', size: medium, variants: [ '10 feet', '25 feet', '50 feet', '100 feet' ] },
    { name: 'Rope, silk', size: medium, variants: [ '10 feet', '25 feet', '50 feet', '100 feet' ] },
    { name: 'Sewing kit', size: tiny },
    { name: 'Shovel', size: medium },
    { name: 'Smith’s tools', rarity: uncommon },
    { name: 'Spikes, iron', quantity: 100 },
    { name: 'Spyglass', rarity: rare },
    { name: 'Thieves’ tools', rarity: rare },
    { name: 'Three-Dragon Antet set', rarity: rare },
    { name: 'Tinker’s tools', rarity: rare },
    { name: 'Weaver’s tools' },
    { name: 'Whetstone', rarity: uncommon },
    { name: 'Woodcarver’s tools' },
    { name: 'Wooden staff', size: medium },
];

export default config.map((item) => ({ ...defaults, ...item }));
