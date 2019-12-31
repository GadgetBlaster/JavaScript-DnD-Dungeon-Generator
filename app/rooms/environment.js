
import { getRoomTypeLabel } from './description';
import { getVegetationDescription } from './vegetation';
import { knobs } from '../knobs';
import { roll, rollArrayItem, rollPercentile } from '../utility/roll';
import roomType from './type';
import size from '../attributes/size';
import { listSentence } from '../utility/tools';

const detailChance  = 50;

const structure = {
    cave     : 'cave',
    ice      : 'ice',
    marble   : 'marble',
    stone    : 'stone',
    stoneWood: 'stoneWood',
    wood     : 'wood',
};

const supportsVegetation = new Set([
    structure.cave,
    structure.stone,
    structure.stoneWood,
    structure.wood,
]);

const air = {
    damp  : 'damp',
    misty : 'misty',
    smelly: 'smelly',
    smokey: 'smokey',
};

const ground = {
    bloody  : 'bloody',
    dirt    : 'dirt',
    flooded : 'flooded',
    muddy   : 'muddy',
    rubble  : 'rubble',
    slimy   : 'slimy',
    slippery: 'slippery',
};

const wall = {
    bloody   : 'bloody',
    cracked  : 'cracked',
    crumbling: 'crumbling',
    scorched : 'scorched',
    slimy    : 'slimy',
};

const getStructureDesc = (settings, roomStructure) => {
    let {
        [knobs.roomType]: typeSetting,
        [knobs.roomSize]: roomSize,
    } = settings;

    let type = getRoomTypeLabel(typeSetting);

    switch (roomStructure) {
        case structure.cave:
            let isCavern = roomSize === size.massive && typeSetting !== roomType.hallway;
            return `The ${type} is formed by a ${isCavern ? 'cavern' : 'cave'}`;

        case structure.ice:
            return `The ${type} is made entirely of ice`;

        case structure.marble:
            return `The ${type} is carved through solid marble`;

        case structure.stone:
        case structure.wood:
            return `The ${type} is constructed from ${roomStructure}`;

        case structure.stoneWood:
            return `The stone ${type} is reinforced with wooden beams and pillars`;

        default:
            throw 'Invalid structure';
    }
};

const getGroundDesc = () => {
    if (!rollPercentile(detailChance)) {
        return;
    }

    let random = rollArrayItem(Object.keys(ground));

    switch (random) {
        case ground.bloody:
            let isFresh = roll() ? 'Fresh blood' : 'Blood stains';
            return `${isFresh} can be seen on the floor`;

        case ground.dirt:
            return 'Dirt covers the ground';

        case ground.flooded:
            let inches = roll();
            return `The room is ${inches ? '' : 'completely '}flooded with a few ${inches ? 'inches' : 'feet'} of water`;

        case ground.muddy:
            return 'The floor is sticky with mud';

        case ground.rubble:
            return 'Rubble covers the floor';

        case ground.slimy:
            return 'The ground is slimy';

        case ground.slippery:
            return 'The floor is wet and slippery';

        default:
            throw 'Undefined ground';
    }
};

const getWallDesc = () => {
    if (!rollPercentile(detailChance)) {
        return;
    }

    let random = rollArrayItem(Object.keys(wall));

    switch (random) {
        case wall.bloody:
            let isFresh = roll() ? 'Fresh blood is' : 'Blood stains are';
            return `${isFresh} splattered across the walls`;

        case wall.cracked:
            return 'The walls are cracked';

        case wall.crumbling:
            return 'The walls are crumbling';

        case wall.scorched:
            return 'The walls appear to have been scorched by fire';

        case wall.slimy:
            return 'Something slimy drips from the walls';

        default:
            throw 'Undefined wall';
    }
};

const getAirDesc = () => {
    if (!rollPercentile(detailChance)) {
        return;
    }

    let random = rollArrayItem(Object.keys(air));

    switch (random) {
        case air.damp:
            return 'The air is think and damp';

        case air.misty:
            if (roll()) {
                return 'Low mist clings to the ground';
            }

            return 'Mist fills the air';

        case air.smelly:
            if (roll()) {
                return 'A nasty smell fills the room';
            }

            if (roll()) {
                return 'The air smells fresh crisp';
            }

            return 'There is strange sweet sent in the air';

        case air.smokey:
            return 'The room is filled with smoke from a hastily extinguished fire';

        default:
            throw 'Undefined air';
    }
};

export const getEnvironmentDescription = (settings) => {
    let roomStructure = rollArrayItem(Object.keys(structure));
    let roomVegetation;

    if (supportsVegetation.has(roomStructure)) {
        roomVegetation = getVegetationDescription();
    }

    return [
        getStructureDesc(settings, roomStructure),
        getGroundDesc(),
        getWallDesc(),
        roomVegetation,
        getAirDesc(),
    ].filter(Boolean);
};