
import { render } from './render.js';
import { useState } from './state.js';
import suite from './suite.js';

// -- Config -------------------------------------------------------------------

/**
 * URL params
 *
 * @type {URLSearchParams}
 */
const urlParams = new URLSearchParams(window.location.search);

/**
 * URL parameter to run a specific test file.
 *
 * @type {string}
 */
const scope = urlParams.get('scope');

/**
 * URL parameter to include verbose output.
 *
 * @type {boolean}
 */
const verbose = Boolean(urlParams.get('verbose'));

const elements = {
    dotsContainer   : document.getElementById('dots'),
    infoContainer   : document.getElementById('info'),
    listContainer   : document.getElementById('list'),
    navContainer    : document.getElementById('nav'),
    headerContainer : document.getElementById('header'),
};

// -- Initialization -----------------------------------------------------------

render(elements, suite, useState(), { scope, verbose });
