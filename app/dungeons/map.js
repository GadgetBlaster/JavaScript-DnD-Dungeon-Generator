
import { rollArrayItem } from '../utility/roll';

const tempRoomCount = 6;

const sides = {
    top   : 'top',
    right : 'right',
    bottom: 'bottom',
    left  : 'left',
};

const units    = 64;
const cellSize = 10;

const gridColor      = '#cfcfcf';
const background     = '#efefef';
const roomBackground = '#ffffff';

const getStartingPoint = ({ roomWidth = cel, roomHeight }) => {
    let side = rollArrayItem(Object.values(sides));
    let x;
    let y;

    switch (side) {
        case sides.right:
            // x =
            break;
        case sides.bottom:
            break;
        case sides.left:
            break;
        case sides.top:
        default:
            break;
    }
};

const createAttrs = (obj) => {
    return Object.keys(obj).map((key) => {
        return `${key}="${obj[key]}"`;
    }).join('');
};

const createLine = ({ x1, y1, x2, y2 }, stroke = gridColor, width = 1) => {
    let attrs = createAttrs({
        x1, y1, x2, y2,
        stroke,
        'stroke-width': width,
        'shape-rendering': 'crispEdges',
    });

    return `<line ${attrs} />`;
};

const createRect = ({ x, y, width = 1, height = 1, fill = roomBackground }) => {
    let attrs = createAttrs({
        x: x * cellSize,
        y: y * cellSize,
        width: width * cellSize,
        height: height * cellSize,
        fill,
    });

    return `<rect ${attrs} />`
};

const createGrid = () => {
    let lines = '';

    for (let i = 0; i <= units; i++) {
        let unit = i * cellSize;
        let x2   = units * cellSize;
        let y2   = units * cellSize;

        lines += createLine({ x1: 0, y1: unit, x2, y2: unit });
        lines += createLine({ x1: unit, y1: 0, x2: unit, y2 });
    }

    return lines;
};

const createRooms = () => {
    let rooms = '';

    for (let i = 0; i < tempRoomCount; i++) {
        rooms += createRect({
            x: i,
            y: i,
        });
    }

    return rooms;
};

export const generateMap = () => {
    let dimension = units * cellSize;

    let grid  = createGrid();
    let rooms = createRooms();

    let content = rooms + grid;

    let attrs = createAttrs({
        width : dimension + 1,
        height: dimension + 1,
        style : `background: ${background}`,
    });

    return `<svg ${attrs}>${content}</svg>`;
};
