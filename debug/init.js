
import { list } from '../app/ui/list.js';
import { element } from '../app/utility/html.js';
import { toWords } from '../app/utility/tools.js';

import {
    doorDescriptions,
    roomDescriptions,
    roomDoorDescriptions,
} from './descriptions.js';

const titleContainer   = document.getElementById('title');
const contentContainer = document.getElementById('content');

/**
 * URL params
 *
 * @type {URLSearchParams}
 */
const urlParams = new URLSearchParams(window.location.search);

/**
 * Link
 *
 * @param {string} label
 *
 * @returns {string}
 */
const link = (label) => element('a', toWords(label), { href: `./debug.html?scope=${label}` });

/**
 * Sections
 *
 * @returns {object<string, array>}
 */
const sections = {
    doorDescriptions,
    roomDescriptions,
    roomDoorDescriptions,
};

/**
 * Get list
 *
 * @returns {string}
 */
const getList = () => list(Object.keys(sections).map((title) => link(title)));

(() => {
    let section  = urlParams.get('scope');
    let getter   = sections[section] || getList;
    let backLink = section ? element('a', 'Back', { href: `./debug.html` }) : '';

    titleContainer.innerHTML   = 'Debug Tools' + (section ? `: ${toWords(section)}` : '');
    contentContainer.innerHTML = backLink + getter(urlParams);
})();
