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

/** @typedef {import('../../item/generate').Container} Container */
/** @typedef {import('../../item/generate').Item} Item */
/** @typedef {import('../../item/generate').ItemSet} ItemSet */

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
            it('renders a paragraph describing the condition', () => {
                const body = parseHtml(formatItemContent({
                    ...itemSet,
                    conditionUniformity: 'busted',
                }));

                assert(body.querySelector('p').textContent).equals('Item condition: Busted');
            });
        });

        describe('given a rarity uniformity', () => {
            it('renders a paragraph describing the rarity', () => {
                const body = parseHtml(formatItemContent({
                    ...itemSet,
                    rarityUniformity: 'legendary',
                }));

                assert(body.querySelector('p').textContent).equals('Item rarity: Legendary');
            });
        });
    });

    describe('formatRoom()', () => {
        // TODO
    });

    describe('formatRoomGrid()', () => {
        // TODO
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

        describe('given an item count of 1', () => {
            it('returns the item label with no count', () => {
                assert(getItemDescription(item)).equals('Goblin juice');
            });
        });

        describe('given an item count larger than 1', () => {
            it('returns the item label with the count appended', () => {
                let desc = parseHtml(getItemDescription({ ...item, count: 12 }));
                assert(desc.textContent).equals('Goblin juice (12)');
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
