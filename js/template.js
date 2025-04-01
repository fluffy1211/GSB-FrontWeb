document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Get the repository name from the pathname
        const pathArray = window.location.pathname.split('/');
        const repoName = pathArray[1]; // E.g., "fluffy1211.github.io"
        const basePath = pathArray.length > 2 ? `/${repoName}` : '';

        // Load header
        const headerPlaceholder = document.getElementById('header-placeholder');
        if (headerPlaceholder) {
            const headerResponse = await fetch(`${basePath}/header.html`);
            if (headerResponse.ok) {
                const headerData = await headerResponse.text();
                headerPlaceholder.innerHTML = headerData;
            } else {
                console.error('Failed to load header');
            }
        }

        // Load footer
        const footerPlaceholder = document.getElementById('footer-placeholder');
        if (footerPlaceholder) {
            const footerResponse = await fetch(`${basePath}/footer.html`);
            if (footerResponse.ok) {
                const footerData = await footerResponse.text();
                footerPlaceholder.innerHTML = footerData;
            } else {
                console.error('Failed to load footer');
            }
        }

        // Handle hamburger menu after header is loaded
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
    } catch (error) {
        console.error('Error in template.js:', error);
    }
});