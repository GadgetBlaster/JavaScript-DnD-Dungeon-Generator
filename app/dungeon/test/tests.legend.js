// @ts-check

import { cellFeet } from '../grid.js';
import {
    drawLegend,
} from '../legend.js';

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {
    describe('drawLegend()', () => {
        const legend = drawLegend();

        it('returns an unordered list', () => {
            assert(/<ul(.*?)>(.+?)<\/ul>/.test(legend)).isTrue();
        });

        it('returns a list item for each legend item', () => {
            [
                `${cellFeet} x ${cellFeet} ft`,
                'Room',
                'Trapped Room',
                'Passageway',
                'Archway',
                'Doorway',
                'Locked Door',
                'Hole',
                'Secret',
                'Concealed',
            ].forEach((label) => {
                const regExp = RegExp(`<li(.*?)><svg(.+?)>(.*?)</svg>(.*?)${label}(.*?)</li>`);
                assert(regExp.test(legend)).isTrue();
            });


        });
    });
};
