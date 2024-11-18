// Function to get a cookie by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// Function to decode JWT token
function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error parsing JWT token:', error);
        return null;
    }
}

const checkElements = setInterval(() => {
    const loginLink = document.querySelector('.nav-link[href="login.html"]');
    const panierLink = document.querySelector('.nav-link[href="panier.html"]');
    const loginRemoved = document.getElementById('loginremoved');
    const panierRemoved = document.getElementById('panierremoved');

    if (loginLink && panierLink) {
        clearInterval(checkElements);

        const token = getCookie('jwt');

        if (token) {
            const user = parseJwt(token);
            if (user) {
                loginRemoved.style.display = 'none';
                panierLink.style.display = 'block';
            }
        } else {
            loginLink.style.display = 'block';
            panierRemoved.style.display = 'none';
        }
    }
}, 100);