// @ts-check

import { getTestNav, getOutput } from './unit/output.js';
import { toss } from './utility/tools.js';
import { unitState } from './unit/state.js';
import suite from './unit/suite.js';

// -- Config -------------------------------------------------------------------

/**
 * Container unit test output is rendered to.
 */
const contentContainer = document.getElementById('content');

/**
 * Container unit test navigation is rendered to.
 */
const navContainer = document.getElementById('nav');

/**
 * URL params
 */
const urlParams = new URLSearchParams(window.location.search);

/**
 * URL parameter to run a specific test file.
 */
const scope = urlParams.get('scope') || undefined;

/**
 * URL parameter to include verbose output.
 */
const verbose = Boolean(urlParams.get('verbose'));

// -- Render -------------------------------------------------------------------

if (!navContainer)     { toss('Cannot find nav element'); }
if (!contentContainer) { toss('Cannot find content element'); }

navContainer.innerHTML     = getTestNav({ scope, verbose });
contentContainer.innerHTML = getOutput(unitState(), suite, {
    scope,
    verbose,
    onError: console.error,
    onSuccess: console.log,
});
