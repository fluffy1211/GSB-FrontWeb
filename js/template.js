Promise.all([
    fetch("header.html").then(response => response.text()),
    fetch("footer.html").then(response => response.text())
]).then(([headerData, footerData]) => {
    try {
        document.getElementById("header-placeholder").innerHTML = headerData;
        document.getElementById("footer-placeholder").innerHTML = footerData;

        // Attacher les événements après le chargement du contenu
        const hamburger = document.querySelector(".hamburger");
        const navMenu = document.querySelector(".nav-menu");
        const navLink = document.querySelectorAll(".nav-link");
        const searchInput = document.querySelector('.searchbar-input');

        // BURGER MENU
        function mobileMenu() {
            hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
        }
        hamburger.addEventListener("click", mobileMenu);

        // LINKS MENU
        navLink.forEach(n => n.addEventListener("click", closeMenu));
        function closeMenu() {
            hamburger.classList.remove("active");
            navMenu.classList.remove("active");
        }
    } catch (error) {
        console.error('Error in template.js:', error);
    }
});