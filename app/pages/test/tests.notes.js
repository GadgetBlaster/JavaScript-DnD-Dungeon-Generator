// @ts-check

import {
    // Config
    releaseNotes,
    currentVersion,

    // Public Functions
    formatNotes,
} from '../notes.js';

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {

    // -- Config ---------------------------------------------------------------

    describe('releaseNotes', () => {
        it('should be an array of sequentially versioned ReleaseNote objects', () => {
            assert(releaseNotes).isArray();

            let prevNote;

            releaseNotes.forEach((note) => {
                assert(note).isObject();
                assert(note.title).isString();
                assert(note.version).isString();
                assert(note.commit).isString();
                assert(note.date).isString();

                if (note.description) {
                    assert(note.description).isArray();
                    note.description.forEach((desc) => assert(desc).isString());
                }

                if (note.details) {
                    assert(note.details).isArray();
                    note.details.forEach((detail) => assert(detail).isString());
                }

                if (prevNote) {
                    // Notes should be descending from recent to oldest.
                    assert(new Date(note.date) <= new Date(prevNote.date)).isTrue();

                    let versionParts = note.version.split('.', 3).map((numb) => Number(numb));
                    let prevVersionParts = prevNote.version.split('.', 3).map((numb) => Number(numb));

                    assert(versionParts.length).equals(3);

                    let [ major, minor, patch ] = versionParts;
                    let [ prevMajor, prevMinor, prevPatch ] = prevVersionParts;

                    if (major === prevMajor) {
                        if (minor === prevMinor) {
                            assert(patch).equals(prevPatch - 1);
                        } else {
                            assert(minor).equals(prevMinor - 1);
                        }
                    } else {
                        assert(major).equals(prevMajor - 1);
                    }
                }

                prevNote = note;
            });
        });
    });

    describe('currentVersion', () => {
        it('should match the latest release note version', () => {
            assert(currentVersion).equals(releaseNotes[0].version);
        });
    });

    // -- Public Functions -----------------------------------------------------

    describe('formatNotes()', () => {
        // TODO
    });

};
