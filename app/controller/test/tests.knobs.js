// @ts-check

import {
    // Config
    knobConfig,

    // Private Functions
    testGetFields as getFields,

    // Public Functions
    getKnobConfig,
} from '../knobs.js';

import { pages } from '../controller.js';

/** @typedef {import('../knobs.js').KnobConfig} KnobConfig */

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

                it('has label and pages properties', () => {
                    assert(knobs.label).isString();

                    knobs.pages.forEach((page) => {
                        assert(pages.includes(page)).isTrue();
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

                            fieldConfig.min && assert(fieldConfig.min).isNumber();
                            fieldConfig.max && assert(fieldConfig.max).isNumber();
                            fieldConfig.value && assert(typeof fieldConfig.value === 'number' || typeof fieldConfig.value === 'string').isTrue();
                            fieldConfig.values && assert(fieldConfig.values).isArray();

                            if (fieldConfig.pages) {
                                fieldConfig.pages.forEach((page) => assert(pages.includes(page)).isTrue());
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
            pages : new Set([ 'dungeon' ]),
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

        describe('when none of the fields in the knob config have a pages property', () => {
            it('returns the knob config unmodified', () => {
                const result = getFields(fakeKnobs, 'dungeon');
                assert(result).equalsObject(fakeKnobs);
            });
        });

        describe('when a field in the knob config has a pages property', () => {
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
                        pages : new Set([ 'rooms' ]),
                        value : 1,
                    },
                ],
            };

            describe('when the current page is not included in the pages property', () => {
                it('returns the knob config with the field excluded', () => {
                    const result = getFields(fakeKnobsCopy, 'dungeon');
                    assert(result).equalsObject(fakeKnobs);
                });
            });

            describe('when the current page is included in the pages property', () => {
                it('returns the knob config unmodified', () => {
                    const result = getFields(fakeKnobsCopy, 'rooms');
                    assert(result).equalsObject(fakeKnobsCopy);
                });
            });
        });

        describe('given a config object', () => {
            it('returns the knob set with the values from the config assigned', () => {
                const result = getFields(fakeKnobs, 'dungeon', {
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
        const fakeKnobs = [
            {
                label : 'Fake Dungeon Knobs',
                pages : new Set([ 'dungeon' ]),
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
                pages : new Set([ 'dungeon', 'rooms' ]),
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

        describe('given a page that contains all knobs', () => {
            it('returns the knob configs unmodified', () => {
                const result = getKnobConfig(fakeKnobs, 'dungeon');
                assert(result).equalsArray(fakeKnobs);
            });
        });

        describe('given a page that contains some of the knobs', () => {
            it('returns only the knob configs appropriate to the given page', () => {
                const result = getKnobConfig(fakeKnobs, 'rooms');
                assert(result).equalsArray([ fakeKnobs[1] ]);
            });
        });
    });
};
