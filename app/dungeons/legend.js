
import { cellFeet } from './grid';
import { directions } from './map';
import { drawMap, drawRoom, drawDoor, drawGrid } from './draw';
import { small } from '../ui/typography';
import { list } from '../ui/list';
import doorType from '../rooms/door';

export const drawLegend = () => {

    let mapSettings = { gridWidth: 1, gridHeight: 1 };
    let attrs       = { x: 0, y: 0, width: 1, height: 1 };
    let direction   = directions.east;

    let scale = `${cellFeet} x ${cellFeet} ft`;

    let legend = {
        [scale]     : drawGrid(mapSettings),
        'room'      : drawRoom(attrs, { roomNumber: 1 }),
        'passageway': drawDoor(attrs, { direction, type: doorType.passageway }),
        'archway'   : drawDoor(attrs, { direction, type: doorType.archway }),
        'doorway'   : drawDoor(attrs, { direction, type: doorType.wooden }),
        'hole'      : drawDoor(attrs, { direction, type: doorType.hole }),
        'secret'    : drawDoor(attrs, { direction, type: doorType.secret }),
        'concealed' : drawDoor(attrs, { direction, type: doorType.concealed }),
    };

    return list(Object.keys(legend).map((key) => {
        return drawMap(mapSettings, legend[key]) + small(key);
    }), { 'data-grid': true });
};
