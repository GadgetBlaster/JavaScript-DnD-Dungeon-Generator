// @ts-check

import { cellFeet } from './grid.js';
import { drawMap, drawRoom, drawDoor, drawGrid } from './draw.js';
import { small } from '../ui/typography.js';
import { list } from '../ui/list.js';

// -- Types --------------------------------------------------------------------

/** @typedef {import('./grid.js').Dimensions} Dimensions */
/** @typedef {import('./grid.js').Rectangle} Rectangle */
/** @typedef {import('./map.js').Direction} Direction */

// -- Public Functions ---------------------------------------------------------

/**
 * Returns an unordered list of labeled map features.
 *
 * @returns {string}
 */
export function drawLegend() {

    /** @type {Dimensions} gridDimensions */
    let gridDimensions = { width: 1, height: 1 };

    /** @type {Rectangle} gridRectangle */
    let gridRectangle = { x: 0, y: 0, width: 1, height: 1 };

    /**  @type {Direction} direction */
    let direction = 'east';

    let scale = `${cellFeet} x ${cellFeet} ft`;

    let legend = {
        [scale]       : drawGrid(gridDimensions),
        'Room'        : drawRoom(gridRectangle, { roomNumber: 1 }),
        'Trapped Room': drawRoom(gridRectangle, { roomNumber: '' }, { hasTraps: true }),
        'Passageway'  : drawDoor(gridRectangle, { direction, type: 'passageway' }),
        'Archway'     : drawDoor(gridRectangle, { direction, type: 'archway' }),
        'Doorway'     : drawDoor(gridRectangle, { direction, type: 'wooden' }),
        'Locked Door' : drawDoor(gridRectangle, { direction, type: 'wooden', locked: true }),
        'Hole'        : drawDoor(gridRectangle, { direction, type: 'hole' }),
        'Secret'      : drawDoor(gridRectangle, { direction, type: 'secret' }),
        'Concealed'   : drawDoor(gridRectangle, { direction, type: 'concealed' }),
    };

    return list(Object.keys(legend).map((key) => {
        return drawMap(gridDimensions, legend[key]) + small(key);
    }), { 'data-grid': true });
}
