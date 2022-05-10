# JavaScript D&D Dungeon Generator

A JavaScript based D&D Dungeon Generator. Procedurally generates a dungeon map based on your selected configurations. The map is drawn as a printable SVG element and accompanied with room descriptions, doorway connections, and items.

## Examples

Live  Demo: [D&D Dungeon Generator App on Mystic Waffle](https://dnd.mysticwaffle.com/)

![D&D Dungeon Generator Map Example](/img/example.png)

## Application Design

This app uses native browser support for JavaScript modules and so will only run in modern browsers.

All HTML elements are generated via template literals.

A multi-dimensional array is generated to represent the dungeon grid. Rooms and doorway connections are procedurally generated on the grid and drawn as a SVG element. Room descriptions, traps, condition, and contents are randomly assigned to each room based on conditional probability tables for attributes such as rarity, condition, and quantity.

The application is organized by a top level `/app/app.js` file that initializes the app and the following directories:

- `/app/attribute/*` - Contains configurations for reusable attributes such as
size and condition.
- `/app/controller/*` - Application controller code
- `/app/dungeon/*` - Code related to generating dungeons
- `/app/item/*` - Code related to generating items
- `/app/room/*` - Code related to, you guessed it, generating rooms
- `/app/ui/*` - HTML generators
- `/app/unit/*` - Unit testing library
- `/app/utility/*` - Utilities such as randomization and text formatters

## Unit Tests

Because I'm crazy I wrote a unit test library found in the `/unit/*` directory. Tests are run by navigating to `/unit.html` and the output is printed to the browser. New unit test suites should be added to the test manifest in `/unit/suite.js`.

## Creative Commons

Want to add a feature, improve something, or use this code to create your own totally awesome dungeon generator? Fork this repo and open a pull request.

We ask you don't use this for commercial use without permission and link Attribution back to us under the Creative Commons Attribution-NonCommercial license.

<a rel="license" href="http://creativecommons.org/licenses/by-nc/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc/4.0/88x31.png" /></a><br /><span xmlns:dct="http://purl.org/dc/terms/" href="http://purl.org/dc/dcmitype/InteractiveResource" property="dct:title" rel="dct:type">D&D Dungeon Generator</span> by <a xmlns:cc="http://creativecommons.org/ns#" href="http://widgets.mysticwaffle.com/dnd-dungeon-generator/" property="cc:attributionName" rel="cc:attributionURL">Mystic Waffle</a> is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc/4.0/">Creative Commons Attribution-NonCommercial 4.0 International License</a>.

## TODO list:

- [ ] Fix awkward room descriptions.
- [ ] Add rare loot and magical item generation.
- [ ] Required items by room type. For example, a bedroom should always contain at least a bed.
- [ ] Item frequency by room type. For example, books should be more common in libraries and studies.
- [ ] Item quantity by room type. For example, a hallway should typically have fewer items than a laboratory.
- [ ] Add checkbox sets for select menu options. For example, be able to select a subset of room types or room conditions.
- [ ] Add a max room count setting.
- [ ] Add grid dimension settings.
- [ ] Add multi level generation with stairway connections.
- [ ] Generate dungeon title and dungeon description.
- [ ] Generate random encounters based on challenge rating and frequency knobs.
- [ ] Add dungeon and environment types. Such as classic dungeon, wilderness, jungle ruin, etc.
- [ ] Config for multiple entrances & exits to the dungeon
