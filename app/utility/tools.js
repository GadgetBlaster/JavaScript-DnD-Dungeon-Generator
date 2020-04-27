
export const toWords    = (text) => text.replace(/([A-Z])/g, ' $1').toLowerCase();
export const toDash     = (text) => text.replace(/\s+/g, '-').toLowerCase();
export const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);
export const isOdd      = (num)  => num % 2;
export const isEven     = (num)  => num % 2 === 0;

export const chunk = (array, size) => array.reduce((resultArray, item, index) => {
    let chunkIndex = Math.floor(index / size);

    if(!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = [];
    }

    resultArray[chunkIndex].push(item);

    return resultArray;
}, []);

export const listSentence = (parts) => {
    if (parts.length === 0) {
        return;
    }

    let last = parts.pop();

    if (parts.length === 0) {
        return capitalize(last);
    }

    let comma = parts.length > 1 ? ',' : '';

    return `${capitalize(parts.join(', '))}${comma} and ${last}`;
};

export const plural = (count, string, suffix = 's') =>
    `${string}${count !== 1 ? suffix : ''}`;
