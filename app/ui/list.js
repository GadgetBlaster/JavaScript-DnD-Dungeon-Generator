
export const list = (items, { columns = 1 } = {}) => {
    return `
        <ul data-columns="${columns}">
            <li>${items.join('</li><li>')}</li>
        </ul>
    `;
}
