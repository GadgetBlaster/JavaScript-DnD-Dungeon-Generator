
import { cellFeet } from './grid.js';
import { directions } from './map.js';
import { drawMap, drawRoom, drawDoor, drawGrid, pxCell } from './draw.js';
import { small } from '../ui/typography.js';
import { list } from '../ui/list.js';
import doorType from '../rooms/door.js';

export const drawLegend = ({ mapWidth }) => {

    let mapSettings = { gridWidth: 1, gridHeight: 1 };
    let attrs       = { x: 0, y: 0, width: 1, height: 1 };
    let direction   = directions.east;

    let scale = `${cellFeet} x ${cellFeet} ft`;

    let legend = {
        [scale]      : drawGrid(mapSettings),
        'room'       : drawRoom(attrs, { roomNumber: 1 }),
        'trapped'    : drawRoom(attrs, { roomNumber: '' }, { hasTraps: true }),
        'passageway' : drawDoor(attrs, { direction, type: doorType.passageway }),
        'archway'    : drawDoor(attrs, { direction, type: doorType.archway }),
        'doorway'    : drawDoor(attrs, { direction, type: doorType.wooden }),
        'locked door': drawDoor(attrs, { direction, type: doorType.wooden, locked: true }),
        'hole'       : drawDoor(attrs, { direction, type: doorType.hole }),
        'secret'     : drawDoor(attrs, { direction, type: doorType.secret }),
        'concealed'  : drawDoor(attrs, { direction, type: doorType.concealed }),
    };

    return list(Object.keys(legend).map((key) => {
        return drawMap(mapSettings, legend[key]) + small(key);
    }), { 'data-grid': true, style: `width: ${mapWidth * pxCell}px;` });
};
