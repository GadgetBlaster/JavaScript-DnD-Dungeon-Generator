
import assert from './test/tests.assert.js';
import output from './test/tests.output.js';
import run from './test/tests.run.js';
import unit from './test/tests.unit.js';

import html from '../utility/test/tests.html.js';
import roll from '../utility/test/tests.roll.js';
import tests from '../utility/test/tests.tests.js';
import tools from '../utility/test/tests.tools.js';

import action from '../ui/test/tests.action.js';
import block from '../ui/test/tests.block.js';
import button from '../ui/test/tests.button.js';
import field from '../ui/test/tests.field.js';
import form from '../ui/test/tests.form.js';
import link from '../ui/test/tests.link.js';
import list from '../ui/test/tests.list.js';
import nav from '../ui/test/tests.nav.js';
import typography from '../ui/test/tests.typography.js';

import roomDescription from '../rooms/test/tests.description.js';
import roomDimensions from '../rooms/test/tests.dimensions.js';
import door from '../rooms/test/tests.door.js';
import environment from '../rooms/test/tests.environment.js';
import feature from '../rooms/test/tests.feature.js';
import generateRooms from '../rooms/test/tests.generate.js';
import settings from '../rooms/test/tests.settings.js';
import trap from '../rooms/test/tests.trap.js';
import type from '../rooms/test/tests.type.js';
import vegetation from '../rooms/test/tests.vegetation.js';

import itemDescription from '../items/test/tests.description.js';
import generateItems from '../items/test/tests.generate.js';

export default {
    '/app/unit/test/tests.assert.js': assert,
    '/app/unit/test/tests.output.js': output,
    '/app/unit/test/tests.run.js'   : run,
    '/app/unit/test/tests.unit.js'  : unit,

    '/app/utility/test/tests.html.js' : html,
    '/app/utility/test/tests.roll.js' : roll,
    '/app/utility/test/tests.tests.js': tests,
    '/app/utility/test/tests.tools.js': tools,

    '/app/ui/test/tests.action.js'    : action,
    '/app/ui/test/tests.block.js'     : block,
    '/app/ui/test/tests.button.js'    : button,
    '/app/ui/test/tests.field.js'     : field,
    '/app/ui/test/tests.form.js'      : form,
    '/app/ui/test/tests.link.js'      : link,
    '/app/ui/test/tests.list.js'      : list,
    '/app/ui/test/tests.nav.js'       : nav,
    '/app/ui/test/tests.typography.js': typography,

    '/app/rooms/test/tests.description.js': roomDescription,
    '/app/rooms/test/tests.dimensions.js' : roomDimensions,
    '/app/rooms/test/tests.door.js'       : door,
    '/app/rooms/test/tests.environment.js': environment,
    '/app/rooms/test/tests.feature.js'    : feature,
    '/app/rooms/test/tests.generate.js'   : generateRooms,
    '/app/rooms/test/tests.settings.js'   : settings,
    '/app/rooms/test/tests.trap.js'       : trap,
    '/app/rooms/test/tests.type.js'       : type,
    '/app/rooms/test/tests.vegetation.js' : vegetation,

    '/app/item/test/tests.description.js' : itemDescription,
    '/app/item/test/tests.generate.js'    : generateItems,
};
