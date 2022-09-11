// @ts-check

import { article, div, header } from '../ui/block.js';
import { list } from '../ui/list.js';
import { link } from '../ui/link.js';
import { paragraph, subtitle, title } from '../ui/typography.js';
import { element } from '../utility/element.js';

// TODO tests, validate version sequence, font size
// TODO navigating from release notes to a generator UI is missing

// -- Types --------------------------------------------------------------------

/**
 * @typedef {object} ReleaseNote
 *
 * @prop {string} title
 * @prop {string} version
 * @prop {string} commit
 * @prop {string} date
 * @prop {string[]} [description]
 * @prop {string[]} [details]
 */

// -- Config -------------------------------------------------------------------

/**
 * @param {string} tag
 */
const getGitHubTagUrl = (tag) => `https://github.com/GadgetBlaster/JavaScript-DnD-Dungeon-Generator/tree/v${tag}`;

/**
 * Returns an array of `ReleaseNote` objects.
 *
 * @type {ReleaseNote[]}
 */
export const releaseNotes = [
    {
        title: 'Numerous Fixes & Improvements',
        version: '1.4.0',
        commit: '74f1243c4e6c663569e765521eca46da8261f03e',
        date: '2022-07-30',
        details: [
            'Added generator icons, large call-to-action buttons, and layout updates.',
            'Added animations to various user interface elements.',
            'Fixed a bug with door size descriptions.',
            'Improved formatting of items in the item generator.',
            'Fixed a bug causing missing item uniformity descriptions.',
            'Fixed a bug with incorrect coin labels.',
            'JavaScript errors are now caught and reported to a server log.',
            'Added humans.txt, robots.txt, and sitemap.xml documents.',
            'Numerous code improvements and additional test coverage. The application now makes 2425 unit test assertions 🤯!',
        ],
    },
    {
        title: 'Expandable Sidebar 🎉',
        version: '1.3.0',
        commit: '2a4ca1fdd4b78bdb3861be6ed776c7489af44645',
        date: '2022-04-10',
        description: [
            'Updated the generator controls sidebar to be expandable and collapsible. This allows users to see and configure all generator options simultaneously.',
        ],
    },
    {
        title: 'Extensive Test Coverage & Code Improvements',
        version: '1.2.0',
        commit: 'b7a617d0e33c0932effcf57179eb6f69949e7bd5',
        date: '2022-04-09',
        description: [
            "Over the last two years I've focused on adding extensive unit test coverage to all aspects of the application. This will help create a stable application and allow faster development of increasingly complex functionality.",
            'Additionally, a number of significant refactors, documentation additions, code cleanup, renames, and reorganizations have been completed.',
        ],
        details: [
            'The project has its first GitHub contributor, @ambrossRake, who fixed a README typo!', // TODO link to user
            'The application now makes 1786 unit test assertions!',
            'A number of small user facing improvements, including bug fixes, item, room, and map generation improvements have been made.',
        ],
    },
    {
        title: 'Added A Unit Test Framework',
        version: '1.1.0',
        commit: '097dabf2971ca76974cbfedbe997e63cd503a204',
        date: '2020-04-12',
        description: [
            'Created a custom unit test framework as part of this project. This framework has been programmed partially as a personal challenge, to see if I could program a unit test framework, and secondly to avoid any dependencies on 3rd party libraries. While some 3rd party JavaScript libraries are fantastic, I wanted to avoid getting bogged down chasing package updates, compatibility issues, migration overhead, library limitations, etc.',
            'With a simple custom built unit test framework we can focus on adding great test coverage while keeping the application self-contained. It also encourages straightforward functional programming. Unit tests can be run in the browser at unit.html. Currently the application has 194 unit test assertions.', // TODO add link.
        ],
    },
    {
        title: 'Beta: Improved User Interface',
        version: '1.0.0',
        commit: 'ae68e42e3051d2156e2b7cb15a65ad8b5d5fcff9',
        date: '2020-02-17',
        description: [
            "The user interface has been overhauled. It's as good a time as any to tag the project as Beta!",
            "The generator's controls are now in a left-hand sidebar with collapsible sections. A retro pink and teal color pallette has been applied to the app.",
        ],
    },
    {
        title: 'Dungeon Maps & Traps',
        version: '0.12.0',
        commit: '203a0dc9a4fd0bc8536aec1b23af9e1ebd3250ba',
        date: '2020-01-01',
        details: [
            'Added a maps input which randomly distributes one or more maps throughout the dungeon. Maps are itemized with room descriptions.',
            'Added a traps slider which controls the probability that a trap will be placed in a room. Traps are itemized with room descriptions and a "T" icon is placed in the lower left corner of trapped rooms on the dungeon grid.',
        ],
    },
    {
        title: 'Improved Room Descriptions',
        version: '0.11.0',
        commit: 'de8b39cd2673b8f5f607e3e042aee1be81f8fd13',
        date: '2019-12-31',
        details: [
            'Added room environment descriptions as part of room randomization; including room structure, air, ground, wall, and vegetation descriptions.',
            'Added room features, for example alters, candles, pits, torches, etc.',
            'Added furnishings to room contents.',
            'Containers are now filled with other items based on container capacity and item size.',
            'Added trinkets to item randomization.',
        ],
    },
    {
        title: 'Secret & Concealed Room Connections',
        version: '0.10.0',
        commit: 'af7bd9ec4678bd3d353041226a38d56f2572cb06',
        date: '2019-12-30',
        details: [
            'Added secret and concealed rooms and connections (doorways) to procedurally generated maps when maps are non-liner (generated with additional room connections).',
            'Added room dimensions to room description boxes.',
            'Added pillar graphics to large rooms.',
            'Made improvements and fixes to item configuration and generation.',
        ],
    },
    {
        title: 'Room Connection Configuration',
        version: '0.9.0',
        commit: '1671a0c61bd1a6a028315b48aca7f4e5618d3ba5',
        date: '2019-12-29',
        description: [
            'A new connections slider control has been added which adjusts the probability that a room will be connected to an adjacent room. Setting connections to zero will make dungeons linear, while stetting connections to 100 will place a doorway between ever adjacent room.',
        ],
        details: [
            'Added doorway descriptions to the room description boxes when rooms are generated as part of a dungeon. Doorway directions and room connections in the descriptions correlate to the generated map.',
            'Improved wall and room corner detection during procedural generation.',
        ],
    },
    {
        title: 'Dungeon Generation Improvements',
        version: '0.8.0',
        commit: 'd2edc71309f068823a52c7a2d897895cbfa91d63',
        date: '2019-12-28',
        details: [
            'Added room type labels to the dungeon map.',
            'Added a slider interface for the dungeon complexity control.',
            'Added doorway and passageway types including simple graphical representations on the map.',
            'Hallway junction logic has been added.',
            'A legend has been added below the map.',
        ],
    },
    {
        title: 'Dungeon Generation Improvements',
        version: '0.7.0',
        commit: 'ace333a1e82e7b949cd2e3ca91426437e3ecc315',
        date: '2019-12-27',
        details: [
            'Dungeon rooms are now generated based on randomized room sizes.',
            'Room descriptions and contents are now generated with dungeons. Room descriptions are corresponded to the map by number.',
            'Doorway connections have been added between rooms.',
            'The dungeon entryway, which is always at the edge of the map, is now a doorway.',
            'Hallway room types, which have custom dimensions, have been added.',
        ],
    },
    {
        title: 'Dungeon Grid Generator',
        version: '0.6.0',
        commit: '31bfa0034e0a849065086fb9cfcab9ef6d476668',
        date: '2019-12-26',
        description: [
            'Added a simple dungeon grid generator which procedurally places a series of adjacent rooms on the grid. The map is drawn as a Scalable Vector Graphic (SVG).',
        ],
    },
    {
        title: 'Multi-room Generation & Item Type Controls',
        version: '0.5.0',
        commit: 'efe6b475c4a806e378f6e1202489fa839ac7ec89',
        date: '2019-12-24',
        details: [
            'Added the ability to generate any number of rooms simultaneously.',
            'Added item type controls.',
            'Added separate pages for generating dungeons, rooms, and items. Note, the dungeon generation page is currently just a placeholder.',
        ],
    },
    {
        title: 'Item Rarity, Room Types, Distribution Tables, & Interface Improvements',
        version: '0.4.0',
        commit: 'c1495bb1eee6eb09ab7416c08c85fa4ae59c9369',
        date: '2019-12-21',
        details: [
            'Added informational descriptions to each generator control, via a "?" button.',
            'Added room types to room descriptions and randomization.',
            'Added a condition distribution table.',
            'Added an item uniformity chance which controls the probability that a set of items will share the same condition.',
            'Added a quantity property to item configurations for items which should appear in sets, such as arrows, fruit, etc.',
        ],
    },
    {
        title: 'Item Generation Improvements',
        version: '0.3.0',
        commit: 'c2bae8c55af1be20735fdcee4523f0ffbf9bbc9a',
        date: '2019-12-21',
        details: [
            'Added numerous items.',
            'Added item categories.',
            'Added an item rarity property to items and a rarity distribution table. The rarity distribution table controls the frequency of each item based on their rarity, common to rare, during randomization.',
        ],
    },
    {
        title: 'Item Generator',
        version: '0.2.0',
        commit: '9ab50a1fd86518309c28894b6fb8918e100977c1',
        date: '2019-12-18',
        description: [
            'What good is a dungeon room without great loot in it!?',
        ],
        details: [
            'Added a random item generator to accompany room descriptions.',
            'Item generation includes condition and quantity controls.',
            'Some items are configured with multiple variations and/or quantity ranges.',
        ],
    },
    {
        title: 'Initial Alpha: Room Generator',
        version: '0.1.0',
        commit: '6ffd591b5353f2a269ef3dd261b0f3cc3fd99ab5',
        date: '2019-12-07',
        description: [
            'The the initial release of the D&D Generator app!',
            "Why am I creating this? It's winter in 2019 I am stuck at the in-laws; so I'm challenging myself to program a procedurally generated game map. JavaScript sounds like a good choice, plus that way anyone can run the app in a web browser.",
            'The app is basic right now, rendering an interface which allows users to configure and generate a simple room description including room contents. Gotta start somewhere!',
        ],
    },
];

export const currentVersion = releaseNotes[0].version;

// -- Public Functions ---------------------------------------------------------

/**
 * Formats content for the release notes page.
 *
 * @param {ReleaseNote[]} notes
 *
 * @returns {string}
 */
export const formatNotes = (notes) =>
    div(notes.map(({ title: noteTitle, version, date, description, details }) => {
        let imgSrc = `/img/notes/v${version}.jpg`;

        return article(
            header(title(noteTitle, { 'data-font-size': 'title' }))
            + subtitle(link(`v${version}`, getGitHubTagUrl(version), { target: '_blank' }))
            + paragraph(new Date(`${date} PST`).toLocaleDateString('en-us', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'}))
            + (description ? description.map((p) => paragraph(p)).join('') : '')
            + (details ? list(details, { 'data-spacing': 'b' }) : '')
            + link(element('img', undefined, { src: imgSrc }), imgSrc, { target: '_blank' })
        );
    }).join(''), { 'data-grid': '' });
