
const door = {
    archway: 'archway',
    hole   : 'hole',
    metal  : 'metal',
    portal : 'portal',
    stone  : 'stone',
    wood   : 'wood',
};

export const lockable = new Set([
    door.metal,
    door.stone,
    door.wood,
]);

export const list = Object.keys(type);

export default door;
