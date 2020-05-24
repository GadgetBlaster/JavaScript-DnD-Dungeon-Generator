
import runSuite from '../run.js';

const mockUnit = {
    getSummary: () => {},
    onError   : () => {},
    runUnits  : () => {},
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

            const getSummary = () => 'success';

            const results = runSuite({ ...mockUnit, runUnits, getSummary }, suite);

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

            it('should call `getSummary` returning the test summary', () => {
                assert(results).equals('success');
            });
        });

        describe('given an undefined `suite`', () => {
            let onErrorResult;

            const onError = (error) => { onErrorResult = error; };

            runSuite({ ...mockUnit, onError });

            it('should call `onError` returning a string containing `Invalid`', () => {
                assert(onErrorResult)
                    .isString()
                    .stringContains('Invalid');
            });
        });

        describe('given an invalid suite', () => {
            let onErrorResult;

            const onError = (error) => { onErrorResult = error; };

            runSuite({ ...mockUnit, onError }, 'junk');

            it('should call `onError` returning a string containing `Invalid`', () => {
                assert(onErrorResult)
                    .isString()
                    .stringContains('Invalid');
            });
        });

        describe('given an empty suite', () => {
            let onErrorResult;

            const onError = (error) => { onErrorResult = error; };

            runSuite({ ...mockUnit, onError }, {});

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

            const runUnits = (name) => { names.push(name); };

            runSuite({ ...mockUnit, runUnits }, suite);

            it('should call `runUnits` once for the scoped function', () => {
                assert(names.length).equals(1);
                assert(names[0]).equals(scope);
            });
        });

        describe('given an invalid `scope`', () => {
            let onErrorResult;

            const onError = (error) => { onErrorResult = error; };
            const suite   = { '/some/scope': () => {} };
            const scope   = '/invalid/scope';

            runSuite({ ...mockUnit, onError }, suite, scope);

            it('should call `onError` returning a string containing `Invalid` and `scope`', () => {
                assert(onErrorResult)
                    .isString()
                    .stringContains('Invalid')
                    .stringContains('/invalid/scope');
            });
        });

        describe('given an invalid test function', () => {
            let onErrorResult;

            const onError = (error) => { onErrorResult = error; };
            const suite   = { '/some/scope': undefined };

            runSuite({ ...mockUnit, onError }, suite);

            it('should call `onError` returning a string containing `Invalid` and `scope`', () => {
                assert(onErrorResult)
                    .isString()
                    .stringContains('Invalid')
                    .stringContains('/some/scope');
            });
        });

        describe('given a test function that throws an `Error` object`', () => {
            let onErrorResult;

            const onError  = (error) => { onErrorResult = error; };
            const runUnits = (_, tests) => { tests(); };
            const suite    = { '/some/scope': () => { throw new Error('Whoops'); } };

            runSuite({ ...mockUnit, onError, runUnits }, suite);

            it('should call `onError` returning a string containing an error', () => {
                assert(onErrorResult)
                    .isString()
                    .stringContains('Error')
                    .stringContains('Whoops');
            });
        });

        describe('given a test function that throws an error string`', () => {
            let onErrorResult;

            const onError  = (error) => { onErrorResult = error; };
            const runUnits = (_, tests) => { tests(); };
            const suite    = { '/some/scope': () => { throw 'Something is wrong'; } };

            runSuite({ ...mockUnit, onError, runUnits }, suite);

            it('should call `onError` returning the error string', () => {
                assert(onErrorResult)
                    .isString()
                    .equals('Something is wrong');
            });
        });
    });
};
