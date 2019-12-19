
export const lookup = (arr) => arr.reduce((obj, i) => {
    obj[i] = i;

    return obj;
}, {});
