Promise.all([
    fetch("header.html").then(response => response.text()),
    fetch("footer.html").then(response => response.text())
]).then(([headerData, footerData]) => {
    document.getElementById("header-placeholder").innerHTML = headerData;
    document.getElementById("footer-placeholder").innerHTML = footerData;

    // Attacher les événements après le chargement du contenu
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");
    const navLink = document.querySelectorAll(".nav-link");
    const searchInput = document.querySelector('.searchbar-input');

    console.log(hamburger);

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

    // SLIDER
    const slide = ["../assets/medicaments_1.jpg", "../assets/medicaments_2.jpg", "../assets/medicaments_3.jpg", "../assets/medicaments_4.jpg"];
    let numero = 0;

    function ChangeSlide(sens) {
        const slideElement = document.getElementById("slide");
        slideElement.classList.remove("fade");
        void slideElement.offsetWidth;
        numero = numero + sens;
        if (numero < 0)
            numero = slide.length - 1;
        if (numero > slide.length - 1)
            numero = 0;
        slideElement.src = slide[numero];
        slideElement.classList.add("fade");
    }

    setInterval(() => {
        ChangeSlide(1);
    }, 5000);

    document.getElementById("next").addEventListener("click", () => {
        ChangeSlide(1);
    });

    document.getElementById("previous").addEventListener("click", () => {
        ChangeSlide(-1);
    });

    console.log('loaded');
});