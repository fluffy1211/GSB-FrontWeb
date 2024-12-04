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
    const loginIcon = document.getElementById('login');
    const panierIcon = document.getElementById('panier');
    const profilIcon = document.getElementById('profil');

    if (loginIcon && panierIcon && profilIcon) {
        clearInterval(checkElements);

        const token = getCookie('jwt');

        if (token) {
            const user = parseJwt(token);
            if (user) {
                loginIcon.style.display = 'none';
                panierIcon.style.display = 'block';
                profilIcon.style.display = 'block';
            }
        } else {
            loginIcon.style.display = 'block';
            panierIcon.style.display = 'none';
            profilIcon.style.display = 'none';
        }
    }
}, 100);