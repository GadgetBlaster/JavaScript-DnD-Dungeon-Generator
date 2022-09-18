// @ts-check

import { cellFeet } from './grid.js';
import { drawMap, drawRoom, drawDoor, drawGrid } from './draw.js';
import { span } from '../ui/typography.js';
import { list } from '../ui/list.js';

// -- Types --------------------------------------------------------------------

/** @typedef {import('./grid.js').Dimensions} Dimensions */
/** @typedef {import('./grid.js').Rectangle} Rectangle */
/** @typedef {import('./map.js').Direction} Direction */
/** @typedef {import('./map.js').Door} Door */

// -- Public Functions ---------------------------------------------------------

/**
 * Returns an unordered list of labeled map features.
 *
 * TODO draw legend on its own grid and toggle show/hide.
 *
 * @returns {string}
 */
export function drawLegend() {
    let gridDimensions = { width: 1, height: 1 };
    let rectangle = { x: 0, y: 0, width: 1, height: 1 };

    /** @type {Omit<Door, "type">} */
    let doorBase = {
        rectangle,
        locked: false,
        connect: { 1: { direction: 'east', to: 2 } },
    };

    let scale = `${cellFeet} x ${cellFeet} ft`;

    let legend = {
        [scale]       : drawGrid(gridDimensions),
        'Room'        : drawRoom(rectangle, { roomNumber: '1' }),
        'Trapped Room': drawRoom(rectangle, { roomNumber: '' }, { hasTraps: true }),
        'Passageway'  : drawDoor({ ...doorBase, type: 'passageway' }),
        'Archway'     : drawDoor({ ...doorBase, type: 'archway' }),
        'Doorway'     : drawDoor({ ...doorBase, type: 'wooden' }),
        'Locked Door' : drawDoor({ ...doorBase, type: 'wooden', locked: true }),
        'Hole'        : drawDoor({ ...doorBase, type: 'hole' }),
        'Secret'      : drawDoor({ ...doorBase, type: 'secret' }),
        'Concealed'   : drawDoor({ ...doorBase, type: 'concealed' }),
    };

    return list(Object.keys(legend).map((key) => {
        return drawMap(gridDimensions, legend[key]) + span(key);
    }), { 'data-flex': true });
}
