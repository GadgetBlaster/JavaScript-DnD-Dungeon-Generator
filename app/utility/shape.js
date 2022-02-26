// @ts-check

import { element } from './element.js';
import { isRequired } from './tools.js';

// -- Type Imports -------------------------------------------------------------

/** @typedef {import('./element.js').Attributes} Attributes */

// -- Types --------------------------------------------------------------------

/**
 * @typedef PixelCoordinates
 *
 * @prop {number} x
 * @prop {number} y
 */

/**
 * @typedef PixelDimensions
 *
 * @prop {number} width
 * @prop {number} height
 */

/** @typedef {PixelCoordinates & PixelDimensions} PixelRectangle */

/**
 * @typedef Circle
 *
 * @prop {number} cx
 * @prop {number} cy
 * @prop {number} r
 */

/**
 * @typedef Line
 *
 * @prop {number} x1
 * @prop {number} y1
 * @prop {number} x2
 * @prop {number} y2
 * @prop {string} color
 * @prop {number} width
 */

// -- Config -------------------------------------------------------------------

const dashLength = 5;

const defaultTextColor = '#666666';

const pxTextOffset = 2;

export const defaultFontSize = 14;

export {
    dashLength   as testDashLength,
    pxTextOffset as testPxTextOffset,
};

// -- Public Functions ---------------------------------------------------------

/**
 * Returns an SVG circle element string.
 *
 * @private
 *
 * @param {Circle} circle
 * @param {object} [options]
 *     @param {string} [options.fill]
 *     @param {string} [options.stroke]
 *
 * @returns {string}
 */
export function drawCircle({ cx, cy, r }, { fill, stroke } = {}) {
    isRequired(cx, 'cx is required by drawCircle()');
    isRequired(cy, 'cy is required by drawCircle()');
    isRequired(r,  'r is required by drawCircle()');

    let attributes = {
        cx,
        cy,
        r,
        fill,
        'shape-rendering': 'geometricPrecision',
        ...(stroke && { stroke, 'stroke-width': 2 }),
    };

    return element('circle', null, attributes);
}

/**
 * Returns an SVG line element string.
 *
 * @private
 *
 * @param {Line} args
 * @param {object} [options = {}]
 *     @param {boolean} [options.dashed]
 *
 * @returns {string}
 */
export function drawLine({ x1, y1, x2, y2, color, width }, { dashed } = {}) {
    isRequired(x1,    'x1 is required by drawLine()');
    isRequired(y1,    'y1 is required by drawLine()');
    isRequired(x2,    'x2 is required by drawLine()');
    isRequired(y2,    'y2 is required by drawLine()');
    isRequired(color, 'color is required by drawLine()');
    isRequired(width, 'width is required by drawLine()');

    let attributes = {
        x1,
        y1,
        x2,
        y2,
        stroke: color,
        'shape-rendering': 'crispEdges',
        'stroke-linecap': 'square',
        'stroke-width': width,
        ...(dashed && { 'stroke-dasharray': dashLength }),
    };

    return element('line', null, attributes);
}

/**
 * Returns an SVG rectangle element string.
 *
 * @private
 *
 * @param {PixelRectangle} rectangle
 * @param {Attributes} [attributes]
 *
 * @returns {string}
 */
export function drawRect({ x, y, width, height }, attributes = {}) {
    isRequired(x,      'x is required by drawRect()');
    isRequired(y,      'y is required by drawRect()');
    isRequired(width,  'width is required by drawRect()');
    isRequired(height, 'height is required by drawRect()');

    return element('rect', null, { x, y, width, height, ...attributes });
}

/**
 * Returns an SVG text element string.
 *
 * @private
 *
 * @param {string | number} text
 * @param {PixelCoordinates} coordinates
 * @param {object} [options]
 *     @param {number} [options.fontSize = 14]
 *     @param {string} [options.fill = '#666666']
 *
 * @returns {string}
 */
export function drawText(text, { x, y }, { fontSize = defaultFontSize, fill = defaultTextColor } = {}) {
    let attributes = {
        x,
        y: y + pxTextOffset,
        fill,
        'alignment-baseline': 'middle',
        'font-family': 'monospace',
        'font-size': `${fontSize}px`,
        'text-anchor': 'middle',
    };

    return element('text', text, attributes);
}
