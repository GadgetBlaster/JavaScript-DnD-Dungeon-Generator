
import { knobs } from '../knobs.js';
import { roll, rollArrayItem, rollPercentile } from '../utility/roll.js';
import roomType from './type.js';

const featureChance = 50;
const maxFeatures   = 3;

const feature = {
    altar     : 'altar',
    beetles   : 'beetles',
    cage      : 'cage',
    candles   : 'candles',
    carvings  : 'carvings',
    caveIn    : 'caveIn',
    cobwebs   : 'cobwebs',
    corpse    : 'corpse',
    embers    : 'embers',
    fire      : 'fire',
    fountain  : 'fountain',
    gargoyles : 'gargoyles',
    hole      : 'hole',
    machinery : 'machinery',
    moths     : 'moths',
    mouldy    : 'mouldy',
    pit       : 'pit',
    pits      : 'pits',
    rats      : 'rats',
    sarcophagi: 'sarcophagi',
    shackles  : 'shackles',
    spiders   : 'spiders',
    spikes    : 'spikes',
    statue    : 'statue',
    stream    : 'stream',
    tapestries: 'tapestries',
    torches   : 'torches',
    well      : 'well',
};

const getFeatureDesc = (type) => {
    switch (type) {
        case feature.altar:
            let location = roll() ? 'in the center' : 'to one side';
            return `A ritualistic altar sits ${location} of the room`;

        case feature.beetles:
            return 'Beetles scurry about';

        case feature.cage:
            return 'A large cage occupies the space';

        case feature.candles:
            return 'Candles that were lit recently flicker and cast shadows around the room';

        case feature.carvings:
            return 'Strange carvings have been etched into the walls, floor, and ceiling';

        case feature.caveIn:
            return 'Part of the rom has caved in';

        case feature.cobwebs:
            return 'Massive cobwebs stick to the walls';

        case feature.corpse:
            return 'A rotting corpse sits against a wall';

        case feature.embers:
            return 'Scattered embers from a recent fire glow in the room';

        case feature.fire:
            return 'An abandoned campfire burns on the floor';

        case feature.fountain:
            let flowing = roll() ? 'still flowing' : 'that has long ago stopped running';
            return `The room features a small fountain ${flowing}`;

        case feature.gargoyles:
            if (roll()) {
                return 'Small gargoyles line the edge of the ceiling';
            }

            return 'Tow statues of gargoyles site motionless next to the door';

        case feature.hole:
            return 'There is a large hole in the floor';

        case feature.machinery:
            return 'Ancient machinery fills the room';

        case feature.moths:
            return 'Moths flutter in the air';

        case feature.mouldy:
            return 'The room covered in mould';

        case feature.pit:
            return 'A large pit has been dug in the floor';

        case feature.pits:
            return 'Several small pits can be seen in the room';

        case feature.rats:
            return 'Rats scatter as you enter the room';

        case feature.sarcophagi:
            return 'A sarcophagus sits undisturbed in the center of the room';

        case feature.shackles:
            return 'Shackles are attached to the walls';

        case feature.spiders:
            return 'The room is crawling with spikers';

        case feature.spikes:
            return 'Rusty spikes have been crudely attached to the walls and floors';

        case feature.statue:
            let material = roll() ? 'stone' : 'wooden';
            return `A ${material} statue sits motionless`;

        case feature.stream:
            return 'A small stream runs through the room';

        case feature.tapestries:
            return 'Several large tapestries line the walls';

        case feature.torches:
            return 'Lit torches illuminate the walls';

        case feature.well:
            return 'The rom features a well that appears to have running water at the bottom';

        default:
            throw new TypeError('Invalid feature type');
    }
};

export const getRoomFeatures = (settings) => {
    let {
        [knobs.roomType]: roomTypeSetting,
    } = settings;

    if (roomTypeSetting === roomType.hallway) {
        return [];
    }

    if (!rollPercentile(featureChance)) {
        return [];
    }

    let featureCount = roll(1, maxFeatures);
    let types = new Set();

    for (let i = 0; i < featureCount; i++) {
        types.add(rollArrayItem(Object.keys(feature)));
    }

    let roomFeatures = [ ...types ].map((type) => {
        return getFeatureDesc(type);
    });

    return roomFeatures;
};
