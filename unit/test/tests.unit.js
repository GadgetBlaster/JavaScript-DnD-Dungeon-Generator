
import unit from '../unit.js';

export default ({ assert, describe, it }) => {
    describe('#unit', () => {
        const unitObj = unit({ onAssert: () => {} });

        it('should return a object', () => {
            assert(unitObj).isObject();
        });

        describe('properties', () => {
            it('should return a object with a function property `runUnits`', () => {
                assert(unitObj.runUnits).isFunction();
            });

            it('should return a object with a function property `getSummary`', () => {
                assert(unitObj.getSummary).isFunction();
            });
        });
    });

    describe('#runUnits', () => {
        const { runUnits, getSummary } = unit({ onAssert: () => {} });

        let assertFunc;
        let describeFunc;
        let itFunc;

        runUnits('/fake/path', (utility) => {
            assertFunc   = utility.assert;
            describeFunc = utility.describe;
            itFunc       = utility.it;

            assertFunc().equals();
        });

        it('should inject an `assert` function', () => {
            assert(assertFunc).isFunction();
        });

        it('should inject a `describe` function', () => {
            assert(describeFunc).isFunction();
        });

        it('should inject an `it` function', () => {
            assert(itFunc).isFunction();
        });

        it('should add the file path to the first `msg` in `results`', () => {
            const { results } = getSummary();
            assert(results.shift().msg).stringContains('/fake/path');
        });
    });

    describe('#assert', () => {
        const { runUnits } = unit({ onAssert: () => {} });

        let assertFunc;

        runUnits('/fake/path', (utility) => {
            assertFunc = utility.assert;
        });

        const assertObj = assertFunc('some value');

        it('should return an object', () => {
            assert(assertObj).isObject();
        });

        describe('object properties', () => {
            const assertEntries = Object.entries(assertObj);

            assertEntries.forEach(([ key, func ]) => {
                describe(`#${key}`, () => {
                    it('should be a function', () => {
                        assert(func).isFunction();
                    });

                    describe('when invoked', () => {
                        const chainObj = func();

                        it('should return an object', () => {
                            assert(chainObj).isObject();
                        });

                        it('should return an object with the same keys and values as `assertEntries`', () => {
                            const objectsDiffer = Object.entries(chainObj).some(([ key1, value1 ], index) => {
                                let [ key2, value2 ] = assertEntries[index];
                                return key1 !== key2 || value1.name !== value2.name;
                            });

                            assert(objectsDiffer).isFalse();
                        });
                    });
                });
            });
        });
    });

    describe('#_runAssert', () => {
        let lastResult;

        const { runUnits, getSummary } = unit({
            onAssert: (result) => {
                lastResult = result;
            },
        });

        let assertFunc;

        runUnits('/fake/path', (utility) => {
            assertFunc = utility.assert;
        });

        describe('when an assertion is made', () => {
            const { assertions: startingAssertions } = getSummary();

            assertFunc().equals();

            const { assertions, results } = getSummary();

            it('should increment `assertions`', () => {
                assert(assertions).equals(startingAssertions + 1);
            });

            it('should add an entry to `results`', () => {
                assert(results.length).equals(assertions);
            });

            it('should call `onAssert` and return a `Result` object', () => {
                assert(lastResult).isObject();
                assert(lastResult.isOk).isBoolean();
                assert(lastResult.msg).isString();
            });
        });

        describe('when an assertion passes', () => {
            const { failures: startingFailures } = getSummary();

            assertFunc('some value').equals('some value');

            const { failures, results } = getSummary();

            it('should not increment `failures`', () => {
                assert(failures).equals(startingFailures);
            });

            it('the last item in `results` should include the string `Pass`', () => {
                assert(results.pop().msg).stringContains('Pass');
            });
        });

        describe('when an assertion fails', () => {
            const { failures: startingFailures } = getSummary();

            assertFunc('some value').equals('some other value');

            const { failures, results } = getSummary();

            it('should increment `failures`', () => {
                assert(failures).equals(startingFailures + 1);
            });

            it('the last item in `results` should include the string `Failure`', () => {
                assert(results.pop().msg).stringContains('Failure');
            });
        });
    });

    describe('#describe', () => {
        const unitObj = unit({ onAssert: () => {} });
    });

    describe('#it', () => {
        const unitObj = unit({ onAssert: () => {} });
    });

    describe('#getSummary', () => {
        const unitObj = unit({ onAssert: () => {} });
    });
};
