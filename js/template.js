// Function to load HTML content
async function loadHTML(url, element) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const content = await response.text();
        element.innerHTML = content;
    } catch (error) {
        console.error('Error loading the HTML file:', error);
    }
}

// Load header and footer when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const headerPlaceholder = document.getElementById('header-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');

    if (headerPlaceholder) {
        loadHTML('header.html', headerPlaceholder);
    }
    
    if (footerPlaceholder) {
        loadHTML('footer.html', footerPlaceholder);
    }
});