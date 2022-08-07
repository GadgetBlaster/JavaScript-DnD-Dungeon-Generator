// @ts-check

import {
    // Config
    knobConfig,

    // Private Functions
    testGetFields as getFields,

    // Public Functions
    getKnobConfig,
} from '../knobs.js';

import { generators } from '../controller.js';

/** @typedef {import('../knobs.js').KnobConfig} KnobConfig */

const validFieldValueTypes = new Set([ 'number', 'string' ]);

const generatorValues = Object.values(generators);

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {

    // -- Config ---------------------------------------------------------------

    describe('knobs', () => {
        it('is an array', () => {
            assert(knobConfig).isArray();
        });

        describe('each knob configs', () => {
            knobConfig.forEach((knobs) => {
                it('is an object', () => {
                    assert(knobs).isObject();
                });

                it('has label and generators properties', () => {
                    assert(knobs.label).isString();

                    knobs.generators.forEach((generator) => {
                        assert(generator).isInArray(generatorValues);
                    });
                });

                describe(`${knobs.label} field config`, () => {
                    knobs.fields.forEach((fieldConfig) => {
                        it('is an object', () => {
                            assert(fieldConfig).isObject();
                        });

                        it('has correctly configured configs', () => {
                            assert(fieldConfig.label).isString();
                            assert(fieldConfig.name).isString();
                            assert(fieldConfig.desc).isString();
                            assert(fieldConfig.type).isString();

                            fieldConfig.min    && assert(fieldConfig.min).isNumber();
                            fieldConfig.max    && assert(fieldConfig.max).isNumber();
                            fieldConfig.values && assert(fieldConfig.values).isArray();
                            fieldConfig.value  && assert(validFieldValueTypes.has(typeof fieldConfig.value)).isTrue();

                            if (fieldConfig.generators) {
                                fieldConfig.generators.forEach((generator) =>
                                    assert(generator).isInArray(generatorValues));
                            }
                        });
                    });
                });
            });
        });
    });

    // -- Private Functions ----------------------------------------------------

    describe('getFields()', () => {
        /** @type {KnobConfig} */
        const fakeKnobs = {
            label: 'Fake Dungeon Knobs',
            generators : new Set([ 'maps' ]),
            fields: [
                {
                    label : 'Complexity',
                    name  : 'dungeonComplexity',
                    desc  : 'Fake complexity knob',
                    type  : 'range',
                    min   : 2,
                    max   : 11,
                    value : 5,
                },
                {
                    label : 'Maps',
                    name  : 'dungeonMaps',
                    desc  : 'Fake maps knob',
                    type  : 'number',
                    value : 2,
                },
            ],
        };

        describe('when none of the fields in the knob config have a generators property', () => {
            it('returns the knob config unmodified', () => {
                const result = getFields(fakeKnobs, 'maps');
                assert(result).equalsObject(fakeKnobs);
            });
        });

        describe('when a field in the knob config has a generators property', () => {
            /** @type {KnobConfig} */
            const fakeKnobsCopy = {
                ...fakeKnobs,
                fields: [
                    ...fakeKnobs.fields,
                    {
                        label : 'Rooms',
                        name  : 'roomCount',
                        desc  : 'Number of rooms to generate',
                        type  : 'number',
                        generators : new Set([ 'rooms' ]),
                        value : 1,
                    },
                ],
            };

            describe('when the current generator is not included in the generators property', () => {
                it('returns the knob config with the field excluded', () => {
                    const result = getFields(fakeKnobsCopy, 'maps');
                    assert(result).equalsObject(fakeKnobs);
                });
            });

            describe('when the current generator is included in the generators property', () => {
                it('returns the knob config unmodified', () => {
                    const result = getFields(fakeKnobsCopy, 'rooms');
                    assert(result).equalsObject(fakeKnobsCopy);
                });
            });
        });

        describe('given a config object', () => {
            it('returns the knob config with the values from the config object assigned', () => {
                const result = getFields(fakeKnobs, 'maps', {
                    dungeonComplexity: 8,
                    dungeonMaps: 4,
                });

                assert(result.fields.find(({ name }) => name === 'dungeonComplexity').value).equals(8);
                assert(result.fields.find(({ name }) => name === 'dungeonMaps').value).equals(4);
            });
        });
    });

    // -- Public Functions -----------------------------------------------------

    describe('getKnobConfig()', () => {
        /** @type {KnobConfig[]} */
        const fakeKnobConfig = [
            {
                label : 'Fake Dungeon Knobs',
                generators : new Set([ 'maps' ]),
                fields: [
                    {
                        label : 'Complexity',
                        name  : 'dungeonComplexity',
                        desc  : 'Fake complexity knob',
                        type  : 'range',
                        min   : 2,
                        max   : 11,
                        value : 5,
                    },
                    {
                        label : 'Maps',
                        name  : 'dungeonMaps',
                        desc  : 'Fake maps knob',
                        type  : 'number',
                        value : 2,
                    },
                ],
            },
            {
                label : 'Fake Room Settings',
                generators : new Set([ 'maps', 'rooms' ]),
                fields: [
                    {
                        label : 'Type',
                        name  : 'roomType',
                        desc  : 'Fake room type knob',
                        type  : 'select',
                        values: [ 'random', 'room', 'hallway' ],
                    },
                ],
            },
        ];

        describe('given a generator that contains all knobs', () => {
            it('returns the knob configs unmodified', () => {
                const result = getKnobConfig(fakeKnobConfig, 'maps');
                assert(result).equalsArray(fakeKnobConfig);
            });
        });

        describe('given a generator that contains some of the knobs', () => {
            it('returns only the knob configs appropriate to the given generator', () => {
                const result = getKnobConfig(fakeKnobConfig, 'rooms');
                assert(result).equalsArray([ fakeKnobConfig[1] ]);
            });
        });

        describe('given a config object', () => {
            it('returns the knob configs with the values from the config object assigned', () => {
                const result = getKnobConfig(fakeKnobConfig, 'maps', {
                    dungeonComplexity: 8,
                    dungeonMaps: 4,
                    roomType: 'library',
                });

                assert(result[0].fields.find(({ name }) => name === 'dungeonComplexity').value).equals(8);
                assert(result[0].fields.find(({ name }) => name === 'dungeonMaps').value).equals(4);
                assert(result[1].fields.find(({ name }) => name === 'roomType').value).equals('library');
            });
        });
    });
};
