
import assert from './test/tests.assert.js';
import output from './test/tests.output.js';
import run from './test/tests.run.js';
import unit from './test/tests.unit.js';

import html from '../app/utility/test/tests.html.js';
import roll from '../app/utility/test/tests.roll.js';
import tests from '../app/utility/test/tests.tests.js';
import tools from '../app/utility/test/tests.tools.js';

import action from '../app/ui/test/tests.action.js';
import block from '../app/ui/test/tests.block.js';
import button from '../app/ui/test/tests.button.js';
import field from '../app/ui/test/tests.field.js';
import form from '../app/ui/test/tests.form.js';
import list from '../app/ui/test/tests.list.js';
import nav from '../app/ui/test/tests.nav.js';
import typography from '../app/ui/test/tests.typography.js';

import roomDescription from '../app/rooms/test/tests.description.js';
import roomDimensions from '../app/rooms/test/tests.dimensions.js';
import door from '../app/rooms/test/tests.door.js';
import environment from '../app/rooms/test/tests.environment.js';
import feature from '../app/rooms/test/tests.feature.js';
import generate from '../app/rooms/test/tests.generate.js';
import settings from '../app/rooms/test/tests.settings.js';

export default {
    '/unit/test/tests.assert.js': assert,
    '/unit/test/tests.output.js': output,
    '/unit/test/tests.run.js'   : run,
    '/unit/test/tests.unit.js'  : unit,

    '/app/utility/test/tests.html.js' : html,
    '/app/utility/test/tests.roll.js' : roll,
    '/app/utility/test/tests.tests.js': tests,
    '/app/utility/test/tests.tools.js': tools,

    '/app/ui/test/tests.action.js'    : action,
    '/app/ui/test/tests.block.js'     : block,
    '/app/ui/test/tests.button.js'    : button,
    '/app/ui/test/tests.field.js'     : field,
    '/app/ui/test/tests.form.js'      : form,
    '/app/ui/test/tests.list.js'      : list,
    '/app/ui/test/tests.nav.js'       : nav,
    '/app/ui/test/tests.typography.js': typography,

    '/app/rooms/test/tests.description.js': roomDescription,
    '/app/rooms/test/tests.dimensions.js' : roomDimensions,
    '/app/rooms/test/tests.door.js'       : door,
    '/app/rooms/test/tests.environment.js': environment,
    '/app/rooms/test/tests.feature.js'    : feature,
    '/app/rooms/test/tests.generate.js'   : generate,
    '/app/rooms/test/tests.settings.js'   : settings,
};
