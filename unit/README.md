# JavaScript D&D Dungeon Generator Unit Tests

## Adding tests

Unit tests are added by creating a test script. Test scripts should be placed
in a `test` directly alongside the JavaScript being tested.

For example, to add tests for the script `/app/app.js`, create a new test
script: `/app/test/tests.app.js`.

Test scripts need to import any functions or objects that will be tested and
export a single default function. The exported function will have a `utilities`
object injected as its first parameter. The `utilities` objects contains three
function properties, `describe()`, `it()`, and `assert()`.

Describe the function, the function's input, and the expected behavior by
nesting `describe()` and `it()` function callbacks. `describe()` and `it()`
take a message string as their first parameter and a callback function as their
second parameter.

Use the `assert()` function to test if a variable is of the expected type or
value. `assert()` takes a single param of any type and returns an object of
assertion functions for testing the provided variable.

Example `/app/test/tests.app.js`:

```js
import app from '../app.js';

export default ({ assert, describe, it }) => {
    describe('app()', () => {
        describe('given the number `23`', () => {
            const result = app(23);

            it('should return a number', () => {
                assert(result).isNumber();
            });

            it('should return the number `32`', () => {
                assert(result).equals(32);
            });
        });
    });
});
```

## Assertions

Assertion functions, such as `equals()`, return the object of assertion
functions allowing multiple assertions to be chained together.

```js
assert(result).isNumber().equals(32);
```

The following assertion functions are available on the assertions object.

```js
assert(value).equals();
assert(value).equalsArray();
assert(value).isArray();
assert(value).isBoolean();
assert(value).isFalse();
assert(value).isFunction();
assert(value).isNull();
assert(value).isNumber();
assert(value).isObject();
assert(value).isString();
assert(value).isTrue();
assert(value).isUndefined();
assert(value).stringIncludes();
assert(value).stringExcludes();
assert(value).throws();
```

## Including tests in the test suite

Test functions should be imported into `/unit/suite.js` and included in the
test suite object, keyed by their full path.

In `/unit/suite.js`:

```js
import app from '../app/test/tests.app.js';

export default {
    '/app/test/tests.app.js': app,
    // ... other tests
};
```

## Running tets

All tests can be run by visiting
[unit.html](https://apps.mysticwaffle.com/dnd-dungeon-generator/unit.html) in a
web browser.

Verbose output can be shown by adding a
[unit.html?verbose=true](https://apps.mysticwaffle.com/dnd-dungeon-generator/unit.html?verbose=true)
URL param.

Individual test files can be run by adding a scope to the URL params, for example:
[unit.html?scope=/app/utility/test/tests.roll.js](https://apps.mysticwaffle.com/dnd-dungeon-generator/unit.html?scope=/app/utility/test/tests.roll.js)

To run scoped tests they must be included in the test suite object defined in
`/unit/suite.js`.
