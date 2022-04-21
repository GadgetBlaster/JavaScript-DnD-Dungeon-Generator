// @ts-check

import {
    // Config
    testKnobs as knobs,
} from '../knobs.js';

import { pages } from '../controller.js';

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {

    // -- Config ---------------------------------------------------------------

    describe('knobs', () => {
        it('is an array', () => {
            assert(knobs).isArray();
        });

        describe('each knob config', () => {
            knobs.forEach((knobConfig) => {
                it('is an object', () => {
                    assert(knobConfig).isObject();
                });

                it('has label, pages, and fields properties', () => {
                    assert(knobConfig.label).isString();

                    [ ...knobConfig.pages ].forEach((page) => {
                        assert(pages.includes(page)).isTrue();
                    });

                    [ ...knobConfig.fields ].forEach((fields) => {
                        assert(fields).isObject();

                        assert(fields.label).isString();
                        assert(fields.name).isString();
                        assert(fields.desc).isString();
                        assert(fields.type).isString();
                        // TODO optional configs
                    });
                });
            });
        });
    });
};
