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