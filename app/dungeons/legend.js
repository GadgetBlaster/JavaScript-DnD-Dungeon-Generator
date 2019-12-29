
import { directions } from './map';
import { drawMap, drawRoom, drawDoor, drawGrid } from './draw';
import { element } from '../utility/html';
import { list } from '../ui/list';
import doorType from '../rooms/door';

export const drawLegend = () => {

    let mapSettings = { gridWidth: 1, gridHeight: 1 };
    let attrs       = { x: 0, y: 0, width: 1, height: 1 };
    let direction   = directions.east;

    let legend = {
        'room'   : drawRoom(attrs, { roomNumber: 1 }),
        'passage': drawDoor(attrs, { direction, type: doorType.opening }),
        'archway': drawDoor(attrs, { direction, type: doorType.archway }),
        'door'   : drawDoor(attrs, { direction, type: doorType.wood }),
        'hole'   : drawDoor(attrs, { direction, type: doorType.hole }),
    };

    return list(Object.keys(legend).map((key) => {
        return drawMap(mapSettings, legend[key]) + element('span', key);
    }), { 'data-legend': 'true' });
};
