
import { generateMap } from './map';
import { generateRooms } from '../rooms/generate';
import { knobs } from '../knobs';
import { roll, rollArrayItem } from '../utility/roll';
import { createDoorLookup } from '../rooms/door';

const complexityRoomCountMultiplier = 10;
const complexityMultiplierMinXY     = 5;
const complexityMultiplierMaxXY     = 6;

const getMxRoomCount = (complexity) => {
    return complexity * complexityRoomCountMultiplier;
};

const getMapDimensions = (complexity) => {
    let dimensionMin = complexity * complexityMultiplierMinXY;
    let dimensionMax = complexity * complexityMultiplierMaxXY;

    let gridWidth  = roll(dimensionMin, dimensionMax);
    let gridHeight = roll(dimensionMin, dimensionMax);

    return {
        gridWidth,
        gridHeight,
    };
};

export const generateDungeon = (settings) => {
    let {
        [knobs.dungeonComplexity]: complexity,
        [knobs.dungeonMaps]      : maps,
    } = settings;

    settings[knobs.roomCount] = getMxRoomCount(complexity);

    let mapSettings = {
        ...getMapDimensions(complexity),
        rooms: generateRooms(settings),
    };

    let dungeon         = generateMap(mapSettings);
    let { doors, keys } = createDoorLookup(dungeon.doors);

    keys.length && keys.forEach((key) => {
        let room = rollArrayItem(dungeon.rooms);

        if (!room.keys) {
            room.keys = [];
        }

        room.keys.push(key);
    });

    if (maps) {
        for (let i = 0; i < maps; i++) {
            let room = rollArrayItem(dungeon.rooms);
            room.map = true;
        }
    }

    return {
        map  : dungeon.map,
        rooms: dungeon.rooms,
        doors: doors,
    };
};
