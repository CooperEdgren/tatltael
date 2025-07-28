// scripts/pokedex/utils.js

/**
 * Adjusts the font size of elements to fit within their parent container.
 * @param {string} selector - The CSS selector for the text elements to adjust.
 */
export function adjustFontSizes(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
        // Reset font size to initial to handle resizing correctly
        el.style.fontSize = ''; 

        const parent = el.parentElement;
        let parentWidth = parent.clientWidth;
        let elWidth = el.scrollWidth;

        // Check for padding on the parent
        const parentStyle = window.getComputedStyle(parent);
        parentWidth -= parseFloat(parentStyle.paddingLeft) + parseFloat(parentStyle.paddingRight);

        if (elWidth > parentWidth) {
            let fontSize = parseFloat(window.getComputedStyle(el).fontSize);
            while (el.scrollWidth > parentWidth && fontSize > 0) {
                fontSize -= 0.5;
                el.style.fontSize = `${fontSize}px`;
            }
        }
    });
}
