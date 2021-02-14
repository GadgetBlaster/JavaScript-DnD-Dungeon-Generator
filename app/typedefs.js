
/**
 * @typedef {{ [attribute: string]: string }} Attrs
 */

/**
 * @typedef {object} Item
 *
 * @property {number} count
 * @property {number} quantity
 * @property {string} label
 * @property {string} rarity
 * @property {string} size
 * @property {string} type
 */

/**
 * @typedef {object} Probability
 *     Probability distribution table.
 *
 * @property {string} description
 * @property {() => string} roll
 */

/**
 * @typedef {[ number, number ]} Size
 */

/**
 * @typedef {object} Settings
 *
 * @property {number} dungeonComplexity
 * @property {number} dungeonConnections
 * @property {number} dungeonMaps
 * @property {number} dungeonTraps
 * @property {string} itemCondition
 * @property {string} itemQuantity
 * @property {string} itemRarity
 * @property {string} itemType
 * @property {string} roomCondition
 * @property {number} roomCount
 * @property {string} roomFurnishing
 * @property {string} roomSize
 * @property {string} roomType
 */

export default {};
