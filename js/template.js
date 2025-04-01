document.addEventListener('DOMContentLoaded', async function() {
    // Detect if we're on GitHub Pages and set base path
    const hostname = window.location.hostname;
    let basePath = '';
    
    // Check if we're on GitHub Pages
    if (hostname.includes('github.io')) {
        const pathSegments = window.location.pathname.split('/');
        if (pathSegments.length > 1 && pathSegments[1]) {
            basePath = `/${pathSegments[1]}`;
        }
    }
    
    // Make the base path available to other scripts
    window.GSB_BASE_PATH = basePath;
    
    // Load header and footer
    try {
        const headerResponse = await fetch(`${basePath}/header.html`);
        const headerHtml = await headerResponse.text();
        document.getElementById('header-placeholder').innerHTML = headerHtml;
        
        const footerResponse = await fetch(`${basePath}/footer.html`);
        const footerHtml = await footerResponse.text();
        document.getElementById('footer-placeholder').innerHTML = footerHtml;
        
        // After header is loaded, fix image paths
        fixImagePaths();
        
    } catch (error) {
        console.error('Error loading template:', error);
    }
});

// Fix image paths for GitHub Pages
function fixImagePaths() {
    const basePath = window.GSB_BASE_PATH || '';
    
    // Find all images and update their src if needed
    document.querySelectorAll('img').forEach(img => {
        if (img.getAttribute('src') && img.getAttribute('src').startsWith('assets/')) {
            // Save original src for error handling
            const originalSrc = img.getAttribute('src');
            // Update src with base path
            img.setAttribute('src', `${basePath}/${originalSrc}`);
            
            // Update onerror attribute to use correct path
            img.onerror = function() {
                if (this.src.includes('gsb-logo.png')) {
                    this.src = `${basePath}/assets/placeholder-logo.png`;
                } else {
                    this.src = `${basePath}/assets/placeholder-icon.png`;
                }
            };
        }
    });
}