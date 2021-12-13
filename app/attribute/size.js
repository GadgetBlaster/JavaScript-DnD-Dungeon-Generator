// @ts-check

// -- Types --------------------------------------------------------------------

/**
 * @typedef {"tiny"
 *     | "small"
 *     | "medium"
 *     | "large"
 *     | "massive"
 * } Size
 */

// -- Config -------------------------------------------------------------------

// TODO freeze
const size = {
    tiny   : 'tiny',
    small  : 'small',
    medium : 'medium',
    large  : 'large',
    massive: 'massive',
};

export default size;

export const list = Object.keys(size);
