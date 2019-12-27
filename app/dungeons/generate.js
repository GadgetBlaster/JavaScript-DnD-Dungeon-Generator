
import { generateMap } from './map';
import { generateRooms } from '../rooms/generate';
import { knobs } from '../knobs';
import { roll } from '../utility/roll';

const complexityRoomCountMultiplier    = 10;
const complexityMultiplierMinXY = 4;
const complexityMultiplierMaxXY = 5;

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
    let { [knobs.dungeonComplexity]: complexity } = settings;

    settings[knobs.roomCount] = getMxRoomCount(complexity);

    let rooms = generateRooms(settings);

    let mapSettings = {
        ...getMapDimensions(complexity),
        rooms: rooms,
    };

    let { map, roomCount } = generateMap(mapSettings);

    return {
        map,
        rooms: rooms.slice(0, roomCount),
    };
};
