// @ts-check

import {
    // Config
    testKnobs as knobs,
} from '../knobs.js';

import { pages } from '../../ui/nav.js';

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {

    // -- Config ---------------------------------------------------------------

    describe('knobs', () => {
        it('is an array of objects', () => {
            assert(knobs).isArray();
            knobs.forEach((knobConfig) => {
                assert(knobConfig).isObject();
            });
        });

        describe('each knob config', () => {
            it('has correct label, pages, and fields properties', () => {
                knobs.forEach((knobConfig) => {
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
