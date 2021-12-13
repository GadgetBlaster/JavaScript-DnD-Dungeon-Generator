// @ts-check

import { pxCell } from '../draw.js';
import { cellFeet } from '../grid.js';
import {
    drawLegend,
} from '../legend.js';

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {
    describe('drawLegend()', () => {
        const mapWidth = 40;
        const legend = drawLegend({ mapWidth });

        it('should return an unordered list', () => {
            assert(/<ul(.*?)>(.+?)<\/ul>/.test(legend)).isTrue();
        });

        it('should return a list item for each legend item', () => {
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

        it('should have a width equal to the mapWidth in pixels', () => {
            const width  = 40 * pxCell;
            const regExp = RegExp(`<ul(.*?)style="width: ${width}px;"(.*?)>`);

            assert(regExp.test(legend)).isTrue();
        });
    });
};
