
export const toWords = (text) => text.replace(/([A-Z])/g, ' $1').toLowerCase();
export const toDash  = (text) => text.replace(/\s+/g, '-').toLowerCase();
