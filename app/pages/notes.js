// @ts-check

import { article, div, header } from '../ui/block.js';
import { list } from '../ui/list.js';
import { link } from '../ui/link.js';
import { paragraph, subtitle, title } from '../ui/typography.js';
import { element } from '../utility/element.js';

// TODO tests

// -- Types --------------------------------------------------------------------

/**
 * @typedef {object} ReleaseNote
 *
 * @prop {string} title
 * @prop {string} version
 * @prop {string} date
 * @prop {string[]} description
 * @prop {string[]} details
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
const notes = [
    {
        title: 'Item Generator',
        version: '0.2.0',
        date: '2019-12-18',
        description: [
            'What good is a dungeon room without great loot in it!?',
        ],
        details: [
            'Added a random item generator to accompany room descriptions.',
        ],
    },
    {
        title: 'Initial Release',
        version: '0.1.0',
        date: '2019-12-07',
        description: [
            'The the initial release of the D&D Generator app!',
            "Why am I creating this? It's winter in 2019 I am stuck at the in-laws; so I'm challenging myself to program a procedurally generated game map. JavaScript sounds like a good choice, plus that way anyone can run the app in a web browser.",
            'The app is basic right now, rendering an interface which allows users to configure and generate a simple room & room contents description.',
        ],
        details: [
            'Added a room description generator.',
        ],
    },
];

export const currentVersion = notes[0].version;

// -- Public Functions ---------------------------------------------------------

/**
 * Returns formatted content for the release notes page.
 *
 * @returns {string}
 */
export const getFormattedNotes = () =>
    div(notes.map(({ title: noteTitle, version, date, description, details }) => {
        let imgSrc = `/img/notes/v${version}.jpg`;

        return article(
            header(title(noteTitle, { 'data-font-size': 'title' }))
            + subtitle(link(`v${version}`, getGitHubTagUrl(version), { target: '_blank' }))
            + paragraph(new Date(`${date} PST`).toLocaleDateString('en-us', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'}))
            + description.map((p) => paragraph(p)).join('')
            + (details.length ? list(details, { 'data-spacing': 'b' }) : '')
            + link(element('img', undefined, { src: imgSrc }), imgSrc, { target: '_blank' })
        );
    }).join(''), { 'data-grid': '' });
