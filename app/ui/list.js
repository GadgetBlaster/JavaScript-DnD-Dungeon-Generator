
import { element } from '../utility/html';

export const list = (items, attrs) => {
    let content = `<li>${items.join('</li><li>')}</li>`;

    return element('ul', content, attrs);
};
