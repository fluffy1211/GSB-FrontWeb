document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Get the base path for GitHub Pages
        let basePath = '';
        const hostname = window.location.hostname;
        
        // Check if we're on GitHub Pages
        if (hostname.includes('github.io')) {
            // For GitHub Pages - repository is the first segment after the domain
            const pathSegments = window.location.pathname.split('/').filter(s => s);
            if (pathSegments.length > 0) {
                basePath = `/${pathSegments[0]}`;
            }
        }
        
        console.log('Using base path:', basePath);

        // Load header
        const headerPlaceholder = document.getElementById('header-placeholder');
        if (headerPlaceholder) {
            console.log('Loading header from:', `${basePath}/header.html`);
            const headerResponse = await fetch(`${basePath}/header.html`);
            if (headerResponse.ok) {
                const headerData = await headerResponse.text();
                headerPlaceholder.innerHTML = headerData;
            } else {
                console.error('Failed to load header:', headerResponse.status);
            }
        }

        // Load footer
        const footerPlaceholder = document.getElementById('footer-placeholder');
        if (footerPlaceholder) {
            console.log('Loading footer from:', `${basePath}/footer.html`);
            const footerResponse = await fetch(`${basePath}/footer.html`);
            if (footerResponse.ok) {
                const footerData = await footerResponse.text();
                footerPlaceholder.innerHTML = footerData;
            } else {
                console.error('Failed to load footer:', footerResponse.status);
            }
        }

        // Set a global variable for asset path that can be used by other scripts
        window.GSB_BASE_PATH = basePath;

        // Handle hamburger menu after header is loaded
        setTimeout(() => {
            const hamburger = document.querySelector('.hamburger');
            const navMenu = document.querySelector('.nav-menu');
            
            if (hamburger && navMenu) {
                hamburger.addEventListener('click', () => {
                    hamburger.classList.toggle('active');
                    navMenu.classList.toggle('active');
                });
            } else {
                console.log('Hamburger menu elements not found');
            }
        }, 200); // Small delay to ensure DOM is updated
    } catch (error) {
        console.error('Error in template.js:', error);
    }
});