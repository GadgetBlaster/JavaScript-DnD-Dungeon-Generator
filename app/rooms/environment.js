
const environment = {
    structure: {
        cave     : 'cave',
        cavern   : 'cavern',
        ice      : 'ice',
        marble   : 'marble',
        stone    : 'stone',
        stoneWood: 'stoneWood',
        wood     : 'wood',
    },

    air: {
        damp  : 'damp',
        misty : 'misty',
        smelly: 'smelly',
        smokey: 'smokey',
    },

    ground: {
        bloody : 'bloody',
        flooded : 'flooded',
        muddy   : 'muddy',
        rubble  : 'rubble',
        slimy   : 'slimy',
        slippery: 'slippery',
    },

    walls: {
        bloody   : 'bloody',
        cracked  : 'cracked',
        crumbling: 'crumbling',
        scorched : 'scorched',
        slimy    : 'slimy',
    },
};

export default environment;

export const list = Object.keys(environment);
