// @ts-check

import { cellFeet } from './grid.js';
import { directions } from './map.js';
import { drawMap, drawRoom, drawDoor, drawGrid, pxCell } from './draw.js';
import { small } from '../ui/typography.js';
import { list } from '../ui/list.js';
import doorType from '../rooms/door.js';

/** @typedef {import('./draw.js').GridRectangle} GridRectangle */

/**
 * TODO
 * @param {*} param0
 * @returns
 */
export const drawLegend = ({ mapWidth }) => {

    let mapSettings = { gridWidth: 1, gridHeight: 1 };

    /** @type {GridRectangle} gridRectangle */
    let gridRectangle = { gridX: 0, gridY: 0, gridWidth: 1, gridHeight: 1 };

    let direction = directions.east;

    let scale = `${cellFeet} x ${cellFeet} ft`;

    let legend = {
        [scale]      : drawGrid(mapSettings),
        'room'       : drawRoom(gridRectangle, { roomNumber: 1 }),
        'trapped'    : drawRoom(gridRectangle, { roomNumber: '' }, { hasTraps: true }),
        'passageway' : drawDoor(gridRectangle, { direction, type: doorType.passageway }),
        'archway'    : drawDoor(gridRectangle, { direction, type: doorType.archway }),
        'doorway'    : drawDoor(gridRectangle, { direction, type: doorType.wooden }),
        'locked door': drawDoor(gridRectangle, { direction, type: doorType.wooden, locked: true }),
        'hole'       : drawDoor(gridRectangle, { direction, type: doorType.hole }),
        'secret'     : drawDoor(gridRectangle, { direction, type: doorType.secret }),
        'concealed'  : drawDoor(gridRectangle, { direction, type: doorType.concealed }),
    };

    return list(Object.keys(legend).map((key) => {
        return drawMap(mapSettings, legend[key]) + small(key);
    }), { 'data-grid': true, style: `width: ${mapWidth * pxCell}px;` });
};
