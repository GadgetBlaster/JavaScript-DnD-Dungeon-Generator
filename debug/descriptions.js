
import {
    _getDescription,
    _getDoorwayDescription,
    _getRoomDoorwayDescription,
} from '../app/rooms/description.js';
import { knobs } from '../app/knobs.js';
import { list } from '../app/ui/list.js';

import roomType from '../app/rooms/type.js';
import conditions from '../app/attributes/condition.js';
import sizes from '../app/attributes/size.js';
import quantities from '../app/attributes/quantity.js';
import doorType, { outside } from '../app/rooms/door.js';
import { directions } from '../app/dungeons/map.js';

/**
 * Room configs
 *
 * @type {object[]}
 */
const roomConfigs = Object.values(roomType).reduce((combos, type) => {
    let typeConfig  = { [knobs.roomType]: type };
    let emptyConfig = { [knobs.itemQuantity]: quantities.zero };

    combos.push(typeConfig);
    combos.push({ ...typeConfig, ...emptyConfig });

    Object.values(conditions).forEach((condition) => {
        let conditionConfig = { [knobs.roomCondition]: condition };

        combos.push({ ...typeConfig, ...conditionConfig });
        combos.push({ ...typeConfig, ...conditionConfig, ...emptyConfig });

        Object.values(sizes).forEach((size) => {
            let sizeConfig = { [knobs.roomSize]: size };

            combos.push({ ...typeConfig, ...sizeConfig });
            combos.push({ ...typeConfig, ...sizeConfig, ...emptyConfig });
            combos.push({ ...typeConfig, ...sizeConfig, ...conditionConfig, ...emptyConfig });
        });
    });

    return combos;
}, []);

/**
 * Door configs
 *
 * @type {object[]}
 */
const doorConfigs = Object.values(doorType).reduce((combos, type) => {
    combos.push({ type });

    [ 1, 2, 3, 4, ].forEach((size) => {
        combos.push({ type, size });
        combos.push({ type, size, locked: true });
    });

    return combos;
}, []);

/**
 * Room door configs
 *
 * @type {object[]}
 */
const roomDoorConfigs = doorConfigs.reduce((configs, config) => {
    if (config.type === doorType.secret || config.type === doorType.concealed) {
        return configs;
    }

    configs.push([ { ...config, connection: { direction: directions.north, to: 1 } } ]);
    configs.push([ { ...config, connection: { direction: directions.north, to: outside } } ]);
    configs.push([
        { ...config, connection: { direction: directions.north, to: 1 } },
        { ...config, connection: { direction: directions.south, to: 2 } },
    ]);

    return configs;
}, []).filter(Boolean);

/**
 * Room descriptions
 *
 * @returns {string}
 */
export const roomDescriptions = () => list(
    roomConfigs.map((config) => _getDescription(config) + '.')
);

/**
 * Door descriptions
 *
 * @returns {string}
 */
export const doorDescriptions = () => list(
    doorConfigs.map((config) => _getDoorwayDescription(config))
);

/**
 * Door descriptions
 *
 * @returns {string}
 */
export const roomDoorDescriptions = () => list(
    roomDoorConfigs.map((config) => _getRoomDoorwayDescription(config))
);
