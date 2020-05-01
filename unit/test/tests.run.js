
import run from '../run.js';

const defaults = {
    onError : () => {},
    runUnits: () => {},
    suite   : {},
};

/**
 * @param {import('../unit.js').Utility}
 */
export default ({ assert, describe, it }) => {
    describe('#run', () => {
        describe('given a suite of test functions', () => {
            let names     = [];
            let functions = [];

            const suite = {
                '/test/tests.mock1.js': () => {},
                '/test/tests.mock2.js': () => {},
            };

            const runUnits = (name, tests) => {
                names.push(name);
                functions.push(tests);
            };

            run({
                ...defaults,
                runUnits,
                suite,
            });

            it('should call `runUnits` for each function in the suite', () => {
                const keys = Object.keys(suite);

                names.forEach((name, index) => {
                    assert(name).equals(keys[index]);
                });
            });

            it('should inject a tests function into `runUnits` for each test file', () => {
                functions.forEach((func) => {
                    assert(func).isFunction();
                });
            });
        });

        describe('given an undefined `suite`', () => {
            let onErrorResult;

            const onError = (error) => {
                onErrorResult = error;
            };

            run({
                ...defaults,
                onError,
                suite: undefined,
            });

            it('should call `onError` and return a string containing `Invalid`', () => {
                assert(onErrorResult)
                    .isString()
                    .stringContains('Invalid');
            });
        });

        describe('given an invalid suite', () => {
            let onErrorResult;

            run({
                ...defaults,
                onError: (error) => { onErrorResult = error; },
                suite  : 'junk',
            });

            it('should call `onError` and return a string containing `Invalid`', () => {
                assert(onErrorResult)
                    .isString()
                    .stringContains('Invalid');
            });
        });

        describe('given an empty suite', () => {
            let onErrorResult;

            run({
                ...defaults,
                onError: (error) => { onErrorResult = error; },
                suite  : {},
            });

            it('should call `onError` and return a string containing `Empty`', () => {
                assert(onErrorResult)
                    .isString()
                    .stringContains('Empty');
            });
        });

        describe('given a `scope`', () => {
            let names = [];

            const scope = '/some/scope';
            const suite = { [scope]: () => {} };

            run({
                ...defaults,
                runUnits: (name) => { names.push(name); },
                suite,
            });

            it('should call `runUnits` once for the scoped function', () => {
                assert(names.length).equals(1);
                assert(names[0]).equals(scope);
            });
        });

        describe('given an invalid `scope`', () => {
            let onErrorResult;

            run({
                ...defaults,
                onError: (error) => { onErrorResult = error; },
                scope  : '/invalid/scope',
                suite  : { '/some/scope': () => {} },
            });

            it('should call `onError` and return a string containing `Invalid` and `scope`', () => {
                assert(onErrorResult)
                    .isString()
                    .stringContains('Invalid')
                    .stringContains('/invalid/scope');
            });
        });

        describe('given an invalid test function', () => {
            let onErrorResult;

            run({
                ...defaults,
                onError: (error) => { onErrorResult = error; },
                suite  : { '/some/scope': undefined },
            });

            it('should call `onError` and return a string containing `Invalid` and `scope`', () => {
                assert(onErrorResult)
                    .isString()
                    .stringContains('Invalid')
                    .stringContains('/some/scope');
            });
        });

        describe('given a test function that throws an `Error` object`', () => {
            let onErrorResult;

            run({
                ...defaults,
                onError : (error) => { onErrorResult = error; },
                runUnits: (_, tests) => { tests(); },
                suite   : { '/some/scope': () => { throw new Error('Whoops'); } },
            });

            it('should call `onError` and return a string containing an error', () => {
                assert(onErrorResult)
                    .isString()
                    .stringContains('Error')
                    .stringContains('Whoops');
            });
        });

        describe('given a test function that throws an error string`', () => {
            let onErrorResult;

            run({
                ...defaults,
                onError : (error) => { onErrorResult = error; },
                runUnits: (_, tests) => { tests(); },
                suite   : { '/some/scope': () => { throw 'Something is wrong'; } },
            });

            it('should call `onError` and return the error string', () => {
                assert(onErrorResult)
                    .isString()
                    .equals('Something is wrong');
            });
        });
    });
};
