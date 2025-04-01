document.addEventListener('DOMContentLoaded', function() {
    console.log('Website loaded successfully');
    
    // Log information about the current page
    console.log('Current path:', window.location.pathname);
    console.log('Current hostname:', window.location.hostname);
    
    // Check if templates are working
    const headerPlaceholder = document.getElementById('header-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');
    
    console.log('Header placeholder exists:', !!headerPlaceholder);
    console.log('Footer placeholder exists:', !!footerPlaceholder);
});
