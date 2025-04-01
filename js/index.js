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
    
    // Add this to your index.html to help debug
    const debugInfo = document.createElement('div');
    debugInfo.style.display = 'none'; // Hidden by default
    debugInfo.id = 'debug-info';
    
    // Create a button to toggle debug info
    const debugButton = document.createElement('button');
    debugButton.textContent = 'Toggle Debug Info';
    debugButton.style.position = 'fixed';
    debugButton.style.bottom = '10px';
    debugButton.style.right = '10px';
    debugButton.style.zIndex = '1000';
    debugButton.addEventListener('click', () => {
        debugInfo.style.display = debugInfo.style.display === 'none' ? 'block' : 'none';
    });
    
    document.body.appendChild(debugButton);
    document.body.appendChild(debugInfo);
});
