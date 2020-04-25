
import run from '../run.js';

export default ({ assert, describe, it }) => {
    describe('#run', () => {
        describe('given a manifest of test files', async () => {
            let paths     = [];
            let functions = [];
            let completed = false;

            const mockManifest = [
                './test/tests.mock.js',
                './test/tests.mock.js',
            ];

            await run({
                manifest  : mockManifest,
                onComplete: () => { completed = true; },
                onError   : () => {},
                runUnits  : (path, tests) => { paths.push(path); functions.push(tests); },
            });

            it('should call `runUnits` for each path in the manifest', () => {
                paths.forEach((path) => {
                    assert(path).equals('./test/tests.mock.js');
                });
            });

            it('should inject a tests function into `runUnits` for each test file', () => {
                functions.forEach((func) => {
                    assert(func).isFunction();
                });
            });

            it('should call `onComplete` when all tests have been run', () => {
                assert(paths.length).equals(mockManifest.length);
                assert(completed).isTrue();
            });
        });

        describe('given an empty manifest', async () => {
            let onErrorResult;

            await run({
                manifest  : [],
                onComplete: () => {},
                onError   : (error) => { onErrorResult = error; },
                runUnits  : () => {},
            });

            it('should call `onError` and return an error string', () => {
                assert(onErrorResult).isString();
            });
        });

        describe('given a manifest with invalid test file paths', async () => {
            let errors = [];

            await run({
                manifest  : [ './invalid/tests.404.js' ],
                onComplete: () => {},
                onError   : (error) => { errors.push(error); },
                runUnits  : () => {},
            });

            it('should call `onError` for each invalid file', () => {
                assert(errors.length).equals(1);
            });

            it('should return an error string for each invalid file', () => {
                errors.forEach((errorString) => {
                    assert(errorString).isString();
                });
            });
        });
    });
};
