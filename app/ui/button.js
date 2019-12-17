
export const button = (label, action) => {
    return `
        <button data-action="${action}">
            ${label}
        </button>
    `;
};
