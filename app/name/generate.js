
import { roll, rollArrayItem } from '../utility/roll.js';
import { capitalize } from '../utility/tools.js';

const minSyllables = 1;
const maxSyllables = 6;

const minSyllableLength = 2;
const maxSyllableLength = 5;

const vowels = [ 'a', 'e', 'i', 'o', 'u' ];
const constants = [
    'b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's',
    't', 'v', 'w', 'x', 'y', 'z',
];

const shuffle = (array) => array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

function generateSyllable() {
    let length = roll(minSyllableLength, maxSyllableLength);

    let syllable = shuffle([ ...Array(length - 1) ].reduce((letters) => {
        letters.push(rollArrayItem(constants));
        return letters;
    }, [ rollArrayItem(vowels) ])).join('');

    return syllable;
}

/**
 *
 * @param {NameConfig} config
 *
 * @returns {string}
 */
export function generateName(config) {
    let length = roll(minSyllables, maxSyllables);

    let name = [ ...Array(length) ].reduce((syllables) => {
        syllables.push(generateSyllable());
        return syllables;
    }, []);

    return capitalize(name.join(''));
}
