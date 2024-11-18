const cartBtns = document.querySelectorAll('.cart-btn');
const popup = document.getElementById('popup');

cartBtns.forEach(cartBtn => {
    cartBtn.addEventListener('click', e => {
        e.preventDefault();
        const html = `
            <div class="popup-content">
                <h2>Produit ajouté au panier !</h2>
            </div>
        `;
        popup.classList.add('popup-active');
        popup.innerHTML = html;
        setTimeout(() => {
            popup.setAttribute('style', 'display: none');
        }, 4000);
        if (e.target.classList.contains('cart-btn')) {
            popup.setAttribute('style', 'display: active');
        }
    });
});


