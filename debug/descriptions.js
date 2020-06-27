
import { getBaseDescription } from '../app/rooms/description.js';
import { knobs } from '../app/knobs.js';
import { list } from '../app/ui/list.js';

import roomTypes from '../app/rooms/type.js';
import conditions from '../app/attributes/condition.js';
import sizes from '../app/attributes/size.js';
import quantities from '../app/attributes/quantity.js';

/**
 * Configs
 *
 * @type {Object[]}
 */
const configs = Object.values(roomTypes).reduce((combos, type) => {
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
}, [ {} ]);

/**
 * Room descriptions
 *
 * @returns {string}
 */
export const roomDescriptions = () => list(
    configs.map((config) => getBaseDescription(config) + '.')
);
