# D&D Dungeon Generator

This JavaScript based D&D Dungeon Generator takes user input to randomly
generate a dungeon map within the chosen configurations. Dynamically
generated SVG elements are drawn in HTML and accompanied with dungeon room
descriptions, doorway connections, and room contents.

## Examples

[D&D Dungeon Generator App Live Example on Mystic Waffle](https://widgets.mysticwaffle.com/dnd-dungeon-generator/)

![D&D Dungeon Generator Map Example](/img/example.png)

## Application Design

This simple app uses native browser support for JavaScript modules and so
will only run in modern browsers that support modules.

All HTML elements are generated via simple JavaScript Template literals
(Template strings).

The application is organized by a top level `/app/app.js` file that initializes
the app, a `/app/knobs.js` configuration, and the following directories:

- `/app/attributes` - Contains configurations for reusable attributes such as
size and condition.
- `/app/dungeons` - Code related to generating dungeons
- `/app/dungeons` - Code related to generating items
- `/app/dungeons` - Code related to generating rooms
- `/app/ui` - HTML generators, interactive logic, and UI constants
- `/app/utility` - Helpers such as randomizers and text formatters

## Creative Commons

Want to add a feature, improve something, or use this code to create your
own totally awesome dungeon generator? Fork this repo and open a pull request.

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
- [ ] JS doc blocks & type defs
