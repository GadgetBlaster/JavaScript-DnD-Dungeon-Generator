
import run from '../run.js';

const defaults = {
    onComplete: () => {},
    onError   : () => {},
    runUnits  : () => {},
    suite     : {},
};

export default ({ assert, describe, it }) => {
    describe('#run', () => {
        describe('given a suite of test functions', () => {
            let names     = [];
            let functions = [];
            let completed = false;

            const suite = {
                '/test/tests.mock1.js': () => {},
                '/test/tests.mock2.js': () => {},
            };

            run({
                ...defaults,
                onComplete: () => { completed = true; },
                runUnits  : (name, tests) => { names.push(name); functions.push(tests); },
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

            it('should call `onComplete` when all tests have been run', () => {
                assert(completed).isTrue();
            });
        });

        describe('given an undefined suite', () => {
            let completed = false;
            let onErrorResult;

            run({
                ...defaults,
                onComplete: () => { completed = true; },
                onError   : (error) => { onErrorResult = error; },
                suite     : undefined,
            });

            it('should call `onError` and return a string containing `Invalid`', () => {
                assert(onErrorResult)
                    .isString()
                    .stringContains('Invalid');
            });

            it('should call `onComplete`', () => {
                assert(completed).isTrue();
            });
        });

        describe('given an invalid suite', () => {
            let completed = false;
            let onErrorResult;

            run({
                ...defaults,
                onComplete: () => { completed = true; },
                onError   : (error) => { onErrorResult = error; },
                suite     : 'junk',
            });

            it('should call `onError` and return a string containing `Invalid`', () => {
                assert(onErrorResult)
                    .isString()
                    .stringContains('Invalid');
            });

            it('should call `onComplete`', () => {
                assert(completed).isTrue();
            });
        });

        describe('given an empty suite', () => {
            let completed = false;
            let onErrorResult;

            run({
                ...defaults,
                onComplete: () => { completed = true; },
                onError   : (error) => { onErrorResult = error; },
                suite     : {},
            });

            it('should call `onError` and return a string containing `Empty`', () => {
                assert(onErrorResult)
                    .isString()
                    .stringContains('Empty');
            });

            it('should call `onComplete`', () => {
                assert(completed).isTrue();
            });
        });

        describe('given a `scope`', () => {
            let names = [];
            let completed = false;

            const scope = '/some/scope';
            const suite = { [scope]: () => {} };

            run({
                ...defaults,
                onComplete: () => { completed = true; },
                runUnits  : (name) => { names.push(name); },
                suite,
            });

            it('should call `runUnits` once for the scoped function', () => {
                assert(names.length).equals(1);
                assert(names[0]).equals(scope);
            });

            it('should call `onComplete` when all tests have been run', () => {
                assert(completed).isTrue();
            });
        });

        describe('given an invalid `scope`', () => {
            let completed = false;
            let onErrorResult;

            run({
                ...defaults,
                onComplete: () => { completed = true; },
                onError   : (error) => { onErrorResult = error; },
                scope     : '/invalid/scope',
                suite     : { '/some/scope': () => {} },
            });

            it('should call `onError` and return a string containing `Invalid` and `scope`', () => {
                assert(onErrorResult)
                    .isString()
                    .stringContains('Invalid')
                    .stringContains('/invalid/scope');
            });

            it('should call `onComplete`', () => {
                assert(completed).isTrue();
            });
        });

        describe('given an invalid test function', () => {
            let completed = false;
            let onErrorResult;

            run({
                ...defaults,
                onComplete: () => { completed = true; },
                onError   : (error) => { onErrorResult = error; },
                suite     : { '/some/scope': undefined },
            });

            it('should call `onError` and return a string containing `Invalid` and `scope`', () => {
                assert(onErrorResult)
                    .isString()
                    .stringContains('Invalid')
                    .stringContains('/some/scope');
            });

            it('should call `onComplete`', () => {
                assert(completed).isTrue();
            });
        });

        describe('given a test function that throws an `Error` object`', () => {
            let completed = false;
            let onErrorResult;

            run({
                ...defaults,
                onComplete: () => { completed = true; },
                onError   : (error) => { onErrorResult = error; },
                runUnits  : (_, tests) => { tests(); },
                suite     : { '/some/scope': () => { throw new Error('Whoops'); } },
            });

            it('should call `onError` and return a string containing an error', () => {
                assert(onErrorResult)
                    .isString()
                    .stringContains('Error')
                    .stringContains('Whoops');
            });

            it('should call `onComplete`', () => {
                assert(completed).isTrue();
            });
        });

        describe('given a test function that throws an error string`', () => {
            let completed = false;
            let onErrorResult;

            run({
                ...defaults,
                onComplete: () => { completed = true; },
                onError   : (error) => { onErrorResult = error; },
                runUnits  : (_, tests) => { tests(); },
                suite     : { '/some/scope': () => { throw 'Something is wrong'; } },
            });

            it('should call `onError` and return the error string', () => {
                assert(onErrorResult)
                    .isString()
                    .equals('Something is wrong');
            });

            it('should call `onComplete`', () => {
                assert(completed).isTrue();
            });
        });
    });
};
