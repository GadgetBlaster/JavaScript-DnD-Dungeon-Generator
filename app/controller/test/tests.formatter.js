// @ts-check

import {
    // Private Functions
    testFormatDetail        as formatDetail,
    testFormatItemContent   as formatItemContent,
    testFormatRoom          as formatRoom,
    testFormatRoomGrid      as formatRoomGrid,
    testGetItemDescription  as getItemDescription,
    testGetItemTotal        as getItemTotal,

    // Public Functions
    formatDungeon,
    formatError,
    formatItems,
    formatName,
    formatReadyState,
    formatRooms,
} from '../formatter.js';

import { parseHtml } from '../../utility/element.js';

/** @typedef {import('../../dungeon/map').Door} Door */
/** @typedef {import('../../item/generate').Container} Container */
/** @typedef {import('../../item/generate').Item} Item */
/** @typedef {import('../../item/generate').ItemSet} ItemSet */
/** @typedef {import('../../room/generate').RandomizedRoomConfig} RandomizedRoomConfig */
/** @typedef {import('../../room/generate').Room} Room */

/** @type {RandomizedRoomConfig} */
const randomizedRoomConfig = {
    itemCondition         : 'average',
    itemQuantity          : 'zero',
    itemRarity            : 'average',
    itemType              : 'random',
    roomCondition         : 'average',
    roomCount             : 1,
    roomFurnitureQuantity : 'average',
    roomSize              : 'small',
    roomType              : 'room',
};

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {

    // -- Private Functions ----------------------------------------------------

    describe('formatDetail()', () => {
        const body    = parseHtml(formatDetail('super fragilistic'));
        const element = body.children.item(0);

        it('returns an HTML span element', () => {
            assert(element.tagName).equals('SPAN');
        });

        it('contains the given label', () => {
            assert(element.textContent).stringIncludes('super fragilistic');
        });

        it('has a data-detail attributes', () => {
            assert(element).hasAttributes({ 'data-detail' : '' });
        });
    });


    describe('formatItemContent()', () => {
        /** @type {ItemSet} */
        const itemSet = {
            containers: [],
            items     : [],
        };

        /** @type {Item} */
        const item = {
            name: 'Cloak',
            condition: 'average',
            rarity: 'average',
            size: 'small',
            type: 'container',
            count: 1,
        };

        /** @type {Container} */
        const container = {
            name: 'Bucket',
            condition: 'average',
            rarity: 'average',
            size: 'small',
            type: 'container',
            count: 1,
            contents: [ item, item, item ],
        };

        describe('given no items or containers', () => {
            it('returns an empty string', () => {
                assert(formatItemContent(itemSet)).equals('');
            });
        });

        describe('given items', () => {
            const itemOnlySet = {
                ...itemSet,
                items: [ item, item, item, item ],
            };

            it('render a list of item', () => {
                const body = parseHtml(formatItemContent(itemOnlySet));

                const lists = body.querySelectorAll('ul');

                assert(lists.length).equals(1);

                const items = lists.item(0).querySelectorAll('li');

                assert(items.length).equals(4);
            });

            describe('given more than one column', () => {
                it('render a data-columns attribute on on the item list', () => {
                    const body = parseHtml(formatItemContent(itemOnlySet, { columns: 3 }));
                    assert(body.querySelector('ul')).hasAttributes({ 'data-columns': '3' });
                });
            });
        });

        describe('given containers', () => {
            it('renders a section for each container containing an item list', () => {
                const body = parseHtml(formatItemContent({
                    ...itemSet,
                    containers: [ container, container ],
                }));

                const sections = body.querySelectorAll('section');

                assert(sections.length).equals(2);

                sections.forEach((section) => {
                    const list = section.querySelector('ul');
                    assert(Boolean(list)).isTrue();
                    assert(list.children.length).equals(3);
                });
            });
        });

        describe('given a condition uniformity', () => {
            const body = parseHtml(formatItemContent({
                ...itemSet,
                items: [ item, item, item ],
                conditionUniformity: 'busted',
            }));

            it('renders a paragraph describing the condition', () => {
                assert(body.querySelector('p').textContent).equals('Item condition: Busted');
            });

            it('excludes the condition label on individual items', () => {
                const list = body.querySelector('ul');

                assert(list.children.length).equals(3);
                [ ...list.children ].forEach((listItem) => {
                    assert(listItem.textContent)
                        .stringExcludes('busted')
                        .stringExcludes('condition');
                });
            });
        });

        describe('given a rarity uniformity', () => {
            const body = parseHtml(formatItemContent({
                ...itemSet,
                items: [ item, item, item ],
                rarityUniformity: 'legendary',
            }));

            it('renders a paragraph describing the rarity', () => {
                assert(body.querySelector('p').textContent).equals('Item rarity: Legendary');
            });

            it('excludes the condition label on individual items', () => {
                const list = body.querySelector('ul');

                assert(list.children.length).equals(3);
                [ ...list.children ].forEach((listItem) => {
                    assert(listItem.textContent).stringExcludes('legendary');
                });
            });
        });
    });

    describe('formatRoom()', () => {
        // TODO
    });

    describe('formatRoomGrid()', () => {
        /** @type {Room} */
        const room = {
            config: randomizedRoomConfig,
            itemSet: {
                containers: [],
                items     : [],
            },
            roomNumber: 1,
        };


        it('returns section with a grid of room articles', () => {
            const body    = parseHtml(formatRoomGrid([ room ]));
            const section = body.children.item(0);

            assert(body.children.length).equals(1);
            assert(section.tagName).equals('SECTION');
            assert(section).hasAttributes({ 'data-grid': '1' });
        });

        describe('given two rooms', () => {
            it('returns a grid with two columns', () => {
                const body = parseHtml(formatRoomGrid([ room, room ]));
                assert(body.children.item(0)).hasAttributes({ 'data-grid': '2' });
            });
        });

        describe('given three rooms', () => {
            it('returns a grid with three columns', () => {
                const body = parseHtml(formatRoomGrid([ room, room, room ]));
                assert(body.children.item(0)).hasAttributes({ 'data-grid': '3' });
            });
        });

        describe('given doors', () => {
            it('includes doorways with the room descriptions', () => {
                /** @type {Door} */
                const door = {
                    connect  : { 1: { direction: 'south', to: 2 } },
                    locked   : false,
                    rectangle: { width: 1, height: 1, x: 1, y: 1 },
                    type     : 'stone',
                };

                assert(formatRoomGrid([ room ], { 1: [ door ] }))
                    .stringIncludes('Doorways')
                    .stringIncludes('South: Stone doorway to room 2');
            });
        });
    });

    describe('getItemDescription()', () => {
        /** @type {Item} item */
        const item = {
            condition: 'average',
            count: 1,
            name: 'Goblin juice',
            rarity: 'abundant',
            size: 'medium',
            type: 'miscellaneous',
        };

        const args = {
            isConditionUniform: false,
            isRarityUniform: false,
        };

        describe('given an item count of 1', () => {
            it('returns the item label with no count', () => {
                assert(getItemDescription(item, args)).equals('Goblin juice');
            });
        });

        describe('given an item count larger than 1', () => {
            it('returns the item label with the count appended', () => {
                let desc = parseHtml(getItemDescription({ ...item, count: 12 }, args));
                assert(desc.textContent).equals('Goblin juice (12)');
            });
        });

        describe('given a rarity that should be indicated', () => {
            /** @type {Item} */
            const exoticItem = { ...item, rarity: 'exotic' };

            it('includes the rarity on the item label', () => {
                let desc = parseHtml(getItemDescription(exoticItem, args));
                assert(desc.textContent).equals('Goblin juice (exotic)');
            });

            describe('when rarity is uniform', () => {
                it('excludes the condition from the item label', () => {
                    let desc = parseHtml(getItemDescription(exoticItem, {
                        ...args,
                        isRarityUniform: true,
                    }));

                    assert(desc.textContent).equals('Goblin juice');
                });
            });
        });

        describe('given a condition that should be indicated', () => {
            /** @type {Item} */
            const bustedItem = { ...item, condition: 'busted' };

            it('includes the condition on the item label', () => {
                let desc = parseHtml(getItemDescription(bustedItem, args));
                assert(desc.textContent).equals('Goblin juice (busted condition)');
            });

            describe('when condition is uniform', () => {
                it('excludes the condition from the item label', () => {
                    let desc = parseHtml(getItemDescription(bustedItem, {
                        ...args,
                        isConditionUniform: true,
                    }));

                    assert(desc.textContent).equals('Goblin juice');
                });
            });
        });

    });

    describe('getItemTotal()', () => {
        // TODO
    });

    // -- Public Functions -----------------------------------------------------

    describe('formatDungeon()', () => {
        // TODO
    });

    describe('formatError()', () => {
        // TODO
    });

    describe('formatItems()', () => {
        // TODO
    });

    describe('formatName()', () => {
        // TODO
    });

    describe('formatReadyState()', () => {
        // TODO
    });

    describe('formatRooms()', () => {
        // TODO
    });
};
