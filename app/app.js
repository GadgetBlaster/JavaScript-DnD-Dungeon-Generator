
// TODO:
// Room type item affinity
// Flesh out items
// Add furniture to description
// Fill containers
// Traps
// Dungeon map item
// Locked doors
// Door keys stashed
// Checkboxes for randomized sets
// Trim map
// Levels

import {
    actions,
    attachActions,
    toggleCollapsed,
    toggleVisibility,
} from './ui/action';

import { article, section } from './ui/block';
import { createDoorLookup } from './rooms/door';
import { drawLegend } from './dungeons/legend';
import { generateDungeon } from './dungeons/generate';
import { generateItems } from './items/generate';
import { generateRooms } from './rooms/generate';
import { getKnobConfig } from './knobs';
import { getRoomDescription, getDoorwayList } from './rooms/description';
import { nav, setActive, getActive, pages } from './ui/nav';
import { renderKnobs, getFormData } from './ui/form';
import { toDash, chunk } from './utility/tools';

const navContainer     = document.getElementById('nav');
const knobContainer    = document.getElementById('knobs');
const contentContainer = document.getElementById('content');

const roomsPerRow = 3;

const navigate = (target, el) => {
    el && setActive(el);

    let page = target || getActive(navContainer);

    let config = getKnobConfig(page);

    contentContainer.innerHTML = '';
    knobContainer.innerHTML    = renderKnobs(config, page);

    toggleCollapsed(`fieldset-${toDash(config[0].label)}`);
};

const formatRoom = (room, doorLookup) => {
    let roomDoors = doorLookup && doorLookup[room.roomNumber];
    let desc      = getRoomDescription(room, roomDoors);
    let doorList  = roomDoors ? getDoorwayList(roomDoors) : '';
    let items     = room.items.join('');

    return article(desc + doorList + items);
};

const getItems = (settings) => generateItems(settings).join('');

const getRooms = (settings) => {
    return generateRooms(settings).map((room, i) => {
        room.roomNumber = i;

        return formatRoom(room);
    }).join('');
};

const getDungeon = (settings) => {
    let { map, rooms, doors } = generateDungeon(settings);

    let legend     = drawLegend();
    let doorLookup = createDoorLookup(doors);
    let sections   = chunk(rooms, roomsPerRow);

    let articleSections = sections.map((roomChunk) => {
        let row = roomChunk.map((room) => formatRoom(room, doorLookup)).join('');

        return section(row, { 'data-grid': 3 });
    }).join('');

    return section(map + legend) + articleSections;
};

const generators = {
    [pages.dungeon]: getDungeon,
    [pages.items]  : getItems,
    [pages.room]   : getRooms,
};

const generate = () => {
    let settings  = getFormData(knobContainer);
    let page      = getActive(navContainer);
    let generator = generators[page]

    if (!generator) {
        throw 'Invalid page';
    }

    contentContainer.innerHTML = generator(settings);
};

attachActions({
    [actions.expandCollapse]: toggleCollapsed,
    [actions.generate]: generate,
    [actions.navigate]: navigate,
    [actions.showHide]: toggleVisibility,
});

navContainer.innerHTML  = nav;

navigate();
generate();
