document.addEventListener('DOMContentLoaded', function() {
    const slide = document.querySelector('#slide');
    const next = document.querySelector('#next');
    const previous = document.querySelector('#previous');
    
    // Exit if we're not on a page with a slider
    if (!slide || !next || !previous) {
        return;
    }
    
    // Get the base path set by template.js, or default to empty string
    const basePath = window.GSB_BASE_PATH || '';
    
    // Define slide images with proper paths
    const slides = [
        `${basePath}/assets/medicaments_1.jpg`,
        `${basePath}/assets/medicaments_2.jpg`,
        `${basePath}/assets/medicaments_3.jpg`,
        `${basePath}/assets/medicaments_4.jpg`
    ];
    
    let currentSlide = 0;
    
    // Function to change the slide
    function ChangeSlide(direction) {
        if (direction === 'next') {
            currentSlide = (currentSlide + 1) % slides.length;
        } else {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        }
        
        console.log(`Loading slide ${currentSlide}: ${slides[currentSlide]}`);
        slide.src = slides[currentSlide];
        slide.classList.add('fade');
        
        // Remove the fade class after the animation completes
        setTimeout(() => {
            slide.classList.remove('fade');
        }, 1000);
    }
    
    // Event listeners for next and previous buttons
    next.addEventListener('click', () => {
        ChangeSlide('next');
    });
    
    previous.addEventListener('click', () => {
        ChangeSlide('previous');
    });
    
    // Automatic slide change every 3 seconds
    setInterval(() => {
        ChangeSlide('next');
    }, 3000);
});