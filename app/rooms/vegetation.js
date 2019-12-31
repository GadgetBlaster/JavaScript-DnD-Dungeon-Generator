
import { listSentence } from '../utility/tools';
import { roll, rollPercentile, rollArrayItem } from '../utility/roll';

const vegetationChance = 60;
const maxVegetation    = 3;

const vegetation = {
    ferns    : 'ferns',
    flowers  : 'flowers',
    grass    : 'grass',
    moss     : 'moss',
    mushrooms: 'mushrooms',
    roots    : 'roots',
    vines    : 'vines',
};

export const getVegetationDescription = () => {
    if (!rollPercentile(vegetationChance)) {
        return;
    }

    let vegetationCount = roll(1, maxVegetation);
    let types = new Set();

    for (let i = 0; i < vegetationCount; i++) {
        types.add(rollArrayItem(Object.keys(vegetation)));
    }

    let roomVegetation = [ ...types ].map((type) => {
        switch (type) {
            case vegetation.ferns:
            case vegetation.flowers:
                return `${type} are somehow growing here`;

            case vegetation.grass:
                return 'grass pokes through the floor';

            case vegetation.moss:
                return 'moss covers the entire room';

            case vegetation.mushrooms:
                if (roll()) {
                    return 'glowing mushrooms illuminate your surroundings'
                }

                return 'strange mushrooms are scattered about';

            case vegetation.roots:
                return 'roots push through the walls and ceiling';

            case vegetation.vines:
                return `vines ${roll() ? 'cover' : 'cling to '} the walls`;

            default:
                throw 'Undefined vegetation';
        }
    });

    return listSentence(roomVegetation);
};
