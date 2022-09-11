// @ts-check

import assert from './test/tests.assert.js';
import output from './test/tests.output.js';
import run    from './test/tests.run.js';
import state  from './test/tests.state.js';

import element from '../utility/test/tests.element.js';
import roll    from '../utility/test/tests.roll.js';
import shape   from '../utility/test/tests.shape.js';
import tools   from '../utility/test/tests.tools.js';
import xhr     from '../utility/test/tests.xhr.js';

import condition from '../attribute/test/tests.condition.js';
import quantity  from '../attribute/test/tests.quantity.js';
import rarity    from '../attribute/test/tests.rarity.js';
import size      from '../attribute/test/tests.size.js';

import controller from '../controller/test/tests.controller.js';
import formatter  from '../controller/test/tests.formatter.js';
import knobs      from '../controller/test/tests.knobs.js';

import block      from '../ui/test/tests.block.js';
import button     from '../ui/test/tests.button.js';
import field      from '../ui/test/tests.field.js';
import footer     from '../ui/test/tests.footer.js';
import form       from '../ui/test/tests.form.js';
import link       from '../ui/test/tests.link.js';
import list       from '../ui/test/tests.list.js';
import nav        from '../ui/test/tests.nav.js';
import spinner    from '../ui/test/tests.spinner.js';
import typography from '../ui/test/tests.typography.js';

import generateItems   from '../item/test/tests.generate.js';
import item            from '../item/test/tests.item.js';

import roomDescription from '../room/test/tests.description.js';
import roomDimensions  from '../room/test/tests.dimensions.js';
import door            from '../room/test/tests.door.js';
import environment     from '../room/test/tests.environment.js';
import feature         from '../room/test/tests.feature.js';
import generateRooms   from '../room/test/tests.generate.js';
import vegetation      from '../room/test/tests.vegetation.js';

import draw     from '../dungeon/test/tests.draw.js';
import generate from '../dungeon/test/tests.generate.js';
import grid     from '../dungeon/test/tests.grid.js';
import legend   from '../dungeon/test/tests.legend.js';
import map      from '../dungeon/test/tests.map.js';

import notes from '../pages/test/tests.notes.js';

// -- Config -------------------------------------------------------------------

export default {
    '/app/unit/test/tests.assert.js': assert,
    '/app/unit/test/tests.output.js': output,
    '/app/unit/test/tests.run.js'   : run,
    '/app/unit/test/tests.state.js' : state,

    '/app/utility/test/tests.element.js': element,
    '/app/utility/test/tests.roll.js'   : roll,
    '/app/utility/test/tests.shape.js'  : shape,
    '/app/utility/test/tests.tools.js'  : tools,
    '/app/utility/test/tests.xhr.js'    : xhr,

    '/app/attribute/test/tests.condition.js': condition,
    '/app/attribute/test/tests.quantity.js' : quantity,
    '/app/attribute/test/tests.rarity.js'   : rarity,
    '/app/attribute/test/tests.size.js'     : size,

    '/app/controller/test/tests.controller.js': controller,
    '/app/controller/test/tests.formatter.js':  formatter,
    '/app/controller/test/tests.knobs.js':      knobs,

    '/app/ui/test/tests.block.js'     : block,
    '/app/ui/test/tests.button.js'    : button,
    '/app/ui/test/tests.field.js'     : field,
    '/app/ui/test/tests.footer.js'    : footer,
    '/app/ui/test/tests.form.js'      : form,
    '/app/ui/test/tests.link.js'      : link,
    '/app/ui/test/tests.list.js'      : list,
    '/app/ui/test/tests.nav.js'       : nav,
    '/app/ui/test/tests.spinner.js'   : spinner,
    '/app/ui/test/tests.typography.js': typography,

    '/app/item/test/tests.generate.js'    : generateItems,
    '/app/item/test/tests.item.js'        : item,

    '/app/room/test/tests.description.js': roomDescription,
    '/app/room/test/tests.dimensions.js' : roomDimensions,
    '/app/room/test/tests.door.js'       : door,
    '/app/room/test/tests.environment.js': environment,
    '/app/room/test/tests.feature.js'    : feature,
    '/app/room/test/tests.generate.js'   : generateRooms,
    '/app/room/test/tests.vegetation.js' : vegetation,

    '/app/dungeon/test/tests.draw.js'    : draw,
    '/app/dungeon/test/tests.generate.js': generate,
    '/app/dungeon/test/tests.grid.js'    : grid,
    '/app/dungeon/test/tests.legend.js'  : legend,
    '/app/dungeon/test/tests.map.js'     : map,

    '/app/pages/test/tests.notes.js': notes,
};
