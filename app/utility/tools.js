
export const toWords    = (text) => text.replace(/([A-Z])/g, ' $1').toLowerCase();
export const toDash     = (text) => text.replace(/\s+/g, '-').toLowerCase();
export const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);
export const isOdd      = (num)  => num % 2;
export const isEven     = (num)  => num % 2 === 0;

export const chunk = (array, size) => array.reduce((resultArray, item, index) => {
    let chunkIndex = Math.floor(index / size)

    if(!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = [];
    }

    resultArray[chunkIndex].push(item)

    return resultArray
}, []);
