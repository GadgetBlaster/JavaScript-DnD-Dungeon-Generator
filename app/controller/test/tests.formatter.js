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

/** @typedef {import('../../item/generate').Item} Item */

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
        // TODO
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
