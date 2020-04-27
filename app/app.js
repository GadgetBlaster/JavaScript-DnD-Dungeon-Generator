
import { chunk, toDash } from './utility/tools.js';
import testSummary from './utility/tests.js';

import {
    actions,
    attachActions,
    toggleAccordion,
    toggleVisibility,
} from './ui/action.js';

import { article, section } from './ui/block.js';
import { getActive, nav, pages, setActive } from './ui/nav.js';
import { getFormData, renderKnobs } from './ui/form.js';
import { list } from './ui/list.js';
import { subTitle } from './ui/typography.js';

import {
    getDoorwayList,
    getKeyDescription,
    getMapDescription,
    getRoomDescription,
} from './rooms/description.js';

import { drawLegend } from './dungeons/legend.js';
import { generateDungeon } from './dungeons/generate.js';

import { generateItems } from './items/generate.js';
import { generateRooms } from './rooms/generate.js';

import { getKnobConfig } from './knobs.js';

const contentContainer = document.getElementById('content');
const footerContainer  = document.getElementById('footer');
const knobContainer    = document.getElementById('knobs');
const navContainer     = document.getElementById('nav');

footerContainer.insertAdjacentHTML('afterbegin', testSummary());

const homeContent = contentContainer.innerHTML;

const roomsPerRow = 3;

const updateKnobs = (target) => {
    let page = target || getActive(navContainer);
    let config = getKnobConfig(page);

    knobContainer.innerHTML = renderKnobs(config, page);

    toggleAccordion(`fieldset-${toDash(config[0].label)}`);
};

const navigate = (target, el) => {
    el && setActive(el);

    updateKnobs(target);
    contentContainer.innerHTML = homeContent;
};

const navigateHome = () => {
    contentContainer.innerHTML = homeContent;
};

const formatRoom = (room, doors) => {
    let roomDoors = doors && doors[room.roomNumber];
    let desc      = getRoomDescription(room, roomDoors);
    let doorList  = roomDoors ? getDoorwayList(roomDoors) : '';
    let items     = room.items.join('');
    let map       = room.map ? getMapDescription() : '';
    let keys      = room.keys ? getKeyDescription(room.keys) : '';
    let traps     = room.traps ? subTitle(`Traps (${room.traps.length})`) + list(room.traps) : '';

    return article(desc + doorList + items + map + keys + traps);
};

const getItems = (settings) => {
    let items = generateItems(settings).join('');

    return section(article(items));
};

const getRoomRows = (rooms, doors) => {
    let sections = chunk(rooms, roomsPerRow);

    return sections.map((roomChunk) => {
        let row = roomChunk.map((room) => formatRoom(room, doors)).join('');

        return section(row, { 'data-grid': 3 });
    }).join('');
};

const getRooms = (settings) => {
    let rooms = generateRooms(settings);

    rooms.forEach((_, i) => {
        rooms[i].roomNumber = i + 1;
    });

    return getRoomRows(rooms);
};

const getDungeon = (settings) => {
    let { map, rooms, doors, mapDimensions } = generateDungeon(settings);

    let legend   = drawLegend({ mapWidth: mapDimensions.gridWidth });
    let sections = getRoomRows(rooms, doors);

    return section(map) + section(legend) + sections;
};

const generators = {
    [pages.dungeon]: getDungeon,
    [pages.items]  : getItems,
    [pages.room]   : getRooms,
};

const generate = () => {
    let settings  = getFormData(knobContainer);
    let page      = getActive(navContainer);
    let generator = generators[page];

    if (!generator) {
        throw 'Invalid page';
    }

    contentContainer.innerHTML = generator(settings);
};

attachActions({
    [actions.accordion]: toggleAccordion,
    [actions.generate] : generate,
    [actions.navigate] : navigate,
    [actions.showHide] : toggleVisibility,
    [actions.home]     : navigateHome,
});

navContainer.innerHTML  = nav;

updateKnobs();
