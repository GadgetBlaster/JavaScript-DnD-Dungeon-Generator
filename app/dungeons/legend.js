// @ts-check

import { cellFeet } from './grid.js';
import { directions } from './map.js';
import { drawMap, drawRoom, drawDoor, drawGrid, pxCell } from './draw.js';
import { small } from '../ui/typography.js';
import { list } from '../ui/list.js';
import doorType from '../rooms/door.js';

// -- Types --------------------------------------------------------------------

/** @typedef {import('./draw.js').GridRectangle} GridRectangle */

// -- Public Functions ---------------------------------------------------------

/**
 * Returns an unordered list of labeled map features.
 *
 * @param {object} args
 *     @param {number} args.mapWidth
 *
 * @returns {string}
 */
export function drawLegend({ mapWidth }) {

    let mapSettings = { gridWidth: 1, gridHeight: 1 };

    /** @type {GridRectangle} gridRectangle */
    let gridRectangle = { gridX: 0, gridY: 0, gridWidth: 1, gridHeight: 1 };

    let direction = directions.east;

    let scale = `${cellFeet} x ${cellFeet} ft`;

    let legend = {
        [scale]       : drawGrid(mapSettings),
        'Room'        : drawRoom(gridRectangle, { roomNumber: 1 }),
        'Trapped Room': drawRoom(gridRectangle, { roomNumber: '' }, { hasTraps: true }),
        'Passageway'  : drawDoor(gridRectangle, { direction, type: doorType.passageway }),
        'Archway'     : drawDoor(gridRectangle, { direction, type: doorType.archway }),
        'Doorway'     : drawDoor(gridRectangle, { direction, type: doorType.wooden }),
        'Locked Door' : drawDoor(gridRectangle, { direction, type: doorType.wooden, locked: true }),
        'Hole'        : drawDoor(gridRectangle, { direction, type: doorType.hole }),
        'Secret'      : drawDoor(gridRectangle, { direction, type: doorType.secret }),
        'Concealed'   : drawDoor(gridRectangle, { direction, type: doorType.concealed }),
    };

    return list(Object.keys(legend).map((key) => {
        return drawMap(mapSettings, legend[key]) + small(key);
    }), { 'data-grid': true, style: `width: ${mapWidth * pxCell}px;` });
};
