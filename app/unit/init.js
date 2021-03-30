
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

/**
 * Container unit test output is rendered to.
 *
 * @type {Element}
 */
 const contentContainer = document.getElementById('content');

 /**
 * Container unit test navigation is rendered to.
 *
 * @type {Element}
 */
 const navContainer = document.getElementById('nav');

// -- Initialization -----------------------------------------------------------

render({ contentContainer, navContainer }, suite, useState(), { scope, verbose });
