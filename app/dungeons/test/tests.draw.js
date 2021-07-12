
import {
    // Private Functions
    testDrawText as drawText,
    testDrawLine as drawLine,
    testDrawCircle as drawCircle,
    testDrawRect as drawRect,
    testDrawPillar as drawPillar,
    testDetRectAttrs as getRectAttrs,
    testDrawRoomText as drawRoomText,
    testDrawTrapText as drawTrapText,
    testDrawPillarCell as drawPillarCell,
    testDrawPillars as drawPillars,
} from '../draw.js';

/**
 * @param {import('../../unit/state.js').Utility}
 */
export default ({ assert, describe, it }) => {
    describe('drawText()', () => {
        describe('given text and coordinates', () => {
            let textElement = drawText('Wizard Tower', [ 20, 20 ]);

            it('should return a <text> element', () => {
                assert(textElement).isHtmlTag('text');
            });

            it('should have the correct x and y attributes', () => {
                assert(textElement).stringIncludes('x="20" y="22"');
            });
        });

        describe('given a `fontSize` option', () => {
            it('should have the correct font size attribute', () => {
                let textElement = drawText('Goblin Lair', [ 0, 0 ], { fontSize: 24 });
                assert(textElement).stringIncludes('font-size="24px"');
            });
        });

        describe('given a `fill` option', () => {
            it('should have the correct fill color attribute', () => {
                let textElement = drawText('Goblin Zeppelin', [ 0, 0 ], { fill: 'purple' });
                assert(textElement).stringIncludes('fill="purple"');
            });
        });
    });
};
