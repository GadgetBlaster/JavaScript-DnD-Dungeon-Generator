
export const createAttrs = (obj) => {
    return Object.keys(obj).map((key) => {
        return `${key}="${obj[key]}"`;
    }).join('');
};

export const element = (tag, content, attrs) => {
    let attributes = attrs ? ` ${createAttrs(attrs)}` : '';
    return `<${tag}${attributes}>${content}</${tag}>`;
};
