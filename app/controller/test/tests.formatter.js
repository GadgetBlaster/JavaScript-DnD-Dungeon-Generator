// @ts-check

import {
    // Private Functions
    testGetItemDescription as getItemDescription,
} from '../formatter.js';

import { parseHtml } from '../../utility/element.js';

/** @typedef {import('../../item/generate').Item} Item */

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {

    // -- Private Functions ----------------------------------------------------

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
            it('returns the item label', () => {
                assert(getItemDescription(item)).equals('Goblin juice');
            });
        });

        describe('given an item count larger than 1', () => {
            it('returns the item label with the count appended', () => {
                let desc = parseHtml(getItemDescription({ ...item, count: 12 }));
                assert(desc.textContent).equals('Goblin juice ( 12 )');
            });
        });
    });
};
